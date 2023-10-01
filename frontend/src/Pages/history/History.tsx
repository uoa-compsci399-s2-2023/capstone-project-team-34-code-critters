import React, {
    useEffect, useRef, useState, MouseEvent,
  } from 'react';
  import firebase from 'firebase/app';
  import 'firebase/auth';
  import { auth,db } from '../../enviroments/firebase';
  import { doc, collection, getDoc, getDocs } from 'firebase/firestore';
  import { User } from '@firebase/auth';

  function History(){
    const [user, setUser] = useState(auth.currentUser);
    
    useEffect(() => {
      auth.onAuthStateChanged((currentUser) => {
        setUser(currentUser);
      });
    }, []);

    useEffect(() => {
    // Fetch predictions when the user ID changes
    const fetchPredictions = async () => {
      const userId = user?.uid;
      if (userId) {
        const userDocRef = doc(db, 'user', userId);
        const predictionsCollectionRef = collection(userDocRef, 'predictions');

        try {
          const querySnapshot = await getDocs(predictionsCollectionRef);

          const fetchedPredictions = querySnapshot.docs.map((doc) => doc.data());
          // setPredictions(fetchedPredictions);
          console.log(fetchedPredictions);
        } catch (error) {
          console.error('Error getting predictions:', error);
        }
      } else {
        // Clear predictions when the user logs out
        // setPredictions([]);
      }
    };

    fetchPredictions();
  }, [user]);
    
    return (
        <div className="w-full h-full flex justify-center overflow-y-auto pt-28 pb-4">
            
            
        </div>
    )
  }

  export default History;  