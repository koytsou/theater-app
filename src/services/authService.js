import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { auth } from "../../firebase";

export async function registerUser(email, password) {
  const userCredential =
    await createUserWithEmailAndPassword(
      auth,
      email.trim(),
      password
    );

  return userCredential.user;
}

export async function loginUser(email, password) {
  const userCredential =
    await signInWithEmailAndPassword(
      auth,
      email.trim(),
      password
    );

  return userCredential.user;
}

export async function logoutUser() {
  return signOut(auth);
}