import { getDatabase } from './database.js'; // Importuje funkci getDatabase z modulu firebase.js

export default async function handler(request, response) { // Definuje a exportuje asynchronní funkci handler, která zpracovává HTTP požadavky.
    const database  = getDatabase();
    const klic = request.body;
    await database.ref('rezervace').child(klic).remove(); // mazani dat s databaze
    response.status(200).json({success: true}); // Odeslání úspěšné odpovědi

}