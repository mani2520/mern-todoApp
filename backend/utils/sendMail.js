const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Todo App" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });
    console.log("Mail sent to", to);
  } catch (error) {
    console.error("Mail send error:", error);
    throw error;
  }
};

module.exports = sendEmail;
