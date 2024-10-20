const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { sendVerificationEmail, sendVerificationSMS, sendWelcomeEmail } = require('../services/emailService');

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

exports.register = async (req, res) => {
  try {
    const { name, companyName, companyEmail, password, mobile, employeeSize } = req.body;
    
    let user = await User.findOne({ companyEmail });
    if (user) {
      return res.status(400).json({ message: 'Company already registered' });
    }

    const emailOTP = generateOTP();
    const mobileOTP = generateOTP();

    user = new User({
      name,
      companyName,
      companyEmail,
      password,
      mobile,
      employeeSize,
      emailOTP,
      mobileOTP,
      emailOTPExpires: Date.now() + 600000, // OTP expires in 10 minutes
      mobileOTPExpires: Date.now() + 600000
    });

    await user.save();
    
    await sendVerificationEmail(user.companyEmail, emailOTP);
    await sendVerificationSMS(user.mobile, mobileOTP);

    res.status(201).json({ message: 'Company registered. Please check your email and mobile for verification OTPs.' });
  } catch (error) {
    res.status(500).json({ message: 'Error in registration', error: error.message });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { companyEmail, otp } = req.body;
    
    const user = await User.findOne({ companyEmail });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    if (user.emailOTP !== otp || user.emailOTPExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.isEmailVerified = true;
    user.emailOTP = undefined;
    user.emailOTPExpires = undefined;
    await user.save();

    if (user.isMobileVerified) {
      await sendWelcomeEmail(user.companyEmail, user.companyName);
    }

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error in email verification', error: error.message });
  }
};

exports.verifyMobile = async (req, res) => {
  try {
    const { mobile, otp } = req.body;
    
    const user = await User.findOne({ mobile });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    if (user.mobileOTP !== otp || user.mobileOTPExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.isMobileVerified = true;
    user.mobileOTP = undefined;
    user.mobileOTPExpires = undefined;
    await user.save();

    if (user.isEmailVerified) {
      await sendWelcomeEmail(user.companyEmail, user.companyName);
    }

    res.json({ message: 'Mobile number verified successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error in mobile verification', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { companyEmail, password } = req.body;
    
    const user = await User.findOne({ companyEmail });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (!user.isEmailVerified || !user.isMobileVerified) {
      return res.status(400).json({ message: 'Please verify your email and mobile number first' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error in login', error: error.message });
  }
};
