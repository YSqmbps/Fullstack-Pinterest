import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const commentSchema = new Schema( {
    description: {
        type: String,
        required: true,
    },
    pin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Pin",
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    // 回复功能，关联父评论的ID
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
        default: null,
    }
   
},
{
    timestamps: true,
}
)

export default mongoose.model('Comment',commentSchema)
