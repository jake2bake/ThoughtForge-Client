"use client";

import React, { useEffect, useState, useMemo } from "react";
import { ReadingCard } from "../components/readingCard";
import { getReadings, getGutendexSearch } from "../data/readings";

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
        console.log('Searching for:', searchTerm)
        const data = await getGutendexSearch(searchTerm)
        console.log('Gutendex response:', data)
       
        const mappedBooks = data.results.map((book: any) => ({
          id: book.id,
          title: book.title,
          author: book.authors[0]?.name || "Unknown",
          topic: null,
          gutenberg_id: book.id
        }));
        console.log('Mapped books:', mappedBooks)
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

  if (loading) return <div className="loading-scroll">Loading backend readings...</div>;

  return (
    <section className="section bg-parchment">
      <h1 className="title text-castle-dark mb-8">Readings</h1>

      {/* Search Form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="field has-addons">
          <div className="control is-expanded">
        <input
          className="input medieval-input"
          type="text"
          placeholder="Search ancient scrolls..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          
        />
        </div>
        <div className="control">
        <button
          type="submit"
          className="medieval-button"
        >
          Search
        </button>
        </div>
       </div>
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
          <h2 className="title is-4 text-castle-dark mt-8 mb-4">Discovered Scrolls</h2>

          {/* Author Filter Dropdown */}
          <div className="field mb-6">
            <label htmlFor="authorFilter" className="label text-castle-dark">
              Filter by Author:
            </label>
            <div className="control">
              <div className="select is-medieval">
            <select
              id="authorFilter"
              value={selectedAuthor}
              onChange={(e) => setSelectedAuthor(e.target.value)}
            >
              {authors.map((author) => (
                <option key={author} value={author}>
                  {author}
                </option>
              ))}
            </select>
          </div>
          </div>
          </div>

          <div className="columns is-multiline">
            {filteredGutendexBooks.map((book) => (
              <ReadingCard key={book.id} reading={book} />
            ))}
          </div>
        </>
      ) : searchTerm ? (
        <p className="no-results">No books found for "{searchTerm}".</p>
      ) : null}
    </section>
  );
}
