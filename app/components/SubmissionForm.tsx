"use client"

import { useSearchParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { addSubmission } from '@/app/data/submissions'
import { getUserProfile } from '@/app/data/auth'

export default function NewSubmissionPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const readingId = searchParams.get('readingId')
  const courseId = searchParams.get('courseId')
  
  const [title, setTitle] = useState('')
  const [reflection, setReflection] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!readingId) return
    
    setSubmitting(true)
    try {
      const userData = await getUserProfile()
      await addSubmission({
        title,
        reflection,
        user: userData.id,
        reading: Number(readingId),
        grade: null,
        feedback: ""
      })
      router.push(`/courses/${courseId}`)
    } catch (err) {
      setError('Failed to submit assignment. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="section parchment-bg">
      <div className="container">
        <h1 className="title has-text-centered" style={{ color: "var(--castle-gold)" }}>
          Submit Assignment
        </h1>
        
        <form onSubmit={handleSubmit} className="box medieval-border">
          <div className="field">
            <label className="label">Title</label>
            <div className="control">
              <input
                type="text"
                className="input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                style={{
                  background: 'var(--parchment)',
                  border: '1px solid var(--castle-gold)'
                }}
              />
            </div>
          </div>

          <div className="field">
            <label className="label">Reflection</label>
            <div className="control">
              <textarea
                className="textarea"
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                required
                rows={10}
                style={{
                  background: 'var(--parchment)',
                  border: '1px solid var(--castle-gold)'
                }}
              />
            </div>
          </div>

          {error && (
            <div className="notification is-danger">{error}</div>
          )}

          <div className="field">
            <div className="control">
              <button
                type="submit"
                className={`button is-primary ${submitting ? 'is-loading' : ''}`}
                disabled={submitting}
                style={{
                  background: 'var(--castle-gold)',
                  color: 'var(--castle-dark)',
                  border: '1px solid var(--castle-dark)'
                }}
              >
                Submit Assignment
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  )
}