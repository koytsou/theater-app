import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../../firebase";

export async function getActiveReservationsForShow(showId) {
  const q = query(
    collection(db, "reservations"),
    where("showId", "==", showId),
    where("status", "==", "active")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((document) => ({
    id: document.id,
    ...document.data(),
  }));
}

export async function getUserActiveReservations(userId) {
  const q = query(
    collection(db, "reservations"),
    where("userId", "==", userId),
    where("status", "==", "active")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((document) => ({
    id: document.id,
    ...document.data(),
  }));
}

export async function createReservation({ userId, show, selectedSeats }) {
  return addDoc(collection(db, "reservations"), {
    userId,
    showId: show.id,
    showTitle: show.title,
    theatre: show.theatre,
    price: show.price,
    seats: selectedSeats,
    totalPrice: selectedSeats.length * show.price,
    status: "active",
    createdAt: serverTimestamp(),
  });
}

export async function updateReservation({ reservationId, show, selectedSeats }) {
  return updateDoc(doc(db, "reservations", reservationId), {
    seats: selectedSeats,
    totalPrice: selectedSeats.length * show.price,
    updatedAt: serverTimestamp(),
  });
}

export async function cancelUserReservation(reservationId) {
  return updateDoc(doc(db, "reservations", reservationId), {
    status: "cancelled",
    cancelledAt: serverTimestamp(),
  });
}