// src/pages/Contact.tsx
import { useState, type FormEvent } from 'react'

export default function Contact(){
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string|undefined>()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    setError(undefined)
    try {
      const f = e.currentTarget
      const data = new FormData(f)
      const name = data.get('name') || ''
      const email = data.get('email') || ''
      const message = data.get('message') || ''
      const subj = encodeURIComponent(`Project inquiry — ${name}`)
      const body = encodeURIComponent(`${message}\n\nFrom: ${name} <${email}>`)
      window.location.href = `mailto:support@tiertechtools.com?subject=${subj}&body=${body}`
    } catch (err:any) {
      setError(err.message || 'Something went wrong.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="section">
      <div className="container grid-2">
        <div className="panel">
          <h2 className="mt-0">Start a project</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <label htmlFor="name">Name</label>
              <input id="name" name="name" type="text" required />
            </div>
            <div className="form-row">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" required />
            </div>
            <div className="form-row">
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" placeholder="What are you trying to achieve?" required />
            </div>
            <div className="form-row">
              <button className="btn" type="submit" disabled={submitting}>{submitting ? 'Sending…' : 'Send message'}</button>
            </div>
            {error && <p className="small" style={{color:'#9a3324'}}>{error}</p>}
          </form>
        </div>
        <div className="panel">
          <h3 className="mt-0">What to include</h3>
          <ul className="small">
            <li>Problem summary & desired outcome</li>
            <li>Timeline and key constraints</li>
            <li>Systems involved (e.g., auth, billing, storage)</li>
            <li>Decision-maker & stakeholders</li>
          </ul>
        </div>
      </div>
    </main>
  )
}
