import mongoose from "mongoose";
const todoschema=new mongoose .Schema({
task:{
    type:String,
    required:true
},
completed:{
    type:Boolean,
    default:false
}
})
const taskSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    priority:{
        type:String,
        enum:["low","medium","high"],
        default:"low"
    },

    status:{
        type:String,
        enum:["pending","in progress","completed"],
        default:"pending"},

        duedate:{
            type:Date,
            required:true
        },
        assignedTo:[
            {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",},
            ],
            createdBy:[
                {
                type:mongoose.Schema.Types.ObjectId,
                ref:"User",
                },
            ],
            attachments:[{type:String}],
            todoCheckLists:[todoschema],
            progress:{type:Number,default:0}
        },
        {timestamps:true}
    );
const Task=mongoose.model("Task",taskSchema)
export default Task