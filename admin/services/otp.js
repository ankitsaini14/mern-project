//otp generating facility
const otpGenerator = require('otp-generator');
const OtpModel = require('../../models/admin-models/OTP-Model');
const OTP_CONFIG = {
  upperCaseAlphabets: false,
  lowerCaseAlphabets: false,
  specialChars: false,
  digits: true
}

const OTP_LENGTH = 4;

const generateOTP = () => {
  const OTP = otpGenerator.generate(OTP_LENGTH, OTP_CONFIG);
  return OTP;
};

module.exports = generateOTP;