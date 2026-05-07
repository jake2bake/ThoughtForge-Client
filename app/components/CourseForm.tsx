"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  username: string;
  role?: string | null;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  mentor: User;
}

type Props = {
  initial?: Partial<Course>;
  onCreated?: (course: Course) => void;
  redirectAfterCreate?: string; // e.g. "/courses"
};

export default function CourseForm({ initial = {}, onCreated, redirectAfterCreate }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(initial.title || "");
  const [description, setDescription] = useState(initial.description || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function createCourse(payload: { title: string; description: string }) {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const res = await fetch("/courses/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Token ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      let msg = `Failed to create course (${res.status})`;
      try {
        const json = JSON.parse(txt);
        msg = json.detail || json.error || JSON.stringify(json);
      } catch {}
      throw new Error(msg);
    }
    return (await res.json()) as Course;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    setSaving(true);
    try {
      const course = await createCourse({ title: title.trim(), description: description.trim() });
      onCreated?.(course);
      if (redirectAfterCreate) {
        router.push(redirectAfterCreate);
      } else {
        // default: go back to courses list
        router.push("/courses");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to create course.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="field">
        <label className="label">Course Title</label>
        <div className="control">
          <input
            className="input"
            type="text"
            placeholder="Enter course title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={saving}
            required
          />
        </div>
      </div>

      <div className="field">
        <label className="label">Description</label>
        <div className="control">
          <textarea
            className="textarea"
            placeholder="Write a short description for the course"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={saving}
            rows={6}
          />
        </div>
      </div>

      {error && (
        <div className="notification is-danger mb-4">
          {error}
        </div>
      )}

      <div className="field is-grouped">
        <div className="control">
          <button type="submit" className={`button is-primary ${saving ? "is-loading" : ""}`} disabled={saving}>
            Create Course
          </button>
        </div>
        <div className="control">
          <button
            type="button"
            className="button"
            disabled={saving}
            onClick={() => router.push("/courses")}
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}