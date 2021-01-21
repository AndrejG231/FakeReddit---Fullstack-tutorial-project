import nodemailer from "nodemailer";

export const sendMail = (to: string, html: string) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "ag.office.code",
      pass: "<-- Password -->",
    },
  });

  let mailOptions = {
    from: "Test Account ",
    to: to,
    subject: "Testing",
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