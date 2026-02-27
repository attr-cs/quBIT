const express = require("express");
const router = express.Router();

const {register} = require("../controllers/auth.controller");

router.post('/register', register);
router.get('/status', (req,res)=>{res.json({msg:"live"})});

// router.post('/login', );

module.exports = router;