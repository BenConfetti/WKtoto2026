const rounds = [
  { key: "secondRound", label: "Tweede ronde", pointsKey: "secondRoundPoints", slots: 32 },
  { key: "thirdRound", label: "Derde ronde", pointsKey: "thirdRoundPoints", slots: 16 },
  { key: "quarterFinal", label: "Kwartfinale", pointsKey: "quarterFinalPoints", slots: 8 },
  { key: "semiFinal", label: "Halve finale", pointsKey: "semiFinalPoints", slots: 4 },
  { key: "final", label: "Finale", pointsKey: "finalPoints", slots: 2 },
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

const loginCard = document.querySelector("#login-card");
const rulesCard = document.querySelector("#rules-card");
const poolCard = document.querySelector("#pool-card");
const poolRulesCard = document.querySelector("#pool-rules-card");
const liveStatusCard = document.querySelector("#live-status-card");
const resultsCard = document.querySelector("#results-card");
const participantsCard = document.querySelector("#participants-card");
const resetCard = document.querySelector("#reset-card");
const loginStatus = document.querySelector("#login-status");
const rulesStatus = document.querySelector("#rules-status");
const liveStatus = document.querySelector("#live-status");
const resultsStatus = document.querySelector("#results-status");
const poolStatus = document.querySelector("#pool-status");
const poolCount = document.querySelector("#pool-count");
const poolList = document.querySelector("#admin-pool-list");
const selectedPoolName = document.querySelector("#selected-pool-name");
const selectedPoolSlug = document.querySelector("#selected-pool-slug");
const matchList = document.querySelector("#admin-match-list");
const knockoutResultsContainer = document.querySelector("#admin-knockout-results");
const participantsCount = document.querySelector("#participants-count");
const participantsList = document.querySelector("#admin-participants");
const copyTargetPoolSelect = document.querySelector("#copy-target-pool");
const copySkipExistingInput = document.querySelector("#copy-skip-existing");
const copySelectAllInput = document.querySelector("#copy-select-all");
const copyParticipantsButton = document.querySelector("#copy-participants-button");
const copyParticipantsStatus = document.querySelector("#copy-participants-status");
const resultsStatusBanner = document.querySelector("#results-status-banner");
const saveResultsButton = document.querySelector("#save-results-button");
const saveLiveStatusButton = document.querySelector("#save-live-status-button");
const downloadBackupButton = document.querySelector("#download-backup-button");
const downloadBackupStatus = document.querySelector("#download-backup-status");
const resetLaunchDataButton = document.querySelector("#reset-launch-data-button");
const resetLaunchDataStatus = document.querySelector("#reset-launch-data-status");
const eliminatedTeamsContainer = document.querySelector("#admin-eliminated-teams");
const qualifiedSecondRoundContainer = document.querySelector("#admin-qualified-second-round-teams");

const ruleFields = [
  "publicRulesTitle",
  "publicRulesIntro",
  "publicRulesBody",
  "exactScorePoints",
  "correctOutcomePoints",
  "secondRoundPoints",
  "thirdRoundPoints",
  "quarterFinalPoints",
  "semiFinalPoints",
  "finalPoints",
  "championPoints",
  "mostGoalsTeamPoints",
  "mostConcededTeamPoints",
  "bestAfricanTeamPoints",
  "bestAsianTeamPoints",
  "bestCentralAmericanTeamPoints",
  "bestHostTeamPoints",
  "topScorerPoints",
  "topScorerNetherlandsPoints",
  "totalGoalsExactPoints",
];

let adminMatches = [];
let currentRules = null;
let currentPoolRules = null;
let adminPools = [];
let selectedPoolId = null;

function formatDateTime(value) {
  return new Intl.DateTimeFormat("nl-NL", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function setResultsStatus(message, tone = "muted") {
  resultsStatus.textContent = message;
  if (resultsStatusBanner) {
    resultsStatusBanner.textContent = message;
    resultsStatusBanner.className = `status-banner ${tone}`.trim();
  }
}

function setLiveStatus(message) {
  if (liveStatus) {
    liveStatus.textContent = message;
  }
}

function getAdminEditLink(participant) {
  const pool = getSelectedPool();
  return `${window.location.origin}/pool/${pool?.slug || ""}/edit/${participant.editToken}`;
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

function getSelectedPool() {
  return adminPools.find((pool) => pool.id === selectedPoolId) || null;
}

function calculateParticipantCompletion(participant) {
  const totalMatchItems = adminMatches.filter((match) => match.stage === "Groepsfase").length;
  const filledMatchItems = participant.predictions.filter(
    (entry) =>
      entry.match?.stage === "Groepsfase" &&
      entry.predictedHomeScore !== null &&
      entry.predictedAwayScore !== null,
  ).length;

  const totalKnockoutItems = Object.values(participant.knockoutPredictions || {}).reduce(
    (sum, teams) => sum + teams.filter(Boolean).length,
    0,
  );

  const expectedKnockoutItems = 32 + 16 + 8 + 4 + 2;
  const filledBonusItems = [
    participant.bonusPredictions?.championTeam,
    participant.bonusPredictions?.mostGoalsTeam,
    participant.bonusPredictions?.mostConcededTeam,
    participant.bonusPredictions?.bestAfricanTeam,
    participant.bonusPredictions?.bestAsianTeam,
    participant.bonusPredictions?.bestCentralAmericanTeam,
    participant.bonusPredictions?.bestHostTeam,
    participant.bonusPredictions?.topScorer,
    participant.bonusPredictions?.topScorerNetherlands,
    participant.bonusPredictions?.totalGoals,
  ].filter((value) => value !== "" && value !== null && value !== undefined).length;

  const totalItems = totalMatchItems + expectedKnockoutItems + 10;
  const filledItems = filledMatchItems + totalKnockoutItems + filledBonusItems;
  if (totalItems === 0) {
    return 0;
  }

  return Math.min(100, Math.round((filledItems / totalItems) * 100));
}

function getCountryOptionsFromMatches(matches) {
  return [...new Set(matches
    .filter((match) => match.stage === "Groepsfase")
    .flatMap((match) => [match.homeTeam, match.awayTeam]))].sort((left, right) =>
    left.localeCompare(right, "nl"),
  );
}

function filterAvailableTeams(matches, allowedTeams) {
  const availableTeams = new Set(getCountryOptionsFromMatches(matches));
  return allowedTeams.filter((team) => availableTeams.has(team) || availableTeams.has(HOST_TEAM_ALIASES[team]));
}

function getPoolInviteLink(pool) {
  return `${window.location.origin}/pool/${pool.slug}`;
}

function getPoolStandLink(pool) {
  return `${window.location.origin}/pool/${pool.slug}/stand`;
}

function getPoolStatsLink(pool) {
  return `${window.location.origin}/pool/${pool.slug}/stats`;
}

function getGroupStageMatches(matches) {
  return matches.filter((match) => match.stage === "Groepsfase");
}

function getKnockoutStageMatches(matches) {
  const knockoutLabels = new Set(rounds.map((round) => round.label));
  return matches.filter((match) => knockoutLabels.has(match.stage));
}

function getKnockoutMatchesByRoundKey(matches, roundKey) {
  const round = rounds.find((entry) => entry.key === roundKey);
  if (!round) {
    return [];
  }

  return matches.filter((match) => match.stage === round.label);
}

function populateBonusResultSelect(id, countries, selectedValue) {
  const select = document.querySelector(`#${id}`);
  if (!select) {
    return;
  }

  select.innerHTML = `<option value="">Kies een land</option>${countries
    .map((country) => `<option value="${country}" ${selectedValue === country ? "selected" : ""}>${country}</option>`)
    .join("")}`;
}

function renderCheckboxList(containerId, options, selectedValues) {
  const container = document.querySelector(`#${containerId}`);
  if (!container) {
    return;
  }

  const selected = new Set(selectedValues || []);
  container.innerHTML = options
    .map(
      (option) => `
        <label class="checkbox-option">
          <input type="checkbox" value="${option}" ${selected.has(option) ? "checked" : ""}>
          <span>${option}</span>
        </label>
      `,
    )
    .join("");
}

function getCheckedValues(containerId) {
  return [...document.querySelectorAll(`#${containerId} input[type="checkbox"]:checked`)].map((input) => input.value);
}

function renderEliminatedTeams(selectedTeams = []) {
  if (!eliminatedTeamsContainer) {
    return;
  }

  const countries = getCountryOptionsFromMatches(adminMatches);
  renderCheckboxList("admin-eliminated-teams", countries, selectedTeams);
}

function renderQualifiedSecondRoundTeams(selectedTeams = []) {
  if (!qualifiedSecondRoundContainer) {
    return;
  }

  const countries = getCountryOptionsFromMatches(adminMatches);
  renderCheckboxList("admin-qualified-second-round-teams", countries, selectedTeams);
}

function renderKnockoutResults(rules) {
  if (!knockoutResultsContainer) {
    return;
  }

  const countries = getCountryOptionsFromMatches(adminMatches);
  const knockoutResults = rules?.knockoutResults || {};
  knockoutResultsContainer.innerHTML = "";

  for (const round of rounds) {
    const matches = getKnockoutMatchesByRoundKey(adminMatches, round.key);
    const wrapper = document.createElement("section");
    wrapper.className = "round-card";
    wrapper.innerHTML = `
      <div class="round-header">
        <div>
          <h3>${round.label}</h3>
        </div>
        <p class="round-points">${round.slots} landen</p>
      </div>
      <div class="round-inputs"></div>
    `;

    const inputs = wrapper.querySelector(".round-inputs");
    const values = knockoutResults[round.key] || [];
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
        </div>
        <div class="knockout-team-selects"></div>
        <div class="admin-score-grid knockout-score-grid">
          <span class="match-title">Uitslag</span>
          <input type="number" min="0" data-knockout-match-id="${match.id}" data-field="homeScore" value="${match.homeScore ?? ""}" placeholder="0">
          <span>-</span>
          <input type="number" min="0" data-knockout-match-id="${match.id}" data-field="awayScore" value="${match.awayScore ?? ""}" placeholder="0">
          <select data-knockout-match-id="${match.id}" data-field="status">
            <option value="scheduled" ${match.status === "scheduled" ? "selected" : ""}>Gepland</option>
            <option value="finished" ${match.status === "finished" ? "selected" : ""}>Afgelopen</option>
          </select>
          <label class="checkbox-inline">
            <input type="checkbox" data-knockout-match-id="${match.id}" data-field="afterExtraTime" ${match.afterExtraTime ? "checked" : ""}>
            Na verlenging
          </label>
          <label class="penalty-winner-field">
            Wint na strafschoppen
            <select data-knockout-match-id="${match.id}" data-field="penaltyWinnerTeam">
              <option value="">Niet van toepassing</option>
              ${[homeValue, awayValue]
                .filter(Boolean)
                .map((team) => `<option value="${team}" ${match.penaltyWinnerTeam === team ? "selected" : ""}>${team}</option>`)
                .join("")}
            </select>
          </label>
        </div>
      `;

      const selectsContainer = article.querySelector(".knockout-team-selects");

      for (const slot of slots) {
        const field = document.createElement("label");
        field.className = "round-slot";
        field.innerHTML = `<span>${slot.code}</span>`;

        const select = document.createElement("select");
        select.dataset.actualRoundKey = round.key;
        select.dataset.slotCode = slot.code;
        select.setAttribute("aria-label", `${round.label} werkelijk ${slot.label} land voor ${slot.code}`);

        const emptyOption = document.createElement("option");
        emptyOption.value = "";
        emptyOption.textContent = "Kies een land";
        select.appendChild(emptyOption);

        for (const country of countries) {
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

    knockoutResultsContainer.appendChild(wrapper);
  }
}

function collectKnockoutResultsFromForm() {
  const result = {};

  for (const round of rounds) {
    result[round.key] = [...document.querySelectorAll(`[data-actual-round-key="${round.key}"]`)]
      .map((input) => input.value.trim())
      .filter(Boolean);
  }

  return result;
}

function applyKnockoutRoundValues(roundValues) {
  for (const round of rounds) {
    const values = roundValues[round.key] || [];
    document.querySelectorAll(`[data-actual-round-key="${round.key}"]`).forEach((input, index) => {
      if (values[index]) {
        input.value = values[index];
      }
    });
  }
  refreshPenaltyWinnerOptions();
}

function refreshPenaltyWinnerOptions() {
  for (const entry of collectKnockoutRoundEntries()) {
    const select = document.querySelector(`[data-knockout-match-id="${entry.match.id}"][data-field="penaltyWinnerTeam"]`);
    if (!select) {
      continue;
    }
    const currentValue = select.value;
    const options = [entry.homeTeam, entry.awayTeam].filter(Boolean);
    select.innerHTML = '<option value="">Niet van toepassing</option>';
    for (const team of options) {
      const option = document.createElement("option");
      option.value = team;
      option.textContent = team;
      option.selected = currentValue === team;
      select.appendChild(option);
    }
  }
}

function syncBonusResultInputs(rules) {
  const countries = getCountryOptionsFromMatches(adminMatches);
  const africanCountries = filterAvailableTeams(adminMatches, AFRICAN_TEAMS);
  const asianCountries = filterAvailableTeams(adminMatches, ASIAN_TEAMS);
  const centralAmericanCountries = filterAvailableTeams(adminMatches, CENTRAL_AMERICAN_TEAMS);
  const hostCountries = filterAvailableTeams(adminMatches, HOST_TEAMS);
  const bonusResults = rules?.bonusResults || {};
  populateBonusResultSelect("bonusResultChampionTeam", countries, bonusResults.championTeam || "");
  populateBonusResultSelect("bonusResultMostGoalsTeam", countries, bonusResults.mostGoalsTeam || "");
  populateBonusResultSelect("bonusResultMostConcededTeam", countries, bonusResults.mostConcededTeam || "");
  renderCheckboxList(
    "bonusResultBestAfricanTeamList",
    africanCountries,
    bonusResults.bestAfricanTeamAnswers || [],
  );
  renderCheckboxList(
    "bonusResultBestAsianTeamList",
    asianCountries,
    bonusResults.bestAsianTeamAnswers || [],
  );
  renderCheckboxList(
    "bonusResultBestCentralAmericanTeamList",
    centralAmericanCountries,
    bonusResults.bestCentralAmericanTeamAnswers || [],
  );
  renderCheckboxList(
    "bonusResultBestHostTeamList",
    hostCountries,
    bonusResults.bestHostTeamAnswers || [],
  );
  const topScorerInput = document.querySelector("#bonusResultTopScorer");
  const topScorerNetherlandsInput = document.querySelector("#bonusResultTopScorerNetherlands");
  const totalGoalsInput = document.querySelector("#bonusResultTotalGoals");
  if (topScorerInput) {
    topScorerInput.value = (bonusResults.topScorerAnswers || []).join("\n");
  }
  if (topScorerNetherlandsInput) {
    topScorerNetherlandsInput.value = (bonusResults.topScorerNetherlandsAnswers || []).join("\n");
  }
  if (totalGoalsInput) {
    totalGoalsInput.value = bonusResults.totalGoals ?? "";
  }
}

function syncLiveStatusInputs(rules) {
  const liveTopScorerInput = document.querySelector("#liveCurrentTopScorer");
  const liveDutchTopScorerInput = document.querySelector("#liveCurrentDutchTopScorer");

  if (liveTopScorerInput) {
    liveTopScorerInput.value = rules?.liveLeaders?.currentTopScorer || "";
  }
  if (liveDutchTopScorerInput) {
    liveDutchTopScorerInput.value = rules?.liveLeaders?.currentDutchTopScorer || "";
  }
}

function renderPools(pools) {
  adminPools = pools;
  poolCount.textContent = `${pools.length} pools`;
  renderCopyTargetPools();
  poolList.innerHTML = pools
    .map((pool) => `
      <article class="admin-pool-card ${pool.id === selectedPoolId ? "is-active" : ""}">
        <div>
          <h3>${pool.name}</h3>
          <p class="notice">/${pool.slug}</p>
        </div>
        <div class="admin-participant-actions">
          <button type="button" class="secondary-action admin-copy-invite" data-invite-link="${getPoolInviteLink(pool)}">Kopieer invite-link</button>
          <button type="button" class="secondary-action admin-copy-stand" data-stand-link="${getPoolStandLink(pool)}">Kopieer stand-link</button>
          <a class="secondary-action" href="${getPoolStandLink(pool)}" target="_blank" rel="noreferrer">Open stand</a>
          <a class="secondary-action" href="${getPoolStatsLink(pool)}" target="_blank" rel="noreferrer">Open stats</a>
          <button type="button" class="secondary-action admin-select-pool" data-pool-id="${pool.id}">Open pool</button>
        </div>
      </article>
    `)
    .join("");
}

function renderCopyTargetPools() {
  if (!copyTargetPoolSelect) {
    return;
  }

  const targetPools = adminPools.filter((pool) => pool.id !== selectedPoolId);
  copyTargetPoolSelect.innerHTML = targetPools
    .map((pool) => `<option value="${pool.id}">${pool.name}</option>`)
    .join("");
  copyParticipantsButton.disabled = targetPools.length === 0;
  if (!targetPools.length) {
    copyTargetPoolSelect.innerHTML = '<option value="">Geen andere pool beschikbaar</option>';
  }
}

async function loadPools() {
  const response = await fetch("/api/admin/pools");
  if (!response.ok) {
    poolCard.classList.add("hidden");
    return;
  }

  const data = await response.json();
  renderPools(data.pools || []);
}

async function createPool() {
  const name = document.querySelector("#new-pool-name").value.trim();
  if (!name) {
    poolStatus.textContent = "Vul eerst een poolnaam in.";
    return;
  }

  const response = await fetch("/api/admin/pools", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });

  const data = await response.json();
  if (!response.ok) {
    poolStatus.textContent = data.error || "Pool aanmaken mislukt";
    return;
  }

  document.querySelector("#new-pool-name").value = "";
  poolStatus.textContent = "Pool aangemaakt.";
  await loadPools();
  await selectPool(data.pool.id);
}

async function loadPoolRules() {
  if (!selectedPoolId) {
    return;
  }

  const response = await fetch(`/api/admin/pools/${selectedPoolId}/rules`);
  if (!response.ok) {
    return;
  }

  const rules = await response.json();
  currentPoolRules = rules;
  const selectedPool = getSelectedPool();
  selectedPoolName.textContent = selectedPool?.name || "Pool";
  selectedPoolSlug.textContent = selectedPool ? `/${selectedPool.slug}` : "";

  for (const field of ruleFields) {
    const input = document.querySelector(`#${field}`);
    if (input) {
      input.value = rules[field] ?? "";
    }
  }

  rulesCard.classList.remove("hidden");
  poolRulesCard.classList.remove("hidden");
  liveStatusCard.classList.remove("hidden");
  resultsCard.classList.remove("hidden");
  participantsCard.classList.remove("hidden");
  resetCard.classList.remove("hidden");
}

async function loadGlobalRules() {
  const response = await fetch("/api/admin/rules");
  if (!response.ok) {
    return;
  }

  currentRules = await response.json();
  syncBonusResultInputs(currentRules);
  syncLiveStatusInputs(currentRules);
  renderKnockoutResults(currentRules);
}

async function selectPool(poolId) {
  selectedPoolId = poolId;
  renderPools(adminPools);
  await loadPoolRules();
  await loadParticipants();
}

async function login() {
  const password = document.querySelector("#admin-password").value;
  try {
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    });

    const data = await response.json();
    if (!response.ok) {
      loginStatus.textContent = data.error || "Login mislukt";
      return;
    }

    loginStatus.textContent = "Ingelogd als admin.";
    loginCard.classList.add("hidden");
    poolCard.classList.remove("hidden");
    await loadPools();
    await loadGlobalRules();
    await loadMatches();
    if (adminPools.length) {
      await selectPool(selectedPoolId || adminPools[0].id);
    }
  } catch (error) {
    loginStatus.textContent = "Inloggen gelukt, maar de adminpagina kon niet volledig laden.";
  }
}

async function savePoolRules() {
  if (!selectedPoolId) {
    rulesStatus.textContent = "Kies eerst een pool.";
    return;
  }

  const payload = Object.fromEntries(
    ruleFields.map((field) => {
      const input = document.querySelector(`#${field}`);
      const value = input?.value ?? "";
      return [field, input?.type === "number" ? Number(value) : value];
    }),
  );

  const poolResponse = await fetch(`/api/admin/pools/${selectedPoolId}/rules`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const poolData = await poolResponse.json();
  if (!poolResponse.ok) {
    rulesStatus.textContent = poolData.error || "Opslaan mislukt";
    return;
  }

  currentPoolRules = poolData;
  rulesStatus.textContent = "Poolregels opgeslagen.";
}

function collectBonusResultsPayload() {
  return {
    championTeam: document.querySelector("#bonusResultChampionTeam")?.value || "",
    mostGoalsTeam: document.querySelector("#bonusResultMostGoalsTeam")?.value || "",
    mostConcededTeam: document.querySelector("#bonusResultMostConcededTeam")?.value || "",
    bestAfricanTeamAnswers: getCheckedValues("bonusResultBestAfricanTeamList"),
    bestAsianTeamAnswers: getCheckedValues("bonusResultBestAsianTeamList"),
    bestCentralAmericanTeamAnswers: getCheckedValues("bonusResultBestCentralAmericanTeamList"),
    bestHostTeamAnswers: getCheckedValues("bonusResultBestHostTeamList"),
    topScorerAnswers: document.querySelector("#bonusResultTopScorer")?.value || "",
    topScorerNetherlandsAnswers: document.querySelector("#bonusResultTopScorerNetherlands")?.value || "",
    totalGoals:
      (document.querySelector("#bonusResultTotalGoals")?.value ?? "") === ""
        ? null
        : Number(document.querySelector("#bonusResultTotalGoals").value),
  };
}

function collectLiveLeadersPayload() {
  return {
    currentTopScorer: document.querySelector("#liveCurrentTopScorer")?.value || "",
    currentDutchTopScorer: document.querySelector("#liveCurrentDutchTopScorer")?.value || "",
  };
}

function setCheckedValues(containerId, values) {
  const selected = new Set(values.filter(Boolean));
  document.querySelectorAll(`#${containerId} input[type="checkbox"]`).forEach((input) => {
    input.checked = selected.has(input.value);
  });
}

function setSelectValue(selectId, value) {
  const select = document.querySelector(`#${selectId}`);
  if (select && value) {
    select.value = value;
  }
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
      groups.set(groupKey, { key: groupKey, teams: new Set(), matches: [] });
    }

    const group = groups.get(groupKey);
    group.teams.add(match.homeTeam);
    group.teams.add(match.awayTeam);
    group.matches.push(match);
  }

  return [...groups.values()].map((group) => ({
    key: group.key,
    teams: [...group.teams].sort((left, right) => left.localeCompare(right, "nl")),
    matches: group.matches,
  }));
}

function createTeamStats(team, groupKey) {
  return {
    team,
    groupKey,
    played: 0,
    points: 0,
    wins: 0,
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
    homeStats.points += 3;
    return;
  }
  if (homeScore < awayScore) {
    awayStats.wins += 1;
    awayStats.points += 3;
    return;
  }
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

function buildActualGroupSnapshot() {
  const collectedById = new Map(collectMatchesFromForm().map((match) => [match.id, match]));
  const groups = getGroupContexts(adminMatches).map((group) => {
    const statsMap = new Map(group.teams.map((team) => [team, createTeamStats(team, group.key)]));
    let completedMatches = 0;

    for (const match of group.matches) {
      const collected = collectedById.get(match.id);
      if (!collected || collected.status !== "finished" || collected.homeScore === null || collected.awayScore === null) {
        continue;
      }
      completedMatches += 1;
      applyResult(statsMap.get(match.homeTeam), statsMap.get(match.awayTeam), collected.homeScore, collected.awayScore);
    }

    return {
      key: group.key,
      completedMatches,
      totalMatches: group.matches.length,
      table: [...group.teams]
        .map((team) => statsMap.get(team))
        .sort(compareStats)
        .map((entry, index) => ({ ...entry, rank: index + 1 })),
    };
  });
  const completedGroups = groups.filter((group) => group.completedMatches === group.totalMatches);
  const thirdPlaceRanking = completedGroups
    .map((group) => group.table.find((entry) => entry.rank === 3))
    .filter(Boolean)
    .sort(compareStats);
  const allGroupsComplete = completedGroups.length === groups.length && groups.length > 0;

  return {
    groups,
    secondRoundTeams: [
      ...completedGroups.flatMap((group) => group.table.filter((entry) => entry.rank <= 2).map((entry) => entry.team)),
      ...(allGroupsComplete ? thirdPlaceRanking.slice(0, 8).map((entry) => entry.team) : []),
    ],
  };
}

function getTeamForGroupSlot(snapshot, slotCode) {
  const match = /^([12])([A-L])$/.exec(String(slotCode || ""));
  if (!match) {
    return "";
  }
  const group = snapshot.groups.find((entry) => entry.key === match[2]);
  if (!group || group.completedMatches !== group.totalMatches) {
    return "";
  }
  return group?.table.find((entry) => entry.rank === Number(match[1]))?.team || "";
}

function collectKnockoutRoundEntries() {
  const entries = [];

  for (const round of rounds) {
    const matches = getKnockoutMatchesByRoundKey(adminMatches, round.key);
    const selects = [...document.querySelectorAll(`[data-actual-round-key="${round.key}"]`)];

    matches.forEach((match, index) => {
      const homeTeam = selects[index * 2]?.value.trim() || "";
      const awayTeam = selects[index * 2 + 1]?.value.trim() || "";
      const read = (field) =>
        document.querySelector(`[data-knockout-match-id="${match.id}"][data-field="${field}"]`)?.value ?? "";
      const afterExtraTime = document.querySelector(
        `[data-knockout-match-id="${match.id}"][data-field="afterExtraTime"]`,
      )?.checked;
      entries.push({
        roundKey: round.key,
        match,
        homeTeam,
        awayTeam,
        homeScore: read("homeScore") === "" ? null : Number(read("homeScore")),
        awayScore: read("awayScore") === "" ? null : Number(read("awayScore")),
        status: read("status"),
        afterExtraTime: Boolean(afterExtraTime),
        penaltyWinnerTeam: read("penaltyWinnerTeam"),
      });
    });
  }

  return entries;
}

function computeAutomaticKnockoutState() {
  const countries = getCountryOptionsFromMatches(adminMatches);
  const countrySet = new Set(countries);
  const roundValues = collectKnockoutResultsFromForm();
  const knockoutEntries = collectKnockoutRoundEntries();
  const groupSnapshot = buildActualGroupSnapshot();
  const qualifiedSecondRoundTeams = new Set([
    ...getCheckedValues("admin-qualified-second-round-teams"),
    ...groupSnapshot.secondRoundTeams,
  ]);
  const secondRoundMatches = getKnockoutMatchesByRoundKey(adminMatches, "secondRound");
  const secondRoundSlotValues = [];
  secondRoundMatches.forEach((match) => {
    const homeTeam = getTeamForGroupSlot(groupSnapshot, match.homeSlotCode);
    const awayTeam = getTeamForGroupSlot(groupSnapshot, match.awaySlotCode);
    secondRoundSlotValues.push(homeTeam || "", awayTeam || "");
  });
  if (secondRoundSlotValues.some(Boolean)) {
    roundValues.secondRound = secondRoundSlotValues;
    secondRoundSlotValues.filter(Boolean).forEach((team) => qualifiedSecondRoundTeams.add(team));
  }
  const allFinishedMatches = [
    ...collectMatchesFromForm().filter((match) => match.status === "finished"),
  ];
  const teamGoals = new Map();
  const teamConceded = new Map();
  let totalGoals = 0;
  let knockoutGoals = 0;
  let knockoutFinishedMatches = 0;

  function addGoals(team, scored, conceded) {
    if (!countrySet.has(team)) {
      return;
    }
    teamGoals.set(team, (teamGoals.get(team) || 0) + Number(scored || 0));
    teamConceded.set(team, (teamConceded.get(team) || 0) + Number(conceded || 0));
  }

  for (const match of allFinishedMatches) {
    const isKnockout = rounds.some((round) => round.label === adminMatches.find((entry) => entry.id === match.id)?.stage);
    let homeTeam = match.homeTeam;
    let awayTeam = match.awayTeam;
    if (isKnockout) {
      const knockoutEntry = knockoutEntries.find((entry) => entry.match.id === match.id);
      homeTeam = knockoutEntry?.homeTeam || "";
      awayTeam = knockoutEntry?.awayTeam || "";
      knockoutGoals += Number(match.homeScore || 0) + Number(match.awayScore || 0);
      knockoutFinishedMatches += 1;
    }

    totalGoals += Number(match.homeScore || 0) + Number(match.awayScore || 0);
    addGoals(homeTeam, match.homeScore, match.awayScore);
    addGoals(awayTeam, match.awayScore, match.homeScore);
  }

  function leaders(map) {
    const max = Math.max(0, ...map.values());
    return [...map.entries()].filter(([, value]) => value === max && max > 0).map(([team]) => team);
  }

  const finalEntry = knockoutEntries.find((entry) => entry.roundKey === "final" && entry.status === "finished");
  function winnerForEntry(entry) {
    if (!entry || entry.status !== "finished" || !entry.homeTeam || !entry.awayTeam) {
      return "";
    }
    if (entry.homeScore > entry.awayScore) {
      return entry.homeTeam;
    }
    if (entry.awayScore > entry.homeScore) {
      return entry.awayTeam;
    }
    return entry.penaltyWinnerTeam || "";
  }

  const championTeam =
    winnerForEntry(finalEntry);
  for (let index = 0; index < rounds.length - 1; index += 1) {
    const currentRound = rounds[index];
    const nextRound = rounds[index + 1];
    const nextValues = [...(roundValues[nextRound.key] || [])];
    const currentEntries = knockoutEntries.filter((entry) => entry.roundKey === currentRound.key);
    currentEntries.forEach((entry, matchIndex) => {
      const winner = winnerForEntry(entry);
      if (!winner) {
        return;
      }
      nextValues[matchIndex] = nextValues[matchIndex] || winner;
    });
    if (nextValues.some(Boolean)) {
      roundValues[nextRound.key] = nextValues;
    }
  }
  const eliminatedTeams = new Set(getCheckedValues("admin-eliminated-teams"));
  const secondRoundTeams = new Set([...(roundValues.secondRound || []), ...qualifiedSecondRoundTeams]);
  if (secondRoundTeams.size >= 32) {
    countries.forEach((country) => {
      if (!secondRoundTeams.has(country)) {
        eliminatedTeams.add(country);
      }
    });
  }

  for (let index = 0; index < rounds.length - 1; index += 1) {
    const currentTeams = new Set(roundValues[rounds[index].key] || []);
    const nextTeams = new Set(roundValues[rounds[index + 1].key] || []);
    if (!nextTeams.size) {
      continue;
    }
    currentTeams.forEach((team) => {
      if (team && !nextTeams.has(team)) {
        eliminatedTeams.add(team);
      }
    });
  }

  if (championTeam) {
    (roundValues.final || []).forEach((team) => {
      if (team && team !== championTeam) {
        eliminatedTeams.add(team);
      }
    });
  }

  const latestRound = [...rounds].reverse().find((round) => (roundValues[round.key] || []).length);
  const latestRoundTeams = new Set(latestRound ? roundValues[latestRound.key] || [] : qualifiedSecondRoundTeams);
  if (!latestRound || latestRound.key === "secondRound") {
    qualifiedSecondRoundTeams.forEach((team) => latestRoundTeams.add(team));
  }
  const reachedRank = new Map(countries.map((country) => [country, 0]));
  qualifiedSecondRoundTeams.forEach((team) => {
    reachedRank.set(team, Math.max(reachedRank.get(team) || 0, 1));
  });
  rounds.forEach((round, index) => {
    (roundValues[round.key] || []).forEach((team) => {
      reachedRank.set(team, Math.max(reachedRank.get(team) || 0, index + 1));
    });
  });
  if (championTeam) {
    reachedRank.set(championTeam, rounds.length + 1);
  }

  function bestCategoryTeams(teamList) {
    const availableTeams = filterAvailableTeams(adminMatches, teamList);
    const activeTeams = availableTeams.filter((team) => latestRoundTeams.has(team) && !championTeam);
    if (activeTeams.length) {
      return [];
    }
    const maxRank = Math.max(0, ...availableTeams.map((team) => reachedRank.get(team) || 0));
    return maxRank > 0 ? availableTeams.filter((team) => (reachedRank.get(team) || 0) === maxRank) : [];
  }

  return {
    championTeam,
    mostGoalsTeams: leaders(teamGoals),
    mostConcededTeams: leaders(teamConceded),
    bestAfricanTeams: bestCategoryTeams(AFRICAN_TEAMS),
    bestAsianTeams: bestCategoryTeams(ASIAN_TEAMS),
    bestCentralAmericanTeams: bestCategoryTeams(CENTRAL_AMERICAN_TEAMS),
    bestHostTeams: bestCategoryTeams(HOST_TEAMS),
    eliminatedTeams: [...eliminatedTeams],
    qualifiedSecondRoundTeams: [...qualifiedSecondRoundTeams],
    roundValues,
    knockoutGoals,
    knockoutFinishedMatches,
    totalGoals,
  };
}

function applyAutomaticKnockoutState() {
  const derived = computeAutomaticKnockoutState();
  applyKnockoutRoundValues(derived.roundValues);
  setSelectValue("bonusResultChampionTeam", derived.championTeam);
  setSelectValue("bonusResultMostGoalsTeam", derived.mostGoalsTeams[0] || "");
  setSelectValue("bonusResultMostConcededTeam", derived.mostConcededTeams[0] || "");
  if (derived.bestAfricanTeams.length) {
    setCheckedValues("bonusResultBestAfricanTeamList", derived.bestAfricanTeams);
  }
  if (derived.bestAsianTeams.length) {
    setCheckedValues("bonusResultBestAsianTeamList", derived.bestAsianTeams);
  }
  if (derived.bestCentralAmericanTeams.length) {
    setCheckedValues("bonusResultBestCentralAmericanTeamList", derived.bestCentralAmericanTeams);
  }
  if (derived.bestHostTeams.length) {
    setCheckedValues("bonusResultBestHostTeamList", derived.bestHostTeams);
  }
  setCheckedValues("admin-eliminated-teams", derived.eliminatedTeams);
  setCheckedValues("admin-qualified-second-round-teams", derived.qualifiedSecondRoundTeams);
  if (derived.championTeam) {
    const totalGoalsInput = document.querySelector("#bonusResultTotalGoals");
    if (totalGoalsInput) {
      totalGoalsInput.value = derived.totalGoals;
    }
  }

  setResultsStatus("Automatisch ingevuld uit de knock-outuitslagen. Controleer en pas handmatig aan waar nodig.", "muted");
}

async function saveLiveStatus() {
  saveLiveStatusButton.disabled = true;
  saveLiveStatusButton.textContent = "Bezig met opslaan...";
  setLiveStatus("Voorlopige tussenstanden worden opgeslagen...");

  try {
    const response = await fetch("/api/admin/rules", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ liveLeaders: collectLiveLeadersPayload() }),
    });

    const data = await response.json();
    if (!response.ok) {
      setLiveStatus(data.error || "Opslaan mislukt");
      return;
    }

    currentRules = data;
    syncLiveStatusInputs(data);
    setLiveStatus("Voorlopige tussenstanden opgeslagen.");
  } finally {
    saveLiveStatusButton.disabled = false;
    saveLiveStatusButton.textContent = "Voorlopige tussenstanden opslaan";
  }
}

function renderMatches(matches) {
  const groups = new Map();
  matchList.innerHTML = "";

  for (const match of getGroupStageMatches(matches)) {
    if (!groups.has(match.stage)) {
      groups.set(match.stage, []);
    }
    groups.get(match.stage).push(match);
  }

  for (const [stage, stageMatches] of groups.entries()) {
    const section = document.createElement("section");
    section.className = "admin-stage";

    const title = document.createElement("h3");
    title.textContent = stage;
    section.appendChild(title);

    const list = document.createElement("div");
    list.className = "admin-stage-list";

    for (const match of stageMatches) {
      const item = document.createElement("article");
      item.className = "admin-match-row";
      item.innerHTML = `
        <div class="admin-match-meta">
          <p class="match-title">Wedstrijd ${match.matchNumber}</p>
          <p class="match-meta">${new Intl.DateTimeFormat("nl-NL", { dateStyle: "medium", timeStyle: "short" }).format(new Date(match.kickoffAt))} - ${match.city}</p>
        </div>
        <div class="admin-score-grid">
          <span class="match-title">${match.homeTeam} - ${match.awayTeam}</span>
          <input type="number" min="0" data-match-id="${match.id}" data-field="homeScore" value="${match.homeScore ?? ""}" placeholder="0">
          <span>-</span>
          <input type="number" min="0" data-match-id="${match.id}" data-field="awayScore" value="${match.awayScore ?? ""}" placeholder="0">
          <select data-match-id="${match.id}" data-field="status">
            <option value="scheduled" ${match.status === "scheduled" ? "selected" : ""}>Gepland</option>
            <option value="finished" ${match.status === "finished" ? "selected" : ""}>Afgelopen</option>
          </select>
        </div>
      `;
      list.appendChild(item);
    }

    section.appendChild(list);
    matchList.appendChild(section);
  }
}

async function loadMatches() {
  const response = await fetch("/api/admin/matches");
  if (!response.ok) {
    return;
  }

  const data = await response.json();
  adminMatches = data.matches;
  renderMatches(adminMatches);
  currentRules = {
    ...(currentRules || {}),
    knockoutResults: data.knockoutResults || currentRules?.knockoutResults || {},
    eliminatedTeams: data.eliminatedTeams || currentRules?.eliminatedTeams || [],
    qualifiedSecondRoundTeams: data.qualifiedSecondRoundTeams || currentRules?.qualifiedSecondRoundTeams || [],
  };
  renderKnockoutResults(currentRules);
  syncBonusResultInputs(currentRules);
  syncLiveStatusInputs(currentRules);
  renderEliminatedTeams(currentRules.eliminatedTeams || []);
  renderQualifiedSecondRoundTeams(currentRules.qualifiedSecondRoundTeams || []);
}

function collectMatchesFromForm() {
  const groupMatches = getGroupStageMatches(adminMatches).map((match) => {
    const read = (field) => document.querySelector(`[data-match-id="${match.id}"][data-field="${field}"]`)?.value ?? "";
    return {
      id: match.id,
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      homeScore: read("homeScore") === "" ? null : Number(read("homeScore")),
      awayScore: read("awayScore") === "" ? null : Number(read("awayScore")),
      status: read("status"),
    };
  });
  const knockoutMatches = getKnockoutStageMatches(adminMatches).map((match) => {
    const read = (field) =>
      document.querySelector(`[data-knockout-match-id="${match.id}"][data-field="${field}"]`)?.value ?? "";
    const afterExtraTime = document.querySelector(
      `[data-knockout-match-id="${match.id}"][data-field="afterExtraTime"]`,
    )?.checked;
    return {
      id: match.id,
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      homeScore: read("homeScore") === "" ? null : Number(read("homeScore")),
      awayScore: read("awayScore") === "" ? null : Number(read("awayScore")),
      status: read("status"),
      afterExtraTime: Boolean(afterExtraTime),
      penaltyWinnerTeam: read("penaltyWinnerTeam"),
    };
  });

  return [...groupMatches, ...knockoutMatches];
}

function validateMatchesBeforeSave(matches) {
  for (const match of matches) {
    const hasHome = match.homeScore !== null;
    const hasAway = match.awayScore !== null;
    const originalMatch = adminMatches.find((entry) => entry.id === match.id);
    const isKnockout = rounds.some((round) => round.label === originalMatch?.stage);

    if (hasHome !== hasAway) {
      return `Vul voor ${match.homeTeam} - ${match.awayTeam} beide scores in, of laat ze allebei leeg.`;
    }

    if (match.status === "finished" && (!hasHome || !hasAway)) {
      return `Je kunt ${match.homeTeam} - ${match.awayTeam} pas op afgelopen zetten als beide scores zijn ingevuld.`;
    }

    if (isKnockout && match.status === "finished" && match.homeScore === match.awayScore && !match.penaltyWinnerTeam) {
      return `Kies bij ${match.homeTeam} - ${match.awayTeam} welk land na strafschoppen wint.`;
    }

    if (
      isKnockout &&
      match.status === "finished" &&
      match.homeScore === match.awayScore &&
      !collectKnockoutRoundEntries().some(
        (entry) =>
          entry.match.id === match.id &&
          (entry.homeTeam === match.penaltyWinnerTeam || entry.awayTeam === match.penaltyWinnerTeam),
      )
    ) {
      return `Kies bij ${match.homeTeam} - ${match.awayTeam} een geldig land als winnaar na strafschoppen.`;
    }
  }

  return "";
}

async function saveResults() {
  const collectedMatches = collectMatchesFromForm();
  const validationError = validateMatchesBeforeSave(collectedMatches);
  if (validationError) {
    setResultsStatus(validationError, "warning");
    return;
  }

  saveResultsButton.disabled = true;
  saveResultsButton.textContent = "Bezig met opslaan...";
  setResultsStatus("Uitslagen en antwoorden worden opgeslagen...", "muted");

  const bonusResponse = await fetch("/api/admin/rules", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      bonusResults: collectBonusResultsPayload(),
      liveLeaders: collectLiveLeadersPayload(),
    }),
  });

  const bonusData = await bonusResponse.json();
  if (!bonusResponse.ok) {
    setResultsStatus(bonusData.error || "Opslaan mislukt.", "warning");
    saveResultsButton.disabled = false;
    saveResultsButton.textContent = "Uitslagen en antwoorden opslaan";
    return;
  }

  currentRules = {
    ...(currentRules || {}),
    ...bonusData,
  };
  syncBonusResultInputs(currentRules);
  const payload = {
    matches: collectedMatches,
    knockoutResults: collectKnockoutResultsFromForm(),
    eliminatedTeams: getCheckedValues("admin-eliminated-teams"),
    qualifiedSecondRoundTeams: getCheckedValues("admin-qualified-second-round-teams"),
  };

  try {
    const response = await fetch("/api/admin/matches", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      setResultsStatus(data.error || "Opslaan mislukt.", "warning");
      return;
    }

    adminMatches = data.matches;
    currentRules = {
      ...(currentRules || {}),
      knockoutResults: data.knockoutResults || {},
      eliminatedTeams: data.eliminatedTeams || [],
      qualifiedSecondRoundTeams: data.qualifiedSecondRoundTeams || [],
    };
    renderMatches(adminMatches);
    renderKnockoutResults(currentRules);
    syncBonusResultInputs(currentRules);
    syncLiveStatusInputs(currentRules);
    renderEliminatedTeams(currentRules.eliminatedTeams || []);
    renderQualifiedSecondRoundTeams(currentRules.qualifiedSecondRoundTeams || []);
    await loadParticipants();
    const successMessage = `Werkelijke uitslagen en antwoorden opgeslagen op ${formatDateTime(new Date().toISOString())}.`;
    setResultsStatus(successMessage, "success");
  } catch (error) {
    const message = "Opslaan van de uitslagen en antwoorden is mislukt door een technische fout.";
    setResultsStatus(message, "warning");
  } finally {
    saveResultsButton.disabled = false;
    saveResultsButton.textContent = "Uitslagen en antwoorden opslaan";
  }
}

function renderParticipants(participants) {
  participantsCount.textContent = `${participants.length} aangemeld`;
  participantsList.innerHTML = participants
    .map((participant) => `
      <details class="admin-participant-card">
        <summary>
          <span class="admin-participant-summary-main">
            <input type="checkbox" class="admin-copy-select" data-participant-id="${participant.id}" aria-label="Selecteer deelnemer om te kopieren">
            <span>${participant.name}</span>
          </span>
          <span class="notice">${calculateParticipantCompletion(participant)}% ingevuld - ${formatDateTime(participant.updatedAt)}</span>
        </summary>
        <div class="admin-participant-body">
          <div class="admin-participant-actions">
            <button type="button" class="secondary-action admin-copy-link" data-edit-link="${getAdminEditLink(participant)}">Kopieer bewerk-link</button>
            <button type="button" class="admin-delete-button" data-participant-id="${participant.id}" data-participant-name="${participant.name}">Verwijder deelnemer</button>
          </div>
          <div class="admin-participant-section">
            <h3>Wedstrijden</h3>
            <div class="admin-prediction-list">
              ${participant.predictions
                .filter((entry) => entry.match?.stage === "Groepsfase" && (entry.predictedHomeScore !== null || entry.predictedAwayScore !== null))
                .map((entry) => `
                  <div class="admin-prediction-row">
                    <div>
                      <p class="match-title">${entry.match.homeTeam} - ${entry.match.awayTeam}</p>
                      <p class="match-meta">${entry.match.stage} - ${entry.match.city}</p>
                    </div>
                    <strong>${entry.predictedHomeScore} - ${entry.predictedAwayScore}</strong>
                  </div>
                `)
                .join("") || '<p class="notice">Nog geen wedstrijdvoorspellingen ingevuld.</p>'}
            </div>
          </div>
          <div class="admin-participant-section">
            <h3>Knock-out</h3>
            <div class="admin-knockout-grid">
              ${Object.entries(participant.knockoutPredictions)
                .map(([roundKey, teams]) => `
                  <div class="admin-knockout-card">
                    <strong>${roundKey}</strong>
                    <p>${teams.filter(Boolean).length ? teams.filter(Boolean).join(", ") : "Nog niets ingevuld"}</p>
                  </div>
                `)
                .join("")}
            </div>
          </div>
          <div class="admin-participant-section">
            <h3>Bonusvragen</h3>
            <div class="admin-knockout-grid">
              <div class="admin-knockout-card"><strong>Wereldkampioen</strong><p>${participant.bonusPredictions?.championTeam || "Nog niets ingevuld"}</p></div>
              <div class="admin-knockout-card"><strong>Meeste doelpunten</strong><p>${participant.bonusPredictions?.mostGoalsTeam || "Nog niets ingevuld"}</p></div>
              <div class="admin-knockout-card"><strong>Meeste tegendoelpunten</strong><p>${participant.bonusPredictions?.mostConcededTeam || "Nog niets ingevuld"}</p></div>
              <div class="admin-knockout-card"><strong>Afrikaans land komt het verst</strong><p>${participant.bonusPredictions?.bestAfricanTeam || "Nog niets ingevuld"}</p></div>
              <div class="admin-knockout-card"><strong>Aziatisch land komt het verst</strong><p>${participant.bonusPredictions?.bestAsianTeam || "Nog niets ingevuld"}</p></div>
              <div class="admin-knockout-card"><strong>Midden-Amerikaans land komt het verst</strong><p>${participant.bonusPredictions?.bestCentralAmericanTeam || "Nog niets ingevuld"}</p></div>
              <div class="admin-knockout-card"><strong>Gastland komt het verst</strong><p>${participant.bonusPredictions?.bestHostTeam || "Nog niets ingevuld"}</p></div>
              <div class="admin-knockout-card"><strong>Topscorer</strong><p>${participant.bonusPredictions?.topScorer || "Nog niets ingevuld"}</p></div>
              <div class="admin-knockout-card"><strong>Topscorer voor Nederland</strong><p>${participant.bonusPredictions?.topScorerNetherlands || "Nog niets ingevuld"}</p></div>
              <div class="admin-knockout-card"><strong>Totaal doelpunten</strong><p>${participant.bonusPredictions?.totalGoals ?? "Nog niets ingevuld"}</p></div>
            </div>
          </div>
        </div>
      </details>
    `)
    .join("");
  if (copySelectAllInput) {
    copySelectAllInput.checked = false;
    copySelectAllInput.indeterminate = false;
  }
  updateCopySelectionStatus();
}

function getSelectedParticipantIds() {
  return [...participantsList.querySelectorAll(".admin-copy-select:checked")]
    .map((input) => input.dataset.participantId)
    .filter(Boolean);
}

function updateCopySelectionStatus() {
  const total = participantsList.querySelectorAll(".admin-copy-select").length;
  const selected = getSelectedParticipantIds().length;

  if (copySelectAllInput) {
    copySelectAllInput.checked = total > 0 && selected === total;
    copySelectAllInput.indeterminate = selected > 0 && selected < total;
  }

  if (!copyParticipantsStatus) {
    return;
  }

  if (!selected) {
    copyParticipantsStatus.textContent = "Selecteer deelnemers en kies een doelpool om formulieren te kopieren.";
    return;
  }

  copyParticipantsStatus.textContent = `${selected} deelnemer(s) geselecteerd om te kopieren.`;
}

async function loadParticipants() {
  if (!selectedPoolId) {
    participantsList.innerHTML = '<p class="notice">Kies eerst een pool.</p>';
    participantsCount.textContent = "0 aangemeld";
    return;
  }

  const response = await fetch(`/api/admin/pools/${selectedPoolId}/participants`);
  if (!response.ok) {
    return;
  }

  const data = await response.json();
  renderParticipants(data.participants);
}

async function deleteParticipant(participantId) {
  const response = await fetch(`/api/admin/pools/${selectedPoolId}/participants/${participantId}`, {
    method: "DELETE",
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Verwijderen mislukt");
  }
}

async function copyParticipantsToPool() {
  const targetPoolId = copyTargetPoolSelect.value;
  const participantIds = getSelectedParticipantIds();
  if (!selectedPoolId || !targetPoolId) {
    copyParticipantsStatus.textContent = "Kies eerst een bronpool en een andere doelpool.";
    return;
  }

  if (!participantIds.length) {
    copyParticipantsStatus.textContent = "Selecteer eerst een of meer deelnemers om te kopieren.";
    return;
  }

  const sourcePool = getSelectedPool();
  const targetPool = adminPools.find((pool) => pool.id === targetPoolId);
  const confirmed = window.confirm(
    `Weet je zeker dat je ${participantIds.length} geselecteerde formulier(en) van ${sourcePool?.name || "deze pool"} wilt dupliceren naar ${targetPool?.name || "de doelpool"}?`,
  );
  if (!confirmed) {
    return;
  }

  copyParticipantsButton.disabled = true;
  copyParticipantsStatus.textContent = "Formulieren worden gekopieerd...";

  try {
    const response = await fetch(`/api/admin/pools/${selectedPoolId}/participants/copy`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        targetPoolId,
        participantIds,
        skipExisting: copySkipExistingInput.checked,
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Dupliceren mislukt");
    }

    copyParticipantsStatus.textContent = `${data.copied} geselecteerde formulier(en) gekopieerd naar ${data.targetPool?.name || "de doelpool"}. ${data.skippedExisting} bestaande naam/namen overgeslagen.`;
  } finally {
    copyParticipantsButton.disabled = false;
  }
}

async function resetLaunchData() {
  resetLaunchDataStatus.textContent = "Schoonzetten...";
  const response = await fetch("/api/admin/reset-launch-data", {
    method: "POST",
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Schoonzetten mislukt");
  }

  resetLaunchDataStatus.textContent = `Schoongezet: ${data.participants} deelnemers, ${data.matches} wedstrijden, ${data.pools} pools.`;
  await loadPools();
  await loadGlobalRules();
  await loadMatches();
  if (adminPools.length) {
    await selectPool(adminPools[0].id);
  }
}

async function downloadBackup() {
  downloadBackupButton.disabled = true;
  try {
    downloadBackupStatus.textContent = "Backup wordt gemaakt...";
    const response = await fetch("/api/admin/backup");
    const blob = await response.blob();
    if (!response.ok) {
      let message = "Backup downloaden mislukt";
      try {
        const data = JSON.parse(await blob.text());
        message = data.error || message;
      } catch {
        // Keep the generic message when the response is not JSON.
      }
      throw new Error(message);
    }

    const disposition = response.headers.get("Content-Disposition") || "";
    const fileName = disposition.match(/filename="([^"]+)"/)?.[1] || `wk-toto-backup-${new Date().toISOString().replace(/[:.]/g, "-")}.json`;
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    downloadBackupStatus.textContent = `Backup gedownload: ${fileName}`;
  } finally {
    downloadBackupButton.disabled = false;
  }
}

document.querySelector("#login-button").addEventListener("click", () => {
  login().catch(() => {
    loginStatus.textContent = "Login mislukt";
  });
});

document.querySelector("#save-rules-button").addEventListener("click", () => {
  savePoolRules().catch(() => {
    rulesStatus.textContent = "Opslaan mislukt";
  });
});

saveLiveStatusButton.addEventListener("click", () => {
  saveLiveStatus().catch(() => {
    setLiveStatus("Opslaan mislukt");
  });
});

document.querySelector("#create-pool-button").addEventListener("click", () => {
  createPool().catch(() => {
    poolStatus.textContent = "Pool aanmaken mislukt";
  });
});

saveResultsButton.addEventListener("click", () => {
  saveResults().catch(() => {
    setResultsStatus("Opslaan mislukt", "warning");
  });
});

knockoutResultsContainer.addEventListener("change", (event) => {
  if (!event.target.closest("[data-actual-round-key], [data-knockout-match-id]")) {
    return;
  }

  applyAutomaticKnockoutState();
});

matchList.addEventListener("change", () => {
  applyAutomaticKnockoutState();
});

downloadBackupButton.addEventListener("click", () => {
  downloadBackup().catch((error) => {
    downloadBackupStatus.textContent = error.message || "Backup downloaden mislukt";
  });
});

resetLaunchDataButton.addEventListener("click", () => {
  const confirmed = window.confirm(
    "Weet je zeker dat je alle deelnemers, formulieren en werkelijke uitslagen/antwoorden wilt wissen?",
  );
  if (!confirmed) {
    return;
  }

  resetLaunchData().catch((error) => {
    resetLaunchDataStatus.textContent = error.message || "Schoonzetten mislukt";
  });
});

copyParticipantsButton.addEventListener("click", () => {
  copyParticipantsToPool().catch((error) => {
    copyParticipantsStatus.textContent = error.message || "Dupliceren mislukt";
    copyParticipantsButton.disabled = false;
  });
});

copySelectAllInput.addEventListener("change", () => {
  participantsList.querySelectorAll(".admin-copy-select").forEach((input) => {
    input.checked = copySelectAllInput.checked;
  });
  updateCopySelectionStatus();
});

participantsList.addEventListener("click", (event) => {
  if (event.target.closest(".admin-copy-select")) {
    event.stopPropagation();
    return;
  }

  const copyButton = event.target.closest(".admin-copy-link");
  if (copyButton) {
    navigator.clipboard.writeText(copyButton.dataset.editLink || "").then(() => {
      resultsStatus.textContent = "Bewerk-link gekopieerd.";
    }).catch(() => {
      resultsStatus.textContent = "Kopieren van de bewerk-link mislukt.";
    });
    return;
  }

  const deleteButton = event.target.closest(".admin-delete-button");
  if (!deleteButton) {
    return;
  }

  const participantName = deleteButton.dataset.participantName || "deze deelnemer";
  const confirmed = window.confirm(`Weet je zeker dat je ${participantName} wilt verwijderen?`);
  if (!confirmed) {
    return;
  }

  deleteParticipant(deleteButton.dataset.participantId).then(() => {
    resultsStatus.textContent = "Deelnemer verwijderd.";
    loadParticipants().catch(() => {
      resultsStatus.textContent = "Deelnemer verwijderd, maar herladen mislukt.";
    });
  }).catch((error) => {
    resultsStatus.textContent = error.message || "Verwijderen mislukt";
  });
});

participantsList.addEventListener("change", (event) => {
  if (!event.target.closest(".admin-copy-select")) {
    return;
  }

  updateCopySelectionStatus();
});

poolList.addEventListener("click", (event) => {
  const inviteButton = event.target.closest(".admin-copy-invite");
  if (inviteButton) {
    navigator.clipboard.writeText(inviteButton.dataset.inviteLink || "").then(() => {
      poolStatus.textContent = "Invite-link gekopieerd.";
    }).catch(() => {
      poolStatus.textContent = "Kopieren van de invite-link mislukt.";
    });
    return;
  }

  const standButton = event.target.closest(".admin-copy-stand");
  if (standButton) {
    navigator.clipboard.writeText(standButton.dataset.standLink || "").then(() => {
      poolStatus.textContent = "Stand-link gekopieerd.";
    }).catch(() => {
      poolStatus.textContent = "Kopieren van de stand-link mislukt.";
    });
    return;
  }

  const selectButton = event.target.closest(".admin-select-pool");
  if (!selectButton) {
    return;
  }

  selectPool(selectButton.dataset.poolId).catch(() => {
    poolStatus.textContent = "Pool laden mislukt.";
  });
});

loadPools().then(async () => {
  if (!adminPools.length) {
    return;
  }

  loginCard.classList.add("hidden");
  poolCard.classList.remove("hidden");
  await loadGlobalRules();
  await loadMatches();
  await selectPool(selectedPoolId || adminPools[0].id);
}).catch(() => {});
