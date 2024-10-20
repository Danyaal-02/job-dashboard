import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  companyName: { type: String, required: true },
  companyEmail: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobile: { type: String, required: true },
  employeeSize: { 
    type: Number, 
    required: true,
    min: [1, 'Employee size must be at least 1']
  },
  isEmailVerified: { type: Boolean, default: false },
  isMobileVerified: { type: Boolean, default: false },
  emailOTP: { type: String },
  mobileOTP: { type: String },
  emailOTPExpires: { type: Date },
  mobileOTPExpires: { type: Date }
});

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

const User = mongoose.model('User', userSchema);

export default User;