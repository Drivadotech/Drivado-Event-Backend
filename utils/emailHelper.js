const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const { OAuth2 } = google.auth;

//oauth playground
const OAUTH_PLAYGROUND = "https://developers.google.com/oauthplayground";


const {
    MAILING_SERVICE_CLIENT_ID,
    MAILING_SERVICE_CLIENT_SECRET,
    MAILING_SERVICE_REFRESH_TOKEN
  } = process.env;

const oauth2Client = new OAuth2(
  MAILING_SERVICE_CLIENT_ID,
  MAILING_SERVICE_CLIENT_SECRET,
  //MAILING_SERVICE_REFRESH_TOKEN,
  OAUTH_PLAYGROUND
);

const mailHelper = (to, from, subject, template,url) => {

  oauth2Client.setCredentials({
    refresh_token: MAILING_SERVICE_REFRESH_TOKEN,
  });
 

  const accessToken = oauth2Client.getAccessToken();
  

  const smptTransport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: "techsupport@drivado.com",
      clientId: MAILING_SERVICE_CLIENT_ID,
      clientSecret: MAILING_SERVICE_CLIENT_SECRET,
      refreshToken: MAILING_SERVICE_REFRESH_TOKEN,
      accessToken:accessToken
    },
  });
  const mailOptions = {
    from: from,
    to: to,
    subject: subject,
    html: template
  };

  smptTransport.sendMail(mailOptions, (err, infor) => {
    if (err) {
      console.log(err.message);
      return err;
    }
    return infor;
  });

  
};

module.exports = mailHelper;
