const request = require('supertest');
const { createApp } = require('../src/app');
const { prisma } = require('../src/services/releaseService');

let app;

beforeAll(async () => {
  app = await createApp();
  // Ensure tables exist and clear test database
  await prisma.$connect();
  await prisma.release.deleteMany({});
});

afterAll(async () => {
  await prisma.release.deleteMany({});
  await prisma.$disconnect();
});

describe('Release Checklist API Tests', () => {
  let createdReleaseId;

  test('GET /health - should return ok health status', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  test('GET /api/steps - should return standard list of 8 release steps', async () => {
    const res = await request(app).get('/api/steps');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(8);
    expect(res.body.data[0]).toHaveProperty('id');
    expect(res.body.data[0]).toHaveProperty('title');
  });

  test('POST /api/releases - should fail when mandatory fields are missing', async () => {
    const res = await request(app).post('/api/releases').send({
      name: ''
    });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test('POST /api/releases - should create release with "planned" status when 0 steps completed', async () => {
    const res = await request(app).post('/api/releases').send({
      name: 'v1.0.0 Initial Launch',
      targetDate: '2026-09-15T12:00:00Z',
      additionalInfo: 'Launch of flagship product with core features',
      completedStepIds: []
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe('v1.0.0 Initial Launch');
    expect(res.body.data.status).toBe('planned');
    expect(res.body.data.completedCount).toBe(0);
    expect(res.body.data.progressPercentage).toBe(0);

    createdReleaseId = res.body.data.id;
  });

  test('POST /api/releases/:id/toggle-step - should update status to "ongoing" when 1 step completed', async () => {
    const res = await request(app)
      .post(`/api/releases/${createdReleaseId}/toggle-step`)
      .send({
        stepId: 'step-1',
        completed: true
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('ongoing');
    expect(res.body.data.completedCount).toBe(1);
    expect(res.body.data.completedStepIds).toContain('step-1');
  });

  test('PATCH /api/releases/:id/steps - should update status to "done" when all 8 steps completed', async () => {
    const allSteps = [
      'step-1', 'step-2', 'step-3', 'step-4',
      'step-5', 'step-6', 'step-7', 'step-8'
    ];

    const res = await request(app)
      .patch(`/api/releases/${createdReleaseId}/steps`)
      .send({
        completedStepIds: allSteps
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('done');
    expect(res.body.data.completedCount).toBe(8);
    expect(res.body.data.progressPercentage).toBe(100);
  });

  test('PATCH /api/releases/:id - should update release additional information', async () => {
    const res = await request(app)
      .patch(`/api/releases/${createdReleaseId}`)
      .send({
        additionalInfo: 'Updated post-release notes: All services healthy.'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.additionalInfo).toBe('Updated post-release notes: All services healthy.');
  });

  test('GET /api/releases - should return list of releases with auto-calculated status', async () => {
    const res = await request(app).get('/api/releases');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.count).toBeGreaterThanOrEqual(1);
  });

  test('DELETE /api/releases/:id - should delete a release', async () => {
    const res = await request(app).delete(`/api/releases/${createdReleaseId}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const checkRes = await request(app).get(`/api/releases/${createdReleaseId}`);
    expect(checkRes.status).toBe(404);
  });
});
