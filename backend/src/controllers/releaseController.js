const { releaseService } = require('../services/releaseService');

exports.getAllReleases = async (req, res) => {
  try {
    const releases = await releaseService.getAllReleases();
    res.json({ success: true, count: releases.length, data: releases });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getReleaseById = async (req, res) => {
  try {
    const { id } = req.params;
    const release = await releaseService.getReleaseById(id);
    if (!release) {
      return res.status(404).json({ success: false, error: 'Release not found' });
    }
    res.json({ success: true, data: release });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.createRelease = async (req, res) => {
  try {
    const { name, targetDate, additionalInfo, completedStepIds } = req.body;
    if (!name || !targetDate) {
      return res.status(400).json({
        success: false,
        error: 'Both name and targetDate are mandatory'
      });
    }

    const release = await releaseService.createRelease({
      name,
      targetDate,
      additionalInfo,
      completedStepIds
    });

    res.status(201).json({ success: true, data: release });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.updateRelease = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, targetDate, additionalInfo } = req.body;

    const updated = await releaseService.updateRelease(id, {
      name,
      targetDate,
      additionalInfo
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.updateSteps = async (req, res) => {
  try {
    const { id } = req.params;
    const { completedStepIds } = req.body;

    if (!Array.isArray(completedStepIds)) {
      return res.status(400).json({
        success: false,
        error: 'completedStepIds array is required'
      });
    }

    const updated = await releaseService.updateReleaseSteps(id, completedStepIds);
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.toggleStep = async (req, res) => {
  try {
    const { id } = req.params;
    const { stepId, completed } = req.body;

    if (!stepId || typeof completed !== 'boolean') {
      return res.status(400).json({
        success: false,
        error: 'stepId and boolean completed flag are required'
      });
    }

    const updated = await releaseService.toggleStep(id, stepId, completed);
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.deleteRelease = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await releaseService.deleteRelease(id);
    res.json({ success: true, message: 'Release deleted successfully', data: deleted });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getSteps = async (req, res) => {
  try {
    const steps = releaseService.getStepsDefinition();
    res.json({ success: true, count: steps.length, data: steps });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
