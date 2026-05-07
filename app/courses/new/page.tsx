'use client'

import { useRouter } from "next/navigation";
import CourseForm from "@/app/components/CourseForm";

export default function CreateCoursePage() {
  const router = useRouter();

  return (
    <section className="section">
      <div className="container">
        <h1 className="title">Create New Course</h1>
        <CourseForm />
      </div>
    </section>
  );
}