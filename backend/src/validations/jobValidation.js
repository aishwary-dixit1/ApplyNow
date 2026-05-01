const { JOB_STATUSES } = require('../models/Job')

function validateCreateJob(req, res, next){
  const { companyName, role, status } = req.body || {}
  if(!companyName || !role){
    return res.status(400).json({ message: 'companyName and role are required' })
  }
  if(status && !JOB_STATUSES.includes(status)){
    return res.status(400).json({ message: 'Invalid status' })
  }
  return next()
}

function validateUpdateJob(req, res, next){
  const { status } = req.body || {}
  if(status && !JOB_STATUSES.includes(status)){
    return res.status(400).json({ message: 'Invalid status' })
  }
  return next()
}

module.exports = { validateCreateJob, validateUpdateJob }
