const { releaseService } = require('../services/releaseService');

const resolvers = {
  Query: {
    releases: async () => {
      return await releaseService.getAllReleases();
    },
    release: async (_, { id }) => {
      return await releaseService.getReleaseById(id);
    },
    steps: async () => {
      return releaseService.getStepsDefinition().map(s => ({
        ...s,
        completed: false
      }));
    }
  },
  Mutation: {
    createRelease: async (_, { input }) => {
      return await releaseService.createRelease(input);
    },
    updateRelease: async (_, { id, input }) => {
      return await releaseService.updateRelease(id, input);
    },
    updateReleaseSteps: async (_, { id, completedStepIds }) => {
      return await releaseService.updateReleaseSteps(id, completedStepIds);
    },
    toggleStep: async (_, { id, stepId, completed }) => {
      return await releaseService.toggleStep(id, stepId, completed);
    },
    deleteRelease: async (_, { id }) => {
      return await releaseService.deleteRelease(id);
    }
  }
};

module.exports = { resolvers };
