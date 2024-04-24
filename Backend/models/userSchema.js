import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "Please provide your name"],
        minLength: [3, "Name must contain at least 3 characters!"],
        maxLength: [30, "Name cannot exceed 30 characters!"],
    },
    lastName: {
        type: String,
        required: [true, "Please provide your name"],
        minLength: [3, "Name must contain at least 3 characters!"],
        maxLength: [30, "Name cannot exceed 30 characters!"],
    },
    age: {
        type: Number,
        required: [true, "Please provide your age"],
    },
    email: {
        type: String,
        required: [true, "Please provide your email"],
        validate: [validator.isEmail, "Please provide a valid email"],
    },
    // Job_Typ: {
    //     type: String,
    //     enum: ['fulltime', 'parttime', 'intern'],
    //     validate: {
    //         validator: function(v) {
    //             return this.role !== 'Job Seeker' || v != null;
    //         },
    //         message: 'Job Seeker must provide available_for.',
    //     },
    // },

    phone:{
        type: Number,
        required: [true, "Please provide your phone number"],
    },
  
    password:{
        type: String,
        required: [true, "Please provide your password"],
        minLength: [8, "Password must contain at least 8 characters!"],
        maxLength:[32, "Password cannot exceed 32 characters!"],
        select: false,
    },
    role:{
        type: String,
        required: [true, "Please Provide your role"],
        enum: ["Job Seeker", "Employer"],
    },
    
    image: {
        type: String,
        required: true,
    },
    createdAt:{
        type: Date,
        default: Date.now,
    },
});


// Hasing the Password
userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        next()
    }
    this.password = await bcrypt.hash(this.password, 10);
});

// Comparing Password
userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
};

//Generating a JWT token for Authorization
userSchema.methods.getJWTToken = function (){
    return jwt.sign({id: this._id}, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

export const User = mongoose.model("User", userSchema);
export const JobSeeker = mongoose.model("JobSeeker", userSchema);
export const Employer = mongoose.model("Employer", userSchema);



