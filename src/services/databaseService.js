import { collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from './firebaseConfig';

// Clubs
export const getClubs = async () => {
  try {
    const clubsRef = collection(db, 'clubs');
    const snapshot = await getDocs(clubsRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting clubs: ", error);
    throw error;
  }
};

export const addClub = async (clubData) => {
  try {
    const clubsRef = collection(db, 'clubs');
    const docRef = await addDoc(clubsRef, clubData);
    return docRef.id;
  } catch (error) {
    console.error("Error adding club: ", error);
    throw error;
  }
};

export const getClubDetails = async (clubId) => {
  try {
    console.log("Getting club details for clubId:", clubId);
    const clubRef = doc(db, 'clubs', clubId);
    const clubSnap = await getDoc(clubRef);
    console.log("Club snapshot:", clubSnap);
    if (clubSnap.exists()) {
      const clubData = { id: clubSnap.id, ...clubSnap.data() };
      console.log("Club data:", clubData);
      return clubData;
    } else {
      console.log("No such club!");
      throw new Error("Club not found");
    }
  } catch (error) {
    console.error("Error getting club details: ", error);
    throw error;
  }
};

// Players
export const getPlayers = async (clubId) => {
  try {
    const playersRef = collection(db, `clubs/${clubId}/players`);
    const snapshot = await getDocs(playersRef);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return { 
        id: doc.id, 
        ...data,
        trainingCount: data.trainingCount || 0,
        averageScore: data.averageScore || 0,
        averageMisses: data.averageMisses || 0,
        bestTrainingScore: data.bestTrainingScore || 0
      };
    });
  } catch (error) {
    console.error("Error getting players: ", error);
    throw error;
  }
};

export const getPlayer = async (clubId, playerId) => {
  try {
    const playerRef = doc(db, `clubs/${clubId}/players`, playerId);
    const playerSnap = await getDoc(playerRef);
    if (playerSnap.exists()) {
      return { id: playerSnap.id, ...playerSnap.data() };
    } else {
      console.log("No such player!");
      return null;
    }
  } catch (error) {
    console.error("Error getting player: ", error);
    throw error;
  }
};

export const addPlayer = async (clubId, playerData) => {
  try {
    const playersRef = collection(db, `clubs/${clubId}/players`);
    const docRef = await addDoc(playersRef, {
      ...playerData,
      trainingCount: 0,
      totalShots: 0,
      totalMisses: 0,
      averageScore: 0,
      averageMisses: 0,
      bestTrainingScore: 0
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding player: ", error);
    throw error;
  }
};

export const updatePlayer = async (clubId, playerId, playerData) => {
  try {
    const playerRef = doc(db, `clubs/${clubId}/players`, playerId);
    await updateDoc(playerRef, playerData);
  } catch (error) {
    console.error("Error updating player: ", error);
    throw error;
  }
};

export const deletePlayer = async (clubId, playerId) => {
  try {
    const playerRef = doc(db, `clubs/${clubId}/players`, playerId);
    await deleteDoc(playerRef);
  } catch (error) {
    console.error("Error deleting player: ", error);
    throw error;
  }
};

// Trainings
export const addTraining = async (clubId, playerId, trainingData) => {
  try {
    const trainingsRef = collection(db, `clubs/${clubId}/players/${playerId}/trainings`);
    const docRef = await addDoc(trainingsRef, trainingData);

    // Update player statistics
    const playerRef = doc(db, `clubs/${clubId}/players`, playerId);
    const playerDoc = await getDoc(playerRef);
    const playerData = playerDoc.data();

    const newTrainingCount = (playerData.trainingCount || 0) + 1;
    const newTotalShots = (playerData.totalShots || 0) + trainingData.shotsAttempted;
    const newTotalMisses = (playerData.totalMisses || 0) + trainingData.shotsMissed;
    const newScore = trainingData.shotsAttempted - trainingData.shotsMissed;
    const newBestScore = Math.max(playerData.bestTrainingScore || 0, newScore);

    await updateDoc(playerRef, {
      trainingCount: newTrainingCount,
      totalShots: newTotalShots,
      totalMisses: newTotalMisses,
      averageScore: (newTotalShots - newTotalMisses) / newTrainingCount,
      averageMisses: newTotalMisses / newTrainingCount,
      bestTrainingScore: newBestScore
    });

    return docRef.id;
  } catch (error) {
    console.error("Error adding training: ", error);
    throw error;
  }
};

export const getPlayerTrainings = async (clubId, playerId) => {
  try {
    const trainingsRef = collection(db, `clubs/${clubId}/players/${playerId}/trainings`);
    const snapshot = await getDocs(trainingsRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting player trainings: ", error);
    throw error;
  }
};

export const deleteTraining = async (clubId, playerId, trainingId) => {
  try {
    const trainingRef = doc(db, `clubs/${clubId}/players/${playerId}/trainings`, trainingId);
    const trainingSnap = await getDoc(trainingRef);
    const trainingData = trainingSnap.data();

    await deleteDoc(trainingRef);

    // Update player statistics
    const playerRef = doc(db, `clubs/${clubId}/players`, playerId);
    const playerSnap = await getDoc(playerRef);
    const playerData = playerSnap.data();

    const newTrainingCount = (playerData.trainingCount || 0) - 1;
    const newTotalShots = (playerData.totalShots || 0) - trainingData.shotsAttempted;
    const newTotalMisses = (playerData.totalMisses || 0) - trainingData.shotsMissed;

    await updateDoc(playerRef, {
      trainingCount: newTrainingCount,
      totalShots: newTotalShots,
      totalMisses: newTotalMisses,
      averageScore: newTrainingCount > 0 ? (newTotalShots - newTotalMisses) / newTrainingCount : 0,
      averageMisses: newTrainingCount > 0 ? newTotalMisses / newTrainingCount : 0
    });

    console.log('Training deleted and player statistics updated successfully');
  } catch (error) {
    console.error('Error deleting training:', error);
    throw error;
  }
};

// Matches
export const addMatch = async (clubId, matchData) => {
  try {
    const matchesRef = collection(db, `clubs/${clubId}/matches`);
    const docRef = await addDoc(matchesRef, matchData);
    return docRef.id;
  } catch (error) {
    console.error("Error adding match: ", error);
    throw error;
  }
};

export const getGames = async (clubId) => {
  try {
    const gamesRef = collection(db, `clubs/${clubId}/matches`);
    const snapshot = await getDocs(gamesRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting games: ", error);
    throw error;
  }
};

export const getPlayerMatches = async (clubId, playerId) => {
  try {
    const matchesRef = collection(db, `clubs/${clubId}/matches`);
    const snapshot = await getDocs(matchesRef);
    const allMatches = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return allMatches.filter(match => match.playerScores && match.playerScores.some(score => score.playerId === playerId));
  } catch (error) {
    console.error("Error getting player matches: ", error);
    throw error;
  }
};

export const deleteMatch = async (clubId, matchId) => {
  try {
    const matchRef = doc(db, `clubs/${clubId}/matches`, matchId);
    await deleteDoc(matchRef);
    console.log('Match deleted successfully');
  } catch (error) {
    console.error('Error deleting match:', error);
    throw error;
  }
};

export const updateMatch = async (clubId, matchId, newData) => {
  try {
    const matchRef = doc(db, `clubs/${clubId}/matches`, matchId);
    await updateDoc(matchRef, newData);
    console.log('Match updated successfully');
  } catch (error) {
    console.error('Error updating match:', error);
    throw error;
  }
};

export const getMatch = async (clubId, matchId) => {
  try {
    const matchRef = doc(db, `clubs/${clubId}/matches`, matchId);
    const matchSnap = await getDoc(matchRef);
    if (matchSnap.exists()) {
      return { id: matchSnap.id, ...matchSnap.data() };
    } else {
      console.log("No such match!");
      return null;
    }
  } catch (error) {
    console.error("Error getting match: ", error);
    throw error;
  }
};

// Authentication
export const loginAdmin = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error logging in: ", error);
    throw error;
  }
};

export const getPlayersByPosition = async (clubId, position) => {
  try {
    const playersRef = collection(db, `clubs/${clubId}/players`);
    const q = query(playersRef, where("position", "==", position));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting players by position: ", error);
    throw error;
  }
};

export const resetPlayerStats = async (clubId, playerId) => {
  try {
    const playerRef = doc(db, `clubs/${clubId}/players`, playerId);
    await updateDoc(playerRef, {
      trainingCount: 0,
      totalShots: 0,
      totalMisses: 0,
      averageScore: 0,
      averageMisses: 0,
      bestTrainingScore: 0
    });
    console.log('Player statistics reset successfully');
  } catch (error) {
    console.error('Error resetting player statistics:', error);
    throw error;
  }
};