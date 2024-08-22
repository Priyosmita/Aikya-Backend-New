const Funding = require('../models/funding');

exports.createFunding = async (req, res) => {
    try {
      const { title, description, roadmap, investor_name, funds } = req.body;
      const image = req.file ? req.file.path.replace('uploads/', '') : '';
  
      const funding = new Funding({
        title,
        description,
        image,
        roadmap: Array.isArray(roadmap) ? roadmap : JSON.parse(roadmap),
        investor_name: Array.isArray(investor_name) ? investor_name : JSON.parse(investor_name),
        funds: Array.isArray(funds) ? funds : JSON.parse(funds),
      });
  
      await funding.save();
      res.status(201).send(funding);
    } catch (error) {
      console.error('Error creating funding:', error);
      res.status(400).send({ error: 'Failed to create funding' });
    }
  };
  

exports.getFunding = async (req, res) => {
  try {
    const funding = await Funding.find();
    res.send(funding);
  } catch (error) {
    console.error('Error fetching funding:', error);
    res.status(500).send(error);
  }
};
