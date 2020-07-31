const sgMail = require('@sendgrid/mail');
// const sendGridAPIKey = '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';
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