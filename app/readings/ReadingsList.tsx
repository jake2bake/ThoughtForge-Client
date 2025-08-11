"use client";

import React, { useEffect, useState, useMemo } from "react";
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
  gutenberg_id: number
}

export default function ReadingsList() {
  const [readings, setReadings] = useState<Reading[]>([]);
  const [gutendexBooks, setGutendexBooks] = useState<Reading[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingGutendex, setLoadingGutendex] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState<string>("All");

  // Fetch backend readings
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

  // Fetch Gutendex results via proxy
  useEffect(() => {
    if (!searchTerm.trim()) {
      setGutendexBooks([]);
      setSelectedAuthor("All");
      return;
    }

    async function fetchGutendex() {
      setLoadingGutendex(true);
      try {
        const res = await fetch(
          `/gutendex/search/?q=${encodeURIComponent(searchTerm)}`
        );
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const data = await res.json();

        const mappedBooks = data.results.map((book: any) => ({
          id: book.id,
          title: book.title,
          author: book.authors[0]?.name || "Unknown",
          topic: null,
        }));

        setGutendexBooks(mappedBooks);
        setSelectedAuthor("All");
      } catch (err) {
        console.error("Error fetching Gutendex books:", err);
        setGutendexBooks([]);
        setSelectedAuthor("All");
      } finally {
        setLoadingGutendex(false);
      }
    }

    fetchGutendex();
  }, [searchTerm]);

  // Extract authors for dropdown
  const authors = useMemo(() => {
    const uniqueAuthors = new Set(gutendexBooks.map((b) => b.author));
    return ["All", ...Array.from(uniqueAuthors)];
  }, [gutendexBooks]);

  // Filter gutendex books by author
  const filteredGutendexBooks = useMemo(() => {
    return selectedAuthor === "All"
      ? gutendexBooks
      : gutendexBooks.filter((book) => book.author === selectedAuthor);
  }, [gutendexBooks, selectedAuthor]);

  // Handle search submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(search.trim());
  };

  if (loading) return <p>Loading backend readings...</p>;

  return (
    <section className="section">
      <h1 className="title">Readings</h1>

      {/* Search Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Search Gutendex books by title or author"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: "0.5rem", width: "300px" }}
        />
        <button
          type="submit"
          style={{ marginLeft: "0.5rem", padding: "0.5rem 1rem" }}
        >
          Search
        </button>
      </form>

      {/* Backend Readings */}
      <div className="columns is-multiline">
        {readings.map((reading) => (
          <ReadingCard key={reading.id} reading={reading} />
        ))}
      </div>

      {/* Gutendex Search Results */}
      {loadingGutendex ? (
        <p>Loading Gutendex books...</p>
      ) : gutendexBooks.length > 0 ? (
        <>
          <h2 className="title is-4">Gutendex Books</h2>

          {/* Author Filter Dropdown */}
          <div style={{ marginBottom: "1rem" }}>
            <label htmlFor="authorFilter" style={{ marginRight: "0.5rem" }}>
              Filter by Author:
            </label>
            <select
              id="authorFilter"
              value={selectedAuthor}
              onChange={(e) => setSelectedAuthor(e.target.value)}
              style={{ padding: "0.3rem 0.5rem" }}
            >
              {authors.map((author) => (
                <option key={author} value={author}>
                  {author}
                </option>
              ))}
            </select>
          </div>

          <div className="columns is-multiline">
            {filteredGutendexBooks.map((book) => (
              <ReadingCard key={book.id} reading={book} />
            ))}
          </div>
        </>
      ) : searchTerm ? (
        <p>No books found for "{searchTerm}".</p>
      ) : null}
    </section>
  );
}
