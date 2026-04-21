import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export async function POST(req: Request) {
  const note = await req.json();

  const verified = note.page && note.quote;

  const doc = await addDoc(collection(db, "notes"), {
    ...note,
    verified,
  });

  return Response.json({ id: doc.id });
}