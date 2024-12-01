import NodeMailer from 'nodemailer';
import { generateResetToken } from './authRoutes.js';

var transporter = NodeMailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'beatsnap.media@gmail.com',
        pass: 'ifzx pcaa nrue pvwj'
    }
});

export const sendEmail = async function(req, res) {
    const { email } = req.body;

    let token = await generateResetToken(email);

    var mailOptions = {
        from: 'beatsnap.media@gmail.com',
        to: email,
        subject: 'Password Reset',
        text: `Please use the following link to reset your password: ${process.env.UI_URL}/changepassword/${token}`,
        html: `<p>Please use the following link to reset your password:</p> <p>${process.env.UI_URL}/changepassword/${token}</p>`
    }

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
            return res.status(500).send("Internal Server Error");
        } else {
            console.log('Email sent: ' + info.response);
            return res.status(200);
        }
    });
}