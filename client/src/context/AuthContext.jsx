import React, { useContext, useState, useEffect } from "react";
import { auth, googleProvider } from "../firebase"; // Keep your existing firebase import
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  updateProfile 
} from "firebase/auth";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isGuest, setIsGuest] = useState(false); // ✅ Added Guest State
  const [loading, setLoading] = useState(true);

  // ✅ Updated: Signup now takes 'name' and updates profile immediately
  function signup(email, password, name) {
    return createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        return updateProfile(userCredential.user, { displayName: name });
      });
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function loginWithGoogle() {
    return signInWithPopup(auth, googleProvider);
  }

  // ✅ New: Guest Login Logic
  function loginAsGuest() {
    setIsGuest(true);
  }

  // ✅ Updated: Logout clears Guest state AND Firebase auth
  function logout() {
    setIsGuest(false);
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    isGuest, // Export this
    signup,
    login,
    loginWithGoogle,
    loginAsGuest, // Export this
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}