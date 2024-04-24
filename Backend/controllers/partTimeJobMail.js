// Import the User model
// import { User } from './userModel.js';
import { User } from '../models/userSchema.js';
// import nodemailer from "nodemailer";
import {mailSender} from "../utils/mailSender.js";
// import mongoose from "mongoose";




// Define a function to send job post emails
async function sendJobPostEmail(email, jobPost) {
    // Create a transporter to send emails

    // Define the email options

    // Send the email
    try {
        const mailResponse = await mailSender(
            email,
            "New Job Post Available",
            `A new job post is available: ${jobPost.title}. Check it out!`
        );
        console.log("Email sent successfully: ", mailResponse.response);
    } catch (error) {
        console.log("Error occurred while sending email: ", error);
        throw error;
    }
}

export const notifyJobSeekers = async (req, res, next) => {
    try {
        // Get the job post from the request body
        const jobPost = req.body;

        // Check if the job post duration is 'PartTime'
        if (jobPost.duration === 'PartTime') {
            // Find all 'Job Seeker' users
            const users = await User.find({ role: 'Job Seeker' });

            // Send an email to each 'Job Seeker' user
            for (const user of users) {
                await sendJobPostEmail(user.email, jobPost);
            }

            res.status(200).json({
                success: true,
                message: "Emails sent successfully!",
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "An error occurred while sending emails." });
    }
};



