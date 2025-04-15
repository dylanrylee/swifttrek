import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from './firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to sign up a new user
  const signup = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // Function to sign in an existing user
  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Function to sign out the current user
  const logout = () => {
    return signOut(auth);
  };

  // Listen for changes in authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = { currentUser, signup, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {/* Optionally, you can render a loading spinner here instead of null */}
      {!loading ? children : null}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
