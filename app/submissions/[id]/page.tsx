"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getSubmissionById } from '@/app/data/submissions'
import { getUserProfile } from '@/app/data/auth'

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

export default function SubmissionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  
  const [submission, setSubmission] = useState<Submission | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    const fetchSubmission = async () => {
      if (!id) return
      
      try {
        const [submissionData, userData] = await Promise.all([
          getSubmissionById(id),
          getUserProfile()
        ])
        
        // Check if user owns this submission
        if (submissionData.user !== userData.id) {
          setError("You can only view your own submissions")
          return
        }
        
        setSubmission(submissionData)
        setCurrentUser(userData)
      } catch (err) {
        console.error('Error fetching submission:', err)
        setError('Failed to load submission')
      } finally {
        setLoading(false)
      }
    }

    fetchSubmission()
  }, [id])

  if (loading) {
    return (
      <section className="section parchment-bg">
        <div className="container">
          <p className="has-text-centered">Loading submission...</p>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="section parchment-bg">
        <div className="container">
          <div className="notification is-danger">
            <p>{error}</p>
            <button 
              className="button mt-4"
              onClick={() => router.push('/submissions')}
            >
              Back to Submissions
            </button>
          </div>
        </div>
      </section>
    )
  }

  if (!submission) {
    return (
      <section className="section parchment-bg">
        <div className="container">
          <p className="has-text-centered">Submission not found</p>
        </div>
      </section>
    )
  }

  return (
    <section className="section parchment-bg">
      <div className="container">
        <button
          className="button mb-4"
          onClick={() => router.push('/submissions')}
          style={{
            background: 'var(--castle-gold)',
            color: 'var(--castle-dark)'
          }}
        >
          ← Back to Submissions
        </button>

        <div className="box medieval-border"
             style={{ background: "var(--parchment)" }}>
          
          <h1 className="title is-2 mb-4"
              style={{ color: "var(--castle-dark)" }}>
            {submission.title}
          </h1>

          <div className="mb-4">
            <strong>Submitted:</strong>{' '}
            {new Date(submission.submitted_at).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>

          <div className="mb-4">
            <strong>Grade:</strong>{' '}
            <span className={`tag ${submission.grade ? 'is-success' : 'is-warning'}`}>
              {submission.grade || 'Not graded yet'}
            </span>
          </div>

          <div className="mb-5">
            <h3 className="title is-4 mb-3"
                style={{ color: "var(--castle-dark)" }}>
              Reflection
            </h3>
            <div className="content"
                 style={{ 
                   background: "white", 
                   padding: "1.5rem",
                   borderRadius: "8px",
                   border: "1px solid var(--castle-gold)"
                 }}>
              <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                {submission.reflection}
              </p>
            </div>
          </div>

          {submission.feedback && (
            <div className="mt-5 p-4"
                 style={{ 
                   background: "var(--castle-dark)", 
                   color: "var(--parchment)",
                   borderRadius: "8px"
                 }}>
              <h3 className="title is-4 mb-3"
                  style={{ color: "var(--castle-gold)" }}>
                Mentor Feedback
              </h3>
              <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                {submission.feedback}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}