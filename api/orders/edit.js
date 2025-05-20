import {getDatabase} from './database.js';

export default async function handler(request, response) { // Definuje a exportuje asynchronní funkci handler, která zpracovává HTTP požadavky.
    const database = getDatabase(); // Získání databáze
    const {idFirebase, parametry, hodnoty} = request.body;

    const odkazRezervace = database.ref('rezervace').child(idFirebase); // Odkaz na konkrétní rezervaci v databázi

    for(let i = 0; i < parametry.length; i++){
        await odkazRezervace.update({ [parametry[i]]: hodnoty[i]}); // Nastavení nové hodnoty pro daný parametr
    }

    response.status(200).json({success: true}); // Odeslání úspěšné odpovědi
}