import {Schema,model} from 'mongoose'

const habitSchema =new Schema({
    userId:{
        type:Schema.ObjectId,
        ref:'user',
        required:true
    },
    title:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true,
    },
    frequency:{
        type:String,
        required:true,
    },
    streak:{
        type:Number,
        default:0
    },
    longestStreak:{
        type:Number,
        default:0
    },
    selectedDays:{
        type:[String],
        required:true,
    },
    completedDates:{
        type:[Date],
        default:[]
    },
},{timestamps:true})

const Habit = model('habit',habitSchema)

export default Habit