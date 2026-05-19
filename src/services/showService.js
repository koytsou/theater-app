import {
  collection,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";

import { db } from "../../firebase";

export async function getShows() {
  const snapshot = await getDocs(collection(db, "shows"));

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    rows: 10,
    columns: 12,
    ...doc.data(),
  }));
}

export async function updateShowLayout(showId, rows, columns) {
  return updateDoc(doc(db, "shows", showId), {
    rows: Number(rows),
    columns: Number(columns),
  });
}