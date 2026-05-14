const rounds = [
  { key: "secondRound", label: "Tweede ronde", pageKey: "tweede-ronde", pointsKey: "secondRoundPoints", slots: 32 },
  { key: "thirdRound", label: "Derde ronde", pageKey: "derde-ronde", pointsKey: "thirdRoundPoints", slots: 16 },
  { key: "quarterFinal", label: "Kwartfinale", pageKey: "finalerondes", pointsKey: "quarterFinalPoints", slots: 8 },
  { key: "semiFinal", label: "Halve finale", pageKey: "finalerondes", pointsKey: "semiFinalPoints", slots: 4 },
  { key: "final", label: "Finale", pageKey: "finalerondes", pointsKey: "finalPoints", slots: 2 },
];

const AFRICAN_TEAMS = [
  "Algerije",
  "DR Congo",
  "Egypte",
  "Ghana",
  "Ivoorkust",
  "Kaapverdie",
  "Marokko",
  "Senegal",
  "Tunesië",
  "Zuid-Afrika",
];

const ASIAN_TEAMS = [
  "Irak",
  "Iran",
  "Japan",
  "Jordanië",
  "Oezbekistan",
  "Qatar",
  "Saoedi-Arabië",
  "Zuid-Korea",
];

const CENTRAL_AMERICAN_TEAMS = [
  "Curaçao",
  "Haïti",
  "Panama",
];

const HOST_TEAMS = [
  "Canada",
  "VS",
  "Mexico",
];
const HOST_TEAM_ALIASES = {
  VS: "Verenigde Staten",
};

const THIRD_PLACE_ASSIGNMENT_COLUMNS = ["1A", "1B", "1D", "1E", "1G", "1I", "1K", "1L"];
const THIRD_PLACE_ASSIGNMENTS = {
  "EFGHIJKL": [
    "E",
    "J",
    "I",
    "F",
    "H",
    "G",
    "L",
    "K"
  ],
  "DFGHIJKL": [
    "H",
    "G",
    "I",
    "D",
    "J",
    "F",
    "L",
    "K"
  ],
  "DEGHIJKL": [
    "E",
    "J",
    "I",
    "D",
    "H",
    "G",
    "L",
    "K"
  ],
  "DEFHIJKL": [
    "E",
    "J",
    "I",
    "D",
    "H",
    "F",
    "L",
    "K"
  ],
  "DEFGIJKL": [
    "E",
    "G",
    "I",
    "D",
    "J",
    "F",
    "L",
    "K"
  ],
  "DEFGHJKL": [
    "E",
    "G",
    "J",
    "D",
    "H",
    "F",
    "L",
    "K"
  ],
  "DEFGHIKL": [
    "E",
    "G",
    "I",
    "D",
    "H",
    "F",
    "L",
    "K"
  ],
  "DEFGHIJL": [
    "E",
    "G",
    "J",
    "D",
    "H",
    "F",
    "L",
    "I"
  ],
  "DEFGHIJK": [
    "E",
    "G",
    "J",
    "D",
    "H",
    "F",
    "I",
    "K"
  ],
  "CFGHIJKL": [
    "H",
    "G",
    "I",
    "C",
    "J",
    "F",
    "L",
    "K"
  ],
  "CEGHIJKL": [
    "E",
    "J",
    "I",
    "C",
    "H",
    "G",
    "L",
    "K"
  ],
  "CEFHIJKL": [
    "E",
    "J",
    "I",
    "C",
    "H",
    "F",
    "L",
    "K"
  ],
  "CEFGIJKL": [
    "E",
    "G",
    "I",
    "C",
    "J",
    "F",
    "L",
    "K"
  ],
  "CEFGHJKL": [
    "E",
    "G",
    "J",
    "C",
    "H",
    "F",
    "L",
    "K"
  ],
  "CEFGHIKL": [
    "E",
    "G",
    "I",
    "C",
    "H",
    "F",
    "L",
    "K"
  ],
  "CEFGHIJL": [
    "E",
    "G",
    "J",
    "C",
    "H",
    "F",
    "L",
    "I"
  ],
  "CEFGHIJK": [
    "E",
    "G",
    "J",
    "C",
    "H",
    "F",
    "I",
    "K"
  ],
  "CDGHIJKL": [
    "H",
    "G",
    "I",
    "C",
    "J",
    "D",
    "L",
    "K"
  ],
  "CDFHIJKL": [
    "C",
    "J",
    "I",
    "D",
    "H",
    "F",
    "L",
    "K"
  ],
  "CDFGIJKL": [
    "C",
    "G",
    "I",
    "D",
    "J",
    "F",
    "L",
    "K"
  ],
  "CDFGHJKL": [
    "C",
    "G",
    "J",
    "D",
    "H",
    "F",
    "L",
    "K"
  ],
  "CDFGHIKL": [
    "C",
    "G",
    "I",
    "D",
    "H",
    "F",
    "L",
    "K"
  ],
  "CDFGHIJL": [
    "C",
    "G",
    "J",
    "D",
    "H",
    "F",
    "L",
    "I"
  ],
  "CDFGHIJK": [
    "C",
    "G",
    "J",
    "D",
    "H",
    "F",
    "I",
    "K"
  ],
  "CDEHIJKL": [
    "E",
    "J",
    "I",
    "C",
    "H",
    "D",
    "L",
    "K"
  ],
  "CDEGIJKL": [
    "E",
    "G",
    "I",
    "C",
    "J",
    "D",
    "L",
    "K"
  ],
  "CDEGHJKL": [
    "E",
    "G",
    "J",
    "C",
    "H",
    "D",
    "L",
    "K"
  ],
  "CDEGHIKL": [
    "E",
    "G",
    "I",
    "C",
    "H",
    "D",
    "L",
    "K"
  ],
  "CDEGHIJL": [
    "E",
    "G",
    "J",
    "C",
    "H",
    "D",
    "L",
    "I"
  ],
  "CDEGHIJK": [
    "E",
    "G",
    "J",
    "C",
    "H",
    "D",
    "I",
    "K"
  ],
  "CDEFIJKL": [
    "C",
    "J",
    "E",
    "D",
    "I",
    "F",
    "L",
    "K"
  ],
  "CDEFHJKL": [
    "C",
    "J",
    "E",
    "D",
    "H",
    "F",
    "L",
    "K"
  ],
  "CDEFHIKL": [
    "C",
    "E",
    "I",
    "D",
    "H",
    "F",
    "L",
    "K"
  ],
  "CDEFHIJL": [
    "C",
    "J",
    "E",
    "D",
    "H",
    "F",
    "L",
    "I"
  ],
  "CDEFHIJK": [
    "C",
    "J",
    "E",
    "D",
    "H",
    "F",
    "I",
    "K"
  ],
  "CDEFGJKL": [
    "C",
    "G",
    "E",
    "D",
    "J",
    "F",
    "L",
    "K"
  ],
  "CDEFGIKL": [
    "C",
    "G",
    "E",
    "D",
    "I",
    "F",
    "L",
    "K"
  ],
  "CDEFGIJL": [
    "C",
    "G",
    "E",
    "D",
    "J",
    "F",
    "L",
    "I"
  ],
  "CDEFGIJK": [
    "C",
    "G",
    "E",
    "D",
    "J",
    "F",
    "I",
    "K"
  ],
  "CDEFGHKL": [
    "C",
    "G",
    "E",
    "D",
    "H",
    "F",
    "L",
    "K"
  ],
  "CDEFGHJL": [
    "C",
    "G",
    "J",
    "D",
    "H",
    "F",
    "L",
    "E"
  ],
  "CDEFGHJK": [
    "C",
    "G",
    "J",
    "D",
    "H",
    "F",
    "E",
    "K"
  ],
  "CDEFGHIL": [
    "C",
    "G",
    "E",
    "D",
    "H",
    "F",
    "L",
    "I"
  ],
  "CDEFGHIK": [
    "C",
    "G",
    "E",
    "D",
    "H",
    "F",
    "I",
    "K"
  ],
  "CDEFGHIJ": [
    "C",
    "G",
    "J",
    "D",
    "H",
    "F",
    "E",
    "I"
  ],
  "BFGHIJKL": [
    "H",
    "J",
    "B",
    "F",
    "I",
    "G",
    "L",
    "K"
  ],
  "BEGHIJKL": [
    "E",
    "J",
    "I",
    "B",
    "H",
    "G",
    "L",
    "K"
  ],
  "BEFHIJKL": [
    "E",
    "J",
    "B",
    "F",
    "I",
    "H",
    "L",
    "K"
  ],
  "BEFGIJKL": [
    "E",
    "J",
    "B",
    "F",
    "I",
    "G",
    "L",
    "K"
  ],
  "BEFGHJKL": [
    "E",
    "J",
    "B",
    "F",
    "H",
    "G",
    "L",
    "K"
  ],
  "BEFGHIKL": [
    "E",
    "G",
    "B",
    "F",
    "I",
    "H",
    "L",
    "K"
  ],
  "BEFGHIJL": [
    "E",
    "J",
    "B",
    "F",
    "H",
    "G",
    "L",
    "I"
  ],
  "BEFGHIJK": [
    "E",
    "J",
    "B",
    "F",
    "H",
    "G",
    "I",
    "K"
  ],
  "BDGHIJKL": [
    "H",
    "J",
    "B",
    "D",
    "I",
    "G",
    "L",
    "K"
  ],
  "BDFHIJKL": [
    "H",
    "J",
    "B",
    "D",
    "I",
    "F",
    "L",
    "K"
  ],
  "BDFGIJKL": [
    "I",
    "G",
    "B",
    "D",
    "J",
    "F",
    "L",
    "K"
  ],
  "BDFGHJKL": [
    "H",
    "G",
    "B",
    "D",
    "J",
    "F",
    "L",
    "K"
  ],
  "BDFGHIKL": [
    "H",
    "G",
    "B",
    "D",
    "I",
    "F",
    "L",
    "K"
  ],
  "BDFGHIJL": [
    "H",
    "G",
    "B",
    "D",
    "J",
    "F",
    "L",
    "I"
  ],
  "BDFGHIJK": [
    "H",
    "G",
    "B",
    "D",
    "J",
    "F",
    "I",
    "K"
  ],
  "BDEHIJKL": [
    "E",
    "J",
    "B",
    "D",
    "I",
    "H",
    "L",
    "K"
  ],
  "BDEGIJKL": [
    "E",
    "J",
    "B",
    "D",
    "I",
    "G",
    "L",
    "K"
  ],
  "BDEGHJKL": [
    "E",
    "J",
    "B",
    "D",
    "H",
    "G",
    "L",
    "K"
  ],
  "BDEGHIKL": [
    "E",
    "G",
    "B",
    "D",
    "I",
    "H",
    "L",
    "K"
  ],
  "BDEGHIJL": [
    "E",
    "J",
    "B",
    "D",
    "H",
    "G",
    "L",
    "I"
  ],
  "BDEGHIJK": [
    "E",
    "J",
    "B",
    "D",
    "H",
    "G",
    "I",
    "K"
  ],
  "BDEFIJKL": [
    "E",
    "J",
    "B",
    "D",
    "I",
    "F",
    "L",
    "K"
  ],
  "BDEFHJKL": [
    "E",
    "J",
    "B",
    "D",
    "H",
    "F",
    "L",
    "K"
  ],
  "BDEFHIKL": [
    "E",
    "I",
    "B",
    "D",
    "H",
    "F",
    "L",
    "K"
  ],
  "BDEFHIJL": [
    "E",
    "J",
    "B",
    "D",
    "H",
    "F",
    "L",
    "I"
  ],
  "BDEFHIJK": [
    "E",
    "J",
    "B",
    "D",
    "H",
    "F",
    "I",
    "K"
  ],
  "BDEFGJKL": [
    "E",
    "G",
    "B",
    "D",
    "J",
    "F",
    "L",
    "K"
  ],
  "BDEFGIKL": [
    "E",
    "G",
    "B",
    "D",
    "I",
    "F",
    "L",
    "K"
  ],
  "BDEFGIJL": [
    "E",
    "G",
    "B",
    "D",
    "J",
    "F",
    "L",
    "I"
  ],
  "BDEFGIJK": [
    "E",
    "G",
    "B",
    "D",
    "J",
    "F",
    "I",
    "K"
  ],
  "BDEFGHKL": [
    "E",
    "G",
    "B",
    "D",
    "H",
    "F",
    "L",
    "K"
  ],
  "BDEFGHJL": [
    "H",
    "G",
    "B",
    "D",
    "J",
    "F",
    "L",
    "E"
  ],
  "BDEFGHJK": [
    "H",
    "G",
    "B",
    "D",
    "J",
    "F",
    "E",
    "K"
  ],
  "BDEFGHIL": [
    "E",
    "G",
    "B",
    "D",
    "H",
    "F",
    "L",
    "I"
  ],
  "BDEFGHIK": [
    "E",
    "G",
    "B",
    "D",
    "H",
    "F",
    "I",
    "K"
  ],
  "BDEFGHIJ": [
    "H",
    "G",
    "B",
    "D",
    "J",
    "F",
    "E",
    "I"
  ],
  "BCGHIJKL": [
    "H",
    "J",
    "B",
    "C",
    "I",
    "G",
    "L",
    "K"
  ],
  "BCFHIJKL": [
    "H",
    "J",
    "B",
    "C",
    "I",
    "F",
    "L",
    "K"
  ],
  "BCFGIJKL": [
    "I",
    "G",
    "B",
    "C",
    "J",
    "F",
    "L",
    "K"
  ],
  "BCFGHJKL": [
    "H",
    "G",
    "B",
    "C",
    "J",
    "F",
    "L",
    "K"
  ],
  "BCFGHIKL": [
    "H",
    "G",
    "B",
    "C",
    "I",
    "F",
    "L",
    "K"
  ],
  "BCFGHIJL": [
    "H",
    "G",
    "B",
    "C",
    "J",
    "F",
    "L",
    "I"
  ],
  "BCFGHIJK": [
    "H",
    "G",
    "B",
    "C",
    "J",
    "F",
    "I",
    "K"
  ],
  "BCEHIJKL": [
    "E",
    "J",
    "B",
    "C",
    "I",
    "H",
    "L",
    "K"
  ],
  "BCEGIJKL": [
    "E",
    "J",
    "B",
    "C",
    "I",
    "G",
    "L",
    "K"
  ],
  "BCEGHJKL": [
    "E",
    "J",
    "B",
    "C",
    "H",
    "G",
    "L",
    "K"
  ],
  "BCEGHIKL": [
    "E",
    "G",
    "B",
    "C",
    "I",
    "H",
    "L",
    "K"
  ],
  "BCEGHIJL": [
    "E",
    "J",
    "B",
    "C",
    "H",
    "G",
    "L",
    "I"
  ],
  "BCEGHIJK": [
    "E",
    "J",
    "B",
    "C",
    "H",
    "G",
    "I",
    "K"
  ],
  "BCEFIJKL": [
    "E",
    "J",
    "B",
    "C",
    "I",
    "F",
    "L",
    "K"
  ],
  "BCEFHJKL": [
    "E",
    "J",
    "B",
    "C",
    "H",
    "F",
    "L",
    "K"
  ],
  "BCEFHIKL": [
    "E",
    "I",
    "B",
    "C",
    "H",
    "F",
    "L",
    "K"
  ],
  "BCEFHIJL": [
    "E",
    "J",
    "B",
    "C",
    "H",
    "F",
    "L",
    "I"
  ],
  "BCEFHIJK": [
    "E",
    "J",
    "B",
    "C",
    "H",
    "F",
    "I",
    "K"
  ],
  "BCEFGJKL": [
    "E",
    "G",
    "B",
    "C",
    "J",
    "F",
    "L",
    "K"
  ],
  "BCEFGIKL": [
    "E",
    "G",
    "B",
    "C",
    "I",
    "F",
    "L",
    "K"
  ],
  "BCEFGIJL": [
    "E",
    "G",
    "B",
    "C",
    "J",
    "F",
    "L",
    "I"
  ],
  "BCEFGIJK": [
    "E",
    "G",
    "B",
    "C",
    "J",
    "F",
    "I",
    "K"
  ],
  "BCEFGHKL": [
    "E",
    "G",
    "B",
    "C",
    "H",
    "F",
    "L",
    "K"
  ],
  "BCEFGHJL": [
    "H",
    "G",
    "B",
    "C",
    "J",
    "F",
    "L",
    "E"
  ],
  "BCEFGHJK": [
    "H",
    "G",
    "B",
    "C",
    "J",
    "F",
    "E",
    "K"
  ],
  "BCEFGHIL": [
    "E",
    "G",
    "B",
    "C",
    "H",
    "F",
    "L",
    "I"
  ],
  "BCEFGHIK": [
    "E",
    "G",
    "B",
    "C",
    "H",
    "F",
    "I",
    "K"
  ],
  "BCEFGHIJ": [
    "H",
    "G",
    "B",
    "C",
    "J",
    "F",
    "E",
    "I"
  ],
  "BCDHIJKL": [
    "H",
    "J",
    "B",
    "C",
    "I",
    "D",
    "L",
    "K"
  ],
  "BCDGIJKL": [
    "I",
    "G",
    "B",
    "C",
    "J",
    "D",
    "L",
    "K"
  ],
  "BCDGHJKL": [
    "H",
    "G",
    "B",
    "C",
    "J",
    "D",
    "L",
    "K"
  ],
  "BCDGHIKL": [
    "H",
    "G",
    "B",
    "C",
    "I",
    "D",
    "L",
    "K"
  ],
  "BCDGHIJL": [
    "H",
    "G",
    "B",
    "C",
    "J",
    "D",
    "L",
    "I"
  ],
  "BCDGHIJK": [
    "H",
    "G",
    "B",
    "C",
    "J",
    "D",
    "I",
    "K"
  ],
  "BCDFIJKL": [
    "C",
    "J",
    "B",
    "D",
    "I",
    "F",
    "L",
    "K"
  ],
  "BCDFHJKL": [
    "C",
    "J",
    "B",
    "D",
    "H",
    "F",
    "L",
    "K"
  ],
  "BCDFHIKL": [
    "C",
    "I",
    "B",
    "D",
    "H",
    "F",
    "L",
    "K"
  ],
  "BCDFHIJL": [
    "C",
    "J",
    "B",
    "D",
    "H",
    "F",
    "L",
    "I"
  ],
  "BCDFHIJK": [
    "C",
    "J",
    "B",
    "D",
    "H",
    "F",
    "I",
    "K"
  ],
  "BCDFGJKL": [
    "C",
    "G",
    "B",
    "D",
    "J",
    "F",
    "L",
    "K"
  ],
  "BCDFGIKL": [
    "C",
    "G",
    "B",
    "D",
    "I",
    "F",
    "L",
    "K"
  ],
  "BCDFGIJL": [
    "C",
    "G",
    "B",
    "D",
    "J",
    "F",
    "L",
    "I"
  ],
  "BCDFGIJK": [
    "C",
    "G",
    "B",
    "D",
    "J",
    "F",
    "I",
    "K"
  ],
  "BCDFGHKL": [
    "C",
    "G",
    "B",
    "D",
    "H",
    "F",
    "L",
    "K"
  ],
  "BCDFGHJL": [
    "C",
    "G",
    "B",
    "D",
    "H",
    "F",
    "L",
    "J"
  ],
  "BCDFGHJK": [
    "H",
    "G",
    "B",
    "C",
    "J",
    "F",
    "D",
    "K"
  ],
  "BCDFGHIL": [
    "C",
    "G",
    "B",
    "D",
    "H",
    "F",
    "L",
    "I"
  ],
  "BCDFGHIK": [
    "C",
    "G",
    "B",
    "D",
    "H",
    "F",
    "I",
    "K"
  ],
  "BCDFGHIJ": [
    "H",
    "G",
    "B",
    "C",
    "J",
    "F",
    "D",
    "I"
  ],
  "BCDEIJKL": [
    "E",
    "J",
    "B",
    "C",
    "I",
    "D",
    "L",
    "K"
  ],
  "BCDEHJKL": [
    "E",
    "J",
    "B",
    "C",
    "H",
    "D",
    "L",
    "K"
  ],
  "BCDEHIKL": [
    "E",
    "I",
    "B",
    "C",
    "H",
    "D",
    "L",
    "K"
  ],
  "BCDEHIJL": [
    "E",
    "J",
    "B",
    "C",
    "H",
    "D",
    "L",
    "I"
  ],
  "BCDEHIJK": [
    "E",
    "J",
    "B",
    "C",
    "H",
    "D",
    "I",
    "K"
  ],
  "BCDEGJKL": [
    "E",
    "G",
    "B",
    "C",
    "J",
    "D",
    "L",
    "K"
  ],
  "BCDEGIKL": [
    "E",
    "G",
    "B",
    "C",
    "I",
    "D",
    "L",
    "K"
  ],
  "BCDEGIJL": [
    "E",
    "G",
    "B",
    "C",
    "J",
    "D",
    "L",
    "I"
  ],
  "BCDEGIJK": [
    "E",
    "G",
    "B",
    "C",
    "J",
    "D",
    "I",
    "K"
  ],
  "BCDEGHKL": [
    "E",
    "G",
    "B",
    "C",
    "H",
    "D",
    "L",
    "K"
  ],
  "BCDEGHJL": [
    "H",
    "G",
    "B",
    "C",
    "J",
    "D",
    "L",
    "E"
  ],
  "BCDEGHJK": [
    "H",
    "G",
    "B",
    "C",
    "J",
    "D",
    "E",
    "K"
  ],
  "BCDEGHIL": [
    "E",
    "G",
    "B",
    "C",
    "H",
    "D",
    "L",
    "I"
  ],
  "BCDEGHIK": [
    "E",
    "G",
    "B",
    "C",
    "H",
    "D",
    "I",
    "K"
  ],
  "BCDEGHIJ": [
    "H",
    "G",
    "B",
    "C",
    "J",
    "D",
    "E",
    "I"
  ],
  "BCDEFJKL": [
    "C",
    "J",
    "B",
    "D",
    "E",
    "F",
    "L",
    "K"
  ],
  "BCDEFIKL": [
    "C",
    "E",
    "B",
    "D",
    "I",
    "F",
    "L",
    "K"
  ],
  "BCDEFIJL": [
    "C",
    "J",
    "B",
    "D",
    "E",
    "F",
    "L",
    "I"
  ],
  "BCDEFIJK": [
    "C",
    "J",
    "B",
    "D",
    "E",
    "F",
    "I",
    "K"
  ],
  "BCDEFHKL": [
    "C",
    "E",
    "B",
    "D",
    "H",
    "F",
    "L",
    "K"
  ],
  "BCDEFHJL": [
    "C",
    "J",
    "B",
    "D",
    "H",
    "F",
    "L",
    "E"
  ],
  "BCDEFHJK": [
    "C",
    "J",
    "B",
    "D",
    "H",
    "F",
    "E",
    "K"
  ],
  "BCDEFHIL": [
    "C",
    "E",
    "B",
    "D",
    "H",
    "F",
    "L",
    "I"
  ],
  "BCDEFHIK": [
    "C",
    "E",
    "B",
    "D",
    "H",
    "F",
    "I",
    "K"
  ],
  "BCDEFHIJ": [
    "C",
    "J",
    "B",
    "D",
    "H",
    "F",
    "E",
    "I"
  ],
  "BCDEFGKL": [
    "C",
    "G",
    "B",
    "D",
    "E",
    "F",
    "L",
    "K"
  ],
  "BCDEFGJL": [
    "C",
    "G",
    "B",
    "D",
    "J",
    "F",
    "L",
    "E"
  ],
  "BCDEFGJK": [
    "C",
    "G",
    "B",
    "D",
    "J",
    "F",
    "E",
    "K"
  ],
  "BCDEFGIL": [
    "C",
    "G",
    "B",
    "D",
    "E",
    "F",
    "L",
    "I"
  ],
  "BCDEFGIK": [
    "C",
    "G",
    "B",
    "D",
    "E",
    "F",
    "I",
    "K"
  ],
  "BCDEFGIJ": [
    "C",
    "G",
    "B",
    "D",
    "J",
    "F",
    "E",
    "I"
  ],
  "BCDEFGHL": [
    "C",
    "G",
    "B",
    "D",
    "H",
    "F",
    "L",
    "E"
  ],
  "BCDEFGHK": [
    "C",
    "G",
    "B",
    "D",
    "H",
    "F",
    "E",
    "K"
  ],
  "BCDEFGHJ": [
    "H",
    "G",
    "B",
    "C",
    "J",
    "F",
    "D",
    "E"
  ],
  "BCDEFGHI": [
    "C",
    "G",
    "B",
    "D",
    "H",
    "F",
    "E",
    "I"
  ],
  "AFGHIJKL": [
    "H",
    "J",
    "I",
    "F",
    "A",
    "G",
    "L",
    "K"
  ],
  "AEGHIJKL": [
    "E",
    "J",
    "I",
    "A",
    "H",
    "G",
    "L",
    "K"
  ],
  "AEFHIJKL": [
    "E",
    "J",
    "I",
    "F",
    "A",
    "H",
    "L",
    "K"
  ],
  "AEFGIJKL": [
    "E",
    "J",
    "I",
    "F",
    "A",
    "G",
    "L",
    "K"
  ],
  "AEFGHJKL": [
    "E",
    "G",
    "J",
    "F",
    "A",
    "H",
    "L",
    "K"
  ],
  "AEFGHIKL": [
    "E",
    "G",
    "I",
    "F",
    "A",
    "H",
    "L",
    "K"
  ],
  "AEFGHIJL": [
    "E",
    "G",
    "J",
    "F",
    "A",
    "H",
    "L",
    "I"
  ],
  "AEFGHIJK": [
    "E",
    "G",
    "J",
    "F",
    "A",
    "H",
    "I",
    "K"
  ],
  "ADGHIJKL": [
    "H",
    "J",
    "I",
    "D",
    "A",
    "G",
    "L",
    "K"
  ],
  "ADFHIJKL": [
    "H",
    "J",
    "I",
    "D",
    "A",
    "F",
    "L",
    "K"
  ],
  "ADFGIJKL": [
    "I",
    "G",
    "J",
    "D",
    "A",
    "F",
    "L",
    "K"
  ],
  "ADFGHJKL": [
    "H",
    "G",
    "J",
    "D",
    "A",
    "F",
    "L",
    "K"
  ],
  "ADFGHIKL": [
    "H",
    "G",
    "I",
    "D",
    "A",
    "F",
    "L",
    "K"
  ],
  "ADFGHIJL": [
    "H",
    "G",
    "J",
    "D",
    "A",
    "F",
    "L",
    "I"
  ],
  "ADFGHIJK": [
    "H",
    "G",
    "J",
    "D",
    "A",
    "F",
    "I",
    "K"
  ],
  "ADEHIJKL": [
    "E",
    "J",
    "I",
    "D",
    "A",
    "H",
    "L",
    "K"
  ],
  "ADEGIJKL": [
    "E",
    "J",
    "I",
    "D",
    "A",
    "G",
    "L",
    "K"
  ],
  "ADEGHJKL": [
    "E",
    "G",
    "J",
    "D",
    "A",
    "H",
    "L",
    "K"
  ],
  "ADEGHIKL": [
    "E",
    "G",
    "I",
    "D",
    "A",
    "H",
    "L",
    "K"
  ],
  "ADEGHIJL": [
    "E",
    "G",
    "J",
    "D",
    "A",
    "H",
    "L",
    "I"
  ],
  "ADEGHIJK": [
    "E",
    "G",
    "J",
    "D",
    "A",
    "H",
    "I",
    "K"
  ],
  "ADEFIJKL": [
    "E",
    "J",
    "I",
    "D",
    "A",
    "F",
    "L",
    "K"
  ],
  "ADEFHJKL": [
    "H",
    "J",
    "E",
    "D",
    "A",
    "F",
    "L",
    "K"
  ],
  "ADEFHIKL": [
    "H",
    "E",
    "I",
    "D",
    "A",
    "F",
    "L",
    "K"
  ],
  "ADEFHIJL": [
    "H",
    "J",
    "E",
    "D",
    "A",
    "F",
    "L",
    "I"
  ],
  "ADEFHIJK": [
    "H",
    "J",
    "E",
    "D",
    "A",
    "F",
    "I",
    "K"
  ],
  "ADEFGJKL": [
    "E",
    "G",
    "J",
    "D",
    "A",
    "F",
    "L",
    "K"
  ],
  "ADEFGIKL": [
    "E",
    "G",
    "I",
    "D",
    "A",
    "F",
    "L",
    "K"
  ],
  "ADEFGIJL": [
    "E",
    "G",
    "J",
    "D",
    "A",
    "F",
    "L",
    "I"
  ],
  "ADEFGIJK": [
    "E",
    "G",
    "J",
    "D",
    "A",
    "F",
    "I",
    "K"
  ],
  "ADEFGHKL": [
    "H",
    "G",
    "E",
    "D",
    "A",
    "F",
    "L",
    "K"
  ],
  "ADEFGHJL": [
    "H",
    "G",
    "J",
    "D",
    "A",
    "F",
    "L",
    "E"
  ],
  "ADEFGHJK": [
    "H",
    "G",
    "J",
    "D",
    "A",
    "F",
    "E",
    "K"
  ],
  "ADEFGHIL": [
    "H",
    "G",
    "E",
    "D",
    "A",
    "F",
    "L",
    "I"
  ],
  "ADEFGHIK": [
    "H",
    "G",
    "E",
    "D",
    "A",
    "F",
    "I",
    "K"
  ],
  "ADEFGHIJ": [
    "H",
    "G",
    "J",
    "D",
    "A",
    "F",
    "E",
    "I"
  ],
  "ACGHIJKL": [
    "H",
    "J",
    "I",
    "C",
    "A",
    "G",
    "L",
    "K"
  ],
  "ACFHIJKL": [
    "H",
    "J",
    "I",
    "C",
    "A",
    "F",
    "L",
    "K"
  ],
  "ACFGIJKL": [
    "I",
    "G",
    "J",
    "C",
    "A",
    "F",
    "L",
    "K"
  ],
  "ACFGHJKL": [
    "H",
    "G",
    "J",
    "C",
    "A",
    "F",
    "L",
    "K"
  ],
  "ACFGHIKL": [
    "H",
    "G",
    "I",
    "C",
    "A",
    "F",
    "L",
    "K"
  ],
  "ACFGHIJL": [
    "H",
    "G",
    "J",
    "C",
    "A",
    "F",
    "L",
    "I"
  ],
  "ACFGHIJK": [
    "H",
    "G",
    "J",
    "C",
    "A",
    "F",
    "I",
    "K"
  ],
  "ACEHIJKL": [
    "E",
    "J",
    "I",
    "C",
    "A",
    "H",
    "L",
    "K"
  ],
  "ACEGIJKL": [
    "E",
    "J",
    "I",
    "C",
    "A",
    "G",
    "L",
    "K"
  ],
  "ACEGHJKL": [
    "E",
    "G",
    "J",
    "C",
    "A",
    "H",
    "L",
    "K"
  ],
  "ACEGHIKL": [
    "E",
    "G",
    "I",
    "C",
    "A",
    "H",
    "L",
    "K"
  ],
  "ACEGHIJL": [
    "E",
    "G",
    "J",
    "C",
    "A",
    "H",
    "L",
    "I"
  ],
  "ACEGHIJK": [
    "E",
    "G",
    "J",
    "C",
    "A",
    "H",
    "I",
    "K"
  ],
  "ACEFIJKL": [
    "E",
    "J",
    "I",
    "C",
    "A",
    "F",
    "L",
    "K"
  ],
  "ACEFHJKL": [
    "H",
    "J",
    "E",
    "C",
    "A",
    "F",
    "L",
    "K"
  ],
  "ACEFHIKL": [
    "H",
    "E",
    "I",
    "C",
    "A",
    "F",
    "L",
    "K"
  ],
  "ACEFHIJL": [
    "H",
    "J",
    "E",
    "C",
    "A",
    "F",
    "L",
    "I"
  ],
  "ACEFHIJK": [
    "H",
    "J",
    "E",
    "C",
    "A",
    "F",
    "I",
    "K"
  ],
  "ACEFGJKL": [
    "E",
    "G",
    "J",
    "C",
    "A",
    "F",
    "L",
    "K"
  ],
  "ACEFGIKL": [
    "E",
    "G",
    "I",
    "C",
    "A",
    "F",
    "L",
    "K"
  ],
  "ACEFGIJL": [
    "E",
    "G",
    "J",
    "C",
    "A",
    "F",
    "L",
    "I"
  ],
  "ACEFGIJK": [
    "E",
    "G",
    "J",
    "C",
    "A",
    "F",
    "I",
    "K"
  ],
  "ACEFGHKL": [
    "H",
    "G",
    "E",
    "C",
    "A",
    "F",
    "L",
    "K"
  ],
  "ACEFGHJL": [
    "H",
    "G",
    "J",
    "C",
    "A",
    "F",
    "L",
    "E"
  ],
  "ACEFGHJK": [
    "H",
    "G",
    "J",
    "C",
    "A",
    "F",
    "E",
    "K"
  ],
  "ACEFGHIL": [
    "H",
    "G",
    "E",
    "C",
    "A",
    "F",
    "L",
    "I"
  ],
  "ACEFGHIK": [
    "H",
    "G",
    "E",
    "C",
    "A",
    "F",
    "I",
    "K"
  ],
  "ACEFGHIJ": [
    "H",
    "G",
    "J",
    "C",
    "A",
    "F",
    "E",
    "I"
  ],
  "ACDHIJKL": [
    "H",
    "J",
    "I",
    "C",
    "A",
    "D",
    "L",
    "K"
  ],
  "ACDGIJKL": [
    "I",
    "G",
    "J",
    "C",
    "A",
    "D",
    "L",
    "K"
  ],
  "ACDGHJKL": [
    "H",
    "G",
    "J",
    "C",
    "A",
    "D",
    "L",
    "K"
  ],
  "ACDGHIKL": [
    "H",
    "G",
    "I",
    "C",
    "A",
    "D",
    "L",
    "K"
  ],
  "ACDGHIJL": [
    "H",
    "G",
    "J",
    "C",
    "A",
    "D",
    "L",
    "I"
  ],
  "ACDGHIJK": [
    "H",
    "G",
    "J",
    "C",
    "A",
    "D",
    "I",
    "K"
  ],
  "ACDFIJKL": [
    "C",
    "J",
    "I",
    "D",
    "A",
    "F",
    "L",
    "K"
  ],
  "ACDFHJKL": [
    "H",
    "J",
    "F",
    "C",
    "A",
    "D",
    "L",
    "K"
  ],
  "ACDFHIKL": [
    "H",
    "F",
    "I",
    "C",
    "A",
    "D",
    "L",
    "K"
  ],
  "ACDFHIJL": [
    "H",
    "J",
    "F",
    "C",
    "A",
    "D",
    "L",
    "I"
  ],
  "ACDFHIJK": [
    "H",
    "J",
    "F",
    "C",
    "A",
    "D",
    "I",
    "K"
  ],
  "ACDFGJKL": [
    "C",
    "G",
    "J",
    "D",
    "A",
    "F",
    "L",
    "K"
  ],
  "ACDFGIKL": [
    "C",
    "G",
    "I",
    "D",
    "A",
    "F",
    "L",
    "K"
  ],
  "ACDFGIJL": [
    "C",
    "G",
    "J",
    "D",
    "A",
    "F",
    "L",
    "I"
  ],
  "ACDFGIJK": [
    "C",
    "G",
    "J",
    "D",
    "A",
    "F",
    "I",
    "K"
  ],
  "ACDFGHKL": [
    "H",
    "G",
    "F",
    "C",
    "A",
    "D",
    "L",
    "K"
  ],
  "ACDFGHJL": [
    "C",
    "G",
    "J",
    "D",
    "A",
    "F",
    "L",
    "H"
  ],
  "ACDFGHJK": [
    "H",
    "G",
    "J",
    "C",
    "A",
    "F",
    "D",
    "K"
  ],
  "ACDFGHIL": [
    "H",
    "G",
    "F",
    "C",
    "A",
    "D",
    "L",
    "I"
  ],
  "ACDFGHIK": [
    "H",
    "G",
    "F",
    "C",
    "A",
    "D",
    "I",
    "K"
  ],
  "ACDFGHIJ": [
    "H",
    "G",
    "J",
    "C",
    "A",
    "F",
    "D",
    "I"
  ],
  "ACDEIJKL": [
    "E",
    "J",
    "I",
    "C",
    "A",
    "D",
    "L",
    "K"
  ],
  "ACDEHJKL": [
    "H",
    "J",
    "E",
    "C",
    "A",
    "D",
    "L",
    "K"
  ],
  "ACDEHIKL": [
    "H",
    "E",
    "I",
    "C",
    "A",
    "D",
    "L",
    "K"
  ],
  "ACDEHIJL": [
    "H",
    "J",
    "E",
    "C",
    "A",
    "D",
    "L",
    "I"
  ],
  "ACDEHIJK": [
    "H",
    "J",
    "E",
    "C",
    "A",
    "D",
    "I",
    "K"
  ],
  "ACDEGJKL": [
    "E",
    "G",
    "J",
    "C",
    "A",
    "D",
    "L",
    "K"
  ],
  "ACDEGIKL": [
    "E",
    "G",
    "I",
    "C",
    "A",
    "D",
    "L",
    "K"
  ],
  "ACDEGIJL": [
    "E",
    "G",
    "J",
    "C",
    "A",
    "D",
    "L",
    "I"
  ],
  "ACDEGIJK": [
    "E",
    "G",
    "J",
    "C",
    "A",
    "D",
    "I",
    "K"
  ],
  "ACDEGHKL": [
    "H",
    "G",
    "E",
    "C",
    "A",
    "D",
    "L",
    "K"
  ],
  "ACDEGHJL": [
    "H",
    "G",
    "J",
    "C",
    "A",
    "D",
    "L",
    "E"
  ],
  "ACDEGHJK": [
    "H",
    "G",
    "J",
    "C",
    "A",
    "D",
    "E",
    "K"
  ],
  "ACDEGHIL": [
    "H",
    "G",
    "E",
    "C",
    "A",
    "D",
    "L",
    "I"
  ],
  "ACDEGHIK": [
    "H",
    "G",
    "E",
    "C",
    "A",
    "D",
    "I",
    "K"
  ],
  "ACDEGHIJ": [
    "H",
    "G",
    "J",
    "C",
    "A",
    "D",
    "E",
    "I"
  ],
  "ACDEFJKL": [
    "C",
    "J",
    "E",
    "D",
    "A",
    "F",
    "L",
    "K"
  ],
  "ACDEFIKL": [
    "C",
    "E",
    "I",
    "D",
    "A",
    "F",
    "L",
    "K"
  ],
  "ACDEFIJL": [
    "C",
    "J",
    "E",
    "D",
    "A",
    "F",
    "L",
    "I"
  ],
  "ACDEFIJK": [
    "C",
    "J",
    "E",
    "D",
    "A",
    "F",
    "I",
    "K"
  ],
  "ACDEFHKL": [
    "H",
    "E",
    "F",
    "C",
    "A",
    "D",
    "L",
    "K"
  ],
  "ACDEFHJL": [
    "H",
    "J",
    "F",
    "C",
    "A",
    "D",
    "L",
    "E"
  ],
  "ACDEFHJK": [
    "H",
    "J",
    "E",
    "C",
    "A",
    "F",
    "D",
    "K"
  ],
  "ACDEFHIL": [
    "H",
    "E",
    "F",
    "C",
    "A",
    "D",
    "L",
    "I"
  ],
  "ACDEFHIK": [
    "H",
    "E",
    "F",
    "C",
    "A",
    "D",
    "I",
    "K"
  ],
  "ACDEFHIJ": [
    "H",
    "J",
    "E",
    "C",
    "A",
    "F",
    "D",
    "I"
  ],
  "ACDEFGKL": [
    "C",
    "G",
    "E",
    "D",
    "A",
    "F",
    "L",
    "K"
  ],
  "ACDEFGJL": [
    "C",
    "G",
    "J",
    "D",
    "A",
    "F",
    "L",
    "E"
  ],
  "ACDEFGJK": [
    "C",
    "G",
    "J",
    "D",
    "A",
    "F",
    "E",
    "K"
  ],
  "ACDEFGIL": [
    "C",
    "G",
    "E",
    "D",
    "A",
    "F",
    "L",
    "I"
  ],
  "ACDEFGIK": [
    "C",
    "G",
    "E",
    "D",
    "A",
    "F",
    "I",
    "K"
  ],
  "ACDEFGIJ": [
    "C",
    "G",
    "J",
    "D",
    "A",
    "F",
    "E",
    "I"
  ],
  "ACDEFGHL": [
    "H",
    "G",
    "F",
    "C",
    "A",
    "D",
    "L",
    "E"
  ],
  "ACDEFGHK": [
    "H",
    "G",
    "E",
    "C",
    "A",
    "F",
    "D",
    "K"
  ],
  "ACDEFGHJ": [
    "H",
    "G",
    "J",
    "C",
    "A",
    "F",
    "D",
    "E"
  ],
  "ACDEFGHI": [
    "H",
    "G",
    "E",
    "C",
    "A",
    "F",
    "D",
    "I"
  ],
  "ABGHIJKL": [
    "H",
    "J",
    "B",
    "A",
    "I",
    "G",
    "L",
    "K"
  ],
  "ABFHIJKL": [
    "H",
    "J",
    "B",
    "A",
    "I",
    "F",
    "L",
    "K"
  ],
  "ABFGIJKL": [
    "I",
    "J",
    "B",
    "F",
    "A",
    "G",
    "L",
    "K"
  ],
  "ABFGHJKL": [
    "H",
    "J",
    "B",
    "F",
    "A",
    "G",
    "L",
    "K"
  ],
  "ABFGHIKL": [
    "H",
    "G",
    "B",
    "A",
    "I",
    "F",
    "L",
    "K"
  ],
  "ABFGHIJL": [
    "H",
    "J",
    "B",
    "F",
    "A",
    "G",
    "L",
    "I"
  ],
  "ABFGHIJK": [
    "H",
    "J",
    "B",
    "F",
    "A",
    "G",
    "I",
    "K"
  ],
  "ABEHIJKL": [
    "E",
    "J",
    "B",
    "A",
    "I",
    "H",
    "L",
    "K"
  ],
  "ABEGIJKL": [
    "E",
    "J",
    "B",
    "A",
    "I",
    "G",
    "L",
    "K"
  ],
  "ABEGHJKL": [
    "E",
    "J",
    "B",
    "A",
    "H",
    "G",
    "L",
    "K"
  ],
  "ABEGHIKL": [
    "E",
    "G",
    "B",
    "A",
    "I",
    "H",
    "L",
    "K"
  ],
  "ABEGHIJL": [
    "E",
    "J",
    "B",
    "A",
    "H",
    "G",
    "L",
    "I"
  ],
  "ABEGHIJK": [
    "E",
    "J",
    "B",
    "A",
    "H",
    "G",
    "I",
    "K"
  ],
  "ABEFIJKL": [
    "E",
    "J",
    "B",
    "A",
    "I",
    "F",
    "L",
    "K"
  ],
  "ABEFHJKL": [
    "E",
    "J",
    "B",
    "F",
    "A",
    "H",
    "L",
    "K"
  ],
  "ABEFHIKL": [
    "E",
    "I",
    "B",
    "F",
    "A",
    "H",
    "L",
    "K"
  ],
  "ABEFHIJL": [
    "E",
    "J",
    "B",
    "F",
    "A",
    "H",
    "L",
    "I"
  ],
  "ABEFHIJK": [
    "E",
    "J",
    "B",
    "F",
    "A",
    "H",
    "I",
    "K"
  ],
  "ABEFGJKL": [
    "E",
    "J",
    "B",
    "F",
    "A",
    "G",
    "L",
    "K"
  ],
  "ABEFGIKL": [
    "E",
    "G",
    "B",
    "A",
    "I",
    "F",
    "L",
    "K"
  ],
  "ABEFGIJL": [
    "E",
    "J",
    "B",
    "F",
    "A",
    "G",
    "L",
    "I"
  ],
  "ABEFGIJK": [
    "E",
    "J",
    "B",
    "F",
    "A",
    "G",
    "I",
    "K"
  ],
  "ABEFGHKL": [
    "E",
    "G",
    "B",
    "F",
    "A",
    "H",
    "L",
    "K"
  ],
  "ABEFGHJL": [
    "H",
    "J",
    "B",
    "F",
    "A",
    "G",
    "L",
    "E"
  ],
  "ABEFGHJK": [
    "H",
    "J",
    "B",
    "F",
    "A",
    "G",
    "E",
    "K"
  ],
  "ABEFGHIL": [
    "E",
    "G",
    "B",
    "F",
    "A",
    "H",
    "L",
    "I"
  ],
  "ABEFGHIK": [
    "E",
    "G",
    "B",
    "F",
    "A",
    "H",
    "I",
    "K"
  ],
  "ABEFGHIJ": [
    "H",
    "J",
    "B",
    "F",
    "A",
    "G",
    "E",
    "I"
  ],
  "ABDHIJKL": [
    "I",
    "J",
    "B",
    "D",
    "A",
    "H",
    "L",
    "K"
  ],
  "ABDGIJKL": [
    "I",
    "J",
    "B",
    "D",
    "A",
    "G",
    "L",
    "K"
  ],
  "ABDGHJKL": [
    "H",
    "J",
    "B",
    "D",
    "A",
    "G",
    "L",
    "K"
  ],
  "ABDGHIKL": [
    "I",
    "G",
    "B",
    "D",
    "A",
    "H",
    "L",
    "K"
  ],
  "ABDGHIJL": [
    "H",
    "J",
    "B",
    "D",
    "A",
    "G",
    "L",
    "I"
  ],
  "ABDGHIJK": [
    "H",
    "J",
    "B",
    "D",
    "A",
    "G",
    "I",
    "K"
  ],
  "ABDFIJKL": [
    "I",
    "J",
    "B",
    "D",
    "A",
    "F",
    "L",
    "K"
  ],
  "ABDFHJKL": [
    "H",
    "J",
    "B",
    "D",
    "A",
    "F",
    "L",
    "K"
  ],
  "ABDFHIKL": [
    "H",
    "I",
    "B",
    "D",
    "A",
    "F",
    "L",
    "K"
  ],
  "ABDFHIJL": [
    "H",
    "J",
    "B",
    "D",
    "A",
    "F",
    "L",
    "I"
  ],
  "ABDFHIJK": [
    "H",
    "J",
    "B",
    "D",
    "A",
    "F",
    "I",
    "K"
  ],
  "ABDFGJKL": [
    "F",
    "J",
    "B",
    "D",
    "A",
    "G",
    "L",
    "K"
  ],
  "ABDFGIKL": [
    "I",
    "G",
    "B",
    "D",
    "A",
    "F",
    "L",
    "K"
  ],
  "ABDFGIJL": [
    "F",
    "J",
    "B",
    "D",
    "A",
    "G",
    "L",
    "I"
  ],
  "ABDFGIJK": [
    "F",
    "J",
    "B",
    "D",
    "A",
    "G",
    "I",
    "K"
  ],
  "ABDFGHKL": [
    "H",
    "G",
    "B",
    "D",
    "A",
    "F",
    "L",
    "K"
  ],
  "ABDFGHJL": [
    "H",
    "G",
    "B",
    "D",
    "A",
    "F",
    "L",
    "J"
  ],
  "ABDFGHJK": [
    "H",
    "G",
    "B",
    "D",
    "A",
    "F",
    "J",
    "K"
  ],
  "ABDFGHIL": [
    "H",
    "G",
    "B",
    "D",
    "A",
    "F",
    "L",
    "I"
  ],
  "ABDFGHIK": [
    "H",
    "G",
    "B",
    "D",
    "A",
    "F",
    "I",
    "K"
  ],
  "ABDFGHIJ": [
    "H",
    "G",
    "B",
    "D",
    "A",
    "F",
    "I",
    "J"
  ],
  "ABDEIJKL": [
    "E",
    "J",
    "B",
    "A",
    "I",
    "D",
    "L",
    "K"
  ],
  "ABDEHJKL": [
    "E",
    "J",
    "B",
    "D",
    "A",
    "H",
    "L",
    "K"
  ],
  "ABDEHIKL": [
    "E",
    "I",
    "B",
    "D",
    "A",
    "H",
    "L",
    "K"
  ],
  "ABDEHIJL": [
    "E",
    "J",
    "B",
    "D",
    "A",
    "H",
    "L",
    "I"
  ],
  "ABDEHIJK": [
    "E",
    "J",
    "B",
    "D",
    "A",
    "H",
    "I",
    "K"
  ],
  "ABDEGJKL": [
    "E",
    "J",
    "B",
    "D",
    "A",
    "G",
    "L",
    "K"
  ],
  "ABDEGIKL": [
    "E",
    "G",
    "B",
    "A",
    "I",
    "D",
    "L",
    "K"
  ],
  "ABDEGIJL": [
    "E",
    "J",
    "B",
    "D",
    "A",
    "G",
    "L",
    "I"
  ],
  "ABDEGIJK": [
    "E",
    "J",
    "B",
    "D",
    "A",
    "G",
    "I",
    "K"
  ],
  "ABDEGHKL": [
    "E",
    "G",
    "B",
    "D",
    "A",
    "H",
    "L",
    "K"
  ],
  "ABDEGHJL": [
    "H",
    "J",
    "B",
    "D",
    "A",
    "G",
    "L",
    "E"
  ],
  "ABDEGHJK": [
    "H",
    "J",
    "B",
    "D",
    "A",
    "G",
    "E",
    "K"
  ],
  "ABDEGHIL": [
    "E",
    "G",
    "B",
    "D",
    "A",
    "H",
    "L",
    "I"
  ],
  "ABDEGHIK": [
    "E",
    "G",
    "B",
    "D",
    "A",
    "H",
    "I",
    "K"
  ],
  "ABDEGHIJ": [
    "H",
    "J",
    "B",
    "D",
    "A",
    "G",
    "E",
    "I"
  ],
  "ABDEFJKL": [
    "E",
    "J",
    "B",
    "D",
    "A",
    "F",
    "L",
    "K"
  ],
  "ABDEFIKL": [
    "E",
    "I",
    "B",
    "D",
    "A",
    "F",
    "L",
    "K"
  ],
  "ABDEFIJL": [
    "E",
    "J",
    "B",
    "D",
    "A",
    "F",
    "L",
    "I"
  ],
  "ABDEFIJK": [
    "E",
    "J",
    "B",
    "D",
    "A",
    "F",
    "I",
    "K"
  ],
  "ABDEFHKL": [
    "H",
    "E",
    "B",
    "D",
    "A",
    "F",
    "L",
    "K"
  ],
  "ABDEFHJL": [
    "H",
    "J",
    "B",
    "D",
    "A",
    "F",
    "L",
    "E"
  ],
  "ABDEFHJK": [
    "H",
    "J",
    "B",
    "D",
    "A",
    "F",
    "E",
    "K"
  ],
  "ABDEFHIL": [
    "H",
    "E",
    "B",
    "D",
    "A",
    "F",
    "L",
    "I"
  ],
  "ABDEFHIK": [
    "H",
    "E",
    "B",
    "D",
    "A",
    "F",
    "I",
    "K"
  ],
  "ABDEFHIJ": [
    "H",
    "J",
    "B",
    "D",
    "A",
    "F",
    "E",
    "I"
  ],
  "ABDEFGKL": [
    "E",
    "G",
    "B",
    "D",
    "A",
    "F",
    "L",
    "K"
  ],
  "ABDEFGJL": [
    "E",
    "G",
    "B",
    "D",
    "A",
    "F",
    "L",
    "J"
  ],
  "ABDEFGJK": [
    "E",
    "G",
    "B",
    "D",
    "A",
    "F",
    "J",
    "K"
  ],
  "ABDEFGIL": [
    "E",
    "G",
    "B",
    "D",
    "A",
    "F",
    "L",
    "I"
  ],
  "ABDEFGIK": [
    "E",
    "G",
    "B",
    "D",
    "A",
    "F",
    "I",
    "K"
  ],
  "ABDEFGIJ": [
    "E",
    "G",
    "B",
    "D",
    "A",
    "F",
    "I",
    "J"
  ],
  "ABDEFGHL": [
    "H",
    "G",
    "B",
    "D",
    "A",
    "F",
    "L",
    "E"
  ],
  "ABDEFGHK": [
    "H",
    "G",
    "B",
    "D",
    "A",
    "F",
    "E",
    "K"
  ],
  "ABDEFGHJ": [
    "H",
    "G",
    "B",
    "D",
    "A",
    "F",
    "E",
    "J"
  ],
  "ABDEFGHI": [
    "H",
    "G",
    "B",
    "D",
    "A",
    "F",
    "E",
    "I"
  ],
  "ABCHIJKL": [
    "I",
    "J",
    "B",
    "C",
    "A",
    "H",
    "L",
    "K"
  ],
  "ABCGIJKL": [
    "I",
    "J",
    "B",
    "C",
    "A",
    "G",
    "L",
    "K"
  ],
  "ABCGHJKL": [
    "H",
    "J",
    "B",
    "C",
    "A",
    "G",
    "L",
    "K"
  ],
  "ABCGHIKL": [
    "I",
    "G",
    "B",
    "C",
    "A",
    "H",
    "L",
    "K"
  ],
  "ABCGHIJL": [
    "H",
    "J",
    "B",
    "C",
    "A",
    "G",
    "L",
    "I"
  ],
  "ABCGHIJK": [
    "H",
    "J",
    "B",
    "C",
    "A",
    "G",
    "I",
    "K"
  ],
  "ABCFIJKL": [
    "I",
    "J",
    "B",
    "C",
    "A",
    "F",
    "L",
    "K"
  ],
  "ABCFHJKL": [
    "H",
    "J",
    "B",
    "C",
    "A",
    "F",
    "L",
    "K"
  ],
  "ABCFHIKL": [
    "H",
    "I",
    "B",
    "C",
    "A",
    "F",
    "L",
    "K"
  ],
  "ABCFHIJL": [
    "H",
    "J",
    "B",
    "C",
    "A",
    "F",
    "L",
    "I"
  ],
  "ABCFHIJK": [
    "H",
    "J",
    "B",
    "C",
    "A",
    "F",
    "I",
    "K"
  ],
  "ABCFGJKL": [
    "C",
    "J",
    "B",
    "F",
    "A",
    "G",
    "L",
    "K"
  ],
  "ABCFGIKL": [
    "I",
    "G",
    "B",
    "C",
    "A",
    "F",
    "L",
    "K"
  ],
  "ABCFGIJL": [
    "C",
    "J",
    "B",
    "F",
    "A",
    "G",
    "L",
    "I"
  ],
  "ABCFGIJK": [
    "C",
    "J",
    "B",
    "F",
    "A",
    "G",
    "I",
    "K"
  ],
  "ABCFGHKL": [
    "H",
    "G",
    "B",
    "C",
    "A",
    "F",
    "L",
    "K"
  ],
  "ABCFGHJL": [
    "H",
    "G",
    "B",
    "C",
    "A",
    "F",
    "L",
    "J"
  ],
  "ABCFGHJK": [
    "H",
    "G",
    "B",
    "C",
    "A",
    "F",
    "J",
    "K"
  ],
  "ABCFGHIL": [
    "H",
    "G",
    "B",
    "C",
    "A",
    "F",
    "L",
    "I"
  ],
  "ABCFGHIK": [
    "H",
    "G",
    "B",
    "C",
    "A",
    "F",
    "I",
    "K"
  ],
  "ABCFGHIJ": [
    "H",
    "G",
    "B",
    "C",
    "A",
    "F",
    "I",
    "J"
  ],
  "ABCEIJKL": [
    "E",
    "J",
    "B",
    "A",
    "I",
    "C",
    "L",
    "K"
  ],
  "ABCEHJKL": [
    "E",
    "J",
    "B",
    "C",
    "A",
    "H",
    "L",
    "K"
  ],
  "ABCEHIKL": [
    "E",
    "I",
    "B",
    "C",
    "A",
    "H",
    "L",
    "K"
  ],
  "ABCEHIJL": [
    "E",
    "J",
    "B",
    "C",
    "A",
    "H",
    "L",
    "I"
  ],
  "ABCEHIJK": [
    "E",
    "J",
    "B",
    "C",
    "A",
    "H",
    "I",
    "K"
  ],
  "ABCEGJKL": [
    "E",
    "J",
    "B",
    "C",
    "A",
    "G",
    "L",
    "K"
  ],
  "ABCEGIKL": [
    "E",
    "G",
    "B",
    "A",
    "I",
    "C",
    "L",
    "K"
  ],
  "ABCEGIJL": [
    "E",
    "J",
    "B",
    "C",
    "A",
    "G",
    "L",
    "I"
  ],
  "ABCEGIJK": [
    "E",
    "J",
    "B",
    "C",
    "A",
    "G",
    "I",
    "K"
  ],
  "ABCEGHKL": [
    "E",
    "G",
    "B",
    "C",
    "A",
    "H",
    "L",
    "K"
  ],
  "ABCEGHJL": [
    "H",
    "J",
    "B",
    "C",
    "A",
    "G",
    "L",
    "E"
  ],
  "ABCEGHJK": [
    "H",
    "J",
    "B",
    "C",
    "A",
    "G",
    "E",
    "K"
  ],
  "ABCEGHIL": [
    "E",
    "G",
    "B",
    "C",
    "A",
    "H",
    "L",
    "I"
  ],
  "ABCEGHIK": [
    "E",
    "G",
    "B",
    "C",
    "A",
    "H",
    "I",
    "K"
  ],
  "ABCEGHIJ": [
    "H",
    "J",
    "B",
    "C",
    "A",
    "G",
    "E",
    "I"
  ],
  "ABCEFJKL": [
    "E",
    "J",
    "B",
    "C",
    "A",
    "F",
    "L",
    "K"
  ],
  "ABCEFIKL": [
    "E",
    "I",
    "B",
    "C",
    "A",
    "F",
    "L",
    "K"
  ],
  "ABCEFIJL": [
    "E",
    "J",
    "B",
    "C",
    "A",
    "F",
    "L",
    "I"
  ],
  "ABCEFIJK": [
    "E",
    "J",
    "B",
    "C",
    "A",
    "F",
    "I",
    "K"
  ],
  "ABCEFHKL": [
    "H",
    "E",
    "B",
    "C",
    "A",
    "F",
    "L",
    "K"
  ],
  "ABCEFHJL": [
    "H",
    "J",
    "B",
    "C",
    "A",
    "F",
    "L",
    "E"
  ],
  "ABCEFHJK": [
    "H",
    "J",
    "B",
    "C",
    "A",
    "F",
    "E",
    "K"
  ],
  "ABCEFHIL": [
    "H",
    "E",
    "B",
    "C",
    "A",
    "F",
    "L",
    "I"
  ],
  "ABCEFHIK": [
    "H",
    "E",
    "B",
    "C",
    "A",
    "F",
    "I",
    "K"
  ],
  "ABCEFHIJ": [
    "H",
    "J",
    "B",
    "C",
    "A",
    "F",
    "E",
    "I"
  ],
  "ABCEFGKL": [
    "E",
    "G",
    "B",
    "C",
    "A",
    "F",
    "L",
    "K"
  ],
  "ABCEFGJL": [
    "E",
    "G",
    "B",
    "C",
    "A",
    "F",
    "L",
    "J"
  ],
  "ABCEFGJK": [
    "E",
    "G",
    "B",
    "C",
    "A",
    "F",
    "J",
    "K"
  ],
  "ABCEFGIL": [
    "E",
    "G",
    "B",
    "C",
    "A",
    "F",
    "L",
    "I"
  ],
  "ABCEFGIK": [
    "E",
    "G",
    "B",
    "C",
    "A",
    "F",
    "I",
    "K"
  ],
  "ABCEFGIJ": [
    "E",
    "G",
    "B",
    "C",
    "A",
    "F",
    "I",
    "J"
  ],
  "ABCEFGHL": [
    "H",
    "G",
    "B",
    "C",
    "A",
    "F",
    "L",
    "E"
  ],
  "ABCEFGHK": [
    "H",
    "G",
    "B",
    "C",
    "A",
    "F",
    "E",
    "K"
  ],
  "ABCEFGHJ": [
    "H",
    "G",
    "B",
    "C",
    "A",
    "F",
    "E",
    "J"
  ],
  "ABCEFGHI": [
    "H",
    "G",
    "B",
    "C",
    "A",
    "F",
    "E",
    "I"
  ],
  "ABCDIJKL": [
    "I",
    "J",
    "B",
    "C",
    "A",
    "D",
    "L",
    "K"
  ],
  "ABCDHJKL": [
    "H",
    "J",
    "B",
    "C",
    "A",
    "D",
    "L",
    "K"
  ],
  "ABCDHIKL": [
    "H",
    "I",
    "B",
    "C",
    "A",
    "D",
    "L",
    "K"
  ],
  "ABCDHIJL": [
    "H",
    "J",
    "B",
    "C",
    "A",
    "D",
    "L",
    "I"
  ],
  "ABCDHIJK": [
    "H",
    "J",
    "B",
    "C",
    "A",
    "D",
    "I",
    "K"
  ],
  "ABCDGJKL": [
    "C",
    "J",
    "B",
    "D",
    "A",
    "G",
    "L",
    "K"
  ],
  "ABCDGIKL": [
    "I",
    "G",
    "B",
    "C",
    "A",
    "D",
    "L",
    "K"
  ],
  "ABCDGIJL": [
    "C",
    "J",
    "B",
    "D",
    "A",
    "G",
    "L",
    "I"
  ],
  "ABCDGIJK": [
    "C",
    "J",
    "B",
    "D",
    "A",
    "G",
    "I",
    "K"
  ],
  "ABCDGHKL": [
    "H",
    "G",
    "B",
    "C",
    "A",
    "D",
    "L",
    "K"
  ],
  "ABCDGHJL": [
    "H",
    "G",
    "B",
    "C",
    "A",
    "D",
    "L",
    "J"
  ],
  "ABCDGHJK": [
    "H",
    "G",
    "B",
    "C",
    "A",
    "D",
    "J",
    "K"
  ],
  "ABCDGHIL": [
    "H",
    "G",
    "B",
    "C",
    "A",
    "D",
    "L",
    "I"
  ],
  "ABCDGHIK": [
    "H",
    "G",
    "B",
    "C",
    "A",
    "D",
    "I",
    "K"
  ],
  "ABCDGHIJ": [
    "H",
    "G",
    "B",
    "C",
    "A",
    "D",
    "I",
    "J"
  ],
  "ABCDFJKL": [
    "C",
    "J",
    "B",
    "D",
    "A",
    "F",
    "L",
    "K"
  ],
  "ABCDFIKL": [
    "C",
    "I",
    "B",
    "D",
    "A",
    "F",
    "L",
    "K"
  ],
  "ABCDFIJL": [
    "C",
    "J",
    "B",
    "D",
    "A",
    "F",
    "L",
    "I"
  ],
  "ABCDFIJK": [
    "C",
    "J",
    "B",
    "D",
    "A",
    "F",
    "I",
    "K"
  ],
  "ABCDFHKL": [
    "H",
    "F",
    "B",
    "C",
    "A",
    "D",
    "L",
    "K"
  ],
  "ABCDFHJL": [
    "C",
    "J",
    "B",
    "D",
    "A",
    "F",
    "L",
    "H"
  ],
  "ABCDFHJK": [
    "H",
    "J",
    "B",
    "C",
    "A",
    "F",
    "D",
    "K"
  ],
  "ABCDFHIL": [
    "H",
    "F",
    "B",
    "C",
    "A",
    "D",
    "L",
    "I"
  ],
  "ABCDFHIK": [
    "H",
    "F",
    "B",
    "C",
    "A",
    "D",
    "I",
    "K"
  ],
  "ABCDFHIJ": [
    "H",
    "J",
    "B",
    "C",
    "A",
    "F",
    "D",
    "I"
  ],
  "ABCDFGKL": [
    "C",
    "G",
    "B",
    "D",
    "A",
    "F",
    "L",
    "K"
  ],
  "ABCDFGJL": [
    "C",
    "G",
    "B",
    "D",
    "A",
    "F",
    "L",
    "J"
  ],
  "ABCDFGJK": [
    "C",
    "G",
    "B",
    "D",
    "A",
    "F",
    "J",
    "K"
  ],
  "ABCDFGIL": [
    "C",
    "G",
    "B",
    "D",
    "A",
    "F",
    "L",
    "I"
  ],
  "ABCDFGIK": [
    "C",
    "G",
    "B",
    "D",
    "A",
    "F",
    "I",
    "K"
  ],
  "ABCDFGIJ": [
    "C",
    "G",
    "B",
    "D",
    "A",
    "F",
    "I",
    "J"
  ],
  "ABCDFGHL": [
    "C",
    "G",
    "B",
    "D",
    "A",
    "F",
    "L",
    "H"
  ],
  "ABCDFGHK": [
    "H",
    "G",
    "B",
    "C",
    "A",
    "F",
    "D",
    "K"
  ],
  "ABCDFGHJ": [
    "H",
    "G",
    "B",
    "C",
    "A",
    "F",
    "D",
    "J"
  ],
  "ABCDFGHI": [
    "H",
    "G",
    "B",
    "C",
    "A",
    "F",
    "D",
    "I"
  ],
  "ABCDEJKL": [
    "E",
    "J",
    "B",
    "C",
    "A",
    "D",
    "L",
    "K"
  ],
  "ABCDEIKL": [
    "E",
    "I",
    "B",
    "C",
    "A",
    "D",
    "L",
    "K"
  ],
  "ABCDEIJL": [
    "E",
    "J",
    "B",
    "C",
    "A",
    "D",
    "L",
    "I"
  ],
  "ABCDEIJK": [
    "E",
    "J",
    "B",
    "C",
    "A",
    "D",
    "I",
    "K"
  ],
  "ABCDEHKL": [
    "H",
    "E",
    "B",
    "C",
    "A",
    "D",
    "L",
    "K"
  ],
  "ABCDEHJL": [
    "H",
    "J",
    "B",
    "C",
    "A",
    "D",
    "L",
    "E"
  ],
  "ABCDEHJK": [
    "H",
    "J",
    "B",
    "C",
    "A",
    "D",
    "E",
    "K"
  ],
  "ABCDEHIL": [
    "H",
    "E",
    "B",
    "C",
    "A",
    "D",
    "L",
    "I"
  ],
  "ABCDEHIK": [
    "H",
    "E",
    "B",
    "C",
    "A",
    "D",
    "I",
    "K"
  ],
  "ABCDEHIJ": [
    "H",
    "J",
    "B",
    "C",
    "A",
    "D",
    "E",
    "I"
  ],
  "ABCDEGKL": [
    "E",
    "G",
    "B",
    "C",
    "A",
    "D",
    "L",
    "K"
  ],
  "ABCDEGJL": [
    "E",
    "G",
    "B",
    "C",
    "A",
    "D",
    "L",
    "J"
  ],
  "ABCDEGJK": [
    "E",
    "G",
    "B",
    "C",
    "A",
    "D",
    "J",
    "K"
  ],
  "ABCDEGIL": [
    "E",
    "G",
    "B",
    "C",
    "A",
    "D",
    "L",
    "I"
  ],
  "ABCDEGIK": [
    "E",
    "G",
    "B",
    "C",
    "A",
    "D",
    "I",
    "K"
  ],
  "ABCDEGIJ": [
    "E",
    "G",
    "B",
    "C",
    "A",
    "D",
    "I",
    "J"
  ],
  "ABCDEGHL": [
    "H",
    "G",
    "B",
    "C",
    "A",
    "D",
    "L",
    "E"
  ],
  "ABCDEGHK": [
    "H",
    "G",
    "B",
    "C",
    "A",
    "D",
    "E",
    "K"
  ],
  "ABCDEGHJ": [
    "H",
    "G",
    "B",
    "C",
    "A",
    "D",
    "E",
    "J"
  ],
  "ABCDEGHI": [
    "H",
    "G",
    "B",
    "C",
    "A",
    "D",
    "E",
    "I"
  ],
  "ABCDEFKL": [
    "C",
    "E",
    "B",
    "D",
    "A",
    "F",
    "L",
    "K"
  ],
  "ABCDEFJL": [
    "C",
    "J",
    "B",
    "D",
    "A",
    "F",
    "L",
    "E"
  ],
  "ABCDEFJK": [
    "C",
    "J",
    "B",
    "D",
    "A",
    "F",
    "E",
    "K"
  ],
  "ABCDEFIL": [
    "C",
    "E",
    "B",
    "D",
    "A",
    "F",
    "L",
    "I"
  ],
  "ABCDEFIK": [
    "C",
    "E",
    "B",
    "D",
    "A",
    "F",
    "I",
    "K"
  ],
  "ABCDEFIJ": [
    "C",
    "J",
    "B",
    "D",
    "A",
    "F",
    "E",
    "I"
  ],
  "ABCDEFHL": [
    "H",
    "F",
    "B",
    "C",
    "A",
    "D",
    "L",
    "E"
  ],
  "ABCDEFHK": [
    "H",
    "E",
    "B",
    "C",
    "A",
    "F",
    "D",
    "K"
  ],
  "ABCDEFHJ": [
    "H",
    "J",
    "B",
    "C",
    "A",
    "F",
    "D",
    "E"
  ],
  "ABCDEFHI": [
    "H",
    "E",
    "B",
    "C",
    "A",
    "F",
    "D",
    "I"
  ],
  "ABCDEFGL": [
    "C",
    "G",
    "B",
    "D",
    "A",
    "F",
    "L",
    "E"
  ],
  "ABCDEFGK": [
    "C",
    "G",
    "B",
    "D",
    "A",
    "F",
    "E",
    "K"
  ],
  "ABCDEFGJ": [
    "C",
    "G",
    "B",
    "D",
    "A",
    "F",
    "E",
    "J"
  ],
  "ABCDEFGI": [
    "C",
    "G",
    "B",
    "D",
    "A",
    "F",
    "E",
    "I"
  ],
  "ABCDEFGH": [
    "H",
    "G",
    "B",
    "C",
    "A",
    "F",
    "D",
    "E"
  ]
};

const state = {
  bootstrap: null,
  participant: null,
  saveTimer: null,
  currentPage: "",
};

const nameInput = document.querySelector("#participant-name");
const matchesContainer = document.querySelector("#matches");
const roundsContainer = document.querySelector("#rounds");
const formPageNav = document.querySelector("#form-page-nav");
const saveButton = document.querySelector("#save-button");
const recoverButton = document.querySelector("#recover-button");
const saveStatus = document.querySelector("#save-status");
const editLink = document.querySelector("#edit-link");
const deadlineCopy = document.querySelector("#deadline-copy");
const competitionName = document.querySelector("#competition-name");
const heroPoolName = document.querySelector("#hero-pool-name");
const rulesTitle = document.querySelector("#rules-title");
const rulesIntro = document.querySelector("#rules-intro");
const rulesBody = document.querySelector("#rules-body");
const bonusQuestionsContainer = document.querySelector("#bonus-questions");
const completionPill = document.querySelector("#completion-pill");
const groupStandingsContainer = document.querySelector("#group-standings");
const thirdRankingContainer = document.querySelector("#third-ranking");
const secondRoundSuggestionContainer = document.querySelector("#second-round-suggestion");
const groupProgressPill = document.querySelector("#group-progress-pill");

function pageKeyFromHash() {
  return decodeURIComponent(window.location.hash.replace(/^#/, ""));
}

function setActivePage(pageKey, shouldUpdateHash = false) {
  const pages = [...document.querySelectorAll("[data-page]")];
  const availablePages = new Set(pages.map((page) => page.dataset.page));
  const nextPage = availablePages.has(pageKey) ? pageKey : pages[0]?.dataset.page || "";

  state.currentPage = nextPage;

  for (const page of pages) {
    page.classList.toggle("is-active", page.dataset.page === nextPage);
  }

  document.querySelectorAll("[data-page-shell]").forEach((shell) => {
    const hasActivePage = Boolean(shell.querySelector(".form-page.is-active"));
    shell.classList.toggle("hidden", !hasActivePage);
  });

  document.querySelectorAll("[data-page-link]").forEach((link) => {
    const isCurrent = link.dataset.pageLink === nextPage;
    if (isCurrent) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });

  if (shouldUpdateHash && nextPage && pageKeyFromHash() !== nextPage) {
    window.history.replaceState({}, "", `#${encodeURIComponent(nextPage)}`);
  }
}

function renderPageNavigation() {
  const groups = getGroupContexts(state.bootstrap.matches);
  const links = [
    { pageKey: "spelregels", label: "Spelregels" },
    ...groups.map((group) => ({ pageKey: `poule-${group.key}`, label: `Poule ${group.key}` })),
    { pageKey: "overzicht", label: "Overzicht groepsstanden" },
    { pageKey: "tweede-ronde", label: "Tweede ronde" },
    { pageKey: "derde-ronde", label: "Derde ronde" },
    { pageKey: "finalerondes", label: "Kwart/Halve/Finale" },
    { pageKey: "open-vragen", label: "Open vragen" },
  ];

  formPageNav.innerHTML = links
    .map((link) => `<a href="#${link.pageKey}" data-page-link="${link.pageKey}">${link.label}</a>`)
    .join("");
}

function getPoolSlug() {
  const parts = window.location.pathname.split("/").filter(Boolean);
  return parts[0] === "pool" && parts[1] ? parts[1] : "";
}

function poolBasePath() {
  return `/pool/${getPoolSlug()}`;
}

function poolApiPath(path) {
  return `/api/pools/${getPoolSlug()}${path}`;
}

function formatDateTime(value) {
  return new Intl.DateTimeFormat("nl-NL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatDayLabel(value) {
  return new Intl.DateTimeFormat("nl-NL", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date(value));
}

function formatTime(value) {
  return new Intl.DateTimeFormat("nl-NL", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function getKnockoutMatchSelections(knockoutPredictions, matchNumber) {
  for (const round of rounds) {
    const matches = getKnockoutMatchesByRoundKey(state.bootstrap.matches, round.key);
    const matchIndex = matches.findIndex((match) => String(match.matchNumber) === String(matchNumber));
    if (matchIndex === -1) {
      continue;
    }

    const values = knockoutPredictions[round.key] || [];
    const first = values[matchIndex * 2] || "";
    const second = values[matchIndex * 2 + 1] || "";
    return [first, second].filter(Boolean);
  }

  return [];
}

function describeKnockoutSource(code, knockoutPredictions) {
  const value = String(code || "").trim();
  if (!value) {
    return "";
  }

  if (/^W\d+$/.test(value)) {
    const matchNumber = value.slice(1);
    const selections = getKnockoutMatchSelections(knockoutPredictions, matchNumber);
    return selections.length
      ? selections.join(" / ")
      : `Wedstrijd ${matchNumber}`;
  }

  if (/^RU\d+$/.test(value)) {
    const matchNumber = value.slice(2);
    const selections = getKnockoutMatchSelections(knockoutPredictions, matchNumber);
    return selections.length
      ? selections.join(" / ")
      : `Wedstrijd ${matchNumber}`;
  }

  return value;
}

function getTokenFromUrl() {
  const pathParts = window.location.pathname.split("/").filter(Boolean);
  if (pathParts[0] === "pool" && pathParts[2] === "edit" && pathParts[3]) {
    return pathParts[3];
  }

  const params = new URLSearchParams(window.location.search);
  return params.get("edit");
}

function setSaveStatus(text, tone = "") {
  saveStatus.textContent = text;
  saveStatus.className = `pill ${tone}`.trim();
}

function setCompletionStatus(percent) {
  completionPill.textContent = `${percent}% ingevuld`;
  completionPill.className = `pill ${percent === 100 ? "success" : "muted"}`.trim();
}

function getGroupStageMatches(matches) {
  return matches.filter((match) => match.stage === "Groepsfase");
}

function getCountryOptions(matches) {
  return [...new Set(getGroupStageMatches(matches).flatMap((match) => [match.homeTeam, match.awayTeam]))].sort(
    (left, right) => left.localeCompare(right, "nl"),
  );
}

function filterAvailableTeams(matches, allowedTeams) {
  const availableTeams = new Set(getCountryOptions(matches));
  return allowedTeams.filter((team) => availableTeams.has(team) || availableTeams.has(HOST_TEAM_ALIASES[team]));
}

function renderCountryOptions(options, selectedValue) {
  return options
    .map(
      (country) =>
        `<option value="${country}" ${selectedValue === country ? "selected" : ""}>${country}</option>`,
    )
    .join("");
}

function getKnockoutMatchesByRoundKey(matches, roundKey) {
  const round = rounds.find((entry) => entry.key === roundKey);
  if (!round) {
    return [];
  }

  return matches.filter((match) => match.stage === round.label);
}

function getGroupKey(match) {
  const code = String(match.homeSlotCode || match.awaySlotCode || "").trim();
  const result = /^([A-Z])/.exec(code);
  return result ? result[1] : null;
}

function getGroupContexts(matches) {
  const groups = new Map();

  for (const match of getGroupStageMatches(matches)) {
    const groupKey = getGroupKey(match);
    if (!groupKey) {
      continue;
    }

    if (!groups.has(groupKey)) {
      groups.set(groupKey, {
        key: groupKey,
        teams: new Set(),
        matches: [],
      });
    }

    const group = groups.get(groupKey);
    group.teams.add(match.homeTeam);
    group.teams.add(match.awayTeam);
    group.matches.push(match);
  }

  return [...groups.values()]
    .sort((left, right) => left.key.localeCompare(right.key, "nl"))
    .map((group) => ({
      key: group.key,
      teams: [...group.teams].sort((left, right) => left.localeCompare(right, "nl")),
      matches: group.matches,
    }));
}

function renderMatches(matches, predictions = []) {
  const predictionByMatchId = new Map(predictions.map((item) => [item.matchId, item]));
  const groups = getGroupContexts(matches);

  matchesContainer.innerHTML = "";

  for (const group of groups) {
    const page = document.createElement("section");
    page.className = "form-page group-form-page";
    page.dataset.page = `poule-${group.key}`;
    page.innerHTML = `
      <div class="section-head">
        <div>
          <h3>Poule ${group.key}</h3>
          <p class="notice">Vul de wedstrijden in deze poule in. De tussenstand hieronder werkt meteen mee.</p>
        </div>
        <span class="pill muted">${group.matches.length} wedstrijden</span>
      </div>
      <div class="day-match-stack"></div>
      <div class="group-standings-shell inline-group-standings">
        <div class="section-head">
          <h3>Tussenstand poule ${group.key}</h3>
          <span class="pill muted" id="group-progress-${group.key}">0/${group.matches.length} wedstrijden</span>
        </div>
        <div id="group-standing-${group.key}"></div>
      </div>
    `;

    const groupedMatches = new Map();
    for (const match of group.matches) {
      const dayKey = new Date(match.kickoffAt).toISOString().slice(0, 10);
      if (!groupedMatches.has(dayKey)) {
        groupedMatches.set(dayKey, []);
      }
      groupedMatches.get(dayKey).push(match);
    }

    const pageMatches = page.querySelector(".day-match-stack");

    for (const dayMatches of groupedMatches.values()) {
      const daySection = document.createElement("section");
      daySection.className = "day-block";

      const heading = document.createElement("div");
      heading.className = "day-heading";
      heading.innerHTML = `
        <h3>${formatDayLabel(dayMatches[0].kickoffAt)}</h3>
        <p>${dayMatches.length} wedstrijd${dayMatches.length === 1 ? "" : "en"}</p>
      `;
      daySection.appendChild(heading);

      const list = document.createElement("div");
      list.className = "day-matches";

      for (const match of dayMatches) {
        const prediction = predictionByMatchId.get(match.id) || {};
        const article = document.createElement("article");
        article.className = "match-row compact";
        article.innerHTML = `
          <div class="match-time">${formatTime(match.kickoffAt)}</div>
          <div class="match-main">
            <p class="match-title">${match.homeTeam} - ${match.awayTeam}</p>
            <p class="match-meta">Poule ${group.key} - ${match.city}</p>
          </div>
          <div class="score-inputs">
            <input type="number" min="0" data-match-id="${match.id}" data-side="home" value="${prediction.predictedHomeScore ?? ""}">
            <span>-</span>
            <input type="number" min="0" data-match-id="${match.id}" data-side="away" value="${prediction.predictedAwayScore ?? ""}">
          </div>
        `;
        list.appendChild(article);
      }

      daySection.appendChild(list);
      pageMatches.appendChild(daySection);
    }

    matchesContainer.appendChild(page);
  }
}

function renderRulesContent(rules) {
  rulesTitle.textContent = rules.publicRulesTitle || "Spelregels";
  rulesIntro.textContent = rules.publicRulesIntro || "";
  rulesBody.innerHTML = "";

  for (const line of String(rules.publicRulesBody || "")
    .split("\n")
    .map((entry) => entry.trim())
    .filter(Boolean)) {
    const paragraph = document.createElement("p");
    paragraph.textContent = line;
    rulesBody.appendChild(paragraph);
  }
}

function renderBonusQuestions(matches, bonusPredictions = {}) {
  const countryOptions = getCountryOptions(matches);
  const africanOptions = filterAvailableTeams(matches, AFRICAN_TEAMS);
  const asianOptions = filterAvailableTeams(matches, ASIAN_TEAMS);
  const centralAmericanOptions = filterAvailableTeams(matches, CENTRAL_AMERICAN_TEAMS);
  const hostOptions = filterAvailableTeams(matches, HOST_TEAMS);
  bonusQuestionsContainer.innerHTML = `
    <label>
      Wie wordt wereldkampioen?
      <select id="bonus-championTeam">
        <option value="">Kies een land</option>
        ${renderCountryOptions(countryOptions, bonusPredictions.championTeam)}
      </select>
    </label>
    <label>
      Welk land scoort de meeste doelpunten?
      <select id="bonus-mostGoalsTeam">
        <option value="">Kies een land</option>
        ${renderCountryOptions(countryOptions, bonusPredictions.mostGoalsTeam)}
      </select>
    </label>
    <label>
      Welk land krijgt de meeste doelpunten tegen?
      <select id="bonus-mostConcededTeam">
        <option value="">Kies een land</option>
        ${renderCountryOptions(countryOptions, bonusPredictions.mostConcededTeam)}
      </select>
    </label>
    <label>
      Welk Afrikaans land komt het verst?
      <select id="bonus-bestAfricanTeam">
        <option value="">Kies een land</option>
        ${renderCountryOptions(africanOptions, bonusPredictions.bestAfricanTeam)}
      </select>
    </label>
    <label>
      Welk Aziatisch land komt het verst?
      <select id="bonus-bestAsianTeam">
        <option value="">Kies een land</option>
        ${renderCountryOptions(asianOptions, bonusPredictions.bestAsianTeam)}
      </select>
    </label>
    <label>
      Welk Midden-Amerikaans land komt het verst?
      <select id="bonus-bestCentralAmericanTeam">
        <option value="">Kies een land</option>
        ${renderCountryOptions(centralAmericanOptions, bonusPredictions.bestCentralAmericanTeam)}
      </select>
    </label>
    <label>
      Welk gastland komt het verst?
      <select id="bonus-bestHostTeam">
        <option value="">Kies een land</option>
        ${renderCountryOptions(hostOptions, bonusPredictions.bestHostTeam)}
      </select>
    </label>
    <label>
      Wie wordt topscorer?
      <input type="text" id="bonus-topScorer" value="${bonusPredictions.topScorer || ""}" placeholder="Naam speler">
    </label>
    <label>
      Wie wordt topscorer voor Nederland?
      <input type="text" id="bonus-topScorerNetherlands" value="${bonusPredictions.topScorerNetherlands || ""}" placeholder="Naam speler">
    </label>
    <label>
      Hoeveel doelpunten worden er in totaal gescoord?
      <input type="number" min="0" id="bonus-totalGoals" value="${bonusPredictions.totalGoals ?? ""}" placeholder="Bijvoorbeeld 171">
      <span class="field-hint" id="bonus-totalGoals-hint">Nog geen suggestie beschikbaar.</span>
    </label>
  `;
}

function collectPredictions() {
  const inputs = [...document.querySelectorAll("[data-match-id]")];
  const map = new Map();

  for (const input of inputs) {
    const matchId = input.dataset.matchId;
    const side = input.dataset.side;
    const current = map.get(matchId) || {
      matchId,
      predictedHomeScore: null,
      predictedAwayScore: null,
    };
    current[side === "home" ? "predictedHomeScore" : "predictedAwayScore"] =
      input.value === "" ? null : Number(input.value);
    map.set(matchId, current);
  }

  return [...map.values()];
}

function collectKnockoutPredictions() {
  const result = {};

  for (const round of rounds) {
    result[round.key] = [...document.querySelectorAll(`[data-round-key="${round.key}"]`)]
      .map((input) => input.value.trim());
  }

  return result;
}

function collectBonusPredictions() {
  return {
    championTeam: document.querySelector("#bonus-championTeam")?.value || "",
    mostGoalsTeam: document.querySelector("#bonus-mostGoalsTeam")?.value || "",
    mostConcededTeam: document.querySelector("#bonus-mostConcededTeam")?.value || "",
    bestAfricanTeam: document.querySelector("#bonus-bestAfricanTeam")?.value || "",
    bestAsianTeam: document.querySelector("#bonus-bestAsianTeam")?.value || "",
    bestCentralAmericanTeam: document.querySelector("#bonus-bestCentralAmericanTeam")?.value || "",
    bestHostTeam: document.querySelector("#bonus-bestHostTeam")?.value || "",
    topScorer: document.querySelector("#bonus-topScorer")?.value.trim() || "",
    topScorerNetherlands: document.querySelector("#bonus-topScorerNetherlands")?.value.trim() || "",
    totalGoals:
      document.querySelector("#bonus-totalGoals")?.value === ""
        ? null
        : Number(document.querySelector("#bonus-totalGoals")?.value),
  };
}

function calculateCompletion() {
  if (!state.bootstrap) {
    return 0;
  }

  const predictions = collectPredictions();
  const knockoutPredictions = collectKnockoutPredictions();
  const bonusPredictions = collectBonusPredictions();

  const totalMatchItems = getGroupStageMatches(state.bootstrap.matches).length;
  const filledMatchItems = predictions.filter(
    (prediction) => prediction.predictedHomeScore !== null && prediction.predictedAwayScore !== null,
  ).length;

  const totalKnockoutItems = rounds.reduce((sum, round) => sum + round.slots, 0);
  const filledKnockoutItems = Object.values(knockoutPredictions).reduce(
    (sum, teams) => sum + teams.filter(Boolean).length,
    0,
  );

  const totalBonusItems = 10;
  const filledBonusItems = [
    bonusPredictions.championTeam,
    bonusPredictions.mostGoalsTeam,
    bonusPredictions.mostConcededTeam,
    bonusPredictions.bestAfricanTeam,
    bonusPredictions.bestAsianTeam,
    bonusPredictions.bestCentralAmericanTeam,
    bonusPredictions.bestHostTeam,
    bonusPredictions.topScorer,
    bonusPredictions.topScorerNetherlands,
    bonusPredictions.totalGoals,
  ].filter((value) => value !== "" && value !== null).length;

  const totalItems = totalMatchItems + totalKnockoutItems + totalBonusItems;
  const filledItems = filledMatchItems + filledKnockoutItems + filledBonusItems;

  return Math.round((filledItems / totalItems) * 100);
}

function createPredictionMap(predictions) {
  return new Map(predictions.map((prediction) => [prediction.matchId, prediction]));
}

function createTeamStats(team, groupKey) {
  return {
    team,
    groupKey,
    played: 0,
    points: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0,
  };
}

function applyResult(homeStats, awayStats, homeScore, awayScore) {
  homeStats.played += 1;
  awayStats.played += 1;
  homeStats.goalsFor += homeScore;
  homeStats.goalsAgainst += awayScore;
  awayStats.goalsFor += awayScore;
  awayStats.goalsAgainst += homeScore;
  homeStats.goalDifference = homeStats.goalsFor - homeStats.goalsAgainst;
  awayStats.goalDifference = awayStats.goalsFor - awayStats.goalsAgainst;

  if (homeScore > awayScore) {
    homeStats.wins += 1;
    awayStats.losses += 1;
    homeStats.points += 3;
    return;
  }

  if (homeScore < awayScore) {
    awayStats.wins += 1;
    homeStats.losses += 1;
    awayStats.points += 3;
    return;
  }

  homeStats.draws += 1;
  awayStats.draws += 1;
  homeStats.points += 1;
  awayStats.points += 1;
}

function compareStats(left, right) {
  return (
    right.points - left.points ||
    right.goalDifference - left.goalDifference ||
    right.goalsFor - left.goalsFor ||
    left.team.localeCompare(right.team, "nl")
  );
}

function createMiniStats(teams, matches, predictionMap) {
  const teamSet = new Set(teams);
  const statsMap = new Map(teams.map((team) => [team, createTeamStats(team, "")]));

  for (const match of matches) {
    if (!teamSet.has(match.homeTeam) || !teamSet.has(match.awayTeam)) {
      continue;
    }

    const prediction = predictionMap.get(match.id);
    if (!prediction || prediction.predictedHomeScore === null || prediction.predictedAwayScore === null) {
      continue;
    }

    applyResult(
      statsMap.get(match.homeTeam),
      statsMap.get(match.awayTeam),
      prediction.predictedHomeScore,
      prediction.predictedAwayScore,
    );
  }

  return statsMap;
}

function resolveTie(teams, matches, predictionMap) {
  if (teams.length <= 1) {
    return teams;
  }

  const miniStatsMap = createMiniStats(teams, matches, predictionMap);
  const sorted = [...teams].sort((left, right) => compareStats(miniStatsMap.get(left), miniStatsMap.get(right)));
  const result = [];

  for (let index = 0; index < sorted.length; ) {
    const current = miniStatsMap.get(sorted[index]);
    const tiedGroup = [sorted[index]];
    index += 1;

    while (index < sorted.length) {
      const candidate = miniStatsMap.get(sorted[index]);
      if (
        candidate.points === current.points &&
        candidate.goalDifference === current.goalDifference &&
        candidate.goalsFor === current.goalsFor
      ) {
        tiedGroup.push(sorted[index]);
        index += 1;
      } else {
        break;
      }
    }

    if (tiedGroup.length === teams.length) {
      result.push(...tiedGroup.sort((left, right) => left.localeCompare(right, "nl")));
      continue;
    }

    result.push(...resolveTie(tiedGroup, matches, predictionMap));
  }

  return result;
}

function rankGroup(group, predictionMap) {
  const statsMap = new Map(group.teams.map((team) => [team, createTeamStats(team, group.key)]));
  let completedMatches = 0;

  for (const match of group.matches) {
    const prediction = predictionMap.get(match.id);
    if (!prediction || prediction.predictedHomeScore === null || prediction.predictedAwayScore === null) {
      continue;
    }

    completedMatches += 1;
    applyResult(
      statsMap.get(match.homeTeam),
      statsMap.get(match.awayTeam),
      prediction.predictedHomeScore,
      prediction.predictedAwayScore,
    );
  }

  const preliminary = [...group.teams].sort((left, right) => compareStats(statsMap.get(left), statsMap.get(right)));
  const rankedTeams = [];

  for (let index = 0; index < preliminary.length; ) {
    const current = statsMap.get(preliminary[index]);
    const tied = [preliminary[index]];
    index += 1;

    while (index < preliminary.length) {
      const candidate = statsMap.get(preliminary[index]);
      if (
        candidate.points === current.points &&
        candidate.goalDifference === current.goalDifference &&
        candidate.goalsFor === current.goalsFor
      ) {
        tied.push(preliminary[index]);
        index += 1;
      } else {
        break;
      }
    }

    rankedTeams.push(...resolveTie(tied, group.matches, predictionMap));
  }

  return {
    key: group.key,
    completedMatches,
    totalMatches: group.matches.length,
    table: rankedTeams.map((team, index) => ({
      ...statsMap.get(team),
      rank: index + 1,
    })),
  };
}

function compareThirdPlace(left, right) {
  return (
    right.points - left.points ||
    right.goalDifference - left.goalDifference ||
    right.goalsFor - left.goalsFor ||
    left.groupKey.localeCompare(right.groupKey, "nl")
  );
}

function buildStandingsSnapshot() {
  const groupMatches = getGroupStageMatches(state.bootstrap.matches);
  const predictions = collectPredictions();
  const predictionMap = createPredictionMap(predictions);
  const groups = getGroupContexts(state.bootstrap.matches).map((group) => rankGroup(group, predictionMap));
  const totalCompletedMatches = predictions.filter(
    (prediction) => prediction.predictedHomeScore !== null && prediction.predictedAwayScore !== null,
  ).length;
  const totalPredictedGoals = predictions.reduce((sum, prediction) => {
    if (prediction.predictedHomeScore === null || prediction.predictedAwayScore === null) {
      return sum;
    }

    return sum + prediction.predictedHomeScore + prediction.predictedAwayScore;
  }, 0);

  const thirdPlaceRanking = groups
    .map((group) => group.table.find((entry) => entry.rank === 3))
    .filter(Boolean)
    .sort(compareThirdPlace);

  const secondRoundSuggestion =
    totalCompletedMatches > 0
      ? [
          ...groups.flatMap((group) => group.table.filter((entry) => entry.rank <= 2).map((entry) => entry.team)),
          ...thirdPlaceRanking.slice(0, 8).map((entry) => entry.team),
        ]
      : [];

  return {
    groups,
    groupMatches,
    totalCompletedMatches,
    totalPredictedGoals,
    thirdPlaceRanking,
    secondRoundSuggestion,
  };
}

function uniqueTeams(teams) {
  return [...new Set(teams.filter(Boolean))];
}

function getGroupSlotTeam(snapshot, slotCode) {
  const match = /^([12])([A-L])$/.exec(String(slotCode || ""));
  if (!match) {
    return "";
  }

  const rank = Number(match[1]);
  const group = snapshot.groups.find((entry) => entry.key === match[2]);
  return group?.table.find((entry) => entry.rank === rank)?.team || "";
}

function getThirdPlaceSlotTeams(snapshot, slotCode, opponentSlotCode = "") {
  const match = /^3-([A-L]+)$/.exec(String(slotCode || ""));
  if (!match) {
    return [];
  }

  const qualifiedThirdPlaceTeams = snapshot.thirdPlaceRanking.slice(0, 8);
  const qualifiedGroupsKey = qualifiedThirdPlaceTeams
    .map((entry) => entry.groupKey)
    .sort((left, right) => left.localeCompare(right, "nl"))
    .join("");
  const columnIndex = THIRD_PLACE_ASSIGNMENT_COLUMNS.indexOf(String(opponentSlotCode || "").trim());
  const assignedGroup = columnIndex >= 0 ? THIRD_PLACE_ASSIGNMENTS[qualifiedGroupsKey]?.[columnIndex] : "";
  if (assignedGroup && match[1].includes(assignedGroup)) {
    const assignedEntry = qualifiedThirdPlaceTeams.find((entry) => entry.groupKey === assignedGroup);
    return assignedEntry ? [assignedEntry.team] : [];
  }

  return qualifiedThirdPlaceTeams
    .filter((entry) => match[1].includes(entry.groupKey))
    .map((entry) => entry.team);
}

function getKnockoutSlotOptions(slotCode, knockoutPredictions, snapshot, opponentSlotCode = "") {
  const code = String(slotCode || "").trim();
  const groupSlotTeam = getGroupSlotTeam(snapshot, code);
  if (groupSlotTeam) {
    return [groupSlotTeam];
  }

  const thirdPlaceTeams = getThirdPlaceSlotTeams(snapshot, code, opponentSlotCode);
  if (thirdPlaceTeams.length) {
    return thirdPlaceTeams;
  }

  if (/^W\d+$/.test(code)) {
    return getKnockoutMatchSelections(knockoutPredictions, code.slice(1));
  }

  return [];
}

function buildSecondRoundSuggestionFromSlots(knockoutPredictions, snapshot) {
  const usedTeams = new Set();
  const values = [];
  const matches = getKnockoutMatchesByRoundKey(state.bootstrap.matches, "secondRound");

  for (const match of matches) {
    const matchSlots = [match.homeSlotCode || match.homeTeam, match.awaySlotCode || match.awayTeam];
    for (let index = 0; index < matchSlots.length; index += 1) {
      const slotCode = matchSlots[index];
      const opponentSlotCode = matchSlots[index === 0 ? 1 : 0];
      const options = getKnockoutSlotOptions(slotCode, knockoutPredictions, snapshot, opponentSlotCode);
      const nextTeam = options.find((team) => !usedTeams.has(team)) || "";
      if (nextTeam) {
        usedTeams.add(nextTeam);
      }
      values.push(nextTeam);
    }
  }

  return values;
}

function renderGroupStandings(snapshot) {
  groupProgressPill.textContent = `${snapshot.totalCompletedMatches} wedstrijden verwerkt`;
  groupProgressPill.className = `pill ${snapshot.totalCompletedMatches > 0 ? "success" : "muted"}`.trim();

  thirdRankingContainer.innerHTML = `
    <div class="section-head">
      <h3>Ranglijst beste nummers drie</h3>
      <span class="pill muted">Beste 8 gaan door</span>
    </div>
    <div class="ranking-table-wrap">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Land</th>
            <th>Gs</th>
            <th>W</th>
            <th>Gl</th>
            <th>V</th>
            <th>Pt</th>
            <th>Dv</th>
            <th>Dt</th>
            <th>DS</th>
          </tr>
        </thead>
        <tbody>
          ${
            snapshot.thirdPlaceRanking.length
              ? snapshot.thirdPlaceRanking
                  .map(
                    (entry, index) => `
                      <tr class="${index < 8 ? "qualified-row" : ""}">
                        <td>${index + 1}</td>
                        <td>${entry.team}</td>
                        <td>${entry.played}</td>
                        <td>${entry.wins}</td>
                        <td>${entry.draws}</td>
                        <td>${entry.losses}</td>
                        <td class="points-cell">${entry.points}</td>
                        <td>${entry.goalsFor}</td>
                        <td>${entry.goalsAgainst}</td>
                        <td>${entry.goalDifference}</td>
                      </tr>
                    `,
                  )
                  .join("")
              : '<tr><td colspan="10">Nog geen tussenstand beschikbaar.</td></tr>'
          }
        </tbody>
      </table>
    </div>
    <p class="notice">Fair play en loting zitten nog niet in deze automatische tussenstand.</p>
  `;

  groupStandingsContainer.innerHTML = snapshot.groups
    .map(
      (group) => `
        <section class="group-card">
          <div class="section-head">
            <h3>Poule ${group.key}</h3>
            <span class="pill muted">${group.completedMatches}/${group.totalMatches} wedstrijden</span>
          </div>
          ${renderGroupTable(group)}
        </section>
      `,
    )
    .join("");

  for (const group of snapshot.groups) {
    const container = document.querySelector(`#group-standing-${group.key}`);
    const progress = document.querySelector(`#group-progress-${group.key}`);
    if (container) {
      container.innerHTML = renderGroupTable(group);
    }
    if (progress) {
      progress.textContent = `${group.completedMatches}/${group.totalMatches} wedstrijden`;
      progress.className = `pill ${group.completedMatches ? "success" : "muted"}`.trim();
    }
  }
}

function updateTotalGoalsSuggestion(snapshot) {
  const hint = document.querySelector("#bonus-totalGoals-hint");
  if (!hint) {
    return;
  }

  if (snapshot.totalCompletedMatches === 0) {
    hint.textContent = "Nog geen suggestie beschikbaar.";
    return;
  }

  const suggestedTotal = Math.round((snapshot.totalPredictedGoals / snapshot.totalCompletedMatches) * 104);
  hint.textContent = `Suggestie op basis van jouw voorspellingen: ${suggestedTotal} doelpunten.`;
}

function renderSecondRoundSuggestion(suggestedTeams) {
  const hasSuggestion = suggestedTeams.length > 0;
  secondRoundSuggestionContainer.innerHTML = `
    <div class="section-head">
      <div>
        <h3>Suggestie tweede ronde</h3>
        <p class="notice">Deze suggestie is berekend op basis van jouw ingevulde uitslagen: de eerste twee per poule plus de 8 beste nummers drie.</p>
      </div>
      <button type="button" id="apply-second-round-suggestion" ${hasSuggestion ? "" : "disabled"}>Neem suggestie over</button>
    </div>
    <div class="chip-list">
      ${
        hasSuggestion
          ? suggestedTeams.map((team) => `<span class="team-chip">${team}</span>`).join("")
          : '<span class="notice">Vul eerst een paar groepswedstrijden volledig in.</span>'
      }
    </div>
  `;
}

function renderGroupTable(group) {
  return `
    <div class="ranking-table-wrap">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Land</th>
            <th>Gs</th>
            <th>W</th>
            <th>Gl</th>
            <th>V</th>
            <th>Pt</th>
            <th>Dv</th>
            <th>Dt</th>
            <th>DS</th>
          </tr>
        </thead>
        <tbody>
          ${group.table
            .map(
              (entry) => `
                <tr class="${entry.rank <= 2 ? "qualified-row" : entry.rank === 3 ? "playoff-row" : ""}">
                  <td>${entry.rank}</td>
                  <td>${entry.team}</td>
                  <td>${entry.played}</td>
                  <td>${entry.wins}</td>
                  <td>${entry.draws}</td>
                  <td>${entry.losses}</td>
                  <td class="points-cell">${entry.points}</td>
                  <td>${entry.goalsFor}</td>
                  <td>${entry.goalsAgainst}</td>
                  <td>${entry.goalDifference}</td>
                </tr>
              `,
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderRounds(rules, knockoutPredictions = {}, suggestions = {}, snapshot = buildStandingsSnapshot()) {
  roundsContainer.innerHTML = "";

  for (const round of rounds) {
    const matches = getKnockoutMatchesByRoundKey(state.bootstrap.matches, round.key);
    const wrapper = document.createElement("section");
    wrapper.className = "round-card form-page";
    wrapper.dataset.page = round.pageKey;
    wrapper.innerHTML = `
      <div class="round-header">
        <div>
          <h3>${round.label}</h3>
        </div>
        <p class="round-points">${rules[round.pointsKey]} p. per land</p>
      </div>
      <div class="round-inputs"></div>
    `;

    const inputs = wrapper.querySelector(".round-inputs");
    const values = knockoutPredictions[round.key] || [];
    const selectedValues = values.filter(Boolean);

    if (round.key === "secondRound" && suggestions.secondRoundSuggestion?.length) {
      const suggestionText = document.createElement("p");
      suggestionText.className = "notice round-hint";
      suggestionText.textContent = `${suggestions.secondRoundSuggestion.length} landen voorgesteld op basis van jouw groepsstanden.`;
      wrapper.insertBefore(suggestionText, inputs);
    }

    let valueIndex = 0;

    for (const match of matches) {
      const article = document.createElement("article");
      article.className = "knockout-match-card";

      const homeValue = values[valueIndex] || "";
      const awayValue = values[valueIndex + 1] || "";
      const slots = [
        { code: match.homeSlotCode || match.homeTeam, value: homeValue, label: "thuis" },
        { code: match.awaySlotCode || match.awayTeam, value: awayValue, label: "uit" },
      ];
      valueIndex += 2;

      article.innerHTML = `
        <div class="knockout-match-head">
          <p class="match-title">Wedstrijd ${match.matchNumber}</p>
          <p class="match-meta">${formatDayLabel(match.kickoffAt)} om ${formatTime(match.kickoffAt)} - ${match.city}</p>
          <p class="match-meta compact-source">${describeKnockoutSource(match.homeSlotCode || match.homeTeam, knockoutPredictions)} tegen ${describeKnockoutSource(match.awaySlotCode || match.awayTeam, knockoutPredictions)}</p>
        </div>
        <div class="knockout-team-selects"></div>
      `;

      const selectsContainer = article.querySelector(".knockout-team-selects");

      for (const slot of slots) {
        const opponentSlotCode = slots.find((candidate) => candidate !== slot)?.code || "";
        const field = document.createElement("label");
        field.className = "round-slot";
        field.innerHTML = `<span>${slot.code}</span>`;

        const select = document.createElement("select");
        select.dataset.roundKey = round.key;
        select.dataset.slotCode = slot.code;
        select.setAttribute("aria-label", `${round.label} ${slot.label} land voor ${slot.code}`);

        const emptyOption = document.createElement("option");
        emptyOption.value = "";
        emptyOption.textContent = "Kies een land";
        select.appendChild(emptyOption);

        const slotOptions = uniqueTeams([
          ...getKnockoutSlotOptions(slot.code, knockoutPredictions, snapshot, opponentSlotCode),
          slot.value,
        ]);

        if (!slotOptions.length) {
          emptyOption.textContent =
            round.key === "secondRound" ? "Vul eerst de poule volledig in" : "Vul vorige ronde eerst in";
        }

        for (const country of slotOptions) {
          if (selectedValues.includes(country) && country !== slot.value) {
            continue;
          }

          const option = document.createElement("option");
          option.value = country;
          option.textContent = country;
          if (slot.value === country) {
            option.selected = true;
          }
          select.appendChild(option);
        }

        field.appendChild(select);
        selectsContainer.appendChild(field);
      }

      inputs.appendChild(article);
    }

    roundsContainer.appendChild(wrapper);
  }
}

function refreshDerivedViews(overrideKnockoutPredictions = null) {
  if (!state.bootstrap) {
    return;
  }

  const knockoutPredictions = overrideKnockoutPredictions || collectKnockoutPredictions();
  const snapshot = buildStandingsSnapshot();
  renderGroupStandings(snapshot);
  updateTotalGoalsSuggestion(snapshot);
  renderSecondRoundSuggestion(snapshot.secondRoundSuggestion);
  renderRounds(state.bootstrap.rules, knockoutPredictions, {
    secondRoundSuggestion: snapshot.secondRoundSuggestion,
  }, snapshot);
  setCompletionStatus(calculateCompletion());
  setActivePage(state.currentPage || pageKeyFromHash(), false);
}

async function saveParticipant() {
  if (state.bootstrap?.isLocked) {
    setSaveStatus("Voorspellingen zijn vergrendeld", "warning");
    return;
  }

  const payload = {
    name: nameInput.value.trim(),
    predictions: collectPredictions(),
    knockoutPredictions: collectKnockoutPredictions(),
    bonusPredictions: collectBonusPredictions(),
  };

  if (!payload.name) {
    setSaveStatus("Vul eerst je naam in", "warning");
    return;
  }

  setSaveStatus("Bezig met opslaan...", "muted");

  const url = state.participant
    ? poolApiPath(`/participants/${state.participant.editToken}`)
    : poolApiPath("/participants");
  const method = state.participant ? "PUT" : "POST";

  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    setSaveStatus(data.error || "Opslaan mislukt", "warning");
    return;
  }

  state.participant = data;
  setSaveStatus("Opgeslagen", "success");
  setCompletionStatus(calculateCompletion());
  editLink.href = `${poolBasePath()}/edit/${data.editToken}`;
  editLink.classList.remove("hidden");

  if (window.location.pathname === poolBasePath()) {
    window.history.replaceState({}, "", `${poolBasePath()}/edit/${data.editToken}`);
  }
}

function queueAutosave() {
  if (!state.participant || state.bootstrap?.isLocked) {
    return;
  }

  clearTimeout(state.saveTimer);
  setSaveStatus("Wijzigingen nog niet opgeslagen", "warning");
  state.saveTimer = window.setTimeout(() => {
    saveParticipant().catch(() => setSaveStatus("Autosave mislukt", "warning"));
  }, 1200);
}

async function loadParticipant(token) {
  const response = await fetch(poolApiPath(`/participants/${token}`));
  if (!response.ok) {
    setSaveStatus("Bewerk-link niet gevonden", "warning");
    return;
  }

  state.participant = await response.json();
  nameInput.value = state.participant.name;
  renderMatches(state.bootstrap.matches, state.participant.predictions);
  renderBonusQuestions(state.bootstrap.matches, state.participant.bonusPredictions || {});
  refreshDerivedViews(state.participant.knockoutPredictions || {});
  editLink.href = `${poolBasePath()}/edit/${state.participant.editToken}`;
  editLink.classList.remove("hidden");
  setSaveStatus("Bewerk-link geladen", "success");
}

async function recoverParticipantByName() {
  const name = nameInput.value.trim();
  if (!name) {
    setSaveStatus("Vul eerst je naam in", "warning");
    return;
  }

  setSaveStatus("Bestaande inzending zoeken...", "muted");

  const response = await fetch(poolApiPath("/recover"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });

  const data = await response.json();
  if (!response.ok) {
    setSaveStatus(data.error || "Inzending niet gevonden", "warning");
    return;
  }

  window.location.href = `${poolBasePath()}/edit/${data.editToken}`;
}

function applySecondRoundSuggestion() {
  const snapshot = buildStandingsSnapshot();
  const nextPredictions = {
    ...collectKnockoutPredictions(),
    secondRound: buildSecondRoundSuggestionFromSlots(collectKnockoutPredictions(), snapshot),
  };
  refreshDerivedViews(nextPredictions);
  queueAutosave();
}

async function init() {
  const response = await fetch(poolApiPath("/bootstrap"));
  state.bootstrap = await response.json();

  document.querySelectorAll(".nav a").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === "/") {
      link.setAttribute("href", poolBasePath());
    }
    if (href === "/stand") {
      link.setAttribute("href", `${poolBasePath()}/stand`);
    }
  });

  deadlineCopy.textContent = `Je kunt invullen en wijzigen tot ${formatDateTime(state.bootstrap.competition.predictionDeadline)}.`;
  competitionName.textContent = state.bootstrap.pool?.name || state.bootstrap.competition.name;
  heroPoolName.textContent = state.bootstrap.pool?.name || state.bootstrap.competition.name;

  renderRulesContent(state.bootstrap.rules);
  renderPageNavigation();
  renderMatches(state.bootstrap.matches);
  renderBonusQuestions(state.bootstrap.matches);
  state.currentPage = pageKeyFromHash();
  refreshDerivedViews();

  if (state.bootstrap.isLocked) {
    setSaveStatus("Inzenden is gesloten", "warning");
    saveButton.disabled = true;
    nameInput.disabled = true;
  }

  const token = getTokenFromUrl();
  if (token) {
    await loadParticipant(token);
  }

  saveButton.addEventListener("click", () => {
    saveParticipant().catch(() => setSaveStatus("Opslaan mislukt", "warning"));
  });

  recoverButton.addEventListener("click", () => {
    recoverParticipantByName().catch(() => setSaveStatus("Zoeken mislukt", "warning"));
  });

  document.body.addEventListener("input", (event) => {
    if (state.bootstrap?.isLocked) {
      return;
    }

    if (event.target instanceof HTMLInputElement) {
      refreshDerivedViews();
      queueAutosave();
    }
  });

  document.body.addEventListener("change", (event) => {
    if (state.bootstrap?.isLocked) {
      return;
    }

    if (event.target instanceof HTMLSelectElement) {
      refreshDerivedViews();
      queueAutosave();
    }
  });

  document.body.addEventListener("click", (event) => {
    const trigger = event.target.closest("#apply-second-round-suggestion");
    if (!trigger || state.bootstrap?.isLocked) {
      return;
    }

    applySecondRoundSuggestion();
  });

  window.addEventListener("hashchange", () => {
    setActivePage(pageKeyFromHash(), false);
  });
}

init().catch(() => {
  setSaveStatus("Laden mislukt", "warning");
});
