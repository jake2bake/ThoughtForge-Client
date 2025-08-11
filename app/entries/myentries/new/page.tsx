'use client'

import { useRouter } from "next/navigation";
import EntryForm from "@/app/components/EntryForm";
import { addEntry } from "@/app/data/entries";

export default function CreateEntryPage() {
  const router = useRouter();

  const handleCreate = async (data: unknown) => {
    await addEntry(data);
    router.push("/entries/myentries");
  };

  return <EntryForm onSubmit={handleCreate} submitLabel="Create Entry" />;
}
