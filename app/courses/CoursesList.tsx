"use client";

import React, { useEffect, useState } from "react";
import { CourseCard } from "../components/CourseCard";
import { getCourses } from "../data/courses";
import { getUserProfile } from "../data/auth";
import { useRouter } from "next/navigation";


interface User {
  id: number;
  username: string;
  role?: string | null;
}



interface Course {
    id: number
    title: string
    description: string
    mentor: User | null
}
export default function CoursesList() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [checkingUser, setCheckingUser] = useState(true)

  useEffect(() => {
  async function fetchCourses() {
    try {
      getCourses().then((data) => {
        setCourses(data)
      })
    } catch (error) {
      console.error("Error loading courses:", error);
    } finally {
      setLoading(false);
    }
  }
  fetchCourses();
}, []);

  useEffect(() => {
    let mounted = true;
    async function fetchprofile() {
      try {
        const user = await getUserProfile()
        if (mounted) setCurrentUser(user)
      } catch (err) {
        console.error("Error fetching profile", err)
      } finally {
        if (mounted) setCheckingUser(false)
      }
    }
    fetchprofile()
    return () => { mounted = false }
  }, [])


  if (loading) return <p>Loading entries...</p>;

  if (courses.length === 0) return <p>No courses found.</p>;

  return (
    <section className="section">
      <div className="level mb-4">
        <div className="level-left">
          <h1 className="title">Courses</h1>
        </div>

        <div className="level-right">
          {/* Show Create Course only for mentors */}
          {!checkingUser && currentUser?.role === "mentor" && (
            <div className="level-item">
              <button
                className="button is-primary"
                onClick={() => router.push("/courses/new")}
              >
                Create Course
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="columns is-multiline">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </section>
  );
}