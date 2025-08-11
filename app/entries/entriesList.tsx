"use client";

import React, { useEffect, useState } from "react";
import { EntryCard } from "../components/entryCard";
import { getEntries } from "../data/entries";
import { getUserProfile } from "../data/auth";

interface User {
  id: number;
  username: string;
}

interface Topic {
  id: number;
  label: string;
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

export default function EntriesList() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  async function fetchEntries() {
    try {
      const profile = await getUserProfile()
      const data = await getEntries();

      const visibleEntries = data.filter(
        (entry) => !entry.isPrivate || entry.user?.id === profile.id
      );

      setEntries(visibleEntries);
    } catch (error) {
      console.error("Error loading entries:", error);
    } finally {
      setLoading(false);
    }
  }
  fetchEntries();
}, []);


  if (loading) return <p>Loading entries...</p>;

  if (entries.length === 0) return <p>No entries found.</p>;

  return (
    <section className="section">
      <h1 className="title">Entries</h1>
      <div className="columns is-multiline">
        {entries.map((entry) => (
          <EntryCard key={entry.id} entry={entry} />
        ))}
      </div>
    </section>
  );
}
