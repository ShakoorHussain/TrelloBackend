const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    status:{
        type:String,
        enum:["Todo","In Progress","Done"],
        default:"Todo"
    },
    projectId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'project',
        required:true
    },
    assignedTo:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
},
{
    timestamps:true
});
module.exports = mongoose.model('task',taskSchema);