const mongoose = require('mongoose')

const JOB_STATUSES = [
  'Not Applied Yet',
  'Applied',
  'Shortlisted',
  'Not Shortlisted',
  'Assessment',
  'Interviewing',
  'Accepted Offer',
  'Rejected Offer'
]

const jobSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  companyName: { type: String, required: true },
  role: { type: String, required: true },
  dateApplied: { type: Date },
  status: { type: String, enum: JOB_STATUSES, default: 'Not Applied Yet' },
  resumeLink: { type: String },
  expectedCTC: { type: String },
  jobLink: { type: String },
  jobDescription: { type: String },
  notes: { type: String },
  location: { type: String },
  workType: { type: String },
  followUpDate: { type: Date },
  recruiterContact: { type: String },
  hasReferral: { type: Boolean, default: false },
  applicationStatusLink: { type: String },
  favorite: { type: Boolean, default: false },
  archived: { type: Boolean, default: false }
}, { timestamps: true })

module.exports = mongoose.model('Job', jobSchema)
module.exports.JOB_STATUSES = JOB_STATUSES
