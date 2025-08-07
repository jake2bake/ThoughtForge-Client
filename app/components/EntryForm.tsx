'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getTopics } from "@/app/data/topics"
import { addEntry } from '../data/entries';

interface Topic {
  id: number;
  label: string;
}

export default function EntryForm() {
  const [title, setTitle] = useState('');
  const [reflection, setReflection] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [topicId, setTopicId] = useState<number | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
  getTopics()
    .then((data) => {
      console.log("Fetched topics:", data);
      setTopics(data);
    })
    .catch((err) => {
      console.error("Error fetching topics:", err);
      setError("Failed to load topics");
    });
}, []);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !reflection || !topicId) {
      setError('Please complete all fields.');
      return;
    }

    try {
      await addEntry({
        title,
        reflection,
        is_private: isPrivate,
        topic: topicId,
      });
      router.push('/entries/myentries');
    } catch (err) {
      console.error(err);
      setError('Something went wrong while saving your entry.');
    }
  };

  return (
    <section className="section">
      <div className="container fade-in">
        <h1 className="title">Create a New Entry</h1>

        {error && (
          <div className="notification is-danger">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="label">Title</label>
            <div className="control">
              <input
                className="input"
                type="text"
                placeholder="A Knight's Tale..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </div>

          <div className="field">
            <label className="label">Reflection</label>
            <div className="control">
              <textarea
                className="textarea"
                placeholder="Today I battled dragons..."
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
              ></textarea>
            </div>
          </div>

          <div className="field">
            <label className="label">Topic</label>
            <div className="control">
              <div className="select">
                <select
                  value={topicId || ''}
                  onChange={(e) => setTopicId(parseInt(e.target.value))}
                >
                  <option value="" disabled>Select a topic</option>
                  {topics.map((topic) => (
                    <option key={topic.id} value={topic.id}>
                      {topic.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="field">
            <label className="checkbox">
              <input
                type="checkbox"
                className="mr-2"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
              />
              Make this entry private
            </label>
          </div>

          <div className="field is-grouped is-grouped-right">
            <div className="control">
              <button type="submit" className="button is-primary">
                Save Entry
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
