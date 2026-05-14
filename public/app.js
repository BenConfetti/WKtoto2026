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

function getThirdPlaceSlotTeams(snapshot, slotCode) {
  const match = /^3-([A-L]+)$/.exec(String(slotCode || ""));
  if (!match) {
    return [];
  }

  const allowedGroups = new Set(match[1].split(""));
  return snapshot.thirdPlaceRanking
    .slice(0, 8)
    .filter((entry) => allowedGroups.has(entry.groupKey))
    .map((entry) => entry.team);
}

function getKnockoutSlotOptions(slotCode, knockoutPredictions, snapshot) {
  const code = String(slotCode || "").trim();
  const groupSlotTeam = getGroupSlotTeam(snapshot, code);
  if (groupSlotTeam) {
    return [groupSlotTeam];
  }

  const thirdPlaceTeams = getThirdPlaceSlotTeams(snapshot, code);
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
    for (const slotCode of [match.homeSlotCode || match.homeTeam, match.awaySlotCode || match.awayTeam]) {
      const options = getKnockoutSlotOptions(slotCode, knockoutPredictions, snapshot);
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
          ...getKnockoutSlotOptions(slot.code, knockoutPredictions, snapshot),
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
