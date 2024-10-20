import nodemailer from 'nodemailer';
import twilio from 'twilio';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendVerificationEmail = async (email, otp) => {
  const mailOptions = {
    from: 'noreply@jobposting.com',
    to: email,
    subject: 'Email Verification OTP',
    html: `
      <h1>Email Verification</h1>
      <p>Your OTP for email verification is: <strong>${otp}</strong></p>
      <p>This OTP will expire in 10 minutes.</p>
      <p>If you didn't request this verification, please ignore this email.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export const sendVerificationSMS = async (phoneNumber, otp) => {
  try {
    await twilioClient.messages.create({
      body: `Your mobile verification OTP for Job Posting Board is: ${otp}. This OTP will expire in 10 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw new Error('Failed to send verification SMS');
  }
};

export const sendJobAlert = async (job, candidateEmails) => {
  const emailPromises = candidateEmails.map(candidateEmail => {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: candidateEmail,
      subject: `New Job Opportunity: ${job.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">${job.title}</h1>
          <p style="font-size: 16px; line-height: 1.5;">We thought you might be interested in this new job opportunity:</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #1f2937; margin-top: 0;">Job Details</h2>
            <p style="margin: 10px 0;"><strong>Description:</strong><br>${job.description}</p>
            <p style="margin: 10px 0;"><strong>Experience Level:</strong> ${job.experienceLevel}</p>
            <p style="margin: 10px 0;"><strong>Application Deadline:</strong> ${new Date(job.endDate).toLocaleDateString()}</p>
          </div>

          <div style="margin-top: 20px;">
            <p>To apply or learn more about this position, please visit our job board.</p>
            <p style="font-size: 14px; color: #6b7280;">If you're no longer interested in receiving job alerts, please update your preferences.</p>
          </div>
        </div>
      `,
    };

    return transporter.sendMail(mailOptions)
      .then(() => ({
        email: candidateEmail,
        status: 'success',
      }))
      .catch(error => ({
        email: candidateEmail,
        status: 'failed',
        error: error.message,
      }));
  });

  try {
    const results = await Promise.allSettled(emailPromises);

    // Log results for monitoring
    const successful = results.filter(r => r.value?.status === 'success').length;
    const failed = results.filter(r => r.value?.status === 'failed').length;

    console.log(`Job alert email summary: ${successful} sent successfully, ${failed} failed`);

    // If all emails failed, throw an error
    if (failed === candidateEmails.length) {
      throw new Error('Failed to send all job alert emails');
    }

    return {
      successful,
      failed,
      total: candidateEmails.length,
    };
  } catch (error) {
    console.error('Error in sendJobAlert:', error);
    throw error;
  }
};

export const sendWelcomeEmail = async (email, companyName) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Welcome to Job Posting Board',
    html: `
      <h1>Welcome to Job Posting Board</h1>
      <p>Dear ${companyName},</p>
      <p>Thank you for registering with our Job Posting Board. We're excited to have you on board!</p>
      <p>You can now start posting jobs and reaching out to potential candidates.</p>
      <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
      <p>Best regards,</p>
      <p>The Job Posting Board Team</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};
