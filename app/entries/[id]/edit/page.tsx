"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import EntryForm from "@/app/components/EntryForm";
import { getEntryById, editEntry } from "@/app/data/entries";

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
  user: { id: number; username: string } | null;
}

export default function EditEntryPage() {
  const { id } = useParams();
  const router = useRouter();
  const [entry, setEntry] = useState<Entry | null >(null);

  useEffect(() => {
    if (id) {
      getEntryById(id).then(setEntry).catch(console.error);
    }
  }, [id]);

  const handleUpdate = async (data: unknown) => {
    await editEntry(id, data);
    router.push(`/entries/${id}`);
  };

  if (!entry) return <div>Loading...</div>;

  return (
    <EntryForm
      initialData={{
        title: entry.title,
        reflection: entry.reflection,
        isPrivate: entry.isPrivate,
        topicId: entry.topic?.id,
      }}
      onSubmit={handleUpdate}
      submitLabel="Update Entry"
    />
  );
}
