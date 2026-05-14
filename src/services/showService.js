import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

export async function getShows() {
  const snapshot = await getDocs(collection(db, "shows"));

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}