"use client"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { getCourseById, addEnrollment} from "@/app/data/courses"
import { getUserProfile } from "@/app/data/auth"

interface User {
  id: number
  username: string
}

interface Mentor {
  id: number
  username: string
}

interface ReadingAssignment {
  id: number
  title: string
  due_date: string
  content: string
}

interface Enrollment {
  id: number
  user: number
  course: number
}

interface Course {
  id: number
  title: string
  description: string
  mentor: Mentor
  reading_assignments?: ReadingAssignment[]
  enrollments?: Enrollment[]
}

export default function CourseDetailPage() {
  const { id } = useParams()
  const [course, setCourse] = useState<Course | null>(null)
  const [loadingCourse, setLoadingCourse] = useState(true)
  const [error, setError] = useState("")
  const [enrolling, setEnrolling] = useState(false)
  const [enrollSuccess, setEnrollSuccess] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isEnrolled, setIsEnrolled] = useState(false)



  useEffect(() => {
    getUserProfile().then((data) => {
      setCurrentUser(data)
    })
  }, [])

  useEffect(() => {
    if (!id) return
    setLoadingCourse(true)
    getCourseById(id)
      .then((data) => {
        setCourse(data)
        setError("")
      })
      .catch(() => setError("Failed to load course details."))
      .finally(() => setLoadingCourse(false))
  }, [id])

  useEffect(() => {
    if (course && currentUser) {
      const userEnrolled = course.enrollments?.some(enrollment => enrollment.user === currentUser.id
      )
      setIsEnrolled(Boolean(userEnrolled))
      if (userEnrolled)
        setEnrollSuccess(true)
    }
  },[course, currentUser])

  const handleEnroll = async () => {
    if (!currentUser || !course ) return;
    setEnrolling(true)
    try {
      await addEnrollment({
        user: currentUser.id,
        course: course.id,
      })
      
      setEnrollSuccess(true)
      setIsEnrolled(true)
      setError("")
    } catch {
      setError("Enrollment failed. Please try again.")
    } finally {
      setEnrolling(false)
    }
  }

  if (loadingCourse) {
    return <section className="section parchment-bg p-6">Loading course...</section>
  }
  if (error) {
    return (
      <section className="section parchment-bg p-6">
        <div className="notification is-danger">{error}</div>
      </section>
    )
  }
  if (!course) {
    return <section className="section parchment-bg p-6">Course not found.</section>
  }

  return (
    <section className="section parchment-bg">
      <div className="card medieval-border">
        <header className="card-header card-header-title">
          <h1 className="title is-2">{course.title}</h1>
        </header>
        <div className="card-content">
          <p className="mb-4">{course.description}</p>
          <p className="mb-4 has-text-weight-semibold">
            Mentor: <span className="has-text-info">{course.mentor.username}</span>
          </p>

          <button
            className={`button is-primary ${enrolling ? "is-loading" : ""}`}
            onClick={handleEnroll}
            disabled={enrolling || isEnrolled}
          >
            {isEnrolled?  "Enrolled!" : "Enroll in Course"}
          </button>
        </div>
      </div>

      <section className="section mt-6">
        <h2 className="title is-4 has-text-centered" style={{ color: "var(--castle-gold)" }}>
          Course Reading Assignments
        </h2>

        {(!course.reading_assignments || course.reading_assignments.length === 0) ? (
          <p className="has-text-centered">No readings assigned yet.</p>
        ) : (
          <table className="table is-fullwidth medieval-border" style={{ color: "var(--ink-black)", background: "var(--parchment)" }}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Due Date</th>
                <th>Content</th>
              </tr>
            </thead>
            <tbody>
              {course.reading_assignments.map((r) => (
                <tr key={r.id}>
                  <td>{r.title}</td>
                  <td>{r.due_date}</td>
                  <td>{r.content}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </section>
  )
}
