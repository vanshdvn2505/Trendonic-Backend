import express from 'express'
const router = express.Router();
import isAuthorised from '../middlewares/isAuthorised.middleware.js'
import {panels, search, similar, addToCart, fetchCart, removeFromCart} from '../controllers/productControllers.js'

router.get('/panels', panels)
router.post('/search', search)
router.post('/similar', similar)
router.post('/addToCart', isAuthorised, addToCart)
router.post('/fetchCart', isAuthorised, fetchCart)
router.post('/removeFromCart', isAuthorised, removeFromCart)

export default router