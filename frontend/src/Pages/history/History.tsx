import React, {
    useEffect, useRef, useState, MouseEvent,
  } from 'react';
  import firebase from 'firebase/app';
  import 'firebase/auth';
  import { auth,db } from '../../enviroments/firebase';
  import { doc, collection, getDoc, getDocs } from 'firebase/firestore';
  import { User } from '@firebase/auth';


  type PredictionType = {
    name: string;
    date: Date;
    prediction: string;
  };
  
  function History(){
    const [user, setUser] = useState(auth.currentUser);
    const [predictions, setPredictions] = useState<PredictionType[]>([]);

  const getTopThree = (predictionStr: string): [string, string][] => {
      const predictionsList: [string, string][] = JSON.parse(predictionStr);
      return predictionsList.sort((a, b) => parseFloat(b[0]) - parseFloat(a[0])).slice(0, 3);
    }
    
    

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

          const fetchedPredictions = querySnapshot.docs.map((doc): PredictionType => {
            const data = doc.data();
            console.log("Converted date:", data.date.toDate());  // Debugging line
            return {
              name: data.name,
              date: data.date.toDate(),  // Convert the Timestamp to a JavaScript Date object
              prediction: data.prediction
            };
          });
          fetchedPredictions.sort((a, b) => b.date.getTime() - a.date.getTime());

          setPredictions(fetchedPredictions);
          console.log(fetchedPredictions,'fetched pred');
        } catch (error) {
          console.error('Error getting predictions:', error);
        }
      } else {
        // Clear predictions when the user logs out
        setPredictions([]);
      }
    };

    fetchPredictions();
  }, [user]);
    
  return (
    <div className="justify-center overflow-y-auto pt-40 pb-4">
      <table className="table w-full">
        <thead>
          <tr>
            <th></th>
            <th>Date</th>
            <th>Filename</th>
            <th>Predictions</th>
          </tr>
        </thead>
        <tbody>
       {predictions.map((prediction, index) => {
       const topThreePredictions = getTopThree(prediction.prediction);
        
        return (
          <tr key={index} className="hover:bg-gray-200">
            <th>{index + 1}</th>
            <td>{new Date(prediction.date).toLocaleString()}</td>
            <td>{prediction.name}</td>
            <td>
              {topThreePredictions.map((pred, idx) => (
                <span 
                  key={idx} 
                  className={`inline-block transition duration-300 ease-in-out rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2 
                              hover:bg-blue-700 hover:text-white
                              ${idx === 0 ? 'bg-blue-500' : idx === 1 ? 'bg-blue-400' : 'bg-blue-300'}`}>
                  {pred[1]}: {parseFloat(pred[0]).toFixed(2)}%
                </span>
              ))}
            </td>
          </tr>
        );
      })}
    </tbody>
      </table>
    </div>
  );
}

  export default History;