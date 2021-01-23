import nodemailer from "nodemailer";

export const sendMail = async (to: string, subject: string, html: string) => {
  let transporter = nodemailer.createTransport({
    service: "<SERVICE>",
    auth: {
      user: "<USER>",
      pass: "<PASSWORD>",
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