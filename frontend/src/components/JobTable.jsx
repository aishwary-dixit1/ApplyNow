import React, { useEffect, useMemo, useState } from 'react'
import { Filter, ArrowUpDown, Search, Building2, Link2, Pencil, Trash2 } from 'lucide-react'
import api from '../api/api'

const STATUS_CONFIG = {
  'Not Applied Yet':  { color: '#888780', badge: '#5F5E5A' },
  'Applied':          { color: '#378ADD', badge: '#185FA5' },
  'Shortlisted':      { color: '#7F77DD', badge: '#534AB7' },
  'Not Shortlisted':  { color: '#D85A30', badge: '#993C1D' },
  'Assessment':       { color: '#EF9F27', badge: '#854F0B' },
  'Interviewing':     { color: '#1D9E75', badge: '#0F6E56' },
  'Accepted Offer':   { color: '#639922', badge: '#3B6D11' },
  'Rejected Offer':   { color: '#E24B4A', badge: '#A32D2D' }
}

const STATUS_OPTIONS = [
  'Not Applied Yet',
  'Applied',
  'Shortlisted',
  'Not Shortlisted',
  'Assessment',
  'Interviewing',
  'Accepted Offer',
  'Rejected Offer'
]

function downloadCSV(filename, rows){
  if(!rows.length) return
  const headers = Object.keys(rows[0])
  const csv = [headers.join(',')].concat(rows.map(r => headers.map(h => `"${(r[h]||'').toString().replace(/"/g,'""')}"`).join(','))).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function EditJobModal({ job, onClose, onSave }){
  const [form, setForm] = useState({ status: job.status, expectedCTC: job.expectedCTC || '', hasReferral: job.hasReferral ? 'yes' : 'no', workType: job.workType || job.location || 'Remote', notes: job.notes || '' })
  const [saving, setSaving] = useState(false)

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try{
      await api.put(`/api/jobs/${job._id}`, { status: form.status, expectedCTC: form.expectedCTC, hasReferral: form.hasReferral === 'yes', workType: form.workType, notes: form.notes })
      onSave()
      onClose()
    }catch(err){
      console.error(err)
      alert('Failed to update job')
    }finally{ setSaving(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-slate-950/35 backdrop-blur-[2px]" onClick={onClose} />
      <form onSubmit={submit} className="surface relative w-full max-w-lg rounded-[28px] p-6 md:p-7 shadow-glow ring-1 ring-slate-200/70 dark:ring-white/10">
        <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Edit application</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{job.companyName} • {job.role} • {form.workType || job.workType || job.location || 'Remote'}</p>
            </div>
          <button type="button" onClick={onClose} className="btn-secondary px-3 py-2 text-sm">Close</button>
        </div>

        <div className="grid grid-cols-1 gap-4">
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
            <label className="mb-1 block text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Expected Salary (CTC)</label>
            <input name="expectedCTC" value={form.expectedCTC} onChange={handle} placeholder="e.g., 12 LPA" className="field-muted" />
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
            <textarea name="notes" value={form.notes} onChange={handle} placeholder="Interview prep, contacts, reminders..." className="field-muted" rows="4" />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving...' : 'Save Changes'}</button>
        </div>
      </form>
    </div>
  )
}

function NotesModal({ job, onClose }){
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-slate-950/35 backdrop-blur-[2px]" onClick={onClose} />
      <div className="surface relative w-full max-w-xl rounded-[28px] p-6 md:p-7 shadow-glow ring-1 ring-slate-200/70 dark:ring-white/10">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Application notes</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{job.companyName} • {job.role}</p>
          </div>
          <button type="button" onClick={onClose} className="btn-secondary px-3 py-2 text-sm">Close</button>
        </div>

        <div className="rounded-2xl border border-slate-200/70 bg-slate-50/70 p-4 text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">
          {job.notes || 'No notes added for this application yet.'}
        </div>
      </div>
    </div>
  )
}

export default function JobTable(){
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [sortBy, setSortBy] = useState('dateDesc')
  const [page, setPage] = useState(1)
  const [editingJob, setEditingJob] = useState(null)
  const [notesJob, setNotesJob] = useState(null)
  const perPage = 10

  const fetchJobs = async () => {
    setLoading(true)
    try{
      const res = await api.get('/api/jobs')
      // backend returns { jobs, pagination }
      setJobs(res.data.jobs || res.data)
    }catch(err){ setJobs([]) }
    finally{ setLoading(false) }
  }

  useEffect(()=>{
    fetchJobs()
    const handler = ()=> fetchJobs()
    window.addEventListener('jobs:refresh', handler)
    return ()=> window.removeEventListener('jobs:refresh', handler)
  },[])

  const filtered = useMemo(()=>{
    let list = jobs.slice()
    if(query) list = list.filter(j => (j.companyName||'').toLowerCase().includes(query.toLowerCase()) || (j.role||'').toLowerCase().includes(query.toLowerCase()))
    if(statusFilter) list = list.filter(j => j.status === statusFilter)
    if(sortBy === 'dateDesc') list.sort((a,b)=> new Date(b.dateApplied||b.createdAt) - new Date(a.dateApplied||a.createdAt))
    if(sortBy === 'dateAsc') list.sort((a,b)=> new Date(a.dateApplied||a.createdAt) - new Date(b.dateApplied||b.createdAt))
    return list
  },[jobs, query, statusFilter, sortBy])

  const paged = useMemo(()=> filtered.slice((page-1)*perPage, page*perPage), [filtered, page])

  const exportCSV = ()=>{
    const rows = filtered.map((j, idx)=>({
      SNo: idx+1,
      Company: j.companyName,
      Role: j.role,
      DateApplied: j.dateApplied ? new Date(j.dateApplied).toISOString().split('T')[0] : '',
      Status: j.status,
      Salary: j.expectedCTC || '',
      Referral: j.hasReferral ? 'Yes' : 'No',
      JobLink: j.jobLink || '',
      StatusLink: j.applicationStatusLink || '',
      Notes: j.notes || ''
    }))
    downloadCSV('applynow-jobs.csv', rows)
  }

  const updateStatus = async (id, status) => {
    try{
      const res = await api.put(`/api/jobs/${id}`, { status })
      setJobs(prev => prev.map(j => j._id === id ? res.data.job : j))
    }catch(_err){}
  }

  const toggleFavorite = async (id, favorite) => {
    try{
      const res = await api.patch(`/api/jobs/${id}/favorite`, { favorite })
      setJobs(prev => prev.map(j => j._id === id ? res.data.job : j))
    }catch(_err){}
  }

  const toggleArchive = async (id, archived) => {
    try{
      const res = await api.patch(`/api/jobs/${id}/archive`, { archived })
      setJobs(prev => prev.map(j => j._id === id ? res.data.job : j))
    }catch(_err){}
  }

  const deleteJob = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job application?')) return
    try{
      await api.delete(`/api/jobs/${id}`)
      setJobs(prev => prev.filter(j => j._id !== id))
      window.dispatchEvent(new Event('jobs:refresh'))
    }catch(_err){ alert('Failed to delete job') }
  }

  const statuses = Array.from(new Set(jobs.map(j=>j.status))).filter(Boolean)

  return (
    <div className="surface rounded-[26px] border border-slate-200/80 p-4 md:p-5">
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 ring-1 ring-slate-200">
            <Building2 className="h-4 w-4" />
            Applications History
          </div>
        </div>

        <div className="flex items-center gap-2 self-start lg:self-auto">
          {/* Action buttons removed per UX request - kept add/import controls elsewhere */}
        </div>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-3 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-5">
          <label className="mb-1 block text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Search</label>
          <input placeholder="Search company, role, or location" value={query} onChange={e=>{setQuery(e.target.value); setPage(1)}} className="field-muted" />
        </div>
        <div className="lg:col-span-3">
          <label className="mb-1 block text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Status</label>
          <select value={statusFilter} onChange={e=>{setStatusFilter(e.target.value); setPage(1)}} className="field-muted">
            <option value="">All Statuses</option>
            {statuses.map(s=> <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="lg:col-span-2">
          <label className="mb-1 block text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Sort</label>
          <select value={sortBy} onChange={e=>setSortBy(e.target.value)} className="field-muted">
            <option value="dateDesc">Newest</option>
            <option value="dateAsc">Oldest</option>
          </select>
        </div>
        <div className="lg:col-span-2">
          <button onClick={exportCSV} className="btn-secondary w-full justify-center">Export CSV</button>
        </div>
      </div>

      <div className="overflow-hidden rounded-[22px] border border-slate-200/70 bg-white shadow-[0_16px_45px_rgba(15,23,42,0.06)]">
        <table className="w-full table-fixed">
          <thead className="sticky top-0 bg-slate-50/95 backdrop-blur">
            <tr>
              <th className="w-[14%] px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Company</th>
              <th className="w-[14%] px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Position</th>
              <th className="w-[17%] px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Status</th>
              <th className="w-[11%] px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Application Date</th>
              <th className="w-[10%] px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Salary</th>
              <th className="w-[10%] px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Referral</th>
              <th className="w-[7%] px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Website</th>
              <th className="w-[10%] px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Status Link</th>
              <th className="w-[7%] px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Notes</th>
              <th className="w-[7%] px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              Array.from({length:6}).map((_,i)=> (
                <tr key={i} className="animate-pulse border-t border-slate-200/60">
                  <td className="px-4 py-4"><div className="h-4 w-28 rounded bg-slate-200"/></td>
                  <td className="px-4 py-4"><div className="h-4 w-24 rounded bg-slate-200"/></td>
                  <td className="px-4 py-4"><div className="h-4 w-20 rounded bg-slate-200"/></td>
                  <td className="px-4 py-4"><div className="h-4 w-24 rounded bg-slate-200"/></td>
                  <td className="px-4 py-4"><div className="h-4 w-20 rounded bg-slate-200"/></td>
                  <td className="px-4 py-4"><div className="h-4 w-16 rounded bg-slate-200"/></td>
                  <td className="px-4 py-4"><div className="h-4 w-24 rounded bg-slate-200"/></td>
                  <td className="px-4 py-4"><div className="h-4 w-24 rounded bg-slate-200"/></td>
                  <td className="px-4 py-4"><div className="h-4 w-28 rounded bg-slate-200"/></td>
                  <td className="px-4 py-4"><div className="h-4 w-24 rounded bg-slate-200"/></td>
                </tr>
              ))
            )}

            {!loading && paged.length === 0 && (
              <tr><td colSpan={10} className="p-8 text-center text-slate-500">No jobs yet. Use Add application to create your first tracker entry.</td></tr>
            )}

            {!loading && paged.map((job, idx)=> (
              <tr key={job._id || idx} className="border-t border-slate-200/70 transition hover:bg-slate-50">
                <td className="px-4 py-3">
                  <div className="flex min-w-0 flex-col">
                    <span className="inline-flex min-w-0 items-center gap-2 font-medium text-slate-900">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 ring-1 ring-slate-200">
                        <Building2 className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 truncate">{job.companyName}</span>
                    </span>
                    <span className="mt-1 text-xs text-slate-500">{job.workType || job.location || 'Remote / Hybrid'}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-700">
                  <span className="block truncate">{job.role}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className="rounded-full px-3 py-1 text-xs font-semibold"
                      style={{
                        background: `${(STATUS_CONFIG[job.status]?.color || '#888780')}1f`,
                        color: STATUS_CONFIG[job.status]?.badge || '#5F5E5A'
                      }}
                    >
                      {job.status}
                    </span>
                    <select value={job.status || 'Not Applied Yet'} onChange={(e)=>updateStatus(job._id, e.target.value)} className="select w-32 py-2 text-xs lg:w-36">
                      {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-700">{job.dateApplied ? new Date(job.dateApplied).toLocaleDateString() : '—'}</td>
                <td className="px-4 py-3 text-slate-700">{job.expectedCTC || '—'}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${job.hasReferral ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {job.hasReferral ? 'Got referral' : 'No referral'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {job.jobLink ? <a href={job.jobLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm text-sky-600 underline decoration-sky-300 underline-offset-2"><Link2 className="h-3.5 w-3.5" />Open</a> : <span className="text-slate-400">—</span>}
                </td>
                <td className="px-4 py-3">
                  {job.applicationStatusLink ? <a href={job.applicationStatusLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm text-violet-600 underline decoration-violet-300 underline-offset-2"><Link2 className="h-3.5 w-3.5" />Open</a> : <span className="text-slate-400">—</span>}
                </td>
                <td className="px-4 py-3">
                  {job.notes ? (
                    <button onClick={()=>setNotesJob(job)} className="inline-flex items-center rounded-lg bg-slate-100 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-200">
                      View
                    </button>
                  ) : <span className="text-slate-400">—</span>}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col items-center gap-2">
                    <button onClick={()=>setEditingJob(job)} className="inline-flex items-center gap-1 rounded-lg bg-blue-100 px-3 py-2 text-xs font-medium text-blue-700 transition hover:bg-blue-200" title="Edit">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={()=>deleteJob(job._id)} className="inline-flex items-center gap-1 rounded-lg bg-rose-100 px-3 py-2 text-xs font-medium text-rose-700 transition hover:bg-rose-200" title="Delete">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between gap-4 text-sm text-slate-500">
        <div>Showing {(page-1)*perPage + 1} - {Math.min(page*perPage, filtered.length)} of {filtered.length}</div>
        <div className="flex items-center gap-2">
          <button disabled={page<=1} onClick={()=>setPage(p=>Math.max(1,p-1))} className="btn-secondary px-3 py-2 disabled:opacity-40">Prev</button>
          <div className="rounded-lg border border-white/10 bg-white/70 px-3 py-2 text-slate-900 dark:bg-white/5 dark:text-slate-100">{page}</div>
          <button disabled={page*perPage>=filtered.length} onClick={()=>setPage(p=>p+1)} className="btn-secondary px-3 py-2 disabled:opacity-40">Next</button>
        </div>
      </div>

      {editingJob && <EditJobModal job={editingJob} onClose={()=>setEditingJob(null)} onSave={fetchJobs} />}
      {notesJob && <NotesModal job={notesJob} onClose={()=>setNotesJob(null)} />}
    </div>
  )
}
