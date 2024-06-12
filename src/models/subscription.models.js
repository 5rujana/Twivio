import mongoose, {Schema} from "mongoose"

const subscriptionSchema = new Schema({
    subscriber:{
        type: Schema.Types.ObjectId,
        ref: "User", // one who is subscribing
        required: true
    },
    channel:{
        type: Schema.Types.ObjectId,
        ref: "User", // one to whom 'subscriber' is subscribing
        required: true
    
    }
}, {timestamps: true})

export const Subscription = mongoose.model("Subscription", subscriptionSchema)