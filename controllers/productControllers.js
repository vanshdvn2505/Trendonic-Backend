import Product from '../models/product.models.js'
import User from '../models/user.models.js'
import {response_400, response_200} from '../utils/responseCode.utils.js'

export const panels = async (req, res) => {
    try {
        const prod1 = await Product.find({category: /groceries/i});
        const prod2 = await Product.find({category: /laptops/i });
        return response_200(res,"Success", {prod1, prod2})
    }
    catch(error){
        console.log("Error At Panels" + error);
        return response_400(res, error)    
    }    
}

export const similar = async (req, res) => {
    try {
        const {input} = req.body;
        const prod = await Product.find({category: new RegExp(input, 'i')})
        return response_200(res, "Success", {prod})
    }
    catch(error){
        console.log("Error At Similar" + error);
        return response_400(res, error)
    }
}

export const search = async (req, res) => {
    try {
        const {input} = req.body;
        if(input == "Trendonic"){
            const products = await Product.find();
            return response_200(res, "Products Found", {products});
        }
        const keywords = input.split(/\s+/).filter(Boolean);
        // console.log(keywords)
        const queries = keywords.map(keyword => ({
            $or: [
                {category: {$regex: keyword, $options: 'i'}},
                {title: {$regex: keyword, $options: 'i'}},
                {tags: {$regex: keyword, $options: 'i'}},
                {brand: {$regex: keyword, $options: 'i'}},
            ]
        }))
        // console.log(queries);
        // console.log('MongoDB Query:', { $and: queries });

        const products = await Product.find({$and: queries})

        // console.log('Products:', products);

        if(products.length > 0){
            return response_200(res, "Products Found", {products});
        }
        return response_200(res, "Products Not Found")
    }
    catch(error){
        console.log("Error At Search " + error);
        return response_400(res, error);    
    }
}

export const addToCart = async (req, res) => {
    try {
        const {id, userId} = req.body;
        const user = await User.findOne({email: userId});
        if(!user){
            return response_400(res, "User Not Found!!");
        }
        const product = await Product.findOne({_id: id});
        if(!product){
            return response_400(res, "Product Not Found !!");
        }
        const productExists = user.cart.some(cartItem => cartItem._id.equals(product._id));
        if (productExists) {
            return response_200(res, "Product Already In The Cart");
        }
        user.cart.push(product);
        await user.save();
        return response_200(res, "Added Successfully");
    }
    catch(error){
        console.log("Error At Add To Cart " + error);
        return response_400(res, error);    
    }
}

export const fetchCart = async (req, res) => {
    try {
        const {userId} = req.body;
        const user = await User.findOne({email: userId})
        if(!user){
            return response_400(res, "User Not Found")
        }
        const result = user.cart;
        return response_200(res, "Success", {result})
    }
    catch(error){
        console.log("Error At Fetch Cart " + error);
        return response_400(res, error);    
    }
}

export const removeFromCart = async (req, res) => {
    try {
        const {id, userId} = req.body;
        const user = await User.findOne({email: userId});
        if(!user){
            response_400(res, "User Not Found");
        }
        const idx = user.cart.findIndex(item => item._id.toString() == id);
        if(idx == -1){
            return response_400(res, "Product Not Found In the Cart!");
        }
        user.cart.splice(idx, 1);
        await user.save();
        return response_200(res, "Removed Successfully!")
    }
    catch(error){
        console.log("Error At Remove From Cart " + error);
        return response_400(res, error); 
    }
}