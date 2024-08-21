// projectModel.js
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: String,
  website: String,
  type: String,
  industry: String,
  details: String,
  startedIn: String,
  yearlyRevenue: Number,
  monthlySales: Number,
  grossMargin: Number,
  netMargin: Number,
  ebitda: Number,
  skus: Number,
  originalAsk: Number,
  equityOffered: Number,
  debtAmount: Number,
  images: String
});

module.exports = mongoose.model('Project', projectSchema);
