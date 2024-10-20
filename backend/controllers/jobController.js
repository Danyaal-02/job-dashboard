const Job = require('../models/Job');
const { sendJobAlert } = require('../services/emailService');

exports.createJob = async (req, res) => {
    try {
      // 1. Create and save the job
      const { title, description, experienceLevel, candidates, endDate } = req.body;
      const job = new Job({
        title,
        description,
        experienceLevel,
        candidates,
        endDate,
        company: req.user.id
      });
  
      await job.save();
  
      // 2. Send job alerts if there are candidates
      if (candidates && candidates.length > 0) {
        try {
          await sendJobAlert(job, candidates);
          console.log('Job alerts sent successfully');
        } catch (emailError) {
          console.error('Error sending job alerts:', emailError);
          // Don't fail the job creation if email sending fails
          return res.status(201).json({ 
            job,
            warning: 'Job created successfully but there was an error sending email notifications'
          });
        }
      }
  
      // 3. Return success response
      res.status(201).json({ 
        job,
        message: 'Job created successfully and notifications sent'
      });
  
    } catch (error) {
      console.error('Error in createJob:', error);
      res.status(500).json({ 
        message: 'Error creating job',
        error: error.message 
      });
    }
  };

exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ company: req.user.id });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching jobs' });
  }
};
