import admin from 'firebase-admin'; // Import the Firebase Admin SDK

// slouzi k pripojeni k databazi Firebase

// Pokud už je Firebase aplikace inicializovaná, použije ji, jinak ji inicializuje s následující konfigurací:
const app = admin.apps.length ? admin.app() : admin.initializeApp({ 
// Nastavení přihlašovacích údajů pro Firebase
    credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID, // ID projektu z proměnných prostředí
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL, // E-mail klienta z proměnných prostředí
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') // Privátní klíč, upravený pro správné formátování
    }),
        databaseURL:process.env.FIREBASE_PROJECT_ID
});

export function getDatabase(){ // vytvareni funkce pro ziskani databaze, kterou lze volat v jinych souborech
    return admin.database(app); // Vrátí instanci databáze Firebase
}