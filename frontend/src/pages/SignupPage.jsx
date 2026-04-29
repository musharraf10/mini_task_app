import { useState } from 'react'
import { Card, ErrorBox, InlineLink, PrimaryButton, TextInput } from '../components/ui.jsx'
import { useAuth } from '../utils/AuthContext.jsx'

export function SignupPage() {
  const { signup } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

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
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <Card
        title="Create your account"
        footer={
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <InlineLink to="/login">Sign in</InlineLink>
          </p>
        }
      >
        <form className="space-y-4" onSubmit={onSubmit}>

          <ErrorBox message={error} />

          {/* Email */}
          <TextInput
            label="Email"
            value={email}
            onChange={setEmail}
            autoComplete="email"
            placeholder="you@company.com"
          />

          {/* Password */}
          <div className="relative">
            <TextInput
              label="Password (min 8 chars)"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={setPassword}
              autoComplete="new-password"
              placeholder="••••••••"
            />

            {/* Show/Hide toggle */}
            <button
              type="button"
              onClick={() => setShowPassword(prev => !prev)}
              className="absolute right-3 top-[38px] text-sm text-gray-500 hover:text-gray-700"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          {/* Submit */}
          <PrimaryButton
            disabled={submitting || !email || password.length < 8}
            type="submit"
          >
            {submitting ? 'Creating account...' : 'Create account'}
          </PrimaryButton>
        </form>
      </Card>
    </div>
  )
}