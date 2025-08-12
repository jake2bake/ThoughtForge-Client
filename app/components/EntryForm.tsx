'use client';

import React, { useEffect, useState } from 'react';
import { getTopics } from "@/app/data/topics";
import {getTags, getEntryTags} from "@/app/data/tags"

interface Topic {
  id: number;
  label: string;
}

interface Tag {
  id: number;
  name: string

}


interface EntryFormProps {
  initialData?: {
    title: string;
    reflection: string;
    isPrivate: boolean;
    topicId: number;
    tagIds?: number[]
  };
  onSubmit: (data: {
    title: string;
    reflection: string;
    isPrivate: boolean;
    topic: number;
    tag_ids: number[]
  }) => Promise<void>;
  submitLabel?: string;
}

export default function EntryForm({
  initialData,
  onSubmit,
  submitLabel = "Save Entry",
}: EntryFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [reflection, setReflection] = useState(initialData?.reflection || '');
  const [isPrivate, setIsPrivate] = useState(initialData?.isPrivate || false);
  const [topicId, setTopicId] = useState<number | null>(initialData?.topicId || null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [tags, setTags] = useState<Tag[]>([])
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>(initialData?.tagIds || [])

  useEffect(() => {
    getTags()
    .then((data) => setTags(data))
    .catch(() => setError("Failed to load tags"))
  }, [])


  useEffect(() => {
    getTopics()
      .then((data) => setTopics(data))
      .catch(() => setError("Failed to load topics"));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !reflection || !topicId) {
      setError('Please complete all fields.');
      return;
    }

    try {
      await onSubmit({
        title,
        reflection,
        isPrivate,
        topic: topicId,
        tag_ids: selectedTagIds
      });
    } catch (err) {
      console.error(err);
      setError('Something went wrong while saving your entry.');
    }
  };

  return (
    <section className="section">
      <div className="container fade-in">
        <h1 className="title">{submitLabel}</h1>

        {error && <div className="notification is-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="field">
            <label className="label">Title</label>
            <input
              className="input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="A Knight's Tale..."
            />
          </div>

          {/* Reflection */}
          <div className="field">
            <label className="label">Reflection</label>
            <textarea
              className="textarea"
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="Today I battled dragons..."
            />
          </div>

          {/* Topic */}
          <div className="field">
            <label className="label">Topic</label>
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
          
          <div className="field">
  <label className="label">Tags</label>
  {tags.map(tag => (
    <label key={tag.id} className="checkbox" style={{ marginRight: '1em' }}>
      <input
        type="checkbox"
        checked={selectedTagIds.includes(tag.id)}
        onChange={() => {
          if (selectedTagIds.includes(tag.id)) {
            setSelectedTagIds(selectedTagIds.filter(id => id !== tag.id));
          } else {
            setSelectedTagIds([...selectedTagIds, tag.id]);
          }
        }}
      />{' '}
      {tag.name}
    </label>
  ))}
</div>


          {/* Private */}
          <div className="field">
            <label className="checkbox">
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
              />{" "}
              Make this entry private
            </label>
          </div>

          {/* Submit */}
          <div className="field is-grouped is-grouped-right">
            <button type="submit" className="button is-primary">
              {submitLabel}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
