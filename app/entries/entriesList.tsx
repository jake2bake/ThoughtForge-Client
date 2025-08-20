"use client";

import React, { useEffect, useState } from "react";
import { EntryCard } from "../components/entryCard";
import { getEntries } from "../data/entries";
import { getUserProfile, getUsers } from "../data/auth";
import { addLike, getLikes } from "@/app/data/likes"
import {addShare} from "@/app/data/shares"

interface User {
  id: number;
  username: string;
}

interface Topic {
  id: number;
  label: string;
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

interface Like {
  id: number;
  user: number;
  entry: number;
}

export default function EntriesList() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState<Like[]>([])
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [shareEntryId, setShareEntryId] = useState<number | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  useEffect(() => {
  async function fetchData() {
    try {
      const profile = await getUserProfile()
      setCurrentUser(profile)
      const [entriesData, likesData] = await Promise.all([
        getEntries(),
        getLikes(),
      ]);

      const visibleEntries = entriesData.filter(
        (entry) => !entry.isPrivate || entry.user?.id === profile.id
      );

      setEntries(visibleEntries);
      setLikes(likesData)
    } catch (error) {
      console.error("Error loading entries or likes:", error);
    } finally {
      setLoading(false);
    }
  }
  fetchData();
}, []);

  const handleLike = async (entryId: number) => {
  if (!currentUser) return;
  try {
    const newLike = await addLike({
      user: currentUser.id,
      entry: entryId,
    });
    setLikes((prev) => [...prev, newLike]);
    console.log(`Liked entry ${entryId}`);
  } catch (err) {
    console.error("Error liking entry", err);
  }
}

  const handleOpenShareModal = async (entryId: number) => {
    setShareEntryId(entryId)
    setShareModalOpen(true)
    try {
      const allUsers = await getUsers()
      setUsers(allUsers.filter(u => u.id !== currentUser?.id))
    } catch (err) {
      console.error("Error fetching users for share", err)
    }
  }

  const handleConfirmShare = async () => {
    if (!shareEntryId || !selectedUserId || !currentUser) return;
    try {
      await addShare({
        user: currentUser.id,
        entry: shareEntryId,
        shared_to: selectedUserId,
        reading: null,
        course: null,

      })
      console.log(`Shared entry ${shareEntryId} with user ${selectedUserId}`)
      setShareModalOpen(false)
      setSelectedUserId(null)
    } catch (err) {
      console.error("Error sharing entry", err)
    }
  }


  if (loading) return <p>Loading entries...</p>;

  if (entries.length === 0) return <p>No entries found.</p>;

  return (
    <section className="section">
      <h1 className="title">Entries</h1>
      <div className="columns is-multiline">
        {entries.map((entry) => (
          <EntryCard 
            key={entry.id} 
            entry={entry} 
            onLike={handleLike}
            onShare={handleOpenShareModal}
            />
        ))}
      </div>
      {/* Share Modal */}
      {shareModalOpen && (
        <div className="modal is-active">
          <div className="modal-background" onClick={() => setShareModalOpen(false)}></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">Share Entry</p>
              <button className="delete" onClick={() => setShareModalOpen(false)}></button>
            </header>
            <section className="modal-card-body">
              <div className="field">
                <label className="label">Select user to share with</label>
                <div className="control">
                  <div className="select is-fullwidth">
                    <select
                      value={selectedUserId ?? ""}
                      onChange={(e) => setSelectedUserId(Number(e.target.value))}
                    >
                      <option value="">-- Choose a user --</option>
                      {users.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.username}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </section>
            <footer className="modal-card-foot">
              <button className="button is-link" onClick={handleConfirmShare}>
                Share
              </button>
              <button className="button" onClick={() => setShareModalOpen(false)}>
                Cancel
              </button>
            </footer>
          </div>
        </div>
      )}

    </section>
  );
}
