import React from 'react'
import { useAuth } from '../context/AuthContext'

export default function Login(){
  const { loginWithGoogle } = useAuth()

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(6,182,212,0.14),transparent_24%),linear-gradient(180deg,#020617_0%,#0f172a_55%,#111827_100%)] px-4 py-6">
      <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:48px_48px]" />

      <div className="relative mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[32px] border border-white/10 bg-white/6 shadow-[0_30px_120px_rgba(15,23,42,0.45)] backdrop-blur-2xl lg:grid-cols-[1.15fr_0.85fr]">
          <div className="relative flex flex-col justify-between gap-10 p-8 text-white sm:p-10 lg:p-12">
            <div className="inline-flex w-fit items-center gap-3 rounded-full border border-white/10 bg-white/8 px-4 py-2 text-xs font-medium uppercase tracking-[0.28em] text-slate-200/90">
              ApplyNow
            </div>

            <div className="max-w-xl">
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Minimal tracking for a serious job search.
              </h1>
              <p className="mt-5 max-w-lg text-base leading-7 text-slate-300 sm:text-lg">
                Keep applications, status, salary, and referrals in one clean workspace without the clutter.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 text-sm text-slate-300 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
                <div className="text-white">Track faster</div>
                <div className="mt-1 text-slate-400">Add jobs in seconds and keep everything organized.</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
                <div className="text-white">Stay focused</div>
                <div className="mt-1 text-slate-400">A calm, minimal interface that keeps your workflow clear.</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
                <div className="text-white">Move with clarity</div>
                <div className="mt-1 text-slate-400">See salary, referrals, and status at a glance.</div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center bg-white/95 p-6 sm:p-10">
            <div className="w-full max-w-md rounded-[28px] border border-slate-200/80 bg-white p-8 shadow-[0_24px_70px_rgba(15,23,42,0.15)]">
              <div className="mb-8">
                <div className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Sign in</div>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Welcome back</h2>
                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Sign in with Google to continue tracking your applications.
                </p>
              </div>

              <button
                onClick={loginWithGoogle}
                className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-slate-950 px-5 py-4 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(15,23,42,0.22)] transition hover:-translate-y-0.5 hover:bg-slate-800"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21.35 11.1H12v2.96h5.35c-.23 1.4-1.16 2.6-2.48 3.4v2.84h4.01c2.34-2.15 3.69-5.31 3.69-9.2 0-.66-.06-1.3-.17-2z" fill="#4285F4"/>
                    <path d="M12 22c2.97 0 5.46-.98 7.28-2.66l-4.01-2.84c-1.11.74-2.53 1.17-4.27 1.17-3.28 0-6.05-2.21-7.05-5.18H.8v2.9A11.99 11.99 0 0 0 12 22z" fill="#34A853"/>
                    <path d="M4.95 12.49A7.2 7.2 0 0 1 4.6 10c0-.86.15-1.69.35-2.49V4.6H.8A12 12 0 0 0 .8 19.91l4.15-3.22z" fill="#FBBC05"/>
                    <path d="M12 4.75c1.62 0 3.08.56 4.23 1.67l3.17-3.17C17.45 1.7 14.95.7 12 .7A11.99 11.99 0 0 0 .8 4.6l4.15 3.22C5.95 6.05 8.72 4.75 12 4.75z" fill="#EA4335"/>
                  </svg>
                </span>
                Sign in with Google
              </button>

              <p className="mt-6 text-center text-xs leading-5 text-slate-400">
                Secure sign-in with Google OAuth. No passwords stored.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
