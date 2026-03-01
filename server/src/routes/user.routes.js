const { getAllUsers, getMe, getWorkspaceUsers } = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');
const workspaceAdminMiddleware = require('../middleware/workspaceadmin.middleware');
const workspaceUserMiddleware = require('../middleware/workspaceuser.middleware');

const router = require('express').Router();

router.get('/allusers',  authMiddleware, getAllUsers);
router.get('/getme',  authMiddleware, getMe);
router.get('/getWorkspaceusers/:id',  authMiddleware, workspaceUserMiddleware,  getWorkspaceUsers);

module.exports = router;