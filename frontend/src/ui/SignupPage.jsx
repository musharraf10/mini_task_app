import { useState } from 'react'
import { InlineLink, Card, ErrorBox, PrimaryButton, TextInput } from './components.jsx'
import { useAuth } from '../state/AuthContext.jsx'

export function SignupPage() {
  const { signup } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await signup({ email, password })
    } catch (err) {
      setError(err.message || 'Signup failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-full items-center justify-center px-4">
      <Card
        title="Create your account"
        footer={
          <>
            Already have an account? <InlineLink to="/login">Sign in</InlineLink>
          </>
        }
      >
        <form className="space-y-3" onSubmit={onSubmit}>
          <ErrorBox message={error} />
          <TextInput label="Email" value={email} onChange={setEmail} autoComplete="email" placeholder="you@company.com" />
          <TextInput
            label="Password (min 8 chars)"
            type="password"
            value={password}
            onChange={setPassword}
            autoComplete="new-password"
            placeholder="••••••••"
          />
          <PrimaryButton disabled={submitting || !email || password.length < 8} type="submit">
            {submitting ? 'Creating…' : 'Create account'}
          </PrimaryButton>
        </form>
      </Card>
    </div>
  )
}

