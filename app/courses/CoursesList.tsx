"use client";

import React, { useEffect, useState } from "react";
import { CourseCard } from "../components/CourseCard";
import { getCourses } from "../data/courses";


interface User {
  id: number;
  username: string;
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


  if (loading) return <p>Loading entries...</p>;

  if (courses.length === 0) return <p>No courses found.</p>;

  return (
    <section className="section">
      <h1 className="title">Courses</h1>
      <div className="columns is-multiline">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </section>
  );
}