import React from 'react'

export default function StatsCard({title, value, icon}){
  return (
    <div className="surface rounded-[24px] p-5 flex items-center justify-between">
      <div>
        <div className="text-sm font-medium text-slate-500">{title}</div>
        <div className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">{value}</div>
      </div>
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 ring-1 ring-slate-200">
        {icon || <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 12h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><path d="M12 5v14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>}
      </div>
    </div>
  )
}
