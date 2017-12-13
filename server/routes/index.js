const express = require('express');
const routes = express.Router();
const { variable } = require('../controllers');

routes.get('/', variable.getVariables);
routes.get('/data', variable.getDemoData);
routes.get('/unvailable', variable.getUnvailableStats);

module.exports = routes;
