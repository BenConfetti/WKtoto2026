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
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatScore(entry, compact = false) {
  if (entry.predictedHomeScore === null || entry.predictedAwayScore === null) {
    return "-";
  }

  return compact
    ? `${entry.predictedHomeScore}-${entry.predictedAwayScore}`
    : `${entry.predictedHomeScore} - ${entry.predictedAwayScore}`;
}

function sortEntriesByStand(entries, standings) {
  const rankByParticipantId = new Map(standings.map((entry, index) => [entry.id, index]));
  return [...entries].sort((left, right) => {
    return (rankByParticipantId.get(left.participantId) ?? Number.MAX_SAFE_INTEGER) - (rankByParticipantId.get(right.participantId) ?? Number.MAX_SAFE_INTEGER);
  });
}

function renderLastUpdated(match) {
  const target = document.querySelector("#last-updated-match");
  if (!match) {
    target.textContent = "Nog geen uitslagen verwerkt.";
    return;
  }

  target.textContent = `${match.homeTeam} - ${match.awayTeam} (${match.homeScore} - ${match.awayScore}) op ${formatDateTime(match.updatedAt || match.kickoffAt)}.`;
}

function participantLink(entry, unlocked) {
  if (!unlocked) {
    return `<span>${entry.name}</span>`;
  }

  return `<a href="${poolBasePath()}/deelnemer/${entry.id}" class="table-link">${entry.name}</a>`;
}

function participantNameCell(participant, unlocked) {
  return unlocked
    ? `<a href="${poolBasePath()}/deelnemer/${participant.id}" class="table-link">${participant.name}</a>`
    : `<span>${participant.name}</span>`;
}

function shortenTeamName(team) {
  const normalized = String(team || "").trim();
  const abbreviations = {
    "Algerije": "ALG",
    "Argentinie": "ARG",
    "Australie": "AUS",
    "Belgie": "BEL",
    "Bosnie en Herzegovina": "BIH",
    "Brazilie": "BRA",
    "Canada": "CAN",
    "Colombia": "COL",
    "Curacao": "CUR",
    "DR Congo": "COD",
    "Duitsland": "GER",
    "Ecuador": "ECU",
    "Egypte": "EGY",
    "Engeland": "ENG",
    "Frankrijk": "FRA",
    "Ghana": "GHA",
    "Haiti": "HAI",
    "Irak": "IRQ",
    "Iran": "IRN",
    "Ivoorkust": "CIV",
    "Japan": "JPN",
    "Jordanie": "JOR",
    "Kaapverdie": "CPV",
    "Kroatie": "CRO",
    "Marokko": "MAR",
    "Mexico": "MEX",
    "Nederland": "NED",
    "Nieuw-Zeeland": "NZL",
    "Noorwegen": "NOR",
    "Oezbekistan": "UZB",
    "Oostenrijk": "AUT",
    "Panama": "PAN",
    "Paraguay": "PAR",
    "Portugal": "POR",
    "Qatar": "QAT",
    "Saoedi-Arabie": "KSA",
    "Schotland": "SCO",
    "Senegal": "SEN",
    "Spanje": "ESP",
    "Tsjechie": "CZE",
    "Tunesie": "TUN",
    "Turkije": "TUR",
    "Uruguay": "URU",
    "Verenigde Staten": "USA",
    "Zuid-Afrika": "RSA",
    "Zuid-Korea": "KOR",
    "Zweden": "SWE",
    "Zwitserland": "SUI",
  };

  if (abbreviations[normalized]) {
    return abbreviations[normalized];
  }

  const compact = normalized.replace(/[^A-Za-zÀ-ÿ]/g, "").toUpperCase();
  return compact.slice(0, 3) || "-";
}

function renderStandings(standings, unlocked) {
  const body = document.querySelector("#standings-body");

  if (!standings.length) {
    body.innerHTML = '<tr><td colspan="6">Nog geen deelnemers.</td></tr>';
    return;
  }

  body.innerHTML = standings
    .map(
      (entry, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${participantLink(entry, unlocked)}</td>
          <td class="stand-total">${entry.totalPoints}</td>
          <td>${entry.matchPoints}</td>
          <td>${entry.knockoutPoints}</td>
          <td>${entry.bonusPoints}</td>
        </tr>
      `,
    )
    .join("");
}

function renderLiveTournamentStats(stats) {
  const container = document.querySelector("#live-tournament-stats");
  if (!container) {
    return;
  }

  if (!stats || !stats.finishedMatchCount) {
    container.innerHTML = `
      <div class="status-summary-card">
        <strong>Voorspeld totaal aantal doelpunten</strong>
        <p>Nog niet beschikbaar</p>
      </div>
      <div class="status-summary-card">
        <strong>Meest scorende land(en)</strong>
        <p>Nog niet beschikbaar</p>
      </div>
      <div class="status-summary-card">
        <strong>Meeste tegendoelpunten</strong>
        <p>Nog niet beschikbaar</p>
      </div>
      <div class="status-summary-card">
        <strong>Huidige topscorer</strong>
        <p>${stats?.currentTopScorer || "Nog niet ingevuld"}</p>
      </div>
      <div class="status-summary-card">
        <strong>Huidige topscorer Nederland</strong>
        <p>${stats?.currentDutchTopScorer || "Nog niet ingevuld"}</p>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="status-summary-card">
      <strong>Voorspeld totaal aantal doelpunten</strong>
      <p>${stats.projectedTotalGoals} op basis van ${stats.finishedMatchCount} afgelopen wedstrijd${stats.finishedMatchCount === 1 ? "" : "en"}</p>
    </div>
    <div class="status-summary-card">
      <strong>Meest scorende land(en)</strong>
      <p>${stats.mostScoredTeams.length ? `${stats.mostScoredTeams.join(", ")} (${stats.mostScoredGoals})` : "Nog niet beschikbaar"}</p>
    </div>
    <div class="status-summary-card">
      <strong>Meeste tegendoelpunten</strong>
      <p>${stats.mostConcededTeams.length ? `${stats.mostConcededTeams.join(", ")} (${stats.mostConcededGoals})` : "Nog niet beschikbaar"}</p>
    </div>
    <div class="status-summary-card">
      <strong>Huidige topscorer</strong>
      <p>${stats.currentTopScorer || "Nog niet ingevuld"}</p>
    </div>
    <div class="status-summary-card">
      <strong>Huidige topscorer Nederland</strong>
      <p>${stats.currentDutchTopScorer || "Nog niet ingevuld"}</p>
    </div>
  `;
}

function renderPredictionMatrix(matchesWithEntries, standings, unlocked, mode) {
  const isRecent = mode === "recent";
  const participantRows = standings.map((entry) => ({
    id: entry.id,
    name: entry.name,
  }));

  const headerCells = matchesWithEntries
    .map(({ match }) => {
      const title = isRecent
        ? `${match.homeTeam} - ${match.awayTeam} ${match.homeScore}-${match.awayScore}`
        : `${match.homeTeam} - ${match.awayTeam}`;

      return `
        <th class="matrix-match-col">
          <div class="matrix-rotated">
            <span class="matrix-match-title">${title}</span>
          </div>
        </th>
      `;
    })
    .join("");

  const bodyRows = participantRows
    .map((participant) => {
      const nameCell = participantNameCell(participant, unlocked);

      const predictionCells = matchesWithEntries
        .map(({ entries }) => {
          const entry = entries.find((candidate) => candidate.participantId === participant.id) || {
            predictedHomeScore: null,
            predictedAwayScore: null,
            outcome: "miss",
          };
          const toneClass = isRecent ? ` prediction-${entry.outcome}` : "";
          return `<td class="matrix-score${toneClass}">${formatScore(entry, true)}</td>`;
        })
        .join("");

      return `
        <tr>
          <th class="matrix-name-cell">${nameCell}</th>
          ${predictionCells}
        </tr>
      `;
    })
    .join("");

  return `
    <table class="prediction-matrix">
      <thead>
        <tr>
          <th class="matrix-name-head">Deelnemer</th>
          ${headerCells}
        </tr>
      </thead>
      <tbody>
        ${bodyRows}
      </tbody>
    </table>
  `;
}

function renderRecentMatches(recentMatchPredictions, standings, unlocked) {
  const container = document.querySelector("#recent-matches");

  if (!recentMatchPredictions.length) {
    container.innerHTML = '<p class="notice">Nog geen verwerkte wedstrijden.</p>';
    return;
  }

  const sorted = recentMatchPredictions.map((block) => ({
    ...block,
    entries: sortEntriesByStand(block.entries, standings),
  }));
  container.innerHTML = renderPredictionMatrix(sorted, standings, unlocked, "recent");
}

function renderUpcomingMatches(upcomingMatchPredictions, standings, unlocked) {
  const container = document.querySelector("#upcoming-matches");

  if (!upcomingMatchPredictions.length) {
    container.innerHTML = '<p class="notice">Nog geen komende wedstrijden.</p>';
    return;
  }

  const sorted = upcomingMatchPredictions.map((block) => ({
    ...block,
    entries: sortEntriesByStand(block.entries, standings),
  }));
  container.innerHTML = renderPredictionMatrix(sorted, standings, unlocked, "upcoming");
}

function renderKnockoutOverview(knockoutOverview, standings, unlocked) {
  const container = document.querySelector("#knockout-overview");

  if (!knockoutOverview.length) {
    container.innerHTML = '<p class="notice">Nog geen knock-outvoorspellingen.</p>';
    return;
  }

  const participantRows = standings.map((entry) => ({ id: entry.id, name: entry.name }));
  const groupedRounds = new Map();
  const roundMeta = {
    secondRound: { slots: 32, compact: true },
    thirdRound: { slots: 16, compact: true },
    quarterFinal: { slots: 8, compact: true },
    semiFinal: { slots: 4, compact: true },
    final: { slots: 2, compact: true },
  };

  for (const block of knockoutOverview) {
    if (!groupedRounds.has(block.roundKey)) {
      groupedRounds.set(block.roundKey, {
        roundKey: block.roundKey,
        roundLabel: block.roundLabel,
        byParticipant: new Map(),
      });
    }

    const round = groupedRounds.get(block.roundKey);
    for (const entry of block.entries || []) {
      if (!round.byParticipant.has(entry.participantId)) {
        round.byParticipant.set(entry.participantId, []);
      }
      round.byParticipant.get(entry.participantId).push(...(entry.selections || []).filter((selection) => selection.team));
    }
  }

  const sections = [...groupedRounds.values()]
    .map((round) => {
      const meta = roundMeta[round.roundKey] || { slots: 0, compact: false };
      const columnCount = meta.slots || Math.max(0, ...[...round.byParticipant.values()].map((items) => items.length));

      if (!columnCount) {
        return "";
      }

      const headerCells = Array.from({ length: columnCount }, (_, index) => index + 1)
        .map(
          (slotNumber) => `
            <th class="knockout-slot-head">${slotNumber}</th>
          `,
        )
        .join("");

      const bodyRows = participantRows
        .map((participant) => {
          const selections = round.byParticipant.get(participant.id) || [];
          const cells = Array.from({ length: columnCount }, (_, index) => {
              const selection = selections[index];
              if (!selection) {
                return '<td class="knockout-slot-cell"><span class="team-pill flag-empty">-</span></td>';
              }

              const label = meta.compact ? shortenTeamName(selection.team) : selection.team;
              return `
                <td class="knockout-slot-cell">
                  <span class="team-pill status-${selection.status}">${label}</span>
                </td>
              `;
            })
            .join("");

          return `
            <tr>
              <th class="knockout-name-cell">${participantNameCell(participant, unlocked)}</th>
              ${cells}
            </tr>
          `;
        })
        .join("");

      return `
        <section class="knockout-round-table">
          <div class="section-head">
            <h3>${round.roundLabel}</h3>
          </div>
          <table class="knockout-slot-table">
            <thead>
              <tr>
                <th class="knockout-name-head">Deelnemer</th>
                ${headerCells}
              </tr>
            </thead>
            <tbody>
              ${bodyRows}
            </tbody>
          </table>
        </section>
      `;
    })
    .filter(Boolean)
    .join("");

  container.innerHTML = sections || '<p class="notice">Nog geen knock-outvoorspellingen.</p>';
}

function renderBonusOverview(bonusOverview, standings, unlocked) {
  const container = document.querySelector("#bonus-overview");

  if (!bonusOverview.length) {
    container.innerHTML = '<p class="notice">Nog geen open vragen beschikbaar.</p>';
    return;
  }

  const rankByParticipantId = new Map(standings.map((entry, index) => [entry.id, index]));
  const sorted = [...bonusOverview].sort(
    (left, right) =>
      (rankByParticipantId.get(left.participantId) ?? Number.MAX_SAFE_INTEGER) -
      (rankByParticipantId.get(right.participantId) ?? Number.MAX_SAFE_INTEGER),
  );

  container.innerHTML = `
    <table class="bonus-overview-table">
      <thead>
        <tr>
          <th class="bonus-name-head">Deelnemer</th>
          <th>Wereldkampioen</th>
          <th>Meeste goals</th>
          <th>Meeste tegen</th>
          <th>Beste Afrika</th>
          <th>Beste Azië</th>
          <th>Beste Midden-Amerika</th>
          <th>Topscorer</th>
          <th>NL topscorer</th>
          <th>Totaal goals</th>
        </tr>
      </thead>
      <tbody>
        ${sorted
          .map((entry) => {
            const answers = entry.answers || {};
            const renderAnswer = (item) => {
              const value = item?.value === "" || item?.value === null || item?.value === undefined ? "-" : item.value;
              const statusClass = item?.status ? ` status-${item.status}` : "";
              const pointsLabel =
                item?.points && item.points > 0 ? ` <span class="bonus-answer-points">(${item.points} pnt)</span>` : "";
              return `<span class="bonus-answer${statusClass}">${value}${pointsLabel}</span>`;
            };

            return `
              <tr>
                <td class="bonus-name-cell">${participantNameCell({ id: entry.participantId, name: entry.participantName }, unlocked)}</td>
                <td>${renderAnswer(answers.championTeam)}</td>
                <td>${renderAnswer(answers.mostGoalsTeam)}</td>
                <td>${renderAnswer(answers.mostConcededTeam)}</td>
                <td>${renderAnswer(answers.bestAfricanTeam)}</td>
                <td>${renderAnswer(answers.bestAsianTeam)}</td>
                <td>${renderAnswer(answers.bestCentralAmericanTeam)}</td>
                <td>${renderAnswer(answers.topScorer)}</td>
                <td>${renderAnswer(answers.topScorerNetherlands)}</td>
                <td>${renderAnswer(answers.totalGoals)}</td>
              </tr>
            `;
          })
          .join("")}
      </tbody>
    </table>
  `;
}

async function loadStandings() {
  const body = document.querySelector("#standings-body");
  const heroPoolName = document.querySelector("#hero-pool-name");
  document.querySelectorAll(".nav a").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === "/") {
      link.setAttribute("href", poolBasePath());
    }
    if (href === "/stand") {
      link.setAttribute("href", `${poolBasePath()}/stand`);
    }
  });

  const response = await fetch(poolApiPath("/standings"));
  const data = await response.json();

  if (!response.ok) {
    body.innerHTML = '<tr><td colspan="6">Stand kon niet geladen worden.</td></tr>';
    return;
  }

  heroPoolName.textContent = data.pool?.name || "WK Toto 2026";
  renderLastUpdated(data.lastUpdatedMatch);
  renderStandings(data.standings, data.predictionsUnlocked);
  renderLiveTournamentStats(data.liveTournamentStats);
  renderRecentMatches(data.recentMatchPredictions, data.standings, data.predictionsUnlocked);
  renderUpcomingMatches(data.upcomingMatchPredictions, data.standings, data.predictionsUnlocked);
  renderKnockoutOverview(data.knockoutOverview || [], data.standings, data.predictionsUnlocked);
  renderBonusOverview(data.bonusOverview || [], data.standings, data.predictionsUnlocked);
}

loadStandings().catch(() => {
  const body = document.querySelector("#standings-body");
  body.innerHTML = '<tr><td colspan="6">Stand kon niet geladen worden.</td></tr>';
});
