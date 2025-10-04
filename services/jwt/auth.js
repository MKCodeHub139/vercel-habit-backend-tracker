import jwt from 'jsonwebtoken'
const secret =process.env.JWT_SECRET


function createToken(user){
    const payload ={
        id:user._id,
        name:user.name,
        email:user.email,
    }
    const token =jwt.sign(payload,secret)
    return token
}
function validateUser(token){
const payload =jwt.verify(token,secret)
return payload
}
export {createToken,validateUser}