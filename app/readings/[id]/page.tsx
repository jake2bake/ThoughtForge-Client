"use client";
import { getUserProfile, getUsers } from "@/app/data/auth";
import { addShare } from "@/app/data/shares";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getGutendex, getGutendexText } from "@/app/data/readings"; // adjust the path as needed

interface User {
  id: number
  username: string
}

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
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const profile = await getUserProfile()
        setCurrentUser(profile)
      } catch (error) {
        console.error("Error fetching user:", error)
      }
    }
    fetchUser()
  }, [])

   const handleOpenShareModal = async () => {
    try {
      const allUsers = await getUsers();
      setUsers(allUsers.filter(u => u.id !== currentUser?.id));
      setShareModalOpen(true);
    } catch (err) {
      console.error("Error fetching users for share", err);
    }
  };

  const handleConfirmShare = async () => {
    if (!selectedUserId || !currentUser || !reading) return;
    try {
      await addShare({
        user: currentUser.id,
        entry: null,
        shared_to: selectedUserId,
        reading: reading.id,
        course: null,
      });
      setShareModalOpen(false);
      setSelectedUserId(null);
    } catch (err) {
      console.error("Error sharing reading", err);
    }
  };


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
          const bookText = await getGutendexText(textUrl);
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
      <div className="bg-parchment min-h-screen p-8">
        <div className="medieval-scroll p-6">
          <p className="text-xl">📜 Unrolling the ancient scroll...</p>
        </div>
      </div>
    );
  }

  return (
  <div className="min-h-screen p-8" style ={{ background: 'var(--parchment)'}}>
    <div className="max-w-4xl mx-auto manuscript-container">
      {/* Title Scroll */}
      <div className="manuscript-title">
        <h1 className="text-3xl font-bold mb-4">
          {reading.title}
        </h1>
        <h2 className="text-xl">
          <span className="mx-2">⚔️</span>
          By {reading.authors.map((a) => a.name).join(", ")}
          <span className="mx-2">⚔️</span>
        </h2>
      </div>

      {/* Metadata Panel */}
      <div className="reading-metadata">
        <div className="metadata-item">
          <span className="metadata-label">📜 Subjects:</span>
          <span className="metadata-value">{reading.subjects.join(", ")}</span>
        </div>
         <div className="metadata-item">
          <div className="metadata-label">🏰 Bookshelves:</div>
          <div className="metadata-value">{reading.bookshelves.join(", ")}</div>
        </div>
      </div>

      {/* Share Button */}
      <div className="mb-8 text-center">
        <button 
          onClick={handleOpenShareModal} 
          className="medieval-button"
        >
          📜 Share This Reading
        </button>
      </div>

      {/* Manuscript Content */}
      <div className="medieval-manuscript">
        <div className="manuscript-header">
          <h3 className="text-center font-bold text-parchment">📖 Ancient Manuscript 📖</h3>
        </div>
        <div className="manuscript-content">
          {textContent}
        </div>
      </div>

      {/* Share Modal */}
      {shareModalOpen && (
        <div className="medieval-modal">
          <div className="medieval-modal-overlay" onClick={() => setShareModalOpen(false)} />
          <div className="medieval-modal-content">
            <h3 className="medieval-modal-title">📜 Share Reading</h3>
            <div className="medieval-select-wrapper">
              <select
                value={selectedUserId ?? ""}
                onChange={(e) => setSelectedUserId(Number(e.target.value))}
                className="medieval-select"
              >
                <option value="">-- Choose a Scholar --</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.username}
                  </option>
                ))}
              </select>
            </div>
            <div className="medieval-modal-actions">
              <button
                onClick={handleConfirmShare}
                disabled={!selectedUserId}
                className="medieval-button"
              >
                Share Scroll
              </button>
              <button
                onClick={() => setShareModalOpen(false)}
                className="medieval-button is-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);;
}
