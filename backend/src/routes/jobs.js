const express = require('express')
const router = express.Router()
const auth = require('../middleware/authMiddleware')
const sanitize = require('../middleware/sanitize')
const controller = require('../controllers/jobController')
const { validateCreateJob, validateUpdateJob } = require('../validations/jobValidation')

router.use(auth)
router.post('/', sanitize, validateCreateJob, controller.createJob)
router.get('/', controller.getJobs)
router.get('/analytics', controller.analytics)
router.patch('/:id/favorite', sanitize, async (req, res) => {
	try{
		const Job = require('../models/Job')
		const job = await Job.findOneAndUpdate({ _id: req.params.id, userId: req.user.id }, { favorite: !!req.body.favorite }, { new: true })
		if(!job) return res.status(404).json({ message: 'Not found' })
		res.json({ job })
	}catch(err){ res.status(400).json({ message: 'Invalid request' }) }
})
router.patch('/:id/archive', sanitize, async (req, res) => {
	try{
		const Job = require('../models/Job')
		const job = await Job.findOneAndUpdate({ _id: req.params.id, userId: req.user.id }, { archived: !!req.body.archived }, { new: true })
		if(!job) return res.status(404).json({ message: 'Not found' })
		res.json({ job })
	}catch(err){ res.status(400).json({ message: 'Invalid request' }) }
})
router.get('/:id', controller.getJob)
router.put('/:id', sanitize, validateUpdateJob, controller.updateJob)
router.delete('/:id', controller.deleteJob)

module.exports = router
