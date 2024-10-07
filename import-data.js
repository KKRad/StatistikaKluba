const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json'); // Ažurirajte ovu liniju

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const data = require('./your-data.json');  // Osigurajte da ovaj fajl postoji

async function importData() {
  for (const club of data.clubs) {
    const clubRef = await db.collection('clubs').add({
      name: club.name
    });

    for (const player of club.players) {
      await clubRef.collection('players').add(player);
    }

    for (const game of club.games) {
      await clubRef.collection('games').add({
        ...game,
        date: admin.firestore.Timestamp.fromDate(new Date(game.date))
      });
    }
  }

  console.log('Data import completed');
}

importData().catch(console.error);