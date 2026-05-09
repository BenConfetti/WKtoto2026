# Conceptueel datamodel

## Competition

Opslag van één toernooi.

| Veld | Type | Opmerking |
| --- | --- | --- |
| `id` | string | unieke sleutel |
| `name` | string | bijvoorbeeld `WK 2026` |
| `predictionDeadline` | datetime | aftrap eerste wedstrijd |
| `timezone` | string | bijvoorbeeld `Europe/Amsterdam` |

## Match

| Veld | Type | Opmerking |
| --- | --- | --- |
| `id` | string | unieke sleutel |
| `competitionId` | string | relatie naar toernooi |
| `stage` | string | groepsfase, achtste finale, etc. |
| `sequence` | number | chronologische sorteervolgorde |
| `homeTeam` | string | land/team |
| `awayTeam` | string | land/team |
| `city` | string | speelstad |
| `kickoffAt` | datetime | datum en tijd |
| `status` | enum | gepland, bezig, afgelopen |
| `homeScore` | number nullable | uitslag |
| `awayScore` | number nullable | uitslag |

## Participant

| Veld | Type | Opmerking |
| --- | --- | --- |
| `id` | string | unieke sleutel |
| `name` | string | getoonde deelnemersnaam |
| `editToken` | string | geheime sleutel voor bewerken |
| `createdAt` | datetime | eerste opslag |
| `updatedAt` | datetime | laatste wijziging |

## MatchPrediction

| Veld | Type | Opmerking |
| --- | --- | --- |
| `id` | string | unieke sleutel |
| `participantId` | string | relatie naar deelnemer |
| `matchId` | string | relatie naar wedstrijd |
| `predictedHomeScore` | number | voorspelde thuisgoals |
| `predictedAwayScore` | number | voorspelde uitgoals |
| `savedAt` | datetime | laatste opslag |

## KnockoutRoundPrediction

| Veld | Type | Opmerking |
| --- | --- | --- |
| `id` | string | unieke sleutel |
| `participantId` | string | relatie naar deelnemer |
| `roundKey` | string | tweede-ronde, derde-ronde, kwartfinale, halve-finale, finale |
| `teamName` | string | voorspeld land |

## RuleSet

| Veld | Type | Opmerking |
| --- | --- | --- |
| `id` | string | unieke sleutel |
| `competitionId` | string | relatie naar toernooi |
| `exactScorePoints` | number | standaard 3 |
| `correctOutcomePoints` | number | standaard 1 |
| `secondRoundPoints` | number | standaard 2 |
| `thirdRoundPoints` | number | standaard 3 |
| `quarterFinalPoints` | number | standaard 4 |
| `semiFinalPoints` | number | standaard 6 |
| `finalPoints` | number | standaard 8 |

## ScoreEntry

Afgeleid model voor berekening of caching van scores.

| Veld | Type | Opmerking |
| --- | --- | --- |
| `participantId` | string | relatie naar deelnemer |
| `category` | string | wedstrijd of knock-out |
| `sourceId` | string | match of ronde |
| `points` | number | behaalde punten |
