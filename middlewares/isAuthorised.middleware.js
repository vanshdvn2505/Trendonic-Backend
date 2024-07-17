import User from "../models/user.models.js";
import jwt from 'jsonwebtoken'
import { response_400, response_500 } from "../utils/responseCode.utils.js";

const isAuthorised = async (req, res, next) => {
    const authToken = req.cookies.token || req.token;
    if(!authToken){
        console.log("Token Not Found")
        return response_400(res, "Token Not Found");
    }
    try {
        const decoded = jwt.verify(authToken, process.env.JWT_KEY);

        const user = await User.findOne({email: decoded.email});

        if(!user){
            return response_400(res, "User not found!");
        }
        next();
    }
    catch(error){
        return response_500(res, "Failed to authenticate User", error);
    }
}

export default isAuthorised;