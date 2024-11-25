import NodeMailer from 'nodemailer';

var transporter = NodeMailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'beatsnap.media@gmail.com',
        pass: 'ifzx pcaa nrue pvwj'
    }
});

export const sendEmail = async function(email) {
    var mailOptions = {
        from: 'suki.kowaineko@gmail.com',
        to: email,
        subject: 'Password Reset',
        text: "Password reset successful!"
    }

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}