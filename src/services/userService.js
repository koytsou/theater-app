import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../../firebase";

export async function createUserProfile(user, name) {
  await setDoc(doc(db, "users", user.uid), {
    name: name.trim(),
    email: user.email,
    role: "user",
    status: "active",
    createdAt: serverTimestamp(),
  });
}

export async function getUserProfile(userId) {
  const userDoc = await getDoc(doc(db, "users", userId));

  if (!userDoc.exists()) {
    return null;
  }

  return {
    id: userDoc.id,
    ...userDoc.data(),
  };
}

export async function getAllUsers() {
  const snapshot = await getDocs(collection(db, "users"));

  return snapshot.docs.map((document) => ({
    id: document.id,
    ...document.data(),
  }));
}

export async function updateUserRole(userId, role) {
  return updateDoc(doc(db, "users", userId), {
    role,
  });
}

export async function updateUserStatus(userId, status) {
  return updateDoc(doc(db, "users", userId), {
    status,
  });
}