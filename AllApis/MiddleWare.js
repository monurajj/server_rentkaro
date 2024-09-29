require('dotenv').config();
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;
const refreshSecret = process.env.REFRESH_SECRET;

function generateJwt(payload){
    const token = jwt.sign(payload,jwtSecret,{expiresIn:"3d"});
    return token;
}
function generateRefreshToken(payload){
    const refresh_token = jwt.sign(payload,refreshSecret,{expiresIn:"7d"})
    return refresh_token;
}
function jwtVerification(jwtToken){
    try{
        const payload = jwt.verify(jwtToken,jwtSecret)
        return payload
    }
    catch(er){
        return false
    }
}
function refreshVerification(refreshToken){
    try{
        const payload = jwt.verify(refreshToken,refreshSecret);
        return payload;
    }
    catch(er){
        return false
    }
}
function verifyJwt(jwtToken,refreshToken){
    const jwtPayload = jwtVerification(jwtToken);
    if(jwtPayload){
        return {
            message:"valid user",
            token:jwtToken,
            refreshToken:refreshToken
        }
    }
    const refreshPayload = refreshVerification(refreshToken);
    if(refreshToken){
        const newPayload = {
            username:refreshPayload.username,
            email:refreshPayload.email
        }
        const newJwtToken = generateJwt(newPayload);
        return {
            message:"valid user",
            token : newJwtToken,
            refreshToken:refreshToken
        }
    }
    return false
}
module.exports = {generateJwt,jwtVerification,generateRefreshToken,refreshVerification,verifyJwt}