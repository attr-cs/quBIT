const express = require("express");
const router = express.Router();

const {register, login} = require("../controllers/auth.controller");

router.post('/register', register);
router.post('/login', login);
router.get('/status', (req,res)=>{res.json({msg:"live"})});

// router.post('/login', );

module.exports = router;