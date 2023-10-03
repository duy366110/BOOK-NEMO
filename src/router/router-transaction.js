"use strict"
const router = require('express').Router();
const MiddlewarePermission = require("../middleware/middleware.permission");
const MiddlewareUser = require("../middleware/middleware.user");
const ControllerTransaction = require("../controller/controller-transaction");

// CREATE - RENDER TRANSACTION
router.get("/",
MiddlewarePermission.userExists,
MiddlewareUser.findUserBySession,
ControllerTransaction.renderHistoryTransaction);

module.exports = router;