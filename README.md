# WK Toto MVP

Dit project is de eerste basis voor een WK-toto website waar deelnemers hun voorspellingen kunnen invullen en een live stand kunnen volgen.

## MVP-doel

De eerste versie richt zich op:

- een publieke invoerpagina voor voorspellingen
- een publieke standenpagina
- een afgeschermde admin-pagina voor regels en beheer
- opslag van half ingevulde voorspellingen
- bewerken via een persoonlijke bewerk-link

## Beslissingen tot nu toe

- Geen accounts in de eerste versie
- Deelnemers vullen alleen hun naam en voorspellingen in
- Een half ingevuld formulier moet opgeslagen blijven
- Bewerken gebeurt via een persoonlijke bewerk-link
- Alleen de beheerder heeft toegang tot admin
- Deelnemers mogen voorspellingen invullen of aanpassen tot de aftrap van de eerste WK-wedstrijd
- Knock-out bonuspunten gaan op basis van juist voorspelde landen per ronde

## Knock-out puntentelling

- Tweede ronde: 2 punten
- Derde ronde: 3 punten
- Kwartfinale: 4 punten
- Halve finale: 6 punten
- Finale: 8 punten

## Wedstrijdpuntentelling

- Exacte uitslag goed: 3 punten
- Juiste winnaar, maar niet de exacte uitslag: 1 punt
- Juist gelijkspel, maar niet de exacte uitslag: 1 punt

## Structuur

- `docs/requirements.md`: functionele scope van de MVP
- `docs/data-model.md`: conceptueel datamodel
- `prototype/`: eenvoudige statische prototype-schermen
- `server.js`: dependency-vrije Node server
- `public/`: echte MVP-pagina's en frontend-logica
- `data/`: JSON-opslag voor wedstrijden, deelnemers en regels

## Lokaal starten

Gebruik in deze omgeving:

- `.\start.cmd`

Alternatief in PowerShell:

- `powershell -ExecutionPolicy Bypass -File .\run-server.ps1`

Daarna draait de app op:

- `http://localhost:3000`

## Admin-login

De admin-pagina gebruikt voorlopig een wachtwoord uit de environment variable `ADMIN_PASSWORD`.

Als die niet is gezet, gebruikt de MVP standaard:

- `verander-mij`

Zet dit dus om voordat je de app echt gebruikt.

## Volgende technische stap

De basis draait nu al zonder packages. Hierna kunnen we door naar:

- echte WK-wedstrijden importeren
- admin-beheer voor uitslagen en knock-out uitkomsten
- overstap van JSON-opslag naar SQLite
- echte authenticatie en productie-hosting
