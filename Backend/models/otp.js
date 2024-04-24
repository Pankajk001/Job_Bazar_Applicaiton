import mongoose from "mongoose";
// import {mailsender} from "../utils/mailSender.js";
import {mailSender} from "../utils/mailSender.js";
import {otpTemplate} from "../mail/emailVerificationTemplate.js"

 const OTPSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
	},
	otp: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
		expires: 60 * 5, // The document will be automatically deleted after 5 minutes of its creation time
	},
});

// Define a function to send emails
async function sendVerificationEmail(email, otp) {
	// Create a transporter to send emails

	// Define the email options

	// Send the email
	try {
		const mailResponse = await mailSender(
			email,
			"Verification Email",  //title
			otpTemplate(otp)  //body
		);
		console.log("Email sent successfully: ", mailResponse.response);
	} catch (error) {
		console.log("Error occurred while sending email: ", error);
		throw error;
	}
}

// Define a pre-save hook to send email before the document has been saved
OTPSchema.pre("save", async function (next) {
	console.log("New document saved to database");

	// Only send an email when a new document is created otp database
	if (this.isNew) {
		await sendVerificationEmail(this.email, this.otp);
	}
	next();
});

// const OTP = mongoose.model("OTP", OTPSchema);

// module.exports = OTP;
export const OTP = mongoose.model("OTP", OTPSchema);


