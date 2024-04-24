export const sendToken = (user, statusCode, res, message) => {
    const token = user.getJWTToken(); //calling the getJWTToken method on the user object to generate a JWT
    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true, //httpOnly option is a security setting that prevents client-side JavaScript from reading the cookie
    };
    res.status(statusCode).cookie("token", token, options).json({
        success: true,
        user,
        message,
        token,
    });
};