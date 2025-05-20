const vsechnyStoly = document.querySelectorAll('.stoly *'); // Získání všech tlačítek (stolů) na stránce

let aktualnyStulId = 99; // ID aktuálního stolu
let predchoziStulId=0; // ID předchozího stolu
let jePrihlasen = false; // Kontrola přihlášení


NastavCasADen();

/*=======================================| PANELY |==================================================*/
function closeRightPanel(){ //zavreni praveho panelu po odeslani
    document.querySelector('.right-panel').style.visibility = 'hidden'; // Skrytí pravého panelu
    NastavBeznuBarvuStolu(); // Nastavení běžné barvy stolů
    const idRightPanel = ["jmeno", "telefon", "email", "pozadavek"]; // Pole pro uložení ID elementů
    
    for(let i = 0; i < idRightPanel.length; i++){
        document.getElementById(idRightPanel[i]).value = ""; // Vymazání hodnoty v inputu
    }
}

document.querySelectorAll('.stoly button').forEach(button => { //Znazorneni praveho panelu
    button.addEventListener('click', () => {
      predchoziStulId = aktualnyStulId; // Uložení ID předchozího stolu
      aktualnyStulId = button.id; // Získání ID tlačítka
      console.log(`Stisknuto tlačítko s ID: ${aktualnyStulId}`); // Zobrazení ID v konzoli

      // Zobrazení pravého panelu
      const rightPanel = document.querySelector('.right-panel');
      rightPanel.style.visibility = 'visible';
      //zmena barvy vybraneho stolu
      console.log(document.getElementById(aktualnyStulId));
      /*===============================================================================================*/
      if(predchoziStulId !== 99){
          NastavBeznuBarvuStolu(predchoziStulId); // Nastavení běžné barvy stolů
      }
      /*================================================================================================*/ 
      ZmenBarvuStolu(document.getElementById(aktualnyStulId), "rgba(204, 255, 50, 0.9)", "rgba(157, 204, 16, 0.9)"); // Změna barvy pozadí na červenou
    });
});

function OtevritLevouPanel(){
    const leftPanel = document.querySelector('.left-panel');
    leftPanel.style.visibility = 'visible'; // Zobrazení levého panelu
}

function ZobrazitLoginPanel(){
    if(!jePrihlasen){
        const loginPanel = document.querySelector('.login-panel');
        loginPanel.style.visibility = 'visible'; 
    }else{
        const accPanel = document.querySelector('.account-panel');
        accPanel.style.visibility = 'visible'; // Zobrazí panel s informacemi o uživateli
    }
}

function ZavriAccountPanel(){
    const accPanel = document.querySelector('.account-panel');
    accPanel.style.visibility = 'hidden'; // Skrytí panelu
}

function ZavriLoginPanel(){
    const loginPanel = document.querySelector('.login-panel');
    loginPanel.style.visibility = 'hidden';
    document.getElementById('username').value = ""; // Vymazání hodnoty v inputu
    document.getElementById('password').value = ""; // Vymazání hodnoty v inputu
}

function ZavritLevouPanel(){
    const leftPanel = document.querySelector('.left-panel');
    leftPanel.style.visibility = 'hidden'; // Skrytí levého panelu
}

function OdhlasitSe(){
    const img = document.getElementById('confirm');
    img.style.visibility = 'hidden'; // Skrytí obrázku
    ZavriAccountPanel(); // Zavření přihlašovacího panelu
    OtevritLevouPanel();
    ZobrazitAdminRezervaci(false); // Skrytí panelu s rezervacemi
    jePrihlasen = false; // Nastavení stavu přihlášení na false
    alert("Úspěšně odhlášeno."); // Zobrazení úspěšného upozornění

}

async function PrihlasitSe(){
    const data = DostatData("login");
    
    if(data === undefined){return;} // Pokud není data, ukonči funkci
    const jmeno = data[0];
    const heslo = data[1];
    
   const response = await fetch('api/users/login',{
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({jmeno, heslo})
   })
   if(response.ok){
        alert("Úspěšně přihlášeno jako moderátor.");
        ZavriLoginPanel();
        ZobrazitImgAOdhlasit();
        ZavritLevouPanel();
        jePrihlasen = true; 
        ZobrazitAdminRezervaci();
   }else{
       alert("uci uroki, poc");
   }
}

function ZobrazitImgAOdhlasit(){
    const img = document.getElementById('confirm');
    img.style.visibility = 'visible';
}

/*=======================================| Uprava dat z databazi|==================================================*/

function SetridPodleDatumu(rezervaci){
    let vsechnyDatumy = [];
    for(rezervace of rezervaci){
        const datum = rezervace.datum.split("-"); // Rozdělení data na jednotlivé části
        let jeDatum = ZkontrolujJestliExistujeDatum(vsechnyDatumy,datum);
        if(!jeDatum){
            vsechnyDatumy.push(datum); // Přidání data do pole
        }
    }
    const serazenaDatumy = SeradDatumy(vsechnyDatumy);
    return SeradRezervaciPodleDatumu(rezervaci, serazenaDatumy); // Vrátí seřazené rezervace podle data
}

function SeradRezervaciPodleDatumu(rezervaci, datumy){
    let serazenaRezervace = [];
    for(let i = 0; i < datumy.length; i++){
        const datum = datumy[i];
        let rezervacePodleDatumu = [];
        for(rezervace of rezervaci){
            let rezervaceDatum = rezervace.datum.split("-"); // Rozdělení data na jednotlivé části
            if(rezervaceDatum[0] == datum[0] && rezervaceDatum[1] == datum[1] && rezervaceDatum[2] == datum[2]){
                rezervacePodleDatumu.push(rezervace);
            }
        }
        const rezervacePodleCasu = SeradPodleCasu(rezervacePodleDatumu); // Seřazení rezervací podle času
        serazenaRezervace.push(rezervacePodleCasu); // Přidání rezervace do pole
    }
    return serazenaRezervace; // Vrátí seřazené rezervace podle data


}

function SeradPodleCasu(rezervace) {
    return rezervace.sort((a, b) => {
        return a.cas_od.localeCompare(b.cas_od);
    });
}

function ZkontrolujJestliExistujeDatum(vsecnhyDatumy, datum){
    if(vsecnhyDatumy.length === 0) return false; // Pokud není žádné datum, vrátí false
    for(let i = 0; i < vsecnhyDatumy.length; i++){
        if(vsecnhyDatumy[i][0] === datum[0] && vsecnhyDatumy[i][1] === datum[1] && vsecnhyDatumy[i][2] === datum[2]){
            return true;
        }
    }
}

function SeradDatumy(datumy){
   return datumy.sort((a, b) => {
        // Sestavíme string ve formátu YYYY-MM-DD pro porovnání
        const datumA = `${a[0]}-${a[1]}-${a[2]}`;
        const datumB = `${b[0]}-${b[1]}-${b[2]}`;
        // Porovnáváme jako data, vzestupně (nejstarší první) pokud je vysledek kladny - datumB je starsi nez datumA
        return new Date(datumA) - new Date(datumB);
    });
}
/*=======================================| Zmena barvy |==================================================*/
function ZmenBarvuOkraje(element, barva) { // Zobrazí varování, pokud je pole prázdné
    element.style.borderColor = barva; // Změna barvy okraje na červenou
    console.log(barva);
}

function NastavBeznuBarvuStolu(stul = null)
    {
        if( stul !== 0 && stul !== null ){
            ZmenBarvuStolu(document.getElementById(stul), " rgba(50, 255, 98, 0.9)", "#039628",false, "pointer"); // Nastavení běžné barvy stolů
        } else{
            for(let i = 1; i < 19; i++){
                    ZmenBarvuStolu(document.getElementById(i), " rgba(50, 255, 98, 0.9)", "#039628",false, "pointer"); // Nastavení běžné barvy stolů
                }
                for(let i = 1; i < 19; i++){
                    ZmenBarvuStolu(document.getElementById("T" + i), " rgba(50, 255, 98, 0.9)", "#039628",false, "pointer"); // Změna kurzoru na "pointer"
                }
        }
     
}

function ZmenBarvuStolu(stul, idBarvy, idBarvyKraje, isDisabled = true, cursor = "default", isPanelVisible = true) // Změna barvy pozadí a okraje stolu
{
    stul.style.backgroundColor = idBarvy; // Změna barvy pozadí na červenou
    stul.style.borderColor = idBarvyKraje; // Změna barvy okraje na červenou
    stul.disabled = isDisabled;
    stul.style.cursor = cursor// Zablokování tlačítka
   
    if(!isPanelVisible)
      rightPanel.style.visibility = 'hidden'; // Skrytí pravého panelu
}
/*=======================================| Zobrazeni stolu |==================================================*/

async function UkazatDostupneStoly() {
    const data = DostatData("left"); // Získání dat z levého panelu
    if(data === undefined) return; // Pokud není data, ukonči funkci
    const rezervaci = await DostatDataZFireBase(); // Získání rezervací z databáze
    NastavBeznuBarvuStolu(); // Nastavení běžné barvy stolů


    if(rezervaci.length !== 0){
      for (const rezervace of rezervaci) { //zobrazeni stolu s rezervaci
        if (data[1] == rezervace.datum && data[2] < rezervace.cas_do && data[3] > rezervace.cas_od) {
            ZmenBarvuStolu(document.getElementById(rezervace.stul), "rgba(255, 50, 50, 0.9)", "rgba(192, 15, 15, 0.9)");
        }
          ZobrazMensiStoly(data); //zobrazeni stolu s mensim poctem mist
        
      }
    }else{
        console.log("penis");
        ZobrazMensiStoly(data); // Zobrazí stoly s menším počtem míst než je zadaný počet lidí
    }
}

function ZobrazMensiStoly(data){
    for(const id of vsechnyStoly){
        const idStolu = id.id; // Získání ID stolu
        if (data[0] > VratMaxPocetMist(idStolu)) {
            ZmenBarvuStolu(document.getElementById(idStolu), "rgba(255, 50, 50, 0.9)", "rgba(192, 15, 15, 0.9)");
        }
    }
}

function VratMaxPocetMist(id) {
    const stul = document.getElementById(id); // Získání elementu stolu podle ID
    return stul.getAttribute('maxPocetMist'); // Získání maximálního počtu míst z atributu stolu
}


function VytvorPoleRezervaci(data, typ = 0) {
    let poleRezervaci = [];
    const klíče = Object.keys(data); // Získání všech klíčů objektu

    for (let i = 0; i < klíče.length; i++) {
        const key = klíče[i]; // Aktuální klíč
        const rez = data[key]; // Získání dat rezervace podle klíče

        // Vytvoření nového objektu rezervace
        const rezervace = {
            cas_od: rez.cas_od,
            cas_do: rez.cas_do,
            jmeno: rez.jmeno,
            telefon: rez.telefon,
            email: rez.email,
            pocet: rez.pocet,
            stul: rez.id,
            datum: rez.datum,
            idFirebase: key // Přidání unikátního ID z Firebase
        };

        poleRezervaci.push(rezervace); // Přidání objektu do pole rezervací
    }
    if(typ === 1){
        return poleRezervaci
    }else{
    const setrizeneRezervaci = SetridPodleDatumu(poleRezervaci); // Seřazení rezervací podle data
    return setrizeneRezervaci; // Vrátí pole rezervací
    }
}

/*=======================================| Zobrazeni tabulky |==================================================*/

function ZobrazitAdminRezervaci(podminka = true){
    const admin = document.querySelector('.admin-rezervations');
    if(podminka){
        admin.style.display = 'grid'; // Zobrazí panel s rezervacemi
        VytvorSeznamRezervaci(); // Vytvoření seznamu rezervací
    }else{
        admin.style.display = 'none'; // Skrytí panelu s rezervacemi
    }
}

async function VytvorSeznamRezervaci() {

    const rezervacePodleDatumu  = await DostatDataZFireBase();

    const tabulka = document.createElement('table');
    tabulka.className = 'rezervations';

    // Hlavička tabulky
    const hlavicka = document.createElement('thead');
    hlavicka.className = 'head';
    const trhead = document.createElement('tr');
    trhead.className = 'trhead';

    const hlavicky = ["Stůl", "Počet lidí", "Čas od", "Čas do", "Jméno", "Telefon", "E-mail", "Akce"];
    hlavicky.forEach(text => {
        const th = document.createElement('th');
        th.textContent = text;
        trhead.appendChild(th);
    });
    hlavicka.appendChild(trhead);
    tabulka.appendChild(hlavicka);

    // Tělo tabulky
    const body = document.createElement('tbody');
    body.className = 'body';

    for (const rezervaceSkupina of rezervacePodleDatumu) {
        if (rezervaceSkupina.length === 0) continue;

        // Label s datem
        const trLabel = document.createElement('tr');
        const tdLabel = document.createElement('td');
        tdLabel.colSpan = hlavicky.length; //kolik sloupcu ma spojit
        tdLabel.textContent = rezervaceSkupina[0].datum;
        tdLabel.className = 'datum-label';
        trLabel.appendChild(tdLabel);
        body.appendChild(trLabel);

        // Řádky rezervací
        for (const rezervace of rezervaceSkupina) {
            const tr = document.createElement('tr');
            ["stul", "pocet", "cas_od", "cas_do", "jmeno", "telefon", "email"].forEach(atribut => {
                const td = document.createElement('td');
                td.textContent = rezervace[atribut];
                tr.appendChild(td);
            });

            // Sloupec s tlačítky
            const tdImage = document.createElement('td');
            // Tlačítko Upravit
            const imgEdit = document.createElement('img');
            imgEdit.src = "Sprites/edit.png";
            imgEdit.id = "edit"; // Nastavení ID pro obrázek
            imgEdit.onclick = () => UpravitRezervaci(rezervace.idFirebase);

            // Tlačítko Smazat
            const imgDelete = document.createElement('img');
            imgDelete.src = "Sprites/delete.png";
            imgDelete.onclick = () => SmazatRezervaci(rezervace.idFirebase);
            imgDelete.id = "delete"; // Nastavení ID pro obrázek


            tdImage.appendChild(imgEdit);
            tdImage.appendChild(imgDelete);
            tr.appendChild(tdImage);

            tr.id = rezervace.idFirebase; // pro úpravy
            body.appendChild(tr);
        }
    }

    tabulka.appendChild(body);
    const canvas = document.createElement('canvas');
    canvas.id = 'barChart';

    const adminRezervace = document.querySelector(".admin-rezervations");
    adminRezervace.innerHTML = "";
    adminRezervace.appendChild(tabulka);
    adminRezervace.appendChild(canvas); // Přidání grafu do panelu
    VytvorGraf();
}

/*=======================================| Zobrazeni grafu |==================================================*/

async function VytvorGraf(){
     const rezervaci = await DostatDataZFireBase(); // Získání dat z Firebase
     const data = VytvorDataGrafu(rezervaci); // Vytvoření dat pro graf
     new Chart(document.getElementById('barChart'), {
       type: 'bar',
        data: {
         labels: data[0], // Získání dat pro labely grafu
         datasets: [{
            label: 'Počet rezervaci',
            data: data[1],
            backgroundColor:'rgb(65, 41, 224)'
         }]
        },
         options: {
         responsive: true,
         scales: {
          y: { beginAtZero: true }
          }    
         }
    });
}

function VytvorDataGrafu(rezervaci){
    const labely = [];
    const data = [];
    const dataGrafu = [];

    for(let i = 0; i < rezervaci.length; i++){ // zjisteni vsech datumu pro labely grafu
        const rezervace = rezervaci[i];
        const datum = rezervace[0].datum;
        labely.push(datum); 
        data.push(rezervace.length); // Získání počtu rezervací pro dané datum
    }
    dataGrafu.push(labely); // Přidání labelů do pole
    dataGrafu.push(data); // Přidání dat do pole

    return dataGrafu;

}

/*=======================================| Metody pro editaci dat |==================================================*/

function UpravitRezervaci(idRezervaci){

   const radekRezervace = document.getElementById(idRezervaci); // Získání těla tabulky podle ID
   const vsechnyBunky = radekRezervace.querySelectorAll('td'); // Získání všech řádků v těle tabulky
   
  const tlacitko = radekRezervace.querySelector('#edit'); // Získání tlačítka pro úpravu rezervace
   tlacitko.style.backgroundColor =  "#1b610b"; // Změna barvy pozadí tlačítka
   
   if(!radekRezervace.jePovolenaOprava){ // Kontrola stavu úpravy
       radekRezervace.jePovolenaOprava = true; // Nastavení stavu úpravy na true
       for (bunka of vsechnyBunky) {
        bunka.setAttribute("contenteditable", "true"); // Nastavení atributu pro editaci
       }
   }else{
       radekRezervace.jePovolenaOprava = false; // Nastavení stavu úpravy na false
        for (bunka of vsechnyBunky) {
          bunka.setAttribute("contenteditable", "false"); // Nastavení atributu pro editaci
        }
        const opravenaData = DostatOpravenaDataBunky(vsechnyBunky); // Získání dat z buněk
        UpravitRezervaceVDatavazi(idRezervaci, opravenaData.paramenty, opravenaData.hodnoty); // Odeslání dat na server
   }
}


function DostatOpravenaDataBunky(vsechnyBunky){

   let paramenty = [];
   let hodnoty = [];
   for (bunka of vsechnyBunky) {
    if(bunka.byloOpraveno){
        paramenty.push(bunka.id); // Přidání ID do pole
        hodnoty.push(bunka.textContent); // Přidání textu do pole
        bunka.byloOpraveno = false; // Nastavení stavu na false
    }
   }
    consoele.log(paramenty, hodnoty);
   return {paramenty, hodnoty}; // Vrátí pole s hodnotami
}

/*=======================================| Zbyle metody |==================================================*/

function DostatData(panel = "all"){
    if(panel === "all"){
        const idElementu = ["cas-od", "cas-do", "datum", "email", "telefon", "jmeno", "pocet-lidi"]; // Pole pro uložení ID elementů
        let data = []; // Pole pro uložení dat
        for(let i = 0; i < idElementu.length; i++){
            let element = document.getElementById(idElementu[i]); // Získání elementu podle ID
             if(element.value === "" || element.value === null){ // Kontrola, zda je prázdný
                 ZmenBarvuOkraje(element, "red"); // Zobrazí varování, pokud je pole prázdné
                return;
            }else{
                data.push(element.value); // Přidání hodnoty do pole
            }
        }
        return {
         id: aktualnyStulId, // Získání ID stolu
         cas_od: data[0], // Získání času od
         cas_do: data[1], // Získání času do
         datum: data[2], // Získání data
         email: data[3], // Získání e-mailu
         telefon: data[4], // Získání telefonu
         jmeno: data[5], // Získání jména
         pocet: data[6] // Získání počtu lidí
        };
    } else if(panel === "left"){
        let data = ["pocet-lidi", "datum", "cas-od", "cas-do"]; // Pole pro uložení dat

        for(let i = 0; i < data.length; i++){
            ZmenBarvuOkraje(document.getElementById(data[i]), ""); // Obnovení barvy okraje
        }
    
        let hodnota = 0;
        let dataLevehoPanelu = []; // Pole pro uložení hodnot z inputů
        for(let i = 0; i < data.length; i++){
            hodnota = document.getElementById(data[i]).value; // Získání hodnoty z inputu
            if(hodnota === "" || hodnota === null){
                ZmenBarvuOkraje(document.getElementById(data[i]), "red"); // Zobrazí varování, pokud je pole prázdné
                return;
            }else{
                dataLevehoPanelu.push(hodnota); // Přidání hodnoty do pole
            }
        }
        return dataLevehoPanelu; // Vrátí pole s hodnotami
    } else if(panel === "login"){
        let data = ["username", "password"]; // Pole pro uložení ID elementů
        let dataLogin = []; // Pole pro uložení dat
        for(let i = 0; i < data.length; i++){
            let element = document.getElementById(data[i]); // Získání elementu podle ID
            if(element.value === "" || element.value === null){ // Kontrola, zda je prázdný
                ZmenBarvuOkraje(element, "red"); // Zobrazí varování, pokud je pole prázdné
                return;
            }else{
                dataLogin.push(element.value); // Přidání hodnoty do pole
            }
        }
        return dataLogin; // Vrátí pole s hodnotami
    }

}

function ZkontrolujSpleniPozadavku(response){
 if (response.ok) {
        alert("Pozadavek byl uspesne splnen.");
        VytvorSeznamRezervaci(); // Aktualizuj seznam rezervací
    } else {
        alert("Pozadavek nebyl splnen.");
    }
}

function NastavCasADen() { // Nastavení minimální, maximální hodnoty a kroku pro inputy
    const dnyVTydnu = ["Neděle", "Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Sobota"];
    const inputId = ["datum", "cas-od", "cas-do"];
    const dneska = new Date(); // Získání aktuálního data

    console.log("pidoras");

    if(dneska.getDay() === 5 || dneska.getDay() === 6){ 
         for(let i = 1; i < inputId.length; i++){
            document.getElementById(inputId[i]).setAttribute("min", "10:00"); // Nastavení minimální hodnoty pro čas
            document.getElementById(inputId[i]).setAttribute("max", "24:00"); // Nastavení maximální hodnoty pro čas
            document.getElementById(inputId[i]).setAttribute("step", "1800"); // Nastavení kroku pro čas
       }  
    }

    document.getElementById(inputId[0]).value =
     `${dneska.getFullYear()}-${ String(dneska.getMonth() + 1).padStart(2, '0')}-${String(dneska.getDate()).padStart(2, '0')}`;
}

/*=======================================| Metody pro volani Databazi |==================================================*/

async function PoslatDataNaFireBase(){ // Odeslání dat na Firebase (PUT)
    const data = DostatData(); // Získání dat z pravého panelu

    if(data === undefined) return; // Pokud není data, ukonči funkci

    const response = await fetch('/api/orders/post', { // Správné umístění závorek
        method: "POST",
       headers: { 'Content-Type': 'application/json' }, // Nastaví HTTP hlavičku, která říká serveru, že posílaná data jsou ve formátu JSON
        body: JSON.stringify(data) // Odeslání dat na server
        })

        ZkontrolujSpleniPozadavku(response); // Kontrola úspěšnosti odeslání
        
        closeRightPanel(); // Zavření pravého panelu

}
async function SmazatRezervaci(idRezervaciVFirebase){
      const response = await fetch('/api/orders/delete', { // Smazání rezervace z Firebase
        method: "DELETE",
        headers: { 'Content-Type': 'application/json' }, // Nastaví HTTP hlavičku, která říká serveru, že posílaná data jsou ve formátu JSON
        body: JSON.stringify(idRezervaciVFirebase), // Odeslání ID rezervace
    })
    ZkontrolujSpleniPozadavku(response); // Kontrola úspěšnosti smazání
    VytvorSeznamRezervaci(); // Vytvoření seznamu rezervací*/
}

async function DostatDataZFireBase(typReturn = 0) {
    const response = await fetch('/api/orders/get'); // dostat data z firebase
    
    const data = await response.json(); // prevest z JSON
    if(!data){
     console.log("Zadne rezervace nebyly nalezeny"); // pokud neni co zobrazit
     return[];   
    }
    
    let rezervaci = VytvorPoleRezervaci(data, typReturn); // prevest na pole objektu

    return rezervaci; 
}

async function UpravitRezervaceVDatavazi(idFirebase, parametry, hodnoty){

   const tlacitko = document.getElementById("edit"); // Získání tlačítka pro úpravu rezervace
   tlacitko.style.backgroundColor = "transparent"; // Změna barvy pozadí tlačítka

    console.log(idFirebase,parametry,hodnoty);
    const response = await fetch('/api/orders/edit', { // Odeslání dat na Firebase (PUT)
        method: "PATCH",
        headers: { 'Content-Type': 'application/json' }, // Nastaví HTTP hlavičku, která říká serveru, že posílaná data jsou ve formátu JSON
        body: JSON.stringify({idFirebase, parametry, hodnoty}) // Odeslání dat na server
    })
    ZkontrolujSpleniPozadavku(response); // Kontrola úspěšnosti odeslání
}
