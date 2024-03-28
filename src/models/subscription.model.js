import mongoose,{Schema} from 'mongoose'
const substriptionSchema = new Schema({
    subscriber:{
        type:Schema.Types.ObjectId,//this is the id of the user who is subscribing
        ref:"User"
    },
    channel:{
        type:Schema.Types.ObjectId,//this is the id of the user who is being subscribed
        ref:"User"
    }
},{timestamps:true}

)


export const Subscription =  mongoose.model('Subscription', substriptionSchema)