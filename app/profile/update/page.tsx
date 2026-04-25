"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getUserProfile, updateUserProfile } from '@/app/data/auth'

interface User {
  id: number
  username: string
  email: string
  about_me: string
  role: string
}

export default function UpdateProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    about_me: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUserProfile()
        setUser(userData)
        setFormData({
          username: userData.username || '',
          email: userData.email || '',
          about_me: userData.about_me || ''
        })
      } catch (err) {
        console.error('Error fetching user data:', err)
        setError('Failed to load profile data')
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      await updateUserProfile(formData)
      setSuccess('Profile updated successfully!')
      setTimeout(() => {
        router.push('/profile')
      }, 1500)
    } catch (err) {
      console.error('Error updating profile:', err)
      setError('Failed to update profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <section className="section">
        <div className="container">
          <div className="pixel-box">
            <p className="pixel-text has-text-centered">Loading profile...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="section parchment-bg">
      <div className="container">
        <div className="columns is-centered">
          <div className="column is-two-thirds">
            <div className="pixel-box">
              <h1 className="pixel-title has-text-centered mb-6">
                ⚒ Update Profile
              </h1>

              {error && (
                <div className="notification is-danger mb-4">
                  {error}
                </div>
              )}

              {success && (
                <div className="notification is-success mb-4">
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="field mb-5">
                  <label className="label pixel-label">Username</label>
                  <div className="control">
                    <input
                      type="text"
                      name="username"
                      className="input"
                      value={formData.username}
                      onChange={handleInputChange}
                      required
                      style={{
                        background: 'var(--parchment)',
                        border: '2px solid var(--castle-gold)',
                        fontFamily: 'Cinzel, serif'
                      }}
                    />
                  </div>
                </div>

                <div className="field mb-5">
                  <label className="label pixel-label">Email</label>
                  <div className="control">
                    <input
                      type="email"
                      name="email"
                      className="input"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      style={{
                        background: 'var(--parchment)',
                        border: '2px solid var(--castle-gold)',
                        fontFamily: 'Cinzel, serif'
                      }}
                    />
                  </div>
                </div>

                <div className="field mb-5">
                  <label className="label pixel-label">About Me</label>
                  <div className="control">
                    <textarea
                      name="about_me"
                      className="textarea"
                      value={formData.about_me}
                      onChange={handleInputChange}
                      rows={5}
                      placeholder="Tell us about yourself, your interests, scholarly pursuits..."
                      style={{
                        background: 'var(--parchment)',
                        border: '2px solid var(--castle-gold)',
                        fontFamily: 'Cinzel, serif',
                        resize: 'vertical'
                      }}
                    />
                  </div>
                </div>

                <div className="field mb-5">
                  <label className="label pixel-label">Role</label>
                  <div className="control">
                    <input
                      type="text"
                      className="input"
                      value={user?.role || ''}
                      disabled
                      style={{
                        background: 'var(--castle-light)',
                        border: '2px solid var(--castle-gold)',
                        fontFamily: 'Cinzel, serif',
                        color: 'var(--castle-dark)',
                        opacity: 0.7
                      }}
                    />
                  </div>
                  <p className="help">Role cannot be changed</p>
                </div>

                <div className="field is-grouped">
                  <div className="control">
                    <button
                      type="submit"
                      className={`pixel-button is-large ${saving ? 'is-loading' : ''}`}
                      disabled={saving}
                      style={{
                        background: 'var(--castle-gold)',
                        color: 'var(--castle-dark)',
                        border: '2px solid var(--castle-dark)'
                      }}
                    >
                      {saving ? 'Saving...' : '💾 Save Changes'}
                    </button>
                  </div>

                  <div className="control">
                    <button
                      type="button"
                      className="pixel-button is-large"
                      onClick={() => router.push('/profile')}
                      disabled={saving}
                      style={{
                        background: 'var(--parchment)',
                        color: 'var(--castle-dark)',
                        border: '2px solid var(--castle-dark)'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}