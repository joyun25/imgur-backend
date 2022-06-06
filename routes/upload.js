const express = require("express");
const router = express.Router();
const permission = require("../service/permission");
const upload = require("../service/images");
const uploadControllers = require("../controllers/upload");

router.post("/", permission.isAuth, upload, uploadControllers.uploadImg);

module.exports = router;