import { Link } from 'react-router-dom'

export function Card({ title, children, footer }) {
  return (
    <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {title ? <h1 className="text-xl font-semibold text-slate-900">{title}</h1> : null}
      <div className={title ? 'mt-4' : ''}>{children}</div>
      {footer ? <div className="mt-4 text-sm text-slate-600">{footer}</div> : null}
    </div>
  )
}

export function TextInput({ label, type = 'text', value, onChange, placeholder, autoComplete }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input
        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none focus:border-slate-400"
        type={type}
        value={value}
        autoComplete={autoComplete}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  )
}

export function PrimaryButton({ children, disabled, ...props }) {
  return (
    <button
      disabled={disabled}
      className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
      {...props}
    >
      {children}
    </button>
  )
}

export function SecondaryButton({ children, ...props }) {
  return (
    <button
      className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
      {...props}
    >
      {children}
    </button>
  )
}

export function InlineLink({ to, children }) {
  return (
    <Link className="font-medium text-slate-900 underline underline-offset-4 hover:text-slate-700" to={to}>
      {children}
    </Link>
  )
}

export function ErrorBox({ message }) {
  if (!message) return null
  return <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{message}</div>
}

