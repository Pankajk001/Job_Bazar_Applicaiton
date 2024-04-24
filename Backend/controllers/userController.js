import { catchAsyncError } from '../middlewares/catchAsyncError.js'
import ErrorHandler from '../middlewares/error.js';
import { User } from '../models/userSchema.js';
import { sendToken } from '../utils/jwtToken.js';
// import {mailSender} from "../utils/mailSender.js";
import otpGenerator from "otp-generator";
import {OTP} from '../models/otp.js';
import { JobSeeker } from '../models/userSchema.js';
import { Employer } from '../models/userSchema.js';

export const sendotp = async (req, res) => {
  try {
    const { email } = req.body

    // Check if user is already present
    // Find user with provided email
    const checkUserPresent = await User.findOne({ email })
    // to be used in case of signup

    // If user found with provided email
    if (checkUserPresent) {
      // Return 401 Unauthorized status code with error message
      return res.status(401).json({
        success: false,
        message: `User is Already Registered`,
      })
    }

    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    })
    const result = await OTP.findOne({ otp: otp })
    // console.log("Result is Generate OTP Func")
    // console.log("OTP", otp)
    // console.log("Result", result)
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      })
    }
    const otpPayload = { email, otp }
    const otpBody = await OTP.create(otpPayload)
    console.log("OTP Body", otpBody)
    res.status(200).json({
      success: true,
      message: `OTP Sent Successfully`,
      otp,
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({ success: false, error: error.message })
  }
}

export const register = catchAsyncError(async(req, res, next) => {
    const {firstName,
           lastName,
           age, 
           email,
           phone,
           role,
           password,
           otp,
          } = req.body;

          console.log(req.body);

    if(!firstName || !lastName || !age || !email  || !phone || !role || !password || !otp ){
        return next(new ErrorHandler("Please fill all required fields first !"));

    }

    //check the age of the user
    if(age < 18){
      return next(new ErrorHandler("User must be atleast of 18 years"))
    }

     // Check if user already exists
    const existingUser = await User.findOne({email});
    if(existingUser){
        return next(new ErrorHandler("User already exists. Please sign in to continue."));
    }

    //find recent otp from the database corresponding to the email
    const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1)
    console.log(response)
    if (response.length === 0) {
      // OTP not found for the email
      return res.status(400).json({
        success: false,
        message: "Otp not Found, Please try again",
      })
    } else if (otp !== response[0].otp) {
      // Invalid OTP
      return res.status(400).json({
        success: false,
        message: "The OTP is not valid, Please try again",
      })
    }

    let user;
    if(role === 'Job Seeker') {
        user = await JobSeeker.create({ //making entry in Job seeker database
            firstName,
            lastName,
            age, 
            email, 
            phone, 
            role, 
            password,
            image:  `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
        });
    } else if(role === 'Employer') {
        user = await Employer.create({   //making entry in Jobseeker database
            firstName,
            lastName,
            age, 
            email, 
            phone, 
            role, 
            password,
            image:  `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
        });
    }
    user = await User.create({   //making entry in user  database
        firstName,
        lastName,
        age, 
        email, 
        phone, 
        role, 
        password,
        image:  `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });

    sendToken(user, 200, res, "User Registered Successfully!");
});


export const login = catchAsyncError(async(req, res, next) => {
    const {email, password, role} = req.body;

    if(!email || !password || !role){
        return next(
            new ErrorHandler("Please provide email, password and role.", 400)
            
            )
    }

    const user = await User.findOne({email}).select("+password");
    if(!user){
      return next(
        new ErrorHandler("Invalid Email or Password.", 400)
      )

    }
    const isPasswordMatched = await user.comparePassword(password);
    if(!isPasswordMatched){
        return next(
            new ErrorHandler("Invalid Email or Password.", 400)
        )
    }
    if(user.role !== role){
        return next(
            new ErrorHandler("User with this role not found.", 400)
        )
    }

    sendToken(user, 200, res, "User logged in Successfully!");
});

export const logout = catchAsyncError(async(req, res, next) => {
    res.status(201).cookie("token", "", {
        httpOnly: true,
        expires: new Date(Date.now()),
    } ).json({
        success: true,
        message: "User logged out successfully!",
    });
});

export const getUser = catchAsyncError((req, res, next) => {
    const user = req.user;
    res.status(200).json({
      success: true,
      user,
    });
  });

