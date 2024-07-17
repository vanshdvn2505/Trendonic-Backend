import User from '../models/user.models.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import nodemailer from 'nodemailer'
import {response_400, response_200} from '../utils/responseCode.utils.js'
import {v4 as uuidv4} from 'uuid'
const dictionary = [];
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(username, email, password, res){
    if(!username || !email || !password){
        response_400(res, 'All fields required')
        return false;
    }
    else if(!emailRegex.test(email)){
        response_400(res, 'Invalid Email');
        return false;
    }
    else if(password.length < 8){
        response_400(res, "Password must be 8 characters long")
        return false;
    }
    return true;
}

async function generateToken(res, user){
    try {
        const token = jwt.sign(
            {
                id: user.id,
                username: user.username,
                email: user.email
            },
            process.env.JWT_KEY,
            {
                expiresIn: "7d",
            }
        );
        res.cookie("token", token, {
            httpOnly: true,
            secure: true
        });
        return token
    }
    catch(error){
        console.log(error);
        return "";    
    }
}

function sendEmail(res, email){
    const OTP = Math.floor(Math.random()*90000) + 10000
    dictionary.push({
        email: email,
        otp: OTP,
    })
    const text = `The OTP for email verification is ${OTP}`;
    const subjectOfEmail = "Email Verification For Trendonic";
    const auth = nodemailer.createTransport({
        service: "gmail",
        secure: true,
        port: 465,
        auth:{
            user: process.env.SENDER_EMAIL,
            pass: process.env.SENDER_PASS,
        },
    })
    const reciever = {
        from: process.env.SENDER_EMAIL,
        to: [email],
        subject: subjectOfEmail,
        text: text,
    }
    auth.sendMail(reciever, (error, emailResponse) => {
        if(error){
            throw error;
        }
        console.log("Email Sent");
        res.end();
    })
}

export const signup = async (req, res) => {
    try {
        const {username, email, password} = req.body;
        if(!username || !email || !password){
            return response_400(res, 'All fields required')
        }
        
        if(validate(username, email, password, res)){
            const emailExists = await User.findOne({email: email});
            if(emailExists){
                return response_400(res, "Email Already Exists");
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const id = uuidv4();
            const newUser = new User({
                id: id,
                username,
                email,
                password: hashedPassword,
            })

            const token = await generateToken(res, newUser);
            sendEmail(res, email);
            

            return response_200(res, "Registered Successfully", {
                id: id,
                username: username,
                email: email,
                phone: "",
                password: hashedPassword,
                token: token,
            })
        }
    }
    catch(error){
        return response_400(res, error);
    }
}

export const signin = async (req, res) => {
    try {
        const {email, password} = req.body;
        if(!email || !password){
            return response_400(res, 'Enter All Fields');
        }

        if(!emailRegex.test(email)){
            return response_400(res, 'Invalid Email');
        }

        const emailExists = await User.findOne({email: email});
        if(!emailExists){
            return response_400(res, 'Email Does Not Exists');
        }

        const userPassword = await bcrypt.compare(password, emailExists.password);
        if(!userPassword){
            return response_400(res, 'Incorrect Password');
        }

        const user = {
            id: emailExists.id,
            username: emailExists.username,
            email: emailExists.email,
            phone: emailExists.phone,
            password: emailExists.password,
        }

        const token = await generateToken(res, user);
        return response_200(res, "Logged In Successfully", {
            id: user.id,
            username: user.username,
            email: user.email,
            password: user.password,
            phone: user.phone,
            token: token,
        })
    }
    catch(error){
        return response_400(res, error)
    }
}

export const signout = async (req, res) => {
    try {
        const {auth} = req.body;
        const userExists = await User.findOne({email: auth.email});
        if(!userExists){
            return response_400(res, 'User Does Not Exists');
        }
        res.clearCookie(auth.token);
        return response_200(res, 'Signed Out Successfully')
    }
    catch(error){
        return response_400(res, error);    
    }
}

export const verifyOtp = async (req, res) => {
    try {
        const {otp, auth} = req.body; 
        const userRecord = dictionary.find(record => record.email == auth.email && record.otp == otp)
        if(userRecord){
            const newUser = new User({
                id: auth.id,
                username: auth.username,
                email: auth.email,
                password: auth.password,
            })
            await newUser.save();
            const idx = dictionary.indexOf(userRecord);
            if(idx > -1){
                dictionary.splice(idx, 1);
            }
            return response_200(res, "Registered Successfully")
        }
        else{
            return response_400(res, "Invalid OTP");
        }
    }
    catch(error){
        return response_400(res, error);
    }
}