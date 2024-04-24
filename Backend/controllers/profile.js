import { Employer, JobSeeker, User } from '../models/userSchema.js';

export const deleteAccount = async (req, res) => {
    try {
        const userEmail = req.user.email;

        let user;
        user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        // Get the role of the user
        const role = user.role;

        // Delete Associated Profile with the User based on their role
        if(role === "Job Seeker"){
            await JobSeeker.findOneAndDelete({ email: userEmail });
        } else if(role === "Employer"){
            await Employer.findOneAndDelete({ email: userEmail });
        }

        // Delete the user from the User collection
        await User.findOneAndDelete({ email: userEmail });

        res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ success: false, message: "User Cannot be deleted successfully" });
    }
};
