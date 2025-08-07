"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found in localStorage");
      setLoading(false);
      return;
    }

    getMyEntries()
  .then((data) => {
    console.log("Entries received:", data);
    setEntries(data);
  })
  .catch((err) => {
    console.error("Error fetching my entries:", err);
  })
  .finally(() => {
    setLoading(false);
  });
;
  }, []);

  const handleCreateEntry = () => {
    router.push("/entries/myentries/new");
  };

  return (
    <section className="section">
      <div className="level">
        <h1 className="title level-left">My Entries</h1>
        <div className="level-right">
          <button className="button is-primary" onClick={handleCreateEntry}>
            Create New Entry
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading entries...</p>
      ) : entries.length === 0 ? (
        <p>No entries found.</p>
      ) : (
        <div className="columns is-multiline">
          {entries.map((entry) => (
            <EntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </section>
  );
}
