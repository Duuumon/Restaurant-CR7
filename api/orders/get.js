import {getDatabase} from './database.js'; // Importuje funkci getDatabase z modulu database.js

export default async function handler(request, response) { // Definuje a exportuje asynchronní funkci handler, která zpracovává HTTP požadavky.
    const databaze = getDatabase();
    const data = await databaze.ref('rezervace').once('value'); // Načtení dat z databáze
    console.log(data.val()); // Výpis načtených dat do konzole
    response.status(200).json(data.val()); // Odeslání dat jako JSON odpověď
}
