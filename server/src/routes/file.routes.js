const express = require("express");
const authMiddleware = require('../middleware/auth.middleware')
const router = express.Router();

const {createFile, createFolder, getWorkspacefilesfolders} = require("../controllers/file.controller");

router.post('/createfile', authMiddleware, createFile);
router.post('/createfolder', authMiddleware, createFolder);
router.get('/workspacefilesfolders', authMiddleware, getWorkspacefilesfolders);


module.exports = router;