const http = require("node:http");
const fs = require("node:fs/promises");
const path = require("node:path");
const crypto = require("node:crypto");

const ROOT = __dirname;
const PUBLIC_DIR = path.join(ROOT, "public");
const DATA_DIR = path.join(ROOT, "data");
const PORT = Number(process.env.PORT || 3000);
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "verander-mij";
const ADMIN_COOKIE = "wk_admin_session";
const DEFAULT_POOL_ID = "pool-gerrie-senden-bokaal-wk-toto";

const sessions = new Map();

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
};

async function readJson(fileName, fallback) {
  const filePath = path.join(DATA_DIR, fileName);

  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw);
  } catch (error) {
    if (error.code === "ENOENT") {
      return fallback;
    }

    throw error;
  }
}

async function writeJson(fileName, value) {
  const filePath = path.join(DATA_DIR, fileName);
  await fs.writeFile(filePath, JSON.stringify(value, null, 2) + "\n", "utf8");
}

function parseCookies(req) {
  const header = req.headers.cookie;
  if (!header) {
    return {};
  }

  return Object.fromEntries(
    header.split(";").map((part) => {
      const [key, ...rest] = part.trim().split("=");
      return [key, decodeURIComponent(rest.join("="))];
    }),
  );
}

function sendJson(res, statusCode, payload, extraHeaders = {}) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    ...extraHeaders,
  });
  res.end(JSON.stringify(payload));
}

function sendText(res, statusCode, text, extraHeaders = {}) {
  res.writeHead(statusCode, {
    "Content-Type": "text/plain; charset=utf-8",
    ...extraHeaders,
  });
  res.end(text);
}

async function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";

    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 1_000_000) {
        reject(new Error("Request body too large"));
        req.destroy();
      }
    });

    req.on("end", () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch (error) {
        reject(error);
      }
    });

    req.on("error", reject);
  });
}

function fileExtension(filePath) {
  return path.extname(filePath).toLowerCase();
}

async function serveStatic(res, filePath) {
  try {
    const buffer = await fs.readFile(filePath);
    const ext = fileExtension(filePath);
    const cacheControl =
      ext === ".html" || ext === ".js" || ext === ".css"
        ? "no-store, no-cache, must-revalidate"
        : "public, max-age=3600";
    res.writeHead(200, {
      "Content-Type": contentTypes[ext] || "application/octet-stream",
      "Cache-Control": cacheControl,
    });
    res.end(buffer);
  } catch (error) {
    if (error.code === "ENOENT") {
      sendText(res, 404, "Niet gevonden");
      return;
    }

    console.error(error);
    sendText(res, 500, "Serverfout");
  }
}

function normalizeScore(value) {
  if (value === "" || value === null || value === undefined) {
    return null;
  }

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 0) {
    return null;
  }

  return parsed;
}

function hasCompleteScore(matchLike) {
  return matchLike.homeScore !== null && matchLike.awayScore !== null;
}

function matchOutcome(homeScore, awayScore) {
  if (homeScore === awayScore) {
    return "draw";
  }

  return homeScore > awayScore ? "home" : "away";
}

function isDeadlinePassed(competition) {
  return new Date() >= new Date(competition.predictionDeadline);
}

function computeMatchPoints(prediction, match, rules) {
  if (
    !match ||
    match.status !== "finished" ||
    match.homeScore === null ||
    match.awayScore === null ||
    prediction.predictedHomeScore === null ||
    prediction.predictedAwayScore === null
  ) {
    return 0;
  }

  if (
    prediction.predictedHomeScore === match.homeScore &&
    prediction.predictedAwayScore === match.awayScore
  ) {
    return rules.exactScorePoints;
  }

  const predictedOutcome = matchOutcome(
    prediction.predictedHomeScore,
    prediction.predictedAwayScore,
  );
  const actualOutcome = matchOutcome(match.homeScore, match.awayScore);

  return predictedOutcome === actualOutcome ? rules.correctOutcomePoints : 0;
}

function predictionOutcomeLabel(prediction, match, rules) {
  const points = computeMatchPoints(prediction, match, rules);
  if (points === rules.exactScorePoints) {
    return "exact";
  }
  if (points === rules.correctOutcomePoints) {
    return "outcome";
  }
  return "miss";
}

function uniqueNormalized(values) {
  return [...new Set((values || []).map((value) => String(value).trim()).filter(Boolean))];
}

function normalizeSlotValues(values) {
  return Array.isArray(values) ? values.map((value) => String(value || "").trim()) : [];
}

function slugify(value) {
  return String(value || "")
    .toLocaleLowerCase("nl-NL")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getGroupStageMatches(matches) {
  return matches.filter((match) => match.stage === "Groepsfase");
}

const knockoutRoundDefinitions = [
  { key: "secondRound", label: "Tweede ronde", shortLabel: "2R", slots: 32 },
  { key: "thirdRound", label: "Derde ronde", shortLabel: "3R", slots: 16 },
  { key: "quarterFinal", label: "Kwartfinale", shortLabel: "KF", slots: 8 },
  { key: "semiFinal", label: "Halve finale", shortLabel: "HF", slots: 4 },
  { key: "final", label: "Finale", shortLabel: "F", slots: 2 },
];

function getKnockoutMatchesByRoundKey(matches, roundKey) {
  const round = knockoutRoundDefinitions.find((entry) => entry.key === roundKey);
  if (!round) {
    return [];
  }

  return matches.filter((match) => match.stage === round.label);
}

function sanitizeKnockoutResults(payload, previousResults = {}) {
  const rounds = ["secondRound", "thirdRound", "quarterFinal", "semiFinal", "final"];
  const result = {};

  for (const round of rounds) {
    result[round] = normalizeSlotValues(payload?.[round] ?? previousResults?.[round]);
  }

  return result;
}

function sanitizeTeamList(values) {
  return uniqueNormalized(values);
}

function sanitizeLiveLeaders(payload, previous = {}) {
  return {
    currentTopScorer: String(payload?.currentTopScorer ?? previous.currentTopScorer ?? "").trim(),
    currentDutchTopScorer: String(
      payload?.currentDutchTopScorer ?? previous.currentDutchTopScorer ?? "",
    ).trim(),
    knockoutGoalsSoFar:
      payload?.knockoutGoalsSoFar === "" ||
      payload?.knockoutGoalsSoFar === null ||
      payload?.knockoutGoalsSoFar === undefined
        ? Number(previous.knockoutGoalsSoFar ?? 0)
        : Number(payload.knockoutGoalsSoFar),
    knockoutFinishedMatches:
      payload?.knockoutFinishedMatches === "" ||
      payload?.knockoutFinishedMatches === null ||
      payload?.knockoutFinishedMatches === undefined
        ? Number(previous.knockoutFinishedMatches ?? 0)
        : Number(payload.knockoutFinishedMatches),
  };
}

function computeKnockoutPoints(knockoutPredictions, knockoutResults, rules) {
  const roundPoints = {
    secondRound: rules.secondRoundPoints,
    thirdRound: rules.thirdRoundPoints,
    quarterFinal: rules.quarterFinalPoints,
    semiFinal: rules.semiFinalPoints,
    final: rules.finalPoints,
  };

  let total = 0;

  for (const [roundKey, points] of Object.entries(roundPoints)) {
    const predicted = uniqueNormalized(knockoutPredictions[roundKey]);
    const actual = new Set(uniqueNormalized(knockoutResults[roundKey]));

    for (const team of predicted) {
      if (actual.has(team)) {
        total += points;
      }
    }
  }

  return total;
}

function sanitizeBonusAnswers(payload) {
  return {
    championTeam: String(payload?.championTeam || "").trim(),
    mostGoalsTeam: String(payload?.mostGoalsTeam || "").trim(),
    mostConcededTeam: String(payload?.mostConcededTeam || "").trim(),
    bestAfricanTeam: String(payload?.bestAfricanTeam || "").trim(),
    bestAsianTeam: String(payload?.bestAsianTeam || "").trim(),
    bestCentralAmericanTeam: String(payload?.bestCentralAmericanTeam || "").trim(),
    topScorer: String(payload?.topScorer || "").trim(),
    topScorerNetherlands: String(payload?.topScorerNetherlands || "").trim(),
    totalGoals:
      payload?.totalGoals === "" || payload?.totalGoals === null || payload?.totalGoals === undefined
        ? null
        : Number(payload.totalGoals),
  };
}

function sanitizeAnswerList(values) {
  const raw =
    Array.isArray(values) ? values : String(values || "").split(/\r?\n/);

  return [...new Set(raw.map((value) => String(value || "").trim()).filter(Boolean))];
}

function sanitizeBonusResults(payload) {
  const topScorerAnswers = sanitizeAnswerList(
    payload?.topScorerAnswers && Array.isArray(payload.topScorerAnswers)
      ? payload.topScorerAnswers
      : payload?.topScorerAnswers ?? payload?.topScorer,
  );
  const bestAfricanTeamAnswers = sanitizeAnswerList(
    payload?.bestAfricanTeamAnswers && Array.isArray(payload.bestAfricanTeamAnswers)
      ? payload.bestAfricanTeamAnswers
      : payload?.bestAfricanTeamAnswers ?? payload?.bestAfricanTeam,
  );
  const bestAsianTeamAnswers = sanitizeAnswerList(
    payload?.bestAsianTeamAnswers && Array.isArray(payload.bestAsianTeamAnswers)
      ? payload.bestAsianTeamAnswers
      : payload?.bestAsianTeamAnswers ?? payload?.bestAsianTeam,
  );
  const bestCentralAmericanTeamAnswers = sanitizeAnswerList(
    payload?.bestCentralAmericanTeamAnswers && Array.isArray(payload.bestCentralAmericanTeamAnswers)
      ? payload.bestCentralAmericanTeamAnswers
      : payload?.bestCentralAmericanTeamAnswers ?? payload?.bestCentralAmericanTeam,
  );
  const topScorerNetherlandsAnswers = sanitizeAnswerList(
    payload?.topScorerNetherlandsAnswers && Array.isArray(payload.topScorerNetherlandsAnswers)
      ? payload.topScorerNetherlandsAnswers
      : payload?.topScorerNetherlandsAnswers ?? payload?.topScorerNetherlands,
  );

  return {
    championTeam: String(payload?.championTeam || "").trim(),
    mostGoalsTeam: String(payload?.mostGoalsTeam || "").trim(),
    mostConcededTeam: String(payload?.mostConcededTeam || "").trim(),
    bestAfricanTeam: bestAfricanTeamAnswers[0] || "",
    bestAfricanTeamAnswers,
    bestAsianTeam: bestAsianTeamAnswers[0] || "",
    bestAsianTeamAnswers,
    bestCentralAmericanTeam: bestCentralAmericanTeamAnswers[0] || "",
    bestCentralAmericanTeamAnswers,
    topScorer: topScorerAnswers[0] || "",
    topScorerAnswers,
    topScorerNetherlands: topScorerNetherlandsAnswers[0] || "",
    topScorerNetherlandsAnswers,
    totalGoals:
      payload?.totalGoals === "" || payload?.totalGoals === null || payload?.totalGoals === undefined
        ? null
        : Number(payload.totalGoals),
  };
}

function normalizeFreeText(value) {
  return String(value || "")
    .trim()
    .toLocaleLowerCase("nl-NL")
    .replace(/\s+/g, " ");
}

function computeTotalGoalsPoints(predictedTotalGoals, actualTotalGoals, maxPoints) {
  if (
    predictedTotalGoals === null ||
    predictedTotalGoals === undefined ||
    actualTotalGoals === null ||
    actualTotalGoals === undefined
  ) {
    return 0;
  }

  return Math.max(0, Number(maxPoints) - Math.abs(Number(predictedTotalGoals) - Number(actualTotalGoals)));
}

function computeBonusPoints(bonusPredictions, bonusResults, rules) {
  let total = 0;

  if (bonusPredictions.championTeam && bonusPredictions.championTeam === bonusResults.championTeam) {
    total += rules.championPoints;
  }

  if (bonusPredictions.mostGoalsTeam && bonusPredictions.mostGoalsTeam === bonusResults.mostGoalsTeam) {
    total += rules.mostGoalsTeamPoints;
  }

  if (
    bonusPredictions.mostConcededTeam &&
    bonusPredictions.mostConcededTeam === bonusResults.mostConcededTeam
  ) {
    total += rules.mostConcededTeamPoints;
  }

  const acceptedAfricanTeams = sanitizeAnswerList(
    bonusResults.bestAfricanTeamAnswers?.length ? bonusResults.bestAfricanTeamAnswers : bonusResults.bestAfricanTeam,
  );
  if (bonusPredictions.bestAfricanTeam && acceptedAfricanTeams.includes(bonusPredictions.bestAfricanTeam)) {
    total += rules.bestAfricanTeamPoints;
  }

  const acceptedAsianTeams = sanitizeAnswerList(
    bonusResults.bestAsianTeamAnswers?.length ? bonusResults.bestAsianTeamAnswers : bonusResults.bestAsianTeam,
  );
  if (bonusPredictions.bestAsianTeam && acceptedAsianTeams.includes(bonusPredictions.bestAsianTeam)) {
    total += rules.bestAsianTeamPoints;
  }

  const acceptedCentralAmericanTeams = sanitizeAnswerList(
    bonusResults.bestCentralAmericanTeamAnswers?.length
      ? bonusResults.bestCentralAmericanTeamAnswers
      : bonusResults.bestCentralAmericanTeam,
  );
  if (
    bonusPredictions.bestCentralAmericanTeam &&
    acceptedCentralAmericanTeams.includes(bonusPredictions.bestCentralAmericanTeam)
  ) {
    total += rules.bestCentralAmericanTeamPoints;
  }

  const acceptedTopScorers = sanitizeAnswerList(
    bonusResults.topScorerAnswers?.length ? bonusResults.topScorerAnswers : bonusResults.topScorer,
  ).map(normalizeFreeText);

  if (bonusPredictions.topScorer && acceptedTopScorers.includes(normalizeFreeText(bonusPredictions.topScorer))) {
    total += rules.topScorerPoints;
  }

  const acceptedDutchTopScorers = sanitizeAnswerList(
    bonusResults.topScorerNetherlandsAnswers?.length
      ? bonusResults.topScorerNetherlandsAnswers
      : bonusResults.topScorerNetherlands,
  ).map(normalizeFreeText);
  if (
    bonusPredictions.topScorerNetherlands &&
    acceptedDutchTopScorers.includes(normalizeFreeText(bonusPredictions.topScorerNetherlands))
  ) {
    total += rules.topScorerNetherlandsPoints;
  }

  total += computeTotalGoalsPoints(
    bonusPredictions.totalGoals,
    bonusResults.totalGoals,
    rules.totalGoalsExactPoints,
  );

  return total;
}

function sanitizeRules(body, previousRules = {}) {
  return {
    exactScorePoints: Number(body.exactScorePoints ?? previousRules.exactScorePoints ?? 3),
    correctOutcomePoints: Number(body.correctOutcomePoints ?? previousRules.correctOutcomePoints ?? 1),
    secondRoundPoints: Number(body.secondRoundPoints ?? previousRules.secondRoundPoints ?? 2),
    thirdRoundPoints: Number(body.thirdRoundPoints ?? previousRules.thirdRoundPoints ?? 3),
    quarterFinalPoints: Number(body.quarterFinalPoints ?? previousRules.quarterFinalPoints ?? 4),
    semiFinalPoints: Number(body.semiFinalPoints ?? previousRules.semiFinalPoints ?? 6),
    finalPoints: Number(body.finalPoints ?? previousRules.finalPoints ?? 8),
    championPoints: Number(body.championPoints ?? previousRules.championPoints ?? 10),
    mostGoalsTeamPoints: Number(body.mostGoalsTeamPoints ?? previousRules.mostGoalsTeamPoints ?? 7),
    mostConcededTeamPoints: Number(body.mostConcededTeamPoints ?? previousRules.mostConcededTeamPoints ?? 7),
    bestAfricanTeamPoints: Number(body.bestAfricanTeamPoints ?? previousRules.bestAfricanTeamPoints ?? 7),
    bestAsianTeamPoints: Number(body.bestAsianTeamPoints ?? previousRules.bestAsianTeamPoints ?? 7),
    bestCentralAmericanTeamPoints: Number(
      body.bestCentralAmericanTeamPoints ?? previousRules.bestCentralAmericanTeamPoints ?? 7
    ),
    topScorerPoints: Number(body.topScorerPoints ?? previousRules.topScorerPoints ?? 7),
    topScorerNetherlandsPoints: Number(body.topScorerNetherlandsPoints ?? previousRules.topScorerNetherlandsPoints ?? 7),
    totalGoalsExactPoints: Number(body.totalGoalsExactPoints ?? previousRules.totalGoalsExactPoints ?? 12),
    publicRulesTitle: String(body.publicRulesTitle ?? previousRules.publicRulesTitle ?? "Spelregels").trim(),
    publicRulesIntro: String(body.publicRulesIntro ?? previousRules.publicRulesIntro ?? "").trim(),
    publicRulesBody: String(body.publicRulesBody ?? previousRules.publicRulesBody ?? "").trim(),
    knockoutResults: sanitizeKnockoutResults(body.knockoutResults, previousRules.knockoutResults),
    eliminatedTeams: sanitizeTeamList(body.eliminatedTeams ?? previousRules.eliminatedTeams ?? []),
    liveLeaders: sanitizeLiveLeaders(body.liveLeaders, previousRules.liveLeaders),
    bonusResults: sanitizeBonusResults(body.bonusResults ?? previousRules.bonusResults ?? {}),
  };
}

function sanitizePoolRules(body, previousRules = {}) {
  return {
    exactScorePoints: Number(body.exactScorePoints ?? previousRules.exactScorePoints ?? 3),
    correctOutcomePoints: Number(body.correctOutcomePoints ?? previousRules.correctOutcomePoints ?? 1),
    secondRoundPoints: Number(body.secondRoundPoints ?? previousRules.secondRoundPoints ?? 2),
    thirdRoundPoints: Number(body.thirdRoundPoints ?? previousRules.thirdRoundPoints ?? 3),
    quarterFinalPoints: Number(body.quarterFinalPoints ?? previousRules.quarterFinalPoints ?? 4),
    semiFinalPoints: Number(body.semiFinalPoints ?? previousRules.semiFinalPoints ?? 6),
    finalPoints: Number(body.finalPoints ?? previousRules.finalPoints ?? 8),
    championPoints: Number(body.championPoints ?? previousRules.championPoints ?? 10),
    mostGoalsTeamPoints: Number(body.mostGoalsTeamPoints ?? previousRules.mostGoalsTeamPoints ?? 7),
    mostConcededTeamPoints: Number(body.mostConcededTeamPoints ?? previousRules.mostConcededTeamPoints ?? 7),
    bestAfricanTeamPoints: Number(body.bestAfricanTeamPoints ?? previousRules.bestAfricanTeamPoints ?? 7),
    bestAsianTeamPoints: Number(body.bestAsianTeamPoints ?? previousRules.bestAsianTeamPoints ?? 7),
    bestCentralAmericanTeamPoints: Number(
      body.bestCentralAmericanTeamPoints ?? previousRules.bestCentralAmericanTeamPoints ?? 7
    ),
    topScorerPoints: Number(body.topScorerPoints ?? previousRules.topScorerPoints ?? 7),
    topScorerNetherlandsPoints: Number(body.topScorerNetherlandsPoints ?? previousRules.topScorerNetherlandsPoints ?? 7),
    totalGoalsExactPoints: Number(body.totalGoalsExactPoints ?? previousRules.totalGoalsExactPoints ?? 12),
    publicRulesTitle: String(body.publicRulesTitle ?? previousRules.publicRulesTitle ?? "Spelregels").trim(),
    publicRulesIntro: String(body.publicRulesIntro ?? previousRules.publicRulesIntro ?? "").trim(),
    publicRulesBody: String(body.publicRulesBody ?? previousRules.publicRulesBody ?? "").trim(),
  };
}

function buildEffectiveRules(pool, globalRules) {
  return {
    ...sanitizePoolRules(pool?.rules || {}),
    bonusResults: sanitizeBonusResults(globalRules?.bonusResults ?? {}),
    knockoutResults: sanitizeKnockoutResults(globalRules?.knockoutResults),
    eliminatedTeams: sanitizeTeamList(globalRules?.eliminatedTeams ?? []),
    liveLeaders: sanitizeLiveLeaders(globalRules?.liveLeaders ?? {}),
  };
}

function getKnockoutSelectionStatus(predictedTeam, actualTeams, eliminatedTeams, expectedCount) {
  if (!predictedTeam) {
    return "empty";
  }

  const actualSet = new Set(uniqueNormalized(actualTeams));
  const isRoundComplete = Number(expectedCount || 0) > 0 && actualSet.size >= expectedCount;

  if (actualSet.has(predictedTeam)) {
    return "correct";
  }

  if (eliminatedTeams.has(predictedTeam)) {
    return "wrong";
  }

  if (isRoundComplete && !actualSet.has(predictedTeam)) {
    return "wrong";
  }

  return "pending";
}

function getBonusAnswerStatus(questionKey, prediction, bonusResults, eliminatedTeams, rules = {}) {
  if (prediction === "" || prediction === null || prediction === undefined) {
    return "empty";
  }

  if (questionKey === "championTeam") {
    if (bonusResults.championTeam && prediction === bonusResults.championTeam) {
      return "correct";
    }

    if (bonusResults.championTeam && prediction !== bonusResults.championTeam) {
      return "wrong";
    }

    return eliminatedTeams.has(prediction) ? "wrong" : "pending";
  }

  if (questionKey === "mostGoalsTeam" && bonusResults.mostGoalsTeam) {
    return prediction === bonusResults.mostGoalsTeam ? "correct" : "wrong";
  }

  if (questionKey === "mostConcededTeam" && bonusResults.mostConcededTeam) {
    return prediction === bonusResults.mostConcededTeam ? "correct" : "wrong";
  }

  if (questionKey === "bestAfricanTeam") {
    const accepted = sanitizeAnswerList(
      bonusResults.bestAfricanTeamAnswers?.length ? bonusResults.bestAfricanTeamAnswers : bonusResults.bestAfricanTeam,
    );
    if (accepted.length) {
      return accepted.includes(prediction) ? "correct" : "wrong";
    }
    return "pending";
  }

  if (questionKey === "bestAsianTeam") {
    const accepted = sanitizeAnswerList(
      bonusResults.bestAsianTeamAnswers?.length ? bonusResults.bestAsianTeamAnswers : bonusResults.bestAsianTeam,
    );
    if (accepted.length) {
      return accepted.includes(prediction) ? "correct" : "wrong";
    }
    return "pending";
  }

  if (questionKey === "bestCentralAmericanTeam") {
    const accepted = sanitizeAnswerList(
      bonusResults.bestCentralAmericanTeamAnswers?.length
        ? bonusResults.bestCentralAmericanTeamAnswers
        : bonusResults.bestCentralAmericanTeam,
    );
    if (accepted.length) {
      return accepted.includes(prediction) ? "correct" : "wrong";
    }
    return "pending";
  }

  if (questionKey === "topScorer") {
    const accepted = sanitizeAnswerList(
      bonusResults.topScorerAnswers?.length ? bonusResults.topScorerAnswers : bonusResults.topScorer,
    ).map(normalizeFreeText);
    if (accepted.length) {
      return accepted.includes(normalizeFreeText(prediction)) ? "correct" : "wrong";
    }
    return "pending";
  }

  if (questionKey === "topScorerNetherlands") {
    const accepted = sanitizeAnswerList(
      bonusResults.topScorerNetherlandsAnswers?.length
        ? bonusResults.topScorerNetherlandsAnswers
        : bonusResults.topScorerNetherlands,
    ).map(normalizeFreeText);
    if (accepted.length) {
      return accepted.includes(normalizeFreeText(prediction)) ? "correct" : "wrong";
    }
    return "pending";
  }

  if (questionKey === "totalGoals") {
    if (bonusResults.totalGoals === null || bonusResults.totalGoals === undefined) {
      return "pending";
    }

    const awardedPoints = computeTotalGoalsPoints(
      prediction,
      bonusResults.totalGoals,
      rules.totalGoalsExactPoints,
    );

    if (awardedPoints >= Number(rules.totalGoalsExactPoints || 0)) {
      return "correct";
    }

    if (awardedPoints > 0) {
      return "partial";
    }

    return "wrong";
  }

  return "pending";
}

function ensurePoolsState(pools, globalRules) {
  if (Array.isArray(pools) && pools.length) {
    return pools.map((pool) => ({
      id: pool.id || crypto.randomUUID(),
      name: String(pool.name || "Nieuwe pool").trim(),
      slug: slugify(pool.slug || pool.name || "nieuwe-pool"),
      createdAt: pool.createdAt || new Date().toISOString(),
      rules: sanitizePoolRules(pool.rules || {}, globalRules || {}),
    }));
  }

  return [
    {
      id: DEFAULT_POOL_ID,
      name: "Gerrie Senden Bokaal WK-toto",
      slug: "gerrie-senden-bokaal-wk-toto",
      createdAt: new Date().toISOString(),
      rules: sanitizePoolRules(globalRules || {}),
    },
  ];
}

function normalizeParticipantPoolId(participant, pools) {
  if (participant.poolId && pools.some((pool) => pool.id === participant.poolId)) {
    return participant.poolId;
  }

  return pools[0]?.id || DEFAULT_POOL_ID;
}

function findPoolBySlug(pools, slug) {
  return pools.find((pool) => pool.slug === slug);
}

function findPoolById(pools, poolId) {
  return pools.find((pool) => pool.id === poolId);
}

function toPublicParticipant(participant, competition) {
  return {
    id: participant.id,
    name: participant.name,
    editToken: participant.editToken,
    createdAt: participant.createdAt,
    updatedAt: participant.updatedAt,
    isLocked: isDeadlinePassed(competition),
    predictions: participant.predictions,
    knockoutPredictions: participant.knockoutPredictions,
    bonusPredictions: participant.bonusPredictions,
  };
}

function toPublicParticipantSummary(participant) {
  return {
    id: participant.id,
    name: participant.name,
    createdAt: participant.createdAt,
    updatedAt: participant.updatedAt,
    predictions: participant.predictions,
    knockoutPredictions: participant.knockoutPredictions,
    bonusPredictions: participant.bonusPredictions,
  };
}

async function getState() {
  const [competition, matches, participants, rules, pools] = await Promise.all([
    readJson("competition.json", null),
    readJson("matches.json", []),
    readJson("participants.json", []),
    readJson("rules.json", null),
    readJson("pools.json", []),
  ]);

  const normalizedPools = ensurePoolsState(pools, rules || {});
  const normalizedParticipants = participants.map((participant) => ({
    ...participant,
    poolId: normalizeParticipantPoolId(participant, normalizedPools),
  }));
  const normalizedMatches = matches.map((match) => {
    const homeScore = normalizeScore(match.homeScore);
    const awayScore = normalizeScore(match.awayScore);
    const complete = homeScore !== null && awayScore !== null;
    const finished = complete && match.status === "finished";

    return {
      ...match,
      homeScore: finished ? homeScore : null,
      awayScore: finished ? awayScore : null,
      status: finished ? "finished" : "scheduled",
    };
  });

  return {
    competition,
    matches: normalizedMatches,
    participants: normalizedParticipants,
    rules,
    pools: normalizedPools,
  };
}

async function handleBootstrap(res, pool) {
  const { competition, matches, rules } = await getState();
  sendJson(res, 200, {
    competition,
    pool: {
      id: pool.id,
      name: pool.name,
      slug: pool.slug,
    },
    rules: buildEffectiveRules(pool, rules || {}),
    matches,
    isLocked: isDeadlinePassed(competition),
  });
}

async function handleGetParticipant(res, token, pool) {
  const { participants, competition } = await getState();
  const participant = participants.find((entry) => entry.editToken === token && entry.poolId === pool.id);

  if (!participant) {
    sendJson(res, 404, { error: "Deelnemer niet gevonden" });
    return;
  }

  sendJson(res, 200, toPublicParticipant(participant, competition));
}

function normalizeParticipantName(name) {
  return String(name || "").trim().toLocaleLowerCase("nl");
}

async function handleRecoverParticipant(res, body, pool) {
  const { participants, competition } = await getState();
  const name = String(body.name || "").trim();
  if (!name) {
    sendJson(res, 400, { error: "Naam is verplicht" });
    return;
  }

  const normalizedName = normalizeParticipantName(name);
  const participant = participants
    .filter((entry) => entry.poolId === pool.id && normalizeParticipantName(entry.name) === normalizedName)
    .sort((left, right) => new Date(right.updatedAt || right.createdAt).getTime() - new Date(left.updatedAt || left.createdAt).getTime())[0];

  if (!participant) {
    sendJson(res, 404, { error: "Geen inzending gevonden voor deze naam" });
    return;
  }

  sendJson(res, 200, toPublicParticipant(participant, competition));
}

async function handlePublicParticipant(res, participantId, pool) {
  const { participants, matches, rules, competition } = await getState();
  if (!isDeadlinePassed(competition)) {
    sendJson(res, 403, { error: "Voorspellingen zijn pas zichtbaar na de start van het toernooi." });
    return;
  }

  const participant = participants.find((entry) => entry.id === participantId && entry.poolId === pool.id);

  if (!participant) {
    sendJson(res, 404, { error: "Deelnemer niet gevonden" });
    return;
  }

  const matchById = new Map(matches.map((match) => [match.id, match]));
  const effectiveRules = buildEffectiveRules(pool, rules || {});
  const predictions = participant.predictions.map((prediction) => {
    const match = matchById.get(prediction.matchId);
    return {
      ...prediction,
      match,
      points: match ? computeMatchPoints(prediction, match, effectiveRules) : 0,
      outcome: match ? predictionOutcomeLabel(prediction, match, effectiveRules) : "miss",
    };
  });

  sendJson(res, 200, {
    participant: toPublicParticipantSummary(participant),
    predictions,
  });
}

async function handleAdminParticipants(req, res, pool) {
  if (!isAdmin(req)) {
    sendJson(res, 401, { error: "Niet ingelogd als admin" });
    return;
  }

  const { participants, matches, rules } = await getState();
  const matchById = new Map(matches.map((match) => [match.id, match]));
  const effectiveRules = buildEffectiveRules(pool, rules || {});

    const enrichedParticipants = participants
    .filter((participant) => participant.poolId === pool.id)
    .map((participant) => ({
      id: participant.id,
      name: participant.name,
      editToken: participant.editToken,
      createdAt: participant.createdAt,
      updatedAt: participant.updatedAt,
      knockoutPredictions: participant.knockoutPredictions,
      bonusPredictions: participant.bonusPredictions,
      predictions: participant.predictions.map((prediction) => {
        const match = matchById.get(prediction.matchId);
        return {
        ...prediction,
        match,
        points: match ? computeMatchPoints(prediction, match, effectiveRules) : 0,
      };
    }),
  }));

  sendJson(res, 200, { participants: enrichedParticipants });
}

async function handleAdminDeleteParticipant(req, res, pool, participantId) {
  if (!isAdmin(req)) {
    sendJson(res, 401, { error: "Niet ingelogd als admin" });
    return;
  }

  const { participants } = await getState();
  const index = participants.findIndex((entry) => entry.id === participantId && entry.poolId === pool.id);
  if (index === -1) {
    sendJson(res, 404, { error: "Deelnemer niet gevonden" });
    return;
  }

  participants.splice(index, 1);
  await writeJson("participants.json", participants);
  sendJson(res, 200, { ok: true });
}

function sanitizePredictions(matches, incomingPredictions) {
  const validMatches = getGroupStageMatches(matches);
  const validMatchIds = new Set(validMatches.map((match) => match.id));
  const byMatchId = new Map();

  for (const prediction of incomingPredictions || []) {
    if (!prediction || !validMatchIds.has(prediction.matchId)) {
      continue;
    }

    byMatchId.set(prediction.matchId, {
      matchId: prediction.matchId,
      predictedHomeScore: normalizeScore(prediction.predictedHomeScore),
      predictedAwayScore: normalizeScore(prediction.predictedAwayScore),
    });
  }

  return validMatches.map((match) => {
    const saved = byMatchId.get(match.id);
    return (
      saved || {
        matchId: match.id,
        predictedHomeScore: null,
        predictedAwayScore: null,
      }
    );
  });
}

function sanitizeKnockoutPredictions(payload) {
  const rounds = ["secondRound", "thirdRound", "quarterFinal", "semiFinal", "final"];
  const result = {};

  for (const round of rounds) {
    result[round] = normalizeSlotValues(payload?.[round]);
  }

  return result;
}

async function createParticipant(res, body, pool) {
  const { competition, participants, matches } = await getState();

  if (isDeadlinePassed(competition)) {
    sendJson(res, 403, { error: "De deadline is verstreken" });
    return;
  }

  const name = String(body.name || "").trim();
  if (!name) {
    sendJson(res, 400, { error: "Naam is verplicht" });
    return;
  }

    const participant = {
      id: crypto.randomUUID(),
      poolId: pool.id,
      name,
      editToken: crypto.randomBytes(24).toString("hex"),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      predictions: sanitizePredictions(matches, body.predictions),
      knockoutPredictions: sanitizeKnockoutPredictions(body.knockoutPredictions),
      bonusPredictions: sanitizeBonusAnswers(body.bonusPredictions),
    };

  participants.push(participant);
  await writeJson("participants.json", participants);

  sendJson(res, 201, toPublicParticipant(participant, competition));
}

async function updateParticipant(res, token, body, pool) {
  const { competition, participants, matches } = await getState();

  if (isDeadlinePassed(competition)) {
    sendJson(res, 403, { error: "De deadline is verstreken" });
    return;
  }

  const participant = participants.find((entry) => entry.editToken === token && entry.poolId === pool.id);
  if (!participant) {
    sendJson(res, 404, { error: "Deelnemer niet gevonden" });
    return;
  }

  const name = String(body.name || participant.name).trim();
  if (!name) {
    sendJson(res, 400, { error: "Naam is verplicht" });
    return;
  }

  participant.name = name;
  participant.updatedAt = new Date().toISOString();
  participant.predictions = sanitizePredictions(matches, body.predictions);
  participant.knockoutPredictions = sanitizeKnockoutPredictions(body.knockoutPredictions);
  participant.bonusPredictions = sanitizeBonusAnswers(body.bonusPredictions);

  await writeJson("participants.json", participants);
  sendJson(res, 200, toPublicParticipant(participant, competition));
}

async function handleStandings(res, pool) {
  const { participants, matches, rules, competition } = await getState();
  const effectiveRules = buildEffectiveRules(pool, rules || {});
  const poolParticipants = participants.filter((participant) => participant.poolId === pool.id);
  const groupStageMatches = getGroupStageMatches(matches);
  const groupStageMatchById = new Map(groupStageMatches.map((match) => [match.id, match]));
  const knockoutResults = sanitizeKnockoutResults(effectiveRules.knockoutResults);
  const eliminatedTeams = new Set(effectiveRules.eliminatedTeams || []);
  const finishedMatches = matches
    .filter((match) => match.status === "finished" && hasCompleteScore(match))
    .sort((left, right) => {
      const leftUpdated = new Date(left.updatedAt || left.kickoffAt).getTime();
      const rightUpdated = new Date(right.updatedAt || right.kickoffAt).getTime();
      return rightUpdated - leftUpdated;
    });
  const lastUpdatedMatch = finishedMatches[0] || null;
  const recentMatches = finishedMatches
    .filter((match) => groupStageMatchById.has(match.id))
    .slice(0, 5);
  const upcomingMatches = groupStageMatches
    .filter((match) => !hasCompleteScore(match))
    .sort((left, right) => new Date(left.kickoffAt).getTime() - new Date(right.kickoffAt).getTime())
    .slice(0, 5);
  const finishedWithScores = matches.filter((match) => match.status === "finished" && hasCompleteScore(match));
  const teamStats = new Map();

  for (const match of finishedWithScores) {
    if (!teamStats.has(match.homeTeam)) {
      teamStats.set(match.homeTeam, { scored: 0, conceded: 0 });
    }
    if (!teamStats.has(match.awayTeam)) {
      teamStats.set(match.awayTeam, { scored: 0, conceded: 0 });
    }

    teamStats.get(match.homeTeam).scored += match.homeScore;
    teamStats.get(match.homeTeam).conceded += match.awayScore;
    teamStats.get(match.awayTeam).scored += match.awayScore;
    teamStats.get(match.awayTeam).conceded += match.homeScore;
  }

  const manualKnockoutGoalsSoFar = Number(effectiveRules.liveLeaders?.knockoutGoalsSoFar ?? 0);
  const manualKnockoutFinishedMatches = Number(effectiveRules.liveLeaders?.knockoutFinishedMatches ?? 0);
  const finishedMatchCount = finishedWithScores.length + manualKnockoutFinishedMatches;
  const totalGoalsSoFar =
    finishedWithScores.reduce((sum, match) => sum + match.homeScore + match.awayScore, 0) + manualKnockoutGoalsSoFar;
  const projectedTotalGoals =
    finishedMatchCount > 0 ? Math.round((totalGoalsSoFar / finishedMatchCount) * 104) : null;
  const highestScored = Math.max(0, ...[...teamStats.values()].map((entry) => entry.scored));
  const highestConceded = Math.max(0, ...[...teamStats.values()].map((entry) => entry.conceded));
  const mostScoredTeams = [...teamStats.entries()]
    .filter(([, entry]) => entry.scored === highestScored && highestScored > 0)
    .map(([team]) => team)
    .sort((left, right) => left.localeCompare(right, "nl"));
  const mostConcededTeams = [...teamStats.entries()]
    .filter(([, entry]) => entry.conceded === highestConceded && highestConceded > 0)
    .map(([team]) => team)
    .sort((left, right) => left.localeCompare(right, "nl"));

  const standings = poolParticipants
    .map((participant) => {
      const matchPoints = participant.predictions.reduce((sum, prediction) => {
        const match = groupStageMatchById.get(prediction.matchId);
        return sum + computeMatchPoints(prediction, match, effectiveRules);
      }, 0);
        const knockoutPoints = computeKnockoutPoints(
          participant.knockoutPredictions,
          knockoutResults,
          effectiveRules,
        );
        const bonusPoints = computeBonusPoints(
          participant.bonusPredictions || {},
          effectiveRules.bonusResults || {},
          effectiveRules,
        );

        return {
          id: participant.id,
          name: participant.name,
          matchPoints,
          knockoutPoints,
          bonusPoints,
          totalPoints: matchPoints + knockoutPoints + bonusPoints,
        };
      })
    .sort((left, right) => right.totalPoints - left.totalPoints || right.matchPoints - left.matchPoints);

  const recentMatchPredictions = recentMatches.map((match) => ({
    match,
    entries: poolParticipants.map((participant) => {
      const prediction = participant.predictions.find((entry) => entry.matchId === match.id) || {
        predictedHomeScore: null,
        predictedAwayScore: null,
      };

      return {
        participantId: participant.id,
        participantName: participant.name,
        predictedHomeScore: prediction.predictedHomeScore,
        predictedAwayScore: prediction.predictedAwayScore,
        points: computeMatchPoints(prediction, match, effectiveRules),
        outcome: predictionOutcomeLabel(prediction, match, effectiveRules),
      };
    }),
  }));

  const upcomingMatchPredictions = upcomingMatches.map((match) => ({
    match,
    entries: poolParticipants.map((participant) => {
      const prediction = participant.predictions.find((entry) => entry.matchId === match.id) || {
        predictedHomeScore: null,
        predictedAwayScore: null,
      };

      return {
        participantId: participant.id,
        participantName: participant.name,
        predictedHomeScore: prediction.predictedHomeScore,
        predictedAwayScore: prediction.predictedAwayScore,
      };
    }),
  }));

  const knockoutOverview = knockoutRoundDefinitions.flatMap((round) => {
    const roundMatches = getKnockoutMatchesByRoundKey(matches, round.key);
    return roundMatches.map((match, matchIndex) => ({
      roundKey: round.key,
      roundLabel: round.label,
      roundShortLabel: round.shortLabel,
      roundSlots: round.slots,
      match,
      entries: poolParticipants.map((participant) => {
        const values = participant.knockoutPredictions?.[round.key] || [];
        const actualValues = knockoutResults[round.key] || [];
        const homePrediction = values[matchIndex * 2] || "";
        const awayPrediction = values[matchIndex * 2 + 1] || "";
        return {
          participantId: participant.id,
          participantName: participant.name,
          selections: [
            {
              team: homePrediction,
              status: getKnockoutSelectionStatus(homePrediction, actualValues, eliminatedTeams, round.slots),
            },
            {
              team: awayPrediction,
              status: getKnockoutSelectionStatus(awayPrediction, actualValues, eliminatedTeams, round.slots),
            },
          ],
        };
      }),
    }));
  });

  const bonusOverview = poolParticipants.map((participant) => {
    const bonusPredictions = participant.bonusPredictions || {};
    return {
      participantId: participant.id,
      participantName: participant.name,
      answers: {
        championTeam: {
          value: bonusPredictions.championTeam || "",
          status: getBonusAnswerStatus(
            "championTeam",
            bonusPredictions.championTeam,
            effectiveRules.bonusResults || {},
            eliminatedTeams,
            effectiveRules,
          ),
        },
        mostGoalsTeam: {
          value: bonusPredictions.mostGoalsTeam || "",
          status: getBonusAnswerStatus(
            "mostGoalsTeam",
            bonusPredictions.mostGoalsTeam,
            effectiveRules.bonusResults || {},
            eliminatedTeams,
            effectiveRules,
          ),
        },
        mostConcededTeam: {
          value: bonusPredictions.mostConcededTeam || "",
          status: getBonusAnswerStatus(
            "mostConcededTeam",
            bonusPredictions.mostConcededTeam,
            effectiveRules.bonusResults || {},
            eliminatedTeams,
            effectiveRules,
          ),
        },
        bestAfricanTeam: {
          value: bonusPredictions.bestAfricanTeam || "",
          status: getBonusAnswerStatus(
            "bestAfricanTeam",
            bonusPredictions.bestAfricanTeam,
            effectiveRules.bonusResults || {},
            eliminatedTeams,
            effectiveRules,
          ),
        },
        bestAsianTeam: {
          value: bonusPredictions.bestAsianTeam || "",
          status: getBonusAnswerStatus(
            "bestAsianTeam",
            bonusPredictions.bestAsianTeam,
            effectiveRules.bonusResults || {},
            eliminatedTeams,
            effectiveRules,
          ),
        },
        bestCentralAmericanTeam: {
          value: bonusPredictions.bestCentralAmericanTeam || "",
          status: getBonusAnswerStatus(
            "bestCentralAmericanTeam",
            bonusPredictions.bestCentralAmericanTeam,
            effectiveRules.bonusResults || {},
            eliminatedTeams,
            effectiveRules,
          ),
        },
        topScorer: {
          value: bonusPredictions.topScorer || "",
          status: getBonusAnswerStatus(
            "topScorer",
            bonusPredictions.topScorer,
            effectiveRules.bonusResults || {},
            eliminatedTeams,
            effectiveRules,
          ),
        },
        topScorerNetherlands: {
          value: bonusPredictions.topScorerNetherlands || "",
          status: getBonusAnswerStatus(
            "topScorerNetherlands",
            bonusPredictions.topScorerNetherlands,
            effectiveRules.bonusResults || {},
            eliminatedTeams,
            effectiveRules,
          ),
        },
        totalGoals: {
          value: bonusPredictions.totalGoals ?? "",
          points: computeTotalGoalsPoints(
            bonusPredictions.totalGoals,
            effectiveRules.bonusResults?.totalGoals,
            effectiveRules.totalGoalsExactPoints,
          ),
          status: getBonusAnswerStatus(
            "totalGoals",
            bonusPredictions.totalGoals,
            effectiveRules.bonusResults || {},
            eliminatedTeams,
            effectiveRules,
          ),
        },
      },
    };
  });

  sendJson(res, 200, {
    pool: {
      id: pool.id,
      name: pool.name,
      slug: pool.slug,
    },
    standings,
    lastUpdatedMatch,
    liveTournamentStats: {
      finishedMatchCount,
      totalGoalsSoFar,
      projectedTotalGoals,
      mostScoredTeams,
      mostScoredGoals: highestScored,
      mostConcededTeams,
      mostConcededGoals: highestConceded,
      currentTopScorer: effectiveRules.liveLeaders?.currentTopScorer || "",
      currentDutchTopScorer: effectiveRules.liveLeaders?.currentDutchTopScorer || "",
      knockoutGoalsSoFar: manualKnockoutGoalsSoFar,
      knockoutFinishedMatches: manualKnockoutFinishedMatches,
    },
    recentMatchPredictions,
    upcomingMatchPredictions,
    knockoutOverview,
    bonusOverview,
    predictionsUnlocked: isDeadlinePassed(competition),
  });
}

function createAdminSession() {
  const token = crypto.randomBytes(24).toString("hex");
  sessions.set(token, { createdAt: Date.now() });
  return token;
}

function isAdmin(req) {
  const cookies = parseCookies(req);
  return Boolean(cookies[ADMIN_COOKIE] && sessions.has(cookies[ADMIN_COOKIE]));
}

async function handleAdminLogin(req, res) {
  const body = await readBody(req);
  if (body.password !== ADMIN_PASSWORD) {
    sendJson(res, 401, { error: "Onjuist wachtwoord" });
    return;
  }

  const sessionToken = createAdminSession();
  sendJson(
    res,
    200,
    { ok: true },
    {
      "Set-Cookie": `${ADMIN_COOKIE}=${sessionToken}; HttpOnly; Path=/; SameSite=Lax`,
    },
  );
}

async function handleAdminPools(req, res) {
  if (!isAdmin(req)) {
    sendJson(res, 401, { error: "Niet ingelogd als admin" });
    return;
  }

  const { pools } = await getState();

  if (req.method === "GET") {
    sendJson(res, 200, { pools });
    return;
  }

  const body = await readBody(req);
  const name = String(body.name || "").trim();
  if (!name) {
    sendJson(res, 400, { error: "Poolnaam is verplicht" });
    return;
  }

  const currentPools = [...pools];
  const slugBase = slugify(name) || `pool-${Date.now()}`;
  let slug = slugBase;
  let suffix = 2;
  while (currentPools.some((pool) => pool.slug === slug)) {
    slug = `${slugBase}-${suffix}`;
    suffix += 1;
  }

  const pool = {
    id: crypto.randomUUID(),
    name,
    slug,
    createdAt: new Date().toISOString(),
    rules: sanitizePoolRules(body.rules || {}),
  };

  currentPools.push(pool);
  await writeJson("pools.json", currentPools);
  sendJson(res, 201, { pool });
}

async function handleAdminPoolRules(req, res, poolId) {
  if (!isAdmin(req)) {
    sendJson(res, 401, { error: "Niet ingelogd als admin" });
    return;
  }

  const { pools } = await getState();
  const pool = findPoolById(pools, poolId);
  if (!pool) {
    sendJson(res, 404, { error: "Pool niet gevonden" });
    return;
  }

  if (req.method === "GET") {
    sendJson(res, 200, sanitizePoolRules(pool.rules || {}));
    return;
  }

  const body = await readBody(req);
  const nextPools = pools.map((entry) =>
    entry.id === poolId
      ? {
          ...entry,
          name: String(body.name ?? entry.name).trim() || entry.name,
          rules: sanitizePoolRules(body, entry.rules),
        }
      : entry,
  );

  await writeJson("pools.json", nextPools);
  sendJson(res, 200, nextPools.find((entry) => entry.id === poolId).rules);
}

async function handleAdminRules(req, res) {
  if (!isAdmin(req)) {
    sendJson(res, 401, { error: "Niet ingelogd als admin" });
    return;
  }

  if (req.method === "GET") {
    const rules = await readJson("rules.json", null);
    sendJson(res, 200, rules);
    return;
  }

  const body = await readBody(req);
  const previousRules = await readJson("rules.json", null);
  const nextRules = sanitizeRules(body, previousRules);

  await writeJson("rules.json", nextRules);
  sendJson(res, 200, nextRules);
}

async function handleAdminMatches(req, res) {
  if (!isAdmin(req)) {
    sendJson(res, 401, { error: "Niet ingelogd als admin" });
    return;
  }

  const state = await getState();
  const matches = state.matches;
  const previousRules = state.rules;

  if (req.method === "GET") {
    sendJson(res, 200, {
      matches,
      knockoutResults: sanitizeKnockoutResults(previousRules?.knockoutResults),
      eliminatedTeams: sanitizeTeamList(previousRules?.eliminatedTeams ?? []),
    });
    return;
  }

  const body = await readBody(req);
  const incomingMatches = Array.isArray(body.matches) ? body.matches : [];
  const updatesById = new Map(incomingMatches.map((match) => [match.id, match]));

  for (const match of matches) {
    const update = updatesById.get(match.id);
    if (!update) {
      continue;
    }

    const homeScore = normalizeScore(update.homeScore);
    const awayScore = normalizeScore(update.awayScore);
    const explicitStatus = String(update.status || "").trim();
    const hasAnyScore = homeScore !== null || awayScore !== null;
    const isComplete = homeScore !== null && awayScore !== null;

    if (hasAnyScore && !isComplete) {
      sendJson(res, 400, {
        error: `Vul voor ${match.homeTeam} - ${match.awayTeam} beide scores in, of laat ze allebei leeg.`,
      });
      return;
    }

    if (explicitStatus === "finished" && !isComplete) {
      sendJson(res, 400, {
        error: `Je kunt ${match.homeTeam} - ${match.awayTeam} pas op afgelopen zetten als beide scores zijn ingevuld.`,
      });
      return;
    }
  }

  const nextMatches = matches.map((match) => {
    const update = updatesById.get(match.id);
    if (!update) {
      return match;
    }

    const explicitStatus = String(update.status || "").trim();
    const rawHomeScore = normalizeScore(update.homeScore);
    const rawAwayScore = normalizeScore(update.awayScore);
    const isComplete = rawHomeScore !== null && rawAwayScore !== null;
    const finished = explicitStatus === "finished" && isComplete;
    const homeScore = finished ? rawHomeScore : null;
    const awayScore = finished ? rawAwayScore : null;

    const nextMatch = {
      ...match,
      homeTeam: String(update.homeTeam || match.homeTeam).trim() || match.homeTeam,
      awayTeam: String(update.awayTeam || match.awayTeam).trim() || match.awayTeam,
      homeScore,
      awayScore,
      status: finished ? "finished" : "scheduled",
    };

    const changed =
      nextMatch.homeTeam !== match.homeTeam ||
      nextMatch.awayTeam !== match.awayTeam ||
      nextMatch.homeScore !== match.homeScore ||
      nextMatch.awayScore !== match.awayScore ||
      nextMatch.status !== match.status;

    return {
      ...nextMatch,
      updatedAt: changed ? new Date().toISOString() : match.updatedAt || null,
    };
  });

  await writeJson("matches.json", nextMatches);
  const nextRules = {
    ...(previousRules || {}),
    knockoutResults: sanitizeKnockoutResults(body.knockoutResults, previousRules?.knockoutResults),
    eliminatedTeams: sanitizeTeamList(body.eliminatedTeams ?? previousRules?.eliminatedTeams ?? []),
  };
  await writeJson("rules.json", nextRules);
  sendJson(res, 200, {
    matches: nextMatches,
    knockoutResults: nextRules.knockoutResults,
    eliminatedTeams: nextRules.eliminatedTeams,
  });
}

async function route(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;
  const parts = pathname.split("/").filter(Boolean);

  try {
    if (parts[0] === "api" && parts[1] === "pools" && parts[2]) {
      const { pools } = await getState();
      const pool = findPoolBySlug(pools, parts[2]);
      if (!pool) {
        sendJson(res, 404, { error: "Pool niet gevonden" });
        return;
      }

      if (req.method === "GET" && parts[3] === "bootstrap" && parts.length === 4) {
        await handleBootstrap(res, pool);
        return;
      }

      if (req.method === "GET" && parts[3] === "standings" && parts.length === 4) {
        await handleStandings(res, pool);
        return;
      }

      if (req.method === "POST" && parts[3] === "recover" && parts.length === 4) {
        const body = await readBody(req);
        await handleRecoverParticipant(res, body, pool);
        return;
      }

      if (req.method === "POST" && parts[3] === "participants" && parts.length === 4) {
        const body = await readBody(req);
        await createParticipant(res, body, pool);
        return;
      }

      if (req.method === "GET" && parts[3] === "participants" && parts[4] && parts.length === 5) {
        await handleGetParticipant(res, parts[4], pool);
        return;
      }

      if (req.method === "PUT" && parts[3] === "participants" && parts[4] && parts.length === 5) {
        const body = await readBody(req);
        await updateParticipant(res, parts[4], body, pool);
        return;
      }

      if (req.method === "GET" && parts[3] === "public-participants" && parts[4] && parts.length === 5) {
        await handlePublicParticipant(res, parts[4], pool);
        return;
      }
    }

    if (req.method === "POST" && pathname === "/api/admin/login") {
      await handleAdminLogin(req, res);
      return;
    }

    if ((req.method === "GET" || req.method === "POST") && pathname === "/api/admin/pools") {
      await handleAdminPools(req, res);
      return;
    }

    if ((req.method === "GET" || req.method === "PUT") && parts[0] === "api" && parts[1] === "admin" && parts[2] === "pools" && parts[3] && parts[4] === "rules") {
      await handleAdminPoolRules(req, res, parts[3]);
      return;
    }

    if ((req.method === "GET" || req.method === "PUT") && pathname === "/api/admin/rules") {
      await handleAdminRules(req, res);
      return;
    }

    if ((req.method === "GET" || req.method === "PUT") && pathname === "/api/admin/matches") {
      await handleAdminMatches(req, res);
      return;
    }

    if (req.method === "GET" && parts[0] === "api" && parts[1] === "admin" && parts[2] === "pools" && parts[3] && parts[4] === "participants" && parts.length === 5) {
      const { pools } = await getState();
      const pool = findPoolById(pools, parts[3]);
      if (!pool) {
        sendJson(res, 404, { error: "Pool niet gevonden" });
        return;
      }
      await handleAdminParticipants(req, res, pool);
      return;
    }

    if (req.method === "DELETE" && parts[0] === "api" && parts[1] === "admin" && parts[2] === "pools" && parts[3] && parts[4] === "participants" && parts[5]) {
      const { pools } = await getState();
      const pool = findPoolById(pools, parts[3]);
      if (!pool) {
        sendJson(res, 404, { error: "Pool niet gevonden" });
        return;
      }
      await handleAdminDeleteParticipant(req, res, pool, parts[5]);
      return;
    }

    if (req.method === "GET" && pathname === "/") {
      const { pools } = await getState();
      const defaultPool = pools[0];
      res.writeHead(302, { Location: `/pool/${defaultPool.slug}` });
      res.end();
      return;
    }

    if (req.method === "GET" && pathname === "/stand") {
      const { pools } = await getState();
      const defaultPool = pools[0];
      res.writeHead(302, { Location: `/pool/${defaultPool.slug}/stand` });
      res.end();
      return;
    }

    if (req.method === "GET" && parts[0] === "edit" && parts[1] && parts.length === 2) {
      const { participants, pools } = await getState();
      const participant = participants.find((entry) => entry.editToken === parts[1]);
      if (!participant) {
        sendText(res, 404, "Bewerk-link niet gevonden");
        return;
      }

      const pool = findPoolById(pools, participant.poolId) || pools[0];
      res.writeHead(302, { Location: `/pool/${pool.slug}/edit/${participant.editToken}` });
      res.end();
      return;
    }

    if (req.method === "GET" && parts[0] === "deelnemer" && parts[1] && parts.length === 2) {
      const { participants, pools } = await getState();
      const participant = participants.find((entry) => entry.id === parts[1]);
      if (!participant) {
        sendText(res, 404, "Deelnemer niet gevonden");
        return;
      }

      const pool = findPoolById(pools, participant.poolId) || pools[0];
      res.writeHead(302, { Location: `/pool/${pool.slug}/deelnemer/${participant.id}` });
      res.end();
      return;
    }

    if (req.method === "GET" && parts[0] === "pool" && parts[1] && (parts.length === 2 || (parts[2] === "edit" && parts[3] && parts.length === 4))) {
      await serveStatic(res, path.join(PUBLIC_DIR, "index.html"));
      return;
    }

    if (req.method === "GET" && parts[0] === "pool" && parts[1] && parts[2] === "stand" && parts.length === 3) {
      await serveStatic(res, path.join(PUBLIC_DIR, "stand.html"));
      return;
    }

    if (req.method === "GET" && parts[0] === "pool" && parts[1] && parts[2] === "deelnemer" && parts[3] && parts.length === 4) {
      await serveStatic(res, path.join(PUBLIC_DIR, "participant.html"));
      return;
    }

    if (req.method === "GET" && pathname === "/admin") {
      await serveStatic(res, path.join(PUBLIC_DIR, "admin.html"));
      return;
    }

    if (req.method === "GET") {
      const requestedPath = path.normalize(path.join(PUBLIC_DIR, pathname));
      if (!requestedPath.startsWith(PUBLIC_DIR)) {
        sendText(res, 403, "Niet toegestaan");
        return;
      }

      await serveStatic(res, requestedPath);
      return;
    }

    sendText(res, 404, "Niet gevonden");
  } catch (error) {
    console.error(error);
    sendJson(res, 500, { error: "Er ging iets mis op de server" });
  }
}

http.createServer(route).listen(PORT, () => {
  console.log(`WK Toto draait op http://localhost:${PORT}`);
});
