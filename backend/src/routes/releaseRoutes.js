const express = require('express');
const router = express.Router();
const releaseController = require('../controllers/releaseController');

// Standard Steps endpoint
router.get('/steps', releaseController.getSteps);

// Releases CRUD & Step operations
router.get('/releases', releaseController.getAllReleases);
router.post('/releases', releaseController.createRelease);
router.get('/releases/:id', releaseController.getReleaseById);
router.patch('/releases/:id', releaseController.updateRelease);
router.patch('/releases/:id/steps', releaseController.updateSteps);
router.post('/releases/:id/toggle-step', releaseController.toggleStep);
router.delete('/releases/:id', releaseController.deleteRelease);

module.exports = router;
