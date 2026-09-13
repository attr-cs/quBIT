const express = require("express");
const authMiddleware = require('../middleware/auth.middleware')
const router = express.Router();

const {createFile, getFileData,createFolder, getWorkspacefilesfolders, updateFile} = require("../controllers/file.controller");

router.post('/createfile', authMiddleware, createFile);
router.post('/createfolder', authMiddleware, createFolder);
router.get('/workspacefilesfolders', authMiddleware, getWorkspacefilesfolders);
router.get('/getFileData/:id', authMiddleware, getFileData );
router.put('/updatefile', authMiddleware, updateFile);

module.exports = router;