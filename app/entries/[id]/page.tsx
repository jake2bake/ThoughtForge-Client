"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getUserProfile } from "@/app/data/auth";
import { getEntryById, deleteEntry } from "@/app/data/entries";
import MedievalScroll from "@/app/components/MedievalScroll";
;
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

export default function EntryDetailPage() {
  const { id } = useParams();
  const router = useRouter()
  const [entry, setEntry] = useState<Entry | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  useEffect(() => {
    getUserProfile().then((data) => {
      setCurrentUser(data)
    })
  }, [])
  

  useEffect(() => {
    async function fetchEntry() {
      try {
        const data = await getEntryById(id);
        setEntry(data);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      }
    }

    if (id) {
      fetchEntry();
    }
  }, [id]);

   const handleEdit = () => {
    router.push(`/entries/${id}/edit`);
  };

   const handleDelete = async () => {
    try {
      await deleteEntry(id);
      router.push('/entries');
    } catch (err: any) {
      setError(err.message || "Failed to delete entry");
    }
  };

  if (error) {
    return (
      <div className="section">
        <div className="medieval-error">
          ⚔️ Alas! The scroll could not be retrieved from the archives: {error}
        </div>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="section">
        <div className="medieval-loading">
          📜 Unraveling the ancient scroll... Please wait, brave scholar...
        </div>
      </div>
    );
  }

  return <MedievalScroll entry={entry} onEdit={handleEdit} onDelete={handleDelete} currentUser={currentUser} />;
}