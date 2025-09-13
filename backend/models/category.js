import mongoose from "mongoose";

const categoryScheam=new mongoose.Schema({
    name:{type:String, required:true},
},{timestamps:true});


const Category=mongoose.model("Category", categoryScheam.index({name:1}));
export default Category;