"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getGutendex } from "@/app/data/readings"; // adjust the path as needed

interface Reading {
  id: number;
  title: string;
  authors: { name: string }[];
  subjects: string[];
  bookshelves: string[];
  formats: { [key: string]: string };
}

export default function ReadingDetailPage() {
  const { id } = useParams();
  const [reading, setReading] = useState<Reading | null>(null);
  const [textContent, setTextContent] = useState<string>("");

  useEffect(() => {
    const fetchReading = async () => {
      try {
        const data = await getGutendex(Number(id));
        setReading(data);

        const formats = data.formats || {};
        const textUrl =
          formats["text/plain; charset=utf-8"] ||
          formats["text/plain; charset=us-ascii"] ||
          formats["text/plain"];

        if (textUrl) {
          const textRes = await fetch(textUrl);
          const bookText = await textRes.text();
          setTextContent(bookText);
        } else {
          setTextContent("No plain text version available.");
        }
      } catch (err) {
        console.error("Failed to fetch reading:", err);
        setTextContent("An error occurred while fetching the text.");
      }
    };

    fetchReading();
  }, [id]);

  if (!reading) {
    return (
      <div className="bg-amber-50 min-h-screen p-8">
        <div className="bg-amber-900 text-amber-100 p-4 border-4 border-amber-800 shadow-lg">
          <p className="font-mono text-lg">Loading ancient texts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-amber-50 min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 text-amber-100 p-6 border-4 border-amber-800 shadow-lg mb-6">
          <h1 className="text-3xl font-bold font-mono mb-2 text-center border-b-2 border-amber-700 pb-2">
            {reading.title}
          </h1>
          <h2 className="text-xl font-mono text-center text-amber-200">
            ⚔️ By {reading.authors.map((a) => a.name).join(", ")} ⚔️
          </h2>
        </div>

        <div className="bg-amber-100 border-4 border-amber-800 p-4 mb-6 shadow-lg">
          <div className="mb-4">
            <span className="font-bold font-mono text-amber-900">📜 Subjects:</span>
            <span className="font-mono text-amber-800 ml-2">{reading.subjects.join(", ")}</span>
          </div>

          <div className="mb-4">
            <span className="font-bold font-mono text-amber-900">🏰 Bookshelves:</span>
            <span className="font-mono text-amber-800 ml-2">{reading.bookshelves.join(", ")}</span>
          </div>
        </div>

        <div className="bg-amber-100 border-4 border-amber-800 shadow-lg">
          <div className="bg-amber-900 text-amber-100 p-2 border-b-2 border-amber-800">
            <h3 className="font-mono font-bold text-center">📖 Ancient Manuscript 📖</h3>
          </div>

          <div
            className="bg-amber-50 p-4 border-2 border-amber-700 m-2"
            style={{
              maxHeight: "500px",
              overflowY: "scroll",
              whiteSpace: "pre-wrap",
              fontFamily: "monospace",
              fontSize: "0.9rem",
              lineHeight: 1.6,
              color: "#451a03",
            }}
          >
            {textContent}
          </div>
        </div>
      </div>
    </div>
  );
}
