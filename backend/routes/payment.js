const express = require('express');
const router = express.Router();
const PaymentController=require('../controllers/payment');
const checkAuth = require("../middleware/check-auth");


/* GET ALL CHATS */
router.get('/store',checkAuth, PaymentController.getData);
router.post("/purchase",checkAuth,PaymentController.postPayment);
module.exports = router;



