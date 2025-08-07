import React from "react";
import Link from "next/link";

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

interface EntryCardProps {
  entry: Entry;
  onLike?: (id: number) => void;
  onShare?: (id: number) => void;
}

export const EntryCard: React.FC<EntryCardProps> = ({ entry, onLike, onShare }) => {
  return (
    <div className="column is-half">
      <div className="box">
        <Link href={`/entries/${entry.id}`}>
          <h2 className="title is-5 has-text-link is-clickable">{entry.title}</h2>
        </Link>

        {entry.user && (
          <p className="is-size-6 has-text-weight-semibold">
            by {entry.user.username}
          </p>
        )}

        <p className="is-size-7 has-text-grey">
          {entry.created_at ? new Date(entry.created_at).toLocaleString() : ""}
          {entry.topic && ` | Topic: ${entry.topic.label}`}
        </p>

        <p className="mt-2">{entry.reflection}</p>

        <div className="buttons mt-4">
          <button
            className="button is-small is-link is-light"
            onClick={() => onLike?.(entry.id)}
          >
            👍 Like
          </button>
          <button
            className="button is-small is-info is-light"
            onClick={() => onShare?.(entry.id)}
          >
            🔗 Share
          </button>
        </div>
      </div>
    </div>
  );
};
