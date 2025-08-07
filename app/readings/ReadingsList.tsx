"use client";

import React, { useEffect, useState } from "react";
import { ReadingCard } from "../components/readingCard";
import { getReadings } from "../data/readings";

interface Topic {
  id: number;
  label: string;
}

interface Reading {
  id: number;
  title: string;
  author: string;
  topic: Topic | null;
}

export default function ReadingsList() {
  const [readings, setReadings] = useState<Reading[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReadings() {
      try {
        const data = await getReadings();
        setReadings(data);
      } catch (error) {
        console.error("Error loading readings:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchReadings();
  }, []);

  if (loading) return <p>Loading readings...</p>;

  if (readings.length === 0) return <p>No readings found.</p>;

  return (
    <section className="section">
      <h1 className="title">Readings</h1>
      <div className="columns is-multiline">
        {readings.map((reading) => (
          <ReadingCard key={reading.id} reading={reading} />
        ))}
      </div>
    </section>
  );
}
