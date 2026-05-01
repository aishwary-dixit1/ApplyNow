import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import StatsCard from '../components/StatsCard'
import JobTable from '../components/JobTable'
import QuickAdd from '../components/QuickAdd'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, LineChart, Line, Tooltip, CartesianGrid } from 'recharts'
import api from '../api/api'
// small inline SVGs used for stat icons (keeps bundle stable across lucide versions)
const IconBriefcase = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="7" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.6"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
)
const IconPaperPlane = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 2L11 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><path d="M22 2L15 22l-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
)
const IconAward = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.6"/><path d="M8 21l4-3 4 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
)
const IconUserPlus = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 11c1.657 0 3-1.567 3-3.5S17.657 4 16 4s-3 1.567-3 3.5S14.343 11 16 11z" stroke="currentColor" strokeWidth="1.6"/><path d="M6 20v-1a4 4 0 0 1 4-4h0a4 4 0 0 1 4 4v1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><path d="M19 16v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><path d="M22 19h-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
)

const STATUS_ORDER = [
  'Not Applied Yet',
  'Applied',
  'Shortlisted',
  'Not Shortlisted',
  'Assessment',
  'Interviewing',
  'Accepted Offer',
  'Rejected Offer',
]

const STATUS_CONFIG = {
  'Not Applied Yet':  { color: '#888780', badge: '#5F5E5A' },
  'Applied':          { color: '#378ADD', badge: '#185FA5' },
  'Shortlisted':      { color: '#7F77DD', badge: '#534AB7' },
  'Not Shortlisted':  { color: '#D85A30', badge: '#993C1D' },
  'Assessment':       { color: '#EF9F27', badge: '#854F0B' },
  'Interviewing':     { color: '#1D9E75', badge: '#0F6E56' },
  'Accepted Offer':   { color: '#639922', badge: '#3B6D11' },
  'Rejected Offer':   { color: '#E24B4A', badge: '#A32D2D' },
}

function StatusTooltip({ active, payload, total }) {
  if (!active || !payload?.length) return null

  const item = payload[0]
  const data = item.payload ?? {}
  const count = typeof data.value === 'number' ? data.value : item.value
  const percent = total > 0 ? Math.round((count / total) * 100) : 0
  const cfg = STATUS_CONFIG[item.name] ?? { color: item.color, badge: item.color }

  return (
    <div style={{
      display: 'inline-flex', flexDirection: 'column', gap: 10,
      padding: '14px 16px', minWidth: 180,
      background: 'var(--color-background-primary, #fff)',
      border: '0.5px solid var(--color-border-tertiary, rgba(0,0,0,0.12))',
      borderRadius: 12,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{
          width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
          background: cfg.color,
          boxShadow: `0 0 0 3px ${cfg.color}26`,
        }} />
        <span style={{ fontSize: 13, fontWeight: 500 }}>{item.name}</span>
      </div>
      <div style={{ height: '0.5px', background: 'var(--color-border-tertiary)' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
        <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>Applications</span>
        <span style={{ fontSize: 12, fontWeight: 500 }}>{count}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
        <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>Share</span>
        <span style={{
          fontSize: 11, fontWeight: 500, padding: '2px 8px', borderRadius: 20,
          background: `${cfg.color}1f`, color: cfg.badge,
        }}>{percent}%</span>
      </div>
    </div>
  )
}

export default function Dashboard({user}){
  const [stats, setStats] = useState({ total: 0, byStatus: [], monthly: [] })
  const [showAdd, setShowAdd] = useState(false)
  const [referralCount, setReferralCount] = useState(0)

  useEffect(()=>{
    api.get('/api/jobs/analytics').then(res=> setStats(res.data)).catch(()=>{})
  },[])

  useEffect(()=>{
    // fetch jobs to compute referral count (backend analytics doesn't include referral by default)
    api.get('/api/jobs').then(res=>{
      const all = res.data.jobs || res.data
      setReferralCount(Array.isArray(all) ? all.filter(j=>j.hasReferral).length : 0)
    }).catch(()=>setReferralCount(0))
  },[])

  const pieData = stats.byStatus.map(s=> ({ name: s._id, value: s.count }))
  const pieTotal = pieData.reduce((sum, item) => sum + item.value, 0)
  const monthly = stats.monthly.map(m => ({ month: m._id, count: m.count }))
  const archivedCount = 0

  return (
    <div className="app-shell bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.98),_rgba(247,249,252,0.98))]">
      <Navbar user={user} />
      {showAdd && <QuickAdd onClose={()=>setShowAdd(false)} />}
      <main className="relative z-10 mx-auto max-w-[1440px] px-4 py-4 md:px-6 md:py-5">
        <div className="surface mb-4 rounded-[26px] px-4 py-3 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 ring-1 ring-slate-200">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 7H20" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
                  <path d="M4 12H20" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
                  <path d="M4 17H20" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <div className="text-xs font-medium uppercase tracking-[0.25em] text-slate-400">Applications History</div>
                  <div className="mt-1 text-lg font-semibold text-slate-900">A clean table-first view for tracking your application pipeline</div>
              </div>
            </div>
            <div className="flex items-center gap-2 self-start lg:self-center">
              <button onClick={()=>setShowAdd(true)} className="btn-primary px-4 py-2.5 text-sm">Add application</button>
            </div>
          </div>
        </div>

        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-4">
          <StatsCard title="Total Jobs" value={stats.total || 0} icon={IconBriefcase} />
          <StatsCard title="Applied" value={pieData.find(p=>p.name==='Applied')?.value || 0} icon={IconPaperPlane} />
          <StatsCard title="Offers" value={pieData.find(p=>p.name==='Accepted Offer')?.value || 0} icon={IconAward} />
          <StatsCard title="Referral" value={referralCount} icon={IconUserPlus} />
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div>
            <JobTable />
          </div>
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <div className="surface rounded-[26px] p-5">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-base font-semibold text-slate-900">Status overview</h3>
                <span className="text-xs text-slate-500">Small summary</span>
              </div>
              <div className="flex flex-col gap-4">
                <div style={{ width: '100%', height: 220 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={pieData.length ? pieData : [{name:'Empty', value:1}]} dataKey="value" cx="50%" cy="50%" innerRadius={45} outerRadius={74} paddingAngle={3}>
                        {(pieData.length ? pieData : [{name:'Empty'}]).map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={STATUS_CONFIG[entry.name]?.color ?? '#888780'}
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<StatusTooltip total={pieTotal} />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {(pieData.length ? pieData : [{ name: 'Empty', value: 1 }]).map((entry, i) => (
                    <div key={entry.name || i} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200/70 bg-slate-50/80 px-3 py-2">
                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          style={{ background: STATUS_CONFIG[entry.name]?.color ?? '#888780' }}
                          className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
                        />
                        <span className="truncate text-sm font-medium text-slate-700">{entry.name}</span>
                      </div>
                      <div className="shrink-0 text-sm font-semibold text-slate-900">{entry.value}</div>
                    </div>
                  ))}
                  {pieData.length === 0 && <div className="text-sm text-slate-400">No status data yet.</div>}
                </div>
              </div>
            </div>

            <div className="surface rounded-[26px] p-5">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-base font-semibold text-slate-900">Activity trend</h3>
                <span className="text-xs text-slate-500">Recent applications</span>
              </div>
              <div style={{ width: '100%', height: 220 }}>
                <ResponsiveContainer>
                  <LineChart data={monthly}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={3} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200/80 px-1 pt-4 text-xs uppercase tracking-[0.2em] text-slate-500">
          <div className="flex items-center gap-6">
            <span>Count {stats.total || 0}</span>
            <span>Range 17 days</span>
            <span>Max {Math.max(...[0, ...pieData.map(item => item.value)])}</span>
          </div>
          <div className="text-slate-400">ApplyNow tracker</div>
        </div>
      </main>
    </div>
  )
}
