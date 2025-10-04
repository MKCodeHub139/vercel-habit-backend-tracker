import {Schema,model} from 'mongoose'
import {createHmac, randomBytes} from 'crypto'
import { createToken } from '../services/jwt/auth.js'
const userSchema =new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        lowercase:true,
        unique:true
    },
    salt:{
        type:String,
    },
    password:{
        type:String,
        required:true,
    },
},{timestamps:true})

userSchema.pre('save',async function (next) {
    if(!this.isModified('password')) return next()
    const salt =randomBytes(16).toString('hex')
    const hashedPassword =createHmac('sha256',salt).update(this.password).digest('hex')
    this.salt=salt
    this.password=hashedPassword
    next()
})
userSchema.static('matchPassordAndValidateToken',async function (email,password) {
    const user =await this.findOne({email})
    if(!user) throw new Error('user not defined')
        const salt =user.salt
        const hashedPassword =user.password

        const makeNewHashed =createHmac('sha256',salt).update(password).digest('hex')

        if(hashedPassword !== makeNewHashed) throw new Error('incorrect password')
            const token =createToken(user)
        return token
})

const User = model('user',userSchema)

export default User