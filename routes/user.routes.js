import express from 'express'
import isAuthorised from '../middlewares/isAuthorised.middleware.js'
import { saveChanges, verifyCode, sendEmail, addAddress, fetchAddress, removeAddress, placeOrder, fetchOrders } from '../controllers/userControllers.js';
const router = express.Router();

router.post('/sendEmail', isAuthorised, sendEmail)
router.post('/saveChanges', isAuthorised, saveChanges)
router.post('/verifyCode', isAuthorised, verifyCode)
router.post('/addAddress', isAuthorised, addAddress)
router.post('/fetchAddress', isAuthorised, fetchAddress)
router.post('/removeAddress', isAuthorised, removeAddress)
router.post('/placeorder', isAuthorised, placeOrder)
router.post('/fetchOrders', isAuthorised, fetchOrders)

export default router