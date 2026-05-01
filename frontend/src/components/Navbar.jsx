import React from 'react'
import { useAuth } from '../context/AuthContext'

const GITHUB_REPO_URL = 'https://github.com/aishwary-dixit1/ApplyNow'

export default function Navbar(){
  const { user, logout } = useAuth()

  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-[#050816]/90 backdrop-blur-3xl shadow-[0_10px_30px_rgba(2,6,23,0.35)]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/25 to-transparent" />
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 py-3 md:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-cyan-400 shadow-[0_14px_35px_rgba(99,102,241,0.28)] ring-1 ring-white/10">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.5 4.5h9A3.5 3.5 0 0 1 20 8v8a3.5 3.5 0 0 1-3.5 3.5h-9A3.5 3.5 0 0 1 4 16V8a3.5 3.5 0 0 1 3.5-3.5Z" stroke="white" strokeWidth="1.5"/>
              <path d="M8 9.5h8M8 12h8M8 14.5h5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div className="truncate text-base font-semibold tracking-tight text-white sm:text-lg">ApplyNow</div>
              <span className="hidden rounded-full border border-white/10 bg-white/8 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-300 sm:inline-flex">Dashboard</span>
            </div>
            <div className="mt-0.5 truncate text-xs text-slate-400">A calm workspace for tracking applications</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-2 text-sm font-medium text-slate-200 shadow-[0_10px_24px_rgba(2,6,23,0.18)] transition hover:border-white/20 hover:bg-white/10 hover:text-white"
            aria-label="Please star the GitHub repo"
            title="Please star the GitHub repo"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-amber-300 transition group-hover:text-amber-200">
              <path d="M12 2.8l2.86 5.8 6.4.93-4.63 4.52 1.09 6.38L12 17.92l-5.72 3.01 1.09-6.38-4.63-4.52 6.4-.93L12 2.8z" fill="currentColor"/>
            </svg>
            <span className="whitespace-nowrap">Please star the GitHub repo</span>
          </a>
          {user ? (
            <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/7 px-3 py-2 shadow-[0_12px_30px_rgba(15,23,42,0.18)]">
              <div className="flex min-w-0 items-center gap-3">
                <div className="hidden min-w-0 text-right md:block">
                  <div className="truncate text-sm font-medium text-slate-100">{user.name}</div>
                  <div className="truncate text-xs text-slate-400">{user.email}</div>
                </div>
                <img src={user.avatar} alt="avatar" className="h-9 w-9 rounded-full ring-2 ring-white/15" />
              </div>
              <button onClick={logout} className="btn-secondary rounded-full px-3.5 py-2 text-sm">
                Logout
              </button>
            </div>
          ) : (
            <div className="rounded-full border border-white/10 bg-white/7 px-4 py-2 text-sm text-slate-300">
              Not signed in
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
