import nodemailer from "nodemailer";
import dotenv from "dotenv";

const result = dotenv.config({path: "../../.env"});

export const sendMail = (to: string, subject: string, html: string) => {
  let USER: string;
  let PASSWORD: string;

  if(result.parsed){
    USER = result.parsed.EMAIL_CREDENTIALS_USERNAME;
    PASSWORD = result.parsed.EMAIL_CREDENTIALS_PASSWORD;
  } else {
    [USER, PASSWORD] = ["",""];
  }

  console.log(USER, PASSWORD);
  
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: USER,
      pass: PASSWORD,
    },
  });

  let mailOptions = {
    from: "Test Account ",
    to: to,
    subject: "No-reply " + subject,
    html: html,
  };

  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      console.log("Error occured");
      console.log(err)
    } else {
      console.log("##############Mail Sent################");
      console.log(data);
    }
  })
}
