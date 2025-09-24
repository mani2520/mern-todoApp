const generateOtp = require("./generateOtp");

function setOtp(user, type = "email") {
  const otp = generateOtp();
  const expire = Date.now() + 10 * 60 * 1000;

  if (type === "email") {
    (user.emailOTP = otp), (user.emailOTPExpire = expire);
  } else if (type === "reset") {
    (user.resetOTP = otp), (user.resetOTPExpire = expire);
  }

  return otp;
}

module.exports = setOtp;
