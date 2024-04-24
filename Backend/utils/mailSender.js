// const nodemailer = require("nodemailer");
// import mongoose from "mongoose";
import nodemailer from "nodemailer";

export const mailSender = async (email, title, body) => {
    try{
            let transporter = nodemailer.createTransport({
                host:process.env.MAIL_HOST,
                auth:{
                    user: process.env.MAIL_USER,
                    pass: process.env.MAIL_PASS,
                }
            })


            let info = await transporter.sendMail({
                from: 'Job Portal || By Pankaj and Team',
                to:`${email}`,
                subject: `${title}`,
                html: `${body}`,
            })
            console.log(info);
            return info;
    }
    catch(error) {
        console.log(error.message);
    }
}


// module.exports = mailSender;
// export const MailSender = mongoose.model("MailSender", mailSender);

