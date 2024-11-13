const bcrypt = require('bcryptjs');
const crypto = require("crypto"); // For generating reset tokens
const nodemailer = require("nodemailer"); // For sending emails
const {generateJwt, generateRefreshToken, verifyJwt} = require("./MiddleWare");
const {Users} = require('../Schemas/schemas');

// Set up the transporter for sending emails
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'mycollege.nst.1st@gmail.com',
        pass: 'vgdn ypdu ofkw plep',
    }
});

const AuthenticationRoutes = {
    path: "",
    routes: [
        // routes for signup, login, verifyUser...
        {
            method : "post",
            path : "/signup",
            handler : async (req,res)=>{
                const{username,email,password} = req.body;
                if(!username || !email || !password){
                    res.status(400).send({
                        message:"all fields are required"
                    });
                    return;
                }
                try{
                    const checkUsernameAndEmail  = await Users.findOne({email:email});
                    console.log(checkUsernameAndEmail);
                    if(checkUsernameAndEmail){
                        res.status(400).send({message:"Email already exist"});
                        return;
                    }
                    const hash = await bcrypt.hash(password,10);
                    const user = new Users({
                        ...req.body,
                        password : hash
                    });
                    await user.save();
                    const payload = {username,email};
                    const token = generateJwt(payload);
                    const refreshToken = generateRefreshToken(payload);
                    res.status(200).send({
                        message:"signup successfull",
                        username:username,
                        token:token,
                        refreshToken:refreshToken
                    });
                    return;
                }
                catch(e){
                    res.status(500).send({message:"something went wrong"});
                }
            }
        },
        {
            method : "post",
            path : "/login",
            handler : async (req,res)=>{
                const{username, email, password} = req.body;
                if(!password || (!email && !username)){
                    res.status(400).send({message:"all fields are required"});
                    return;
                }
                try{
                    let user;
                    if(!username){
                        user = await Users.findOne({email:email});
                        if(!user){
                            res.status(404).send({message:"User with this email does not exist"});
                            return;
                        }
                    }
                    else if(!email || (!(!email) && !(!username))){
                        user = await Users.findOne({username:username});
                        if(!user){
                            res.status(404).send({message:"User with this username does not exist"});
                            return;
                        }
                    }

                    const checkPassword = await bcrypt.compare(password, user.password);
                    if(!checkPassword){
                        res.status(400).send({message:"Wrong password"});
                        return;
                    }
                    const payload = {
                        name:user.name,
                        username:user.username,
                        email:user.email
                    };
                    const token = generateJwt(payload);
                    const refreshToken = generateRefreshToken(payload);
                    res.status(200).send({
                        message:"login successfull",
                        username:username,
                        token:token,
                        refreshToken:refreshToken
                    });
                    return;
                }
                catch(e){
                    res.status(500).send({message:"something went wrong"});
                }
            }
        },
        {
            method : "post",
            path : "/verifyUser",
            handler : async (req,res)=>{
                const {jwtToken,refreshToken} = req.headers;
                const check = verifyJwt(jwtToken,refreshToken)
                if(check){
                    return res.status(200).json(check);
                }
                return res.status(400).json({
                    message : "token expired"
                })
            }
        },
        // Forgot password route
        {
            method: "post",
            path: "/forgot-password",
            handler: async (req, res) => {
                const { email } = req.body;
                if (!email) {
                    return res.status(400).send({ message: "Email is required" });
                }

                try {
                    // first i am checking where the user with this email exists or not
                    const user = await Users.findOne({ email: email });
                    if (!user) {
                        return res.status(404).send({ message: "User with this email does not exist" });
                    }

                    // Generate a password reset token (you can use JWT or a random token)
                    // console.log("jai ho oasdhfoas dfosdab fs")
                    const resetToken = crypto.randomBytes(32).toString("hex");
                    const tokenExpiration = Date.now() + 3600000; // Token expires in 1 hour
                    console.log(resetToken,"resertdsasdlfhodsfhos")

                    // Save the reset token and its expiration in the user record
                    user.resetPasswordToken = resetToken;
                    user.resetPasswordExpires = tokenExpiration;
                    await user.save();

                    // Send email with reset link
                    const resetLink = `https://rent-karo-page.vercel.app/reset-password?token=${resetToken}&email=${email}`;

                    const mailOptions = {
                        from: 'mycollege.nst.1st@gmail.com',
                        to: email,
                        subject: 'Password Reset Request',
                        text: `You requested for password reset. Please click on the following link to reset your password: ${resetLink}`
                    };
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            console.log(error);
                            return res.status(500).send({ message: "Failed to send email" });
                        }
                        console.log('Email sent: ' + info.response);
                        res.status(200).send({ message: "Password reset link sent to your email", resettoken:resetToken });
                    });
                } catch (e) {
                    res.status(500).send({ message: "Something went wrong" });
                }
            }
        },

        // Reset password route
        {
            method: "post",
            path: "/reset-password",
            handler: async (req, res) => {
                const { email, token, newPassword } = req.body;
                if (!email || !token || !newPassword) {
                    return res.status(400).send({ message: "All fields are required" });
                }

                try {
                    // Find the user by email and check if the token matches and is not expired
                    const user = await Users.findOne({
                        email: email,
                        resetPasswordToken: token,
                        resetPasswordExpires: { $gt: Date.now() } // Check if token is still valid
                    });

                    if (!user) {
                        return res.status(400).send({ message: "Invalid or expired token" });
                    }

                    // Hash the new password and update the user record
                    const hash = await bcrypt.hash(newPassword, 10);
                    user.password = hash;
                    user.resetPasswordToken = undefined; // Clear the reset token
                    user.resetPasswordExpires = undefined; // Clear the expiration time
                    await user.save();

                    res.status(200).send({ message: "Password updated successfully" });
                } catch (e) {
                    res.status(500).send({ message: "Something went wrong" });
                }
            }
        }
    ]
};

module.exports = AuthenticationRoutes;
