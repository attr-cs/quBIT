const {joinRequest, joinRequestApprove,toggleWorkspacePublic ,getJoinRequests ,createWorkspaces, getWs, getUserWs, getW, renameW, addUser, removeUser, deleteWorkspace} = require('../controllers/workspace.controller');
const express = require('express');
const authMiddleware= require('../middleware/auth.middleware');
const workspaceAdminMiddleware= require('../middleware/workspaceadmin.middleware');
const workspaceUserMiddleware = require('../middleware/workspaceuser.middleware');


const router = express.Router();

router.post("/join-request", authMiddleware,  joinRequest);

router.post("/createWorkspace", authMiddleware,  createWorkspaces);
router.post("/deleteWorkspace/:id", authMiddleware, workspaceAdminMiddleware,  deleteWorkspace);

router.get("/get-join-requests", authMiddleware,  getJoinRequests);
router.get("/getWorkspaces", authMiddleware,  getWs);
router.get("/getUserWorkspaces", authMiddleware, getUserWs);
router.get("/getWorkspace/:id", authMiddleware, workspaceUserMiddleware,  getW);

router.post("/renameWorkspace/:id", authMiddleware, workspaceAdminMiddleware,  renameW);
router.post("/:id/approveRequest", authMiddleware, workspaceAdminMiddleware,  joinRequestApprove);

router.post("/:id/addUser", authMiddleware, addUser);
router.post("/:id/removeUser", authMiddleware, workspaceAdminMiddleware, removeUser);

router.post("/:id/togglePublic", authMiddleware, workspaceAdminMiddleware, toggleWorkspacePublic)

module.exports =  router;