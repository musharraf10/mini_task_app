import { useEffect, useMemo, useState } from 'react'
import { apiRequest } from '../api/api.js'
import { useAuth } from '../utils/AuthContext.jsx'
import { ErrorBox, PrimaryButton, SecondaryButton, TextInput } from '../components/ui.jsx'

function StatusPill({ status }) {
  const cls =
    status === 'completed'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
      : 'border-slate-200 bg-slate-50 text-slate-700'
  return <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${cls}`}>{status}</span>
}

export function TasksPage() {
  const { token, user, logout } = useAuth()

  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [creating, setCreating] = useState(false)

  async function refresh(signal) {
    setError('')
    setLoading(true)
    try {
      const data = await apiRequest('/api/tasks', { token, signal })
      setTasks(data.tasks)
    } catch (err) {
      if (signal?.aborted) return
      setError(err.message || 'Failed to load tasks')
    } finally {
      if (!signal?.aborted) setLoading(false)
    }
  }

  useEffect(() => {
    const controller = new AbortController()
    refresh(controller.signal)
    return () => controller.abort()
  }, [token])

  const stats = useMemo(() => {
    const completed = tasks.filter((t) => t.status === 'completed').length
    return { total: tasks.length, completed }
  }, [tasks])

  async function onCreate(e) {
    e.preventDefault()
    if (!title.trim()) return

    setCreating(true)
    setError('')
    try {
      const data = await apiRequest('/api/tasks', {
        method: 'POST',
        token,
        body: { title: title.trim(), description: description.trim() || undefined },
      })
      setTasks((prev) => [data.task, ...prev])
      setTitle('')
      setDescription('')
    } catch (err) {
      setError(err.message || 'Failed to create task')
    } finally {
      setCreating(false)
    }
  }

  async function toggleStatus(task) {
    const nextStatus = task.status === 'completed' ? 'pending' : 'completed'

    // Optimistic update for a snappy UI
    setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, status: nextStatus } : t)))

    try {
      const data = await apiRequest(`/api/tasks/${task.id}`, {
        method: 'PATCH',
        token,
        body: { status: nextStatus },
      })
      setTasks((prev) => prev.map((t) => (t.id === task.id ? data.task : t)))
    } catch (err) {
      setError(err.message || 'Failed to update task')
      setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)))
    }
  }

  async function remove(task) {
    const snapshot = tasks
    setTasks((prev) => prev.filter((t) => t.id !== task.id))

    try {
      await apiRequest(`/api/tasks/${task.id}`, { method: 'DELETE', token })
    } catch (err) {
      setTasks(snapshot)
      setError(err.message || 'Failed to delete task')
    }
  }

  return (
    <div className="min-h-full">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <div>
            <div className="text-sm text-slate-600">Signed in as</div>
            <div className="font-semibold text-slate-900">{user?.email}</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-sm text-slate-600">
              {stats.completed}/{stats.total} completed
            </div>
            <SecondaryButton type="button" onClick={logout}>
              Sign out
            </SecondaryButton>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-lg font-semibold">Your tasks</h1>
            <SecondaryButton type="button" onClick={() => refresh()} disabled={loading}>
              Refresh
            </SecondaryButton>
          </div>

          <div className="mt-3">
            <ErrorBox message={error} />
          </div>

          <form className="mt-4 grid gap-3 md:grid-cols-2" onSubmit={onCreate}>
            <TextInput label="Title" value={title} onChange={setTitle} placeholder="Reading Book" />
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Description (optional)</span>
              <input
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none focus:border-slate-400"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detailed information..."
              />
            </label>
            <div className="md:col-span-2">
              <PrimaryButton disabled={creating || !title.trim()} type="submit">
                {creating ? 'Creating…' : 'Add task'}
              </PrimaryButton>
            </div>
          </form>
        </div>

        <section className="mt-6 space-y-3">
          {loading ? (
            <div className="text-sm text-slate-600">Loading…</div>
          ) : tasks.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
              No tasks yet. Create your first one above.
            </div>
          ) : (
            tasks.map((t) => (
              <div
                key={t.id}
                className="flex items-start justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <div className={`truncate font-medium ${t.status === 'completed' ? 'line-through text-slate-500' : ''}`}>
                      {t.title}
                    </div>
                    <StatusPill status={t.status} />
                  </div>
                  {t.description ? <div className="mt-1 text-sm text-slate-600">{t.description}</div> : null}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <SecondaryButton type="button" onClick={() => toggleStatus(t)}>
                    {t.status === 'completed' ? 'Mark pending' : 'Mark done'}
                  </SecondaryButton>
                  <button
                    type="button"
                    onClick={() => remove(t)}
                    className="rounded-xl border border-rose-200 bg-white px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  )
}

