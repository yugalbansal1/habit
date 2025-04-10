import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import UserProfile from './pages/UserProfile';
import Navigation from './components/Navigation';
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, doc, getDocs, addDoc, deleteDoc, setDoc, updateDoc } from 'firebase/firestore';

interface User {
  displayName?: string | null;
  uid: string;
  email: string | null;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [habits, setHabits] = useState<any[]>([]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      console.log('User signed out successfully.');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const fetchHabits = async (userId: string) => {
    try {
      const habitsCollection = collection(db, 'users', userId, 'habits');
      const habitsSnapshot = await getDocs(habitsCollection);
      const habitsList = habitsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setHabits(habitsList);
    } catch (error) {
      console.error("Error fetching habits:", error);
    }
  };

  const addHabit = async (userId: string, habitName: string) => {
    try {
      const habitsCollection = collection(db, 'users', userId, 'habits');
      const newHabitRef = await addDoc(habitsCollection, {
        name: habitName,
        completed: false
      });
      setHabits(prevHabits => [...prevHabits, { id: newHabitRef.id, name: habitName, completed: false }]);
    } catch (error) {
      console.error("Error adding habit:", error);
    }
  };

  const deleteHabit = async (userId: string, habitId: string) => {
    try {
      const habitDocRef = doc(db, 'users', userId, 'habits', habitId);
      await deleteDoc(habitDocRef);
      setHabits(prevHabits => prevHabits.filter(habit => habit.id !== habitId));
    } catch (error) {
      console.error("Error deleting habit:", error);
    }
  };
  
  const toggleHabitCompleted = async (userId: string, habitId: string, completed: boolean) => {
    const habitDocRef = doc(db, 'users', userId, 'habits', habitId);
    await updateDoc(habitDocRef, { completed: !completed });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName,
        });
        fetchHabits(currentUser.uid);
      } else {
        setUser(null);
        setHabits([])
      } if (currentUser?.uid) {
        fetchHabits(currentUser.uid)
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-gray-100">
        <Navigation user={user} />
        {user?.uid ? (
          <Routes>
            <Route path="/" element={<Dashboard habits={habits} addHabit={(name:string)=>addHabit(user.uid,name)} deleteHabit={(habitId:string)=>deleteHabit(user.uid, habitId)} toggleHabitCompleted={(habitId:string,completed:boolean)=>toggleHabitCompleted(user.uid, habitId,completed)} />} />
            <Route path="/dashboard" element={<Dashboard habits={habits} addHabit={(name:string)=>addHabit(user.uid,name)} deleteHabit={(habitId:string)=>deleteHabit(user.uid, habitId)} toggleHabitCompleted={(habitId:string,completed:boolean)=>toggleHabitCompleted(user.uid, habitId,completed)} />} />
            <Route path="/profile" element={<UserProfile />} />
          </Routes>
        ) : (
          <Routes>
            <Route path="/" element={<LandingPage />} />
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;