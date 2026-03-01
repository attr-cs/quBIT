const {createWorkspaces, getWs, getUserWs, getW, renameW, addUser} = require('../controllers/workspace.controller');
const express = require('express');
const authMiddleware= require('../middleware/auth.middleware');
const workspaceAdminMiddleware= require('../middleware/workspaceadmin.middleware');

const router = express.Router();

router.post("/createWorkspace", authMiddleware,  createWorkspaces);
router.get("/getWorkspaces", authMiddleware,  getWs);
router.get("/getUserWorkspaces", authMiddleware, getUserWs);
router.get("/getWorkspace/:id", authMiddleware,  getW);
router.post("/renameWorkspace/:id", authMiddleware, workspaceAdminMiddleware,  renameW);
router.post("/:id/addUser", authMiddleware, workspaceAdminMiddleware, addUser);

module.exports =  router;