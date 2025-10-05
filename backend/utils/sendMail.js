// const nodemailer = require("nodemailer");

// const sendEmail = async (to, subject, text) => {
//   try {
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       host: "smtp.gmail.com",
//       port: 587,
//       secure: false,
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     await transporter.sendMail({
//       from: `"Todo App" <${process.env.EMAIL_USER}>`,
//       to,
//       subject,
//       text,
//     });
//     console.log("Mail sent to", to);
//   } catch (error) {
//     console.error("Mail send error:", error);
//     throw error;
//   }
// };

// module.exports = sendEmail;

const axios = require("axios");

const sendEmail = async (to, subject, text) => {
  console.log(to);

  try {
    await axios.post(
      "https://api.resend.com/emails",
      {
        from: "Todo App <onboarding@resend.dev>",
        to: to,
        subject: subject,
        text: text,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Mail sent to", to);
  } catch (error) {
    console.error("Mail send error:", error.response?.data || error.message);
  }
};

module.exports = sendEmail;
