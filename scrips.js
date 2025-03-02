// Globale Variable für benutzerdefinierte Betonsorten
let eigeneBetonsorten = [];

// Beim Laden der Seite gespeicherte Betonsorten laden
window.addEventListener('DOMContentLoaded', function() {
    console.log("Seite geladen, lade gespeicherte Betonsorten...");
    ladeEigeneBetonsorten();
    aktualisiereBetonsortenListe();
    erstelleBetonsortenTabelle();
    
    // Event-Listener für das Formular zum Hinzufügen eigener Betonsorten
    const formular = document.getElementById('eigeneBetonsortForm');
    if (formular) {
        console.log("Formular gefunden, füge Event-Listener hinzu");
        formular.addEventListener('submit', function(e) {
            e.preventDefault();
            fuegeEigeneBetonsortHinzu();
        });
    } else {
        console.error("Formular mit ID 'eigeneBetonsortForm' nicht gefunden!");
    }
});

// Funktion zum Laden der gespeicherten Betonsorten aus localStorage
function ladeEigeneBetonsorten() {
    try {
        const gespeicherteBetonsorten = localStorage.getItem('eigeneBetonsorten');
        console.log("Geladene Daten aus localStorage:", gespeicherteBetonsorten);
        
        if (gespeicherteBetonsorten) {
            eigeneBetonsorten = JSON.parse(gespeicherteBetonsorten);
            console.log("Geparste Betonsorten:", eigeneBetonsorten);
        } else {
            console.log("Keine gespeicherten Betonsorten gefunden");
            eigeneBetonsorten = [];
        }
    } catch (error) {
        console.error("Fehler beim Laden der Betonsorten:", error);
        eigeneBetonsorten = [];
    }
}

// Funktion zum Speichern der Betonsorten in localStorage
function speichereEigeneBetonsorten() {
    try {
        const daten = JSON.stringify(eigeneBetonsorten);
        localStorage.setItem('eigeneBetonsorten', daten);
        console.log("Betonsorten gespeichert:", daten);
    } catch (error) {
        console.error("Fehler beim Speichern der Betonsorten:", error);
        alert("Fehler beim Speichern der Betonsorten. Möglicherweise ist der localStorage-Speicher voll oder deaktiviert.");
    }
}

// Funktion zum Aktualisieren der Dropdown-Liste mit eigenen Betonsorten
function aktualisiereBetonsortenListe() {
    console.log("Aktualisiere Dropdown-Liste der Betonsorten");
    
    const betonartSelect = document.getElementById('betonart');
    if (!betonartSelect) {
        console.error("Dropdown-Element 'betonart' nicht gefunden!");
        return;
    }
    
    console.log("Aktuelle Anzahl eigener Betonsorten:", eigeneBetonsorten.length);
    
    // Bestehende eigene Betonsorten entfernen
    const optionen = betonartSelect.options;
    for (let i = optionen.length - 1; i >= 0; i--) {
        if (optionen[i].value.startsWith('eigen_')) {
            betonartSelect.remove(i);
        }
    }
    
    // Trennlinien-Option mit ID entfernen, falls vorhanden
    const existierendeTrennlinie = document.getElementById('trennlinie-betonsorten');
    if (existierendeTrennlinie) {
        existierendeTrennlinie.remove();
    }
    
    // Wenn eigene Betonsorten vorhanden sind, Trennlinie hinzufügen
    if (eigeneBetonsorten.length > 0) {
        const trennlinie = document.createElement('option');
        trennlinie.disabled = true;
        trennlinie.id = 'trennlinie-betonsorten';
        trennlinie.textContent = '----------------------';
        betonartSelect.appendChild(trennlinie);
        
        // Eigene Betonsorten hinzufügen
        eigeneBetonsorten.forEach((betonsorte, index) => {
            const option = document.createElement('option');
            option.value = 'eigen_' + index;
            option.textContent = betonsorte.name + ' (' + betonsorte.hersteller + ')';
            betonartSelect.appendChild(option);
        });
        
        console.log("Betonsorten wurden zur Dropdown-Liste hinzugefügt");
    }
}

// Funktion zum Erstellen der Tabelle mit eigenen Betonsorten
function erstelleBetonsortenTabelle() {
    console.log("Erstelle Tabelle der Betonsorten");
    
    const tabelle = document.getElementById('eigeneBetonsortTabelle');
    if (!tabelle) {
        console.error("Tabellenelement 'eigeneBetonsortTabelle' nicht gefunden!");
        return;
    }
    
    tabelle.innerHTML = '';
    
    if (!eigeneBetonsorten || eigeneBetonsorten.length === 0) {
        console.log("Keine Betonsorten vorhanden");
        tabelle.innerHTML = '<tr><td colspan="6">Keine eigenen Betonsorten vorhanden</td></tr>';
        return;
    }
    
    console.log("Anzahl der anzuzeigenden Betonsorten:", eigeneBetonsorten.length);
    
    // Tabellenkopf
    const kopf = document.createElement('tr');
    kopf.innerHTML = `
        <th>Name</th>
        <th>Hersteller</th>
        <th>Dichte (kg/m³)</th>
        <th>Preis (€/m³)</th>
        <th>Verwendung</th>
        <th>Aktionen</th>
    `;
    tabelle.appendChild(kopf);
    
    // Tabellenzeilen für jede Betonsorte
    eigeneBetonsorten.forEach((betonsorte, index) => {
        const zeile = document.createElement('tr');
        zeile.innerHTML = `
            <td>${betonsorte.name || 'k.A.'}</td>
            <td>${betonsorte.hersteller || 'k.A.'}</td>
            <td>${betonsorte.dichte || 'k.A.'}</td>
            <td>${betonsorte.preis > 0 ? betonsorte.preis : '-'}</td>
            <td>${betonsorte.verwendung || '-'}</td>
            <td>
                <button onclick="loescheBetonsorte(${index})">Löschen</button>
            </td>
        `;
        tabelle.appendChild(zeile);
    });
    
    console.log("Tabelle wurde erstellt");
}

// Funktion zum Hinzufügen einer eigenen Betonsorte
function fuegeEigeneBetonsortHinzu() {
    console.log("Funktion zum Hinzufügen einer Betonsorte aufgerufen");
    
    const nameElement = document.getElementById('eigeneName');
    const herstellerElement = document.getElementById('eigeneHersteller');
    const dichteElement = document.getElementById('eigeneDichte');
    const preisElement = document.getElementById('eigenePreis');
    const verwendungElement = document.getElementById('eigeneVerwendung');
    
    if (!nameElement || !dichteElement) {
        console.error("Formularfelder nicht gefunden!");
        alert('Fehler: Formularfelder nicht gefunden.');
        return;
    }
    
    const name = nameElement.value;
    const hersteller = herstellerElement ? herstellerElement.value : '';
    const dichte = parseFloat(dichteElement.value);
    const preis = preisElement ? parseFloat(preisElement.value) : 0;
    const verwendung = verwendungElement ? verwendungElement.value : '';
    
    console.log("Eingabewerte:", { name, hersteller, dichte, preis, verwendung });
    
    if (!name || !dichte || isNaN(dichte)) {
        alert('Bitte geben Sie mindestens einen Namen und eine gültige Dichte an.');
        return;
    }
    
    const neueBetonsorte = {
        name: name,
        hersteller: hersteller || 'Nicht angegeben',
        dichte: dichte,
        preis: isNaN(preis) ? 0 : preis,
        verwendung: verwendung || 'Keine Angabe'
    };
    
    console.log("Neue Betonsorte:", neueBetonsorte);
    
    // Lokale Liste aktualisieren
    eigeneBetonsorten.push(neueBetonsorte);
    
    // In localStorage speichern
    speichereEigeneBetonsorten();
    console.log("Gespeicherte Betonsorten:", eigeneBetonsorten);
    
    // UI aktualisieren
    aktualisiereBetonsortenListe();
    erstelleBetonsortenTabelle();
    
    // Formular zurücksetzen
    document.getElementById('eigeneBetonsortForm').reset();
    
    // Erfolgsmeldung anzeigen
    const meldung = document.getElementById('erfolgsMeldung');
    meldung.textContent = `${name} wurde erfolgreich hinzugefügt!`;
    meldung.style.display = 'block';
    
    // Meldung nach 3 Sekunden ausblenden
    setTimeout(() => {
        meldung.style.display = 'none';
    }, 3000);
}

// Funktion zum Löschen einer Betonsorte
function loescheBetonsorte(index) {
    console.log("Löschen der Betonsorte mit Index:", index);
    
    if (confirm(`Möchten Sie "${eigeneBetonsorten[index].name}" wirklich löschen?`)) {
        eigeneBetonsorten.splice(index, 1);
        speichereEigeneBetonsorten();
        aktualisiereBetonsortenListe();
        erstelleBetonsortenTabelle();
    }
}

// Testfunktion zum direkten Hinzufügen einer Betonsorte
function testSpeichern() {
    console.log("Test-Speichern ausgeführt");
    
    const testBetonsorte = {
        name: "Test-Beton " + new Date().toLocaleTimeString(),
        hersteller: "Test-Hersteller",
        dichte: 2200,
        preis: 120,
        verwendung: "Nur zum Testen"
    };
    
    eigeneBetonsorten.push(testBetonsorte);
    speichereEigeneBetonsorten();
    aktualisiereBetonsortenListe();
    erstelleBetonsortenTabelle();
    
    alert("Test-Betonsorte wurde hinzugefügt!");
}

// Funktion zum Umschalten der Dichteeingabe
function toggleDichteEingabe() {
    const betonart = document.getElementById('betonart').value;
    const dichteContainer = document.getElementById('dichte-container');
    const festigkeitsklasseContainer = document.getElementById('festigkeitsklasse-container');
    
    if (betonart === 'custom') {
        dichteContainer.style.display = 'block';
        festigkeitsklasseContainer.style.display = 'none';
    } else if (betonart.startsWith('eigen_')) {
        dichteContainer.style.display = 'none';
        festigkeitsklasseContainer.style.display = 'none';
    } else {
        dichteContainer.style.display = 'none';
        festigkeitsklasseContainer.style.display = 'block';
    }
}

// Funktion zur Berechnung des Betons
function berechneBeton() {
    console.log("Starte Betonberechnung...");
    
    try {
        // Eingabewerte holen
        const laengeInput = document.getElementById('laenge');
        const breiteInput = document.getElementById('breite');
        const hoeheInput = document.getElementById('hoehe');
        const betonartSelect = document.getElementById('betonart');
        const preisInput = document.getElementById('preis');
        const herstellerInput = document.getElementById('hersteller');
        
        // Prüfen, ob alle Elemente existieren
        if (!laengeInput || !breiteInput || !hoeheInput || !betonartSelect) {
            console.error("Ein oder mehrere Eingabefelder wurden nicht gefunden!");
            alert("Fehler: Ein oder mehrere Eingabefelder konnten nicht gefunden werden.");
            return;
        }
        
        // Werte parsen
        const laenge = parseFloat(laengeInput.value);
        const breite = parseFloat(breiteInput.value);
        const hoehe = parseFloat(hoeheInput.value);
        const betonart = betonartSelect.value;
        const preisProM3 = preisInput ? (parseFloat(preisInput.value) || 0) : 0;
        const hersteller = herstellerInput ? (herstellerInput.value || '') : '';
        
        console.log("Eingabewerte:", { laenge, breite, hoehe, betonart, preisProM3, hersteller });
        
        // Überprüfen, ob alle notwendigen Werte eingegeben wurden
        if (isNaN(laenge) || isNaN(breite) || isNaN(hoehe) || laenge <= 0 || breite <= 0 || hoehe <= 0) {
            alert('Bitte geben Sie gültige Werte für Länge, Breite und Höhe ein.');
            return;
        }
        
        // Volumen berechnen
        const volumen = laenge * breite * hoehe;
        console.log("Berechnetes Volumen:", volumen);
        
        // Dichte bestimmen
        let dichte = 2400; // Standardwert für Standardbeton
        let betonartText = 'Standardbeton';
        const festigkeitsklasseSelect = document.getElementById('festigkeitsklasse');
        let festigkeitsklasse = festigkeitsklasseSelect ? festigkeitsklasseSelect.value : '';
        
        console.log("Betonart:", betonart);
        
        if (betonart === 'wasserdicht') {
            dichte = 2400;
            betonartText = 'Wasserdichter Beton';
        } else if (betonart === 'leicht_feuerfest') {
            dichte = 1000;
            betonartText = 'Leichter Feuerfestbeton';
            festigkeitsklasse = '';
        } else if (betonart === 'mittel_feuerfest') {
            dichte = 1500;
            betonartText = 'Mittelschwerer Feuerfestbeton';
            festigkeitsklasse = '';
        } else if (betonart === 'schwer_feuerfest') {
            dichte = 2000;
            betonartText = 'Schwerer Feuerfestbeton';
            festigkeitsklasse = '';
        } else if (betonart === 'custom') {
            const dichteInput = document.getElementById('dichte');
            if (!dichteInput) {
                console.error("Dichtefeld nicht gefunden!");
                alert("Fehler: Das Feld für die eigene Dichte wurde nicht gefunden.");
                return;
            }
            
            dichte = parseFloat(dichteInput.value);
            if (isNaN(dichte) || dichte <= 0) {
                alert('Bitte geben Sie eine gültige Dichte ein.');
                return;
            }
            betonartText = 'Eigene Dichte (Feuerfestbeton)';
            festigkeitsklasse = '';
        } else if (betonart.startsWith('eigen_')) {
            try {
                // Index der eigenen Betonsorte aus dem Wert extrahieren
                const index = parseInt(betonart.split('_')[1]);
                console.log("Eigene Betonsorte Index:", index, "Anzahl Betonsorten:", eigeneBetonsorten.length);
                
                if (index >= 0 && index < eigeneBetonsorten.length) {
                    const eigeneBetonsorte = eigeneBetonsorten[index];
                    console.log("Ausgewählte eigene Betonsorte:", eigeneBetonsorte);
                    
                    dichte = eigeneBetonsorte.dichte;
                    betonartText = `${eigeneBetonsorte.name} (${eigeneBetonsorte.hersteller})`;
                    festigkeitsklasse = '';
                    
                    // Wenn ein Preis für die eigene Betonsorte gespeichert ist und kein Preis eingegeben wurde
                    if (eigeneBetonsorte.preis > 0 && preisProM3 === 0 && preisInput) {
                        preisInput.value = eigeneBetonsorte.preis;
                    }
                } else {
                    console.error("Ungültiger Index für eigene Betonsorte:", index);
                    alert("Fehler: Die ausgewählte Betonsorte wurde nicht gefunden.");
                    return;
                }
            } catch (error) {
                console.error("Fehler beim Verarbeiten der eigenen Betonsorte:", error);
                alert("Fehler beim Verarbeiten der eigenen Betonsorte.");
                return;
            }
        }
        
        console.log("Verwendete Dichte:", dichte);
        
        // Gewicht berechnen
        const gewicht = volumen * dichte;
        
        // Preisberechnung
        const gesamtpreis = volumen * preisProM3;
        
        console.log("Berechnetes Gewicht:", gewicht);
        console.log("Berechneter Gesamtpreis:", gesamtpreis);
        
        // Ergebnis-Element suchen
        const ergebnisElement = document.getElementById('ergebnis');
        if (!ergebnisElement) {
            console.error("Ergebnis-Element nicht gefunden!");
            alert("Fehler: Das Ergebnis kann nicht angezeigt werden.");
            return;
        }
        
        // Ergebnis anzeigen
        let ergebnisText = `Berechnungsergebnis:
        
Volumen: ${volumen.toFixed(2)} m³
Gewicht: ${gewicht.toFixed(2)} kg (${(gewicht / 1000).toFixed(2)} Tonnen)

Betonart: ${betonartText}`;

        if (festigkeitsklasse) {
            ergebnisText += `
Festigkeitsklasse: ${festigkeitsklasse}`;
        }

        if (hersteller) {
            ergebnisText += `
Hersteller/Bezeichnung: ${hersteller}`;
        }

        if (preisProM3 > 0) {
            ergebnisText += `
            
Preis pro m³: ${preisProM3.toFixed(2)} €
Gesamtpreis: ${gesamtpreis.toFixed(2)} €`;
        }
        
        if (betonart.startsWith('eigen_')) {
            try {
                const index = parseInt(betonart.split('_')[1]);
                if (index >= 0 && index < eigeneBetonsorten.length) {
                    const eigeneBetonsorte = eigeneBetonsorten[index];
                    
                    if (eigeneBetonsorte.verwendung && eigeneBetonsorte.verwendung !== 'Keine Angabe') {
                        ergebnisText += `
                
Empfohlene Verwendung: ${eigeneBetonsorte.verwendung}`;
                    }
                }
            } catch (error) {
                console.error("Fehler beim Anzeigen der Verwendung:", error);
                // Kein Alert hier - nichtkritscher Fehler
            }
        }
        
        ergebnisElement.textContent = ergebnisText;
        console.log("Berechnung erfolgreich abgeschlossen");
        
    } catch (error) {
        console.error("Fehler bei der Betonberechnung:", error);
        alert("Bei der Berechnung ist ein Fehler aufgetreten. Bitte überprüfen Sie Ihre Eingaben.");
    }
}
