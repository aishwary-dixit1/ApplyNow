import React, { useState } from 'react'
import api from '../api/api'

export default function QuickAdd({ onClose }){
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ companyName: '', role: '', dateApplied: '', status: 'Applied', expectedCTC: '', jobLink: '', applicationStatusLink: '', hasReferral: 'no', workType: 'Remote', notes: '' })

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try{
      await api.post('/api/jobs', {
        ...form,
        hasReferral: form.hasReferral === 'yes'
      })
      // notify job table to refresh
      window.dispatchEvent(new Event('jobs:refresh'))
      onClose()
    }catch(err){
      console.error(err)
      alert('Failed to add job')
    }finally{ setLoading(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-slate-950/35 backdrop-blur-[2px]" onClick={onClose} />
      <form onSubmit={submit} className="surface relative w-full max-w-3xl rounded-[28px] p-6 md:p-7 shadow-glow ring-1 ring-slate-200/70 dark:ring-white/10">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Add application</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Keep your job applications organized in a clean workflow.</p>
          </div>
          <button type="button" onClick={onClose} className="btn-secondary px-3 py-2 text-sm">Close</button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Company</label>
            <input name="companyName" value={form.companyName} onChange={handle} placeholder="Airbnb" className="field-muted" required />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Position</label>
            <input name="role" value={form.role} onChange={handle} placeholder="Frontend Developer" className="field-muted" required />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Application date</label>
            <input name="dateApplied" value={form.dateApplied} onChange={handle} type="date" className="field-muted" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Expected Salary (CTC)</label>
            <input name="expectedCTC" value={form.expectedCTC} onChange={handle} placeholder="e.g., 12 LPA" className="field-muted" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Status</label>
            <select name="status" value={form.status} onChange={handle} className="field-muted">
              <option>Not Applied Yet</option>
              <option>Applied</option>
              <option>Shortlisted</option>
              <option>Not Shortlisted</option>
              <option>Assessment</option>
              <option>Interviewing</option>
              <option>Accepted Offer</option>
              <option>Rejected Offer</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Job website</label>
            <input name="jobLink" value={form.jobLink} onChange={handle} placeholder="airbnb.com/careers/..." className="field-muted" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Application status link</label>
            <input name="applicationStatusLink" value={form.applicationStatusLink} onChange={handle} placeholder="Application portal / tracker link" className="field-muted" />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Referral</label>
            <select name="hasReferral" value={form.hasReferral} onChange={handle} className="field-muted">
              <option value="no">No referral</option>
              <option value="yes">Got referral</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Work type</label>
            <select name="workType" value={form.workType} onChange={handle} className="field-muted">
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="On-site">On-site</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Notes</label>
            <textarea name="notes" value={form.notes} onChange={handle} placeholder="Interview prep, hiring manager, reminders..." className="field-muted" rows="4" />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          <button type="submit" disabled={loading} className="btn-primary">{loading ? 'Adding...' : 'Add Job'}</button>
        </div>
      </form>
    </div>
  )
}
