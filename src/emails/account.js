const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.API_KEY);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to:email,
        from: 'hyun4911@gmail.com',
        subject : 'Welcome '+ name,
        text: 'Welcome to the app, name'
    });
}
const sendByeEmail = (email, name) => {
    sgMail.send({
        to:email,
        from: 'hyun4911@gmail.com',
        subject: 'Bye.. ' + name,
        text: 'Godbless along with you',
    })
}

module.exports = {
    sendWelcomeEmail,
    sendByeEmail,
};