const Profile = require('../models/profile');

exports.createOrUpdateProfile = async (req, res) => {
  try {
    const { name, about, experience, certifications, skills } = req.body;
    const profilePicture = req.file ? req.file.path.replace('uploads/', '') : req.body.profilePicture;

    const parsedSkills = Array.isArray(JSON.parse(skills)) ? JSON.parse(skills) : [];
    const parsedCertifications = certifications ? JSON.parse(certifications) : [];

    const profile = await Profile.findOneAndUpdate({}, {
      name,
      about,
      experience,
      certifications: parsedCertifications,
      skills: parsedSkills,
      profilePicture
    }, { upsert: true, new: true });

    res.status(201).send(profile);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(400).send({ error: 'Failed to update profile' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).send({ error: 'userId query parameter is required' });
    }
    const profile = await Profile.findOne({ userId });
    if (!profile) {
      return res.status(404).send({ error: 'Profile not found' });
    }
    res.send(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).send(error);
  }
};