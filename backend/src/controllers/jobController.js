const Job = require('../models/Job')

exports.createJob = async (req, res) => {
  try{
    const payload = { ...req.body, userId: req.user.id }
    const job = await Job.create(payload)
    res.status(201).json({ job })
  }catch(err){ res.status(400).json({ message: 'Invalid data' }) }
}

exports.getJobs = async (req, res) => {
  try{
    const { q, status, archived, favorite, page = 1, limit = 20, sort = 'latest' } = req.query
    const filter = { userId: req.user.id }
    if(q){
      filter.$or = [
        { companyName: { $regex: q, $options: 'i' } },
        { role: { $regex: q, $options: 'i' } },
        { location: { $regex: q, $options: 'i' } }
      ]
    }
    if(status) filter.status = status
    if(typeof archived !== 'undefined') filter.archived = archived === 'true'
    if(typeof favorite !== 'undefined') filter.favorite = favorite === 'true'

    const sortSpec = sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 }
    const safeLimit = Math.min(Number(limit) || 20, 100)
    const safePage = Math.max(Number(page) || 1, 1)
    const skip = (safePage - 1) * safeLimit

    const [jobs, total] = await Promise.all([
      Job.find(filter).sort(sortSpec).skip(skip).limit(safeLimit),
      Job.countDocuments(filter)
    ])

    res.json({ jobs, pagination: { page: safePage, limit: safeLimit, total, totalPages: Math.ceil(total / safeLimit) } })
  }catch(err){ res.status(500).json({ message: 'Server error' }) }
}

exports.analytics = async (req, res) => {
  try{
    const userId = req.user.id
    const total = await Job.countDocuments({ userId })
    const mongoose = require('mongoose')
    const byStatus = await Job.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ])
    const monthly = await Job.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId), dateApplied: { $exists: true } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$dateApplied' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ])
    res.json({ total, byStatus, monthly })
  }catch(err){ console.error(err); res.status(500).json({ message: 'Server error' }) }
}

exports.getJob = async (req, res) => {
  try{
    const job = await Job.findOne({ _id: req.params.id, userId: req.user.id })
    if(!job) return res.status(404).json({ message: 'Not found' })
    res.json({ job })
  }catch(err){ res.status(400).json({ message: 'Invalid request' }) }
}

exports.updateJob = async (req, res) => {
  try{
    const job = await Job.findOneAndUpdate({ _id: req.params.id, userId: req.user.id }, req.body, { new: true })
    if(!job) return res.status(404).json({ message: 'Not found' })
    res.json({ job })
  }catch(err){ res.status(400).json({ message: 'Invalid data' }) }
}

exports.deleteJob = async (req, res) => {
  try{
    const deleted = await Job.findOneAndDelete({ _id: req.params.id, userId: req.user.id })
    if(!deleted) return res.status(404).json({ message: 'Not found' })
    res.json({ message: 'Deleted' })
  }catch(err){ res.status(400).json({ message: 'Invalid request' }) }
}
