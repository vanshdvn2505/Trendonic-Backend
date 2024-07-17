import express from 'express'
import {signup, verifyOtp, signin, signout} from '../controllers/authControllers.js'
const router = express.Router();

router.post('/signup', signup)
router.post('/signin', signin)
router.post('/signout', signout)
router.post('/verifyOtp', verifyOtp)

export default router