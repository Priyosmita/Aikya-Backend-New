const mongoose = require('mongoose');

const fundingSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
  roadmap: [String],
  investor_name: [String],
  funds: [Number],
});

module.exports = mongoose.model('Funding', fundingSchema);