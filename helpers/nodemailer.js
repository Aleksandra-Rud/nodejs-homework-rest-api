const nodemailer = require("nodemailer");
require("dotenv").config();

const { META_PASSWORD } = process.env;

const nodemailerConfig = {
  host: "smtp.meta.ua",
  port: 465,
  secure: true,
  auth: {
    user: "o-rudnyk@meta.ua",
    pass: META_PASSWORD,
  },
};

const transporter = nodemailer.createTransport(nodemailerConfig);

const email = {
  to: "kamyanskaya@gmail.com",
  from: "o-rudnyk@meta.ua",
  subject: "just some testing mess",
  html: "<p>Hello World ))</p>",
};

transporter
  .sendMail(email)
  .then(() => console.log("Email send success"))
  .catch((error) => console.log(error.message));
