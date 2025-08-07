import React from "react";
import Link from "next/link";

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

interface ReadingCardProps {
  reading: Reading;
}

export const ReadingCard: React.FC<ReadingCardProps> = ({ reading }) => {
  return (
    <div className="column is-half">
      <div className="box">
        <Link href={`/readings/${reading.id}`}>
          <h2 className="title is-5 has-text-link is-clickable">{reading.title}</h2>
        </Link>

        <p className="is-size-6 has-text-weight-semibold">by {reading.author}</p>

        {reading.topic && (
          <p className="is-size-7 has-text-grey">Topic: {reading.topic.label}</p>
        )}
      </div>
    </div>
  );
};
