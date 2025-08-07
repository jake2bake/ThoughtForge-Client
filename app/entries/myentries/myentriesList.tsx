"use client";

import React, { useEffect, useState } from "react";
import { EntryCard } from "../../components/entryCard";
import { getMyEntries } from "../../data/entries";

interface Topic {
  id: number;
  label: string;
}

interface User {
  id: number;
  username: string;
}

interface Entry {
  id: number;
  title: string;
  reflection: string;
  isPrivate: boolean;
  created_at: string;
  topic: Topic | null;
  user: User | null;
}

export default function MyEntries() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found in localStorage");
      setLoading(false);
      return;
    }

    getMyEntries()
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch entries");
        }
        return res.json();
      })
      .then((data) => {
        setEntries(data);
      })
      .catch((err) => {
        console.error("Error fetching my entries:", err);
      })
      .finally(() => {
        setLoading(false); // Set loading to false no matter what
      });
  }, []);

  if (loading) return <p>Loading entries...</p>;

  if (entries.length === 0) return <p>No entries found</p>;

  return (
    <section className="section">
      <h1 className="title">My Entries</h1>
      <div className="columns is-multiline">
        {entries.map((entry) => (
          <EntryCard key={entry.id} entry={entry} />
        ))}
      </div>
    </section>
  );
}
