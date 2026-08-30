/**
 * Standard steps for software release workflow.
 * Consistent across all releases.
 */
const RELEASE_STEPS = [
  { id: 'step-1', order: 1, title: 'Code freeze & merge to release branch', description: 'Ensure all PRs are merged and tag the release branch' },
  { id: 'step-2', order: 2, title: 'Run automated test suite', description: 'Run all unit, integration, and security test suites' },
  { id: 'step-3', order: 3, title: 'Build production artifacts & container images', description: 'Compile production bundle and push docker image tags' },
  { id: 'step-4', order: 4, title: 'Deploy to Staging environment', description: 'Roll out the build candidate to the staging cluster' },
  { id: 'step-5', order: 5, title: 'Execute QA smoke & regression testing', description: 'Verify core customer flows and user acceptance' },
  { id: 'step-6', order: 6, title: 'Apply database migrations & backup snapshots', description: 'Run schema migrations with zero downtime scripts' },
  { id: 'step-7', order: 7, title: 'Deploy to Production environment', description: 'Trigger blue/green or canary production deployment' },
  { id: 'step-8', order: 8, title: 'Post-release health check & publish release notes', description: 'Monitor error rates, ping status page, and inform stakeholders' }
];

module.exports = {
  RELEASE_STEPS,
  TOTAL_STEPS: RELEASE_STEPS.length
};
