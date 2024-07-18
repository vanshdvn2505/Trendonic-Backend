import express from 'express';
import mongoose, { connect } from 'mongoose';
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
dotenv.config();
const app = express();
const PORT = process.env.PORT
const URL = process.env.URL
import Product from './models/product.models.js';


const connectToDatabase = async () => {
    try {
        await mongoose.connect(URL);
        console.log("Connected To Database!");
    }
    catch (error) {
        console.log("Failed To Connect To Database ", error);
    }
}
connectToDatabase();

const allowedOrigins = [
  'https://main--trendonic.netlify.app',
  'https://trendonic.netlify.app'
];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: function (origin, callback) {
                    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
                          callback(null, true);
                    }
                    else {
                          callback(new Error('Not allowed by CORS'));
                    }
            },
    methods: ['GET', 'POST', 'OPTIONS', 'PUT'],
    allowedHeaders: ['Content-Type'],
    credentials: true
}))
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send("Server is running");
})

app.post('/save-products', async (req, res) => {
    try {

        const savedProducts = await Product.insertMany(products);

        res.json(savedProducts);
    } catch (err) {
        console.log(err.message);
        res.status(400).json({ error: err.message });
    }
});

import authRoutes from './routes/auth.routes.js'
app.use('/auth', authRoutes)

import userRoutes from './routes/user.routes.js'
app.use('/user', userRoutes)

import productRoutes from './routes/product.routes.js'
app.use('/product', productRoutes)

app.listen(PORT, () => {
    console.log("Listening...")
})
