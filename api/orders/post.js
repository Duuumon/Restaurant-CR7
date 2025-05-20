import { getDatabase } from './database.js';

export default async function handler(request, response){// Definuje a exportuje asynchronní funkci handler, která zpracovává HTTP požadavky.
    const { id, cas_od, cas_do, datum, email, jmeno, pocet, telefon} = request.body; // Dostabani dat z těla požadavku
    const database = getDatabase(); // Získání databaze
    const novyZaznam = database.ref('rezervace').push(); // Vytvoření nového záznamu v databázi
    await novyZaznam.set({ // Nastavení hodnot nového záznamu
        cas_do: cas_do, 
        cas_od: cas_od,
        datum: datum, 
        email: email, 
        id: id, 
        jmeno: jmeno,
        pocet: pocet, 
        telefon: telefon 
    })

    response.status(200).json({success: true}); // Odeslání úspěšné odpovědi
}