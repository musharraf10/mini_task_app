import { useState } from 'react'
import { Card, ErrorBox, InlineLink, PrimaryButton, TextInput } from '../components/ui.jsx'
import { useAuth } from '../utils/AuthContext.jsx'

export function LoginPage() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login({ email, password })
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-full items-center justify-center px-4">
      <Card
        title="Sign in"
        footer={
          <>
            Don’t have an account? <InlineLink to="/signup">Create one</InlineLink>
          </>
        }
      >
        <form className="space-y-3" onSubmit={onSubmit}>
          <ErrorBox message={error} />
          <TextInput label="Email" value={email} onChange={setEmail} autoComplete="email" placeholder="you@company.com" />
          <TextInput
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            autoComplete="current-password"
            placeholder="••••••••"
          />
          <PrimaryButton disabled={submitting || !email || !password} type="submit">
            {submitting ? 'Signing in…' : 'Sign in'}
          </PrimaryButton>
        </form>
      </Card>
    </div>
  )
}

