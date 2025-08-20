"use client"

import { useState, useEffect } from 'react'
import { getUserProfile } from '@/app/data/auth'
import { getSubmissions } from '@/app/data/submissions'
import { useRouter } from 'next/navigation'

interface Submission {
  id: number
  title: string
  reflection: string
  submitted_at: string
  feedback: string | null
  grade: string | null
  user: number
  reading: number
}

export default function SubmissionsList() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const userData = await getUserProfile()
        const allSubmissions = await getSubmissions()
        // Filter submissions for current user
        const userSubmissions = allSubmissions.filter(
          sub => sub.user === userData.id
        )
        setSubmissions(userSubmissions)
      } catch (err) {
        console.error('Error fetching submissions:', err)
        setError('Failed to load submissions')
      } finally {
        setLoading(false)
      }
    }

    fetchSubmissions()
  }, [])

  if (loading) {
    return (
      <div className="section">
        <div className="container">
          <p className="has-text-centered">Loading submissions...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="section">
        <div className="container">
          <p className="has-text-danger has-text-centered">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="section parchment-bg">
      <div className="container">
        <h1 className="title has-text-centered mb-6" 
            style={{ color: "var(--castle-gold)" }}>
          📝 My Submissions
        </h1>

        {submissions.length === 0 ? (
          <p className="has-text-centered">No submissions yet</p>
        ) : (
          <div className="columns is-multiline">
            {submissions.map((submission) => (
              <div key={submission.id} className="column is-half">
                <div className="box medieval-border"
                     style={{ background: "var(--parchment)" }}>
                  <h3 className="title is-4 mb-4"
                      style={{ color: "var(--castle-dark)" }}>
                    {submission.title}
                  </h3>
                  
                  <div className="mb-3">
                    <strong>Submitted:</strong>{' '}
                    {new Date(submission.submitted_at).toLocaleDateString()}
                  </div>

                  <div className="mb-3">
                    <strong>Grade:</strong>{' '}
                    {submission.grade || 'Not graded yet'}
                  </div>

                  {submission.feedback && (
                    <div className="mt-4 p-3" 
                         style={{ 
                           background: "var(--castle-dark)", 
                           color: "var(--parchment)" 
                         }}>
                      <strong>Feedback:</strong>
                      <p className="mt-2">{submission.feedback}</p>
                    </div>
                  )}

                  <button
                    className="button mt-4 is-fullwidth"
                    onClick={() => router.push(`/submissions/${submission.id}`)}
                    style={{
                      background: "var(--castle-gold)",
                      color: "var(--castle-dark)",
                      border: "1px solid var(--castle-dark)"
                    }}
                  >
                    View Full Submission
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}