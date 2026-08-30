const { PrismaClient } = require('@prisma/client');
const { RELEASE_STEPS, TOTAL_STEPS } = require('../config/steps');

const prisma = new PrismaClient();

/**
 * Computes release status based on completed steps count
 * @param {number} completedCount 
 * @param {number} totalCount 
 * @returns {'planned' | 'ongoing' | 'done'}
 */
function computeStatus(completedCount, totalCount = TOTAL_STEPS) {
  if (completedCount === 0) {
    return 'planned';
  }
  if (completedCount >= totalCount) {
    return 'done';
  }
  return 'ongoing';
}

/**
 * Hydrates a Prisma release record with enriched step information and computed status
 * @param {object} release 
 * @returns {object}
 */
function formatRelease(release) {
  let completedStepIds = [];
  try {
    completedStepIds = typeof release.completedSteps === 'string'
      ? JSON.parse(release.completedSteps || '[]')
      : (release.completedSteps || []);
  } catch (err) {
    completedStepIds = [];
  }

  const completedSet = new Set(completedStepIds);
  const steps = RELEASE_STEPS.map(step => ({
    ...step,
    completed: completedSet.has(step.id)
  }));

  const completedCount = steps.filter(s => s.completed).length;
  const status = computeStatus(completedCount, TOTAL_STEPS);
  const progressPercentage = Math.round((completedCount / TOTAL_STEPS) * 100);

  return {
    id: release.id,
    name: release.name,
    targetDate: release.targetDate,
    additionalInfo: release.additionalInfo || '',
    status,
    completedCount,
    totalSteps: TOTAL_STEPS,
    progressPercentage,
    completedStepIds: Array.from(completedSet),
    steps,
    createdAt: release.createdAt,
    updatedAt: release.updatedAt
  };
}

class ReleaseService {
  async getAllReleases() {
    const releases = await prisma.release.findMany({
      orderBy: { targetDate: 'asc' }
    });
    return releases.map(formatRelease);
  }

  async getReleaseById(id) {
    const release = await prisma.release.findUnique({
      where: { id }
    });
    if (!release) return null;
    return formatRelease(release);
  }

  async createRelease(data) {
    const { name, targetDate, additionalInfo, completedStepIds = [] } = data;

    if (!name || !name.trim()) {
      throw new Error('Release name is mandatory');
    }
    if (!targetDate) {
      throw new Error('Release target date is mandatory');
    }

    const dateObj = new Date(targetDate);
    if (isNaN(dateObj.getTime())) {
      throw new Error('Invalid target date provided');
    }

    const validStepIds = new Set(RELEASE_STEPS.map(s => s.id));
    const filteredSteps = completedStepIds.filter(id => validStepIds.has(id));

    const newRelease = await prisma.release.create({
      data: {
        name: name.trim(),
        targetDate: dateObj,
        additionalInfo: additionalInfo ? additionalInfo.trim() : '',
        completedSteps: JSON.stringify(filteredSteps)
      }
    });

    return formatRelease(newRelease);
  }

  async updateRelease(id, data) {
    const { name, targetDate, additionalInfo } = data;
    const updatePayload = {};

    if (name !== undefined) {
      if (!name || !name.trim()) {
        throw new Error('Release name cannot be empty');
      }
      updatePayload.name = name.trim();
    }

    if (targetDate !== undefined) {
      const dateObj = new Date(targetDate);
      if (isNaN(dateObj.getTime())) {
        throw new Error('Invalid target date');
      }
      updatePayload.targetDate = dateObj;
    }

    if (additionalInfo !== undefined) {
      updatePayload.additionalInfo = additionalInfo ? additionalInfo.trim() : '';
    }

    const updated = await prisma.release.update({
      where: { id },
      data: updatePayload
    });

    return formatRelease(updated);
  }

  async updateReleaseSteps(id, completedStepIds) {
    if (!Array.isArray(completedStepIds)) {
      throw new Error('completedStepIds must be an array of step IDs');
    }

    const validStepIds = new Set(RELEASE_STEPS.map(s => s.id));
    const filtered = completedStepIds.filter(stepId => validStepIds.has(stepId));

    const updated = await prisma.release.update({
      where: { id },
      data: {
        completedSteps: JSON.stringify(filtered)
      }
    });

    return formatRelease(updated);
  }

  async toggleStep(id, stepId, completed) {
    const release = await prisma.release.findUnique({ where: { id } });
    if (!release) {
      throw new Error('Release not found');
    }

    let completedStepIds = [];
    try {
      completedStepIds = JSON.parse(release.completedSteps || '[]');
    } catch {
      completedStepIds = [];
    }

    const stepSet = new Set(completedStepIds);
    if (completed) {
      stepSet.add(stepId);
    } else {
      stepSet.delete(stepId);
    }

    const validStepIds = new Set(RELEASE_STEPS.map(s => s.id));
    const filtered = Array.from(stepSet).filter(s => validStepIds.has(s));

    const updated = await prisma.release.update({
      where: { id },
      data: {
        completedSteps: JSON.stringify(filtered)
      }
    });

    return formatRelease(updated);
  }

  async deleteRelease(id) {
    const deleted = await prisma.release.delete({
      where: { id }
    });
    return formatRelease(deleted);
  }

  getStepsDefinition() {
    return RELEASE_STEPS;
  }
}

module.exports = {
  releaseService: new ReleaseService(),
  computeStatus,
  formatRelease,
  prisma
};
