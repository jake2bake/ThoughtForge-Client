import React, { useEffect, useState } from "react";
import Link from "next/link";


interface User {
    id: number
    username: string
}

interface Course {
    id: number
    title: string
    description: string
    mentor: User
}

interface CourseCardProps {
    course: Course
}

export const CourseCard: React.FC<CourseCardProps> = ({course}) => {
    return (
        <div className="column is-half">
      <div className="box">
        <Link href={`/courses/${course.id}`}>
          <h2 className="title is-5 has-text-link is-clickable">{course.title}</h2>
        </Link>

        {course.mentor && (
          <p className="is-size-6 has-text-weight-semibold">
            by {course.mentor.username}
          </p>
        )}
    </div>
    </div>
    )
}
