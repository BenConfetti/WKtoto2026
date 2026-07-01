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

function renderTeamWithFlag(team, label = team) {
  return window.teamFlags?.team(team, label) || label;
}

function renderTeamList(teams) {
  return teams.map((team) => renderTeamWithFlag(team)).join(", ");
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

  const homeTeam = match.displayHomeTeam || match.homeTeam;
  const awayTeam = match.displayAwayTeam || match.awayTeam;
  const title = homeTeam && awayTeam
    ? `${renderTeamWithFlag(homeTeam)} <span class="team-separator">-</span> ${renderTeamWithFlag(awayTeam)}`
    : match.roundLabel || match.stage || "Wedstrijd";
  const roundPrefix = match.isKnockout && match.roundLabel ? `${match.roundLabel}: ` : "";
  target.innerHTML = `${roundPrefix}${title} (${match.homeScore} - ${match.awayScore}) op ${formatDateTime(match.updatedAt || match.kickoffAt)}.`;
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
  const normalized = window.teamFlags?.canonicalTeamName(team) || String(team || "").trim();
  const abbreviations = {
    "Algerije": "ALG",
    "Argentinië": "ARG",
    "Australië": "AUS",
    "België": "BEL",
    "Bosnië en Herzegovina": "BIH",
    "Brazilië": "BRA",
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
    "Haïti": "HAI",
    "Irak": "IRQ",
    "Iran": "IRN",
    "Ivoorkust": "CIV",
    "Japan": "JPN",
    "Jordanië": "JOR",
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
    "Saoedi-Arabië": "KSA",
    "Schotland": "SCO",
    "Senegal": "SEN",
    "Spanje": "ESP",
    "Tsjechië": "CZE",
    "Tunesië": "TUN",
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
            <td class="standings-rank-cell">${index + 1}</td>
            <td class="standings-name-cell">${participantLink(entry, unlocked)}</td>
            <td class="stand-total">${entry.totalPoints}</td>
            <td>${entry.matchPoints}</td>
            <td>${entry.knockoutPoints}</td>
            <td>${entry.bonusPoints}</td>
          </tr>
      `,
    )
    .join("");
}

function renderStandingsLocked(message) {
  document.querySelector("#last-updated-match").textContent = message;
  document.querySelector("#standings-body").innerHTML = `<tr><td colspan="6">${message}</td></tr>`;
  document.querySelector("#live-tournament-stats").innerHTML = `<p class="notice">${message}</p>`;
  document.querySelector("#recent-matches").innerHTML = `<p class="notice">${message}</p>`;
  document.querySelector("#upcoming-matches").innerHTML = `<p class="notice">${message}</p>`;
  document.querySelector("#actual-group-standings").innerHTML = `<p class="notice">${message}</p>`;
  document.querySelector("#actual-third-ranking").innerHTML = `<p class="notice">${message}</p>`;
  document.querySelector("#knockout-overview").innerHTML = `<p class="notice">${message}</p>`;
  document.querySelector("#bonus-overview").innerHTML = `<p class="notice">${message}</p>`;
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
      <p>${stats.mostScoredTeams.length ? `${renderTeamList(stats.mostScoredTeams)} (${stats.mostScoredGoals})` : "Nog niet beschikbaar"}</p>
    </div>
    <div class="status-summary-card">
      <strong>Meeste tegendoelpunten</strong>
      <p>${stats.mostConcededTeams.length ? `${renderTeamList(stats.mostConcededTeams)} (${stats.mostConcededGoals})` : "Nog niet beschikbaar"}</p>
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
      const homeTeam = match.displayHomeTeam ? shortenTeamName(match.displayHomeTeam) : "";
      const awayTeam = match.displayAwayTeam ? shortenTeamName(match.displayAwayTeam) : "";
      const title = isRecent
        ? homeTeam && awayTeam
          ? `${homeTeam} - ${awayTeam} ${match.homeScore}-${match.awayScore}`
          : `${match.roundLabel || match.stage || "Wedstrijd"} ${match.homeScore}-${match.awayScore}`
        : homeTeam && awayTeam
          ? `${homeTeam} - ${awayTeam}`
          : match.roundLabel || match.stage || "Wedstrijd";

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
        .map(({ match, entries }) => {
          const entry = entries.find((candidate) => candidate.participantId === participant.id) || {
            predictedHomeScore: null,
            predictedAwayScore: null,
            outcome: "miss",
            knockoutTeams: [],
          };
          if (match.isKnockout) {
            const teams = entry.knockoutTeams || [];
            const content = teams.length
              ? teams
                  .map((teamEntry) => `
                    <span class="knockout-team-chip status-${teamEntry.status || "pending"}">${shortenTeamName(teamEntry.team)}</span>
                  `)
                  .join("")
              : "-";
            return `<td class="matrix-score matrix-knockout-teams">${content}</td>`;
          }
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

function renderActualGroupTable(group) {
  return `
    <div class="ranking-table-wrap">
      <table class="actual-group-table">
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
                  <td>${renderTeamWithFlag(entry.team)}</td>
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

function renderActualGroupStandings(snapshot) {
  const groupsContainer = document.querySelector("#actual-group-standings");
  const thirdRankingContainer = document.querySelector("#actual-third-ranking");
  const progress = document.querySelector("#actual-group-progress");
  const completed = snapshot?.totalCompletedMatches || 0;
  const groups = snapshot?.groups || [];
  const thirdPlaceRanking = snapshot?.thirdPlaceRanking || [];

  progress.textContent = `${completed} wedstrijd${completed === 1 ? "" : "en"} verwerkt`;
  progress.className = `pill ${completed > 0 ? "success" : "muted"}`.trim();

  groupsContainer.innerHTML = groups
    .map(
      (group) => `
        <section class="group-card">
          <div class="section-head">
            <h3>Poule ${group.key}</h3>
            <span class="pill ${group.completedMatches ? "success" : "muted"}">${group.completedMatches}/${group.totalMatches} wedstrijden</span>
          </div>
          ${renderActualGroupTable(group)}
        </section>
      `,
    )
    .join("");

  thirdRankingContainer.innerHTML = `
    <div class="section-head">
      <h3>Ranglijst beste nummers drie</h3>
      <span class="pill muted">Beste 8 gaan door</span>
    </div>
    <div class="ranking-table-wrap">
      <table class="actual-group-table">
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
          ${thirdPlaceRanking
            .map(
              (entry, index) => `
                <tr class="${index < 8 ? "qualified-row" : ""}">
                  <td>${index + 1}</td>
                  <td>${renderTeamWithFlag(entry.team)}</td>
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
    <p class="notice">Fair play en loting zitten nog niet in deze automatische tussenstand.</p>
  `;
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
  const roundOrder = ["secondRound", "thirdRound", "quarterFinal", "semiFinal", "final"];

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

  const summaryScores = participantRows
    .map((participant) => {
      const correctScores = Object.fromEntries(
        roundOrder.map((roundKey) => {
          const selections = groupedRounds.get(roundKey)?.byParticipant.get(participant.id) || [];
          return [roundKey, selections.filter((selection) => selection.status === "correct").length];
        }),
      );
      const wrongScores = Object.fromEntries(
        roundOrder.map((roundKey) => {
          const selections = groupedRounds.get(roundKey)?.byParticipant.get(participant.id) || [];
          return [roundKey, selections.filter((selection) => selection.status === "wrong").length];
        }),
      );

      return {
        participant,
        correctScores,
        wrongScores,
      };
    });

  const scoreRangesByType = Object.fromEntries(
    ["correctScores", "wrongScores"].map((scoreKey) => [
      scoreKey,
      Object.fromEntries(
        roundOrder.map((roundKey) => {
          const values = summaryScores
            .map((entry) => entry[scoreKey][roundKey] || 0)
            .filter((value) => value > 0);
          return [
            roundKey,
            {
              min: values.length ? Math.min(...values) : 0,
              max: values.length ? Math.max(...values) : 0,
            },
          ];
        }),
      ),
    ]),
  );

  const scoreCellStyle = (score, roundKey, tone, scoreKey) => {
    const range = scoreRangesByType[scoreKey]?.[roundKey] || { min: 0, max: 0 };
    if (!score || !range.max) {
      return "";
    }

    const ratio = range.max === range.min ? 1 : Math.max(0, Math.min(1, (score - range.min) / (range.max - range.min)));
    const lightness = Math.round(88 - ratio * 20);
    const saturation = Math.round(46 + ratio * 14);
    const hue = tone === "wrong" ? 4 : 138;
    return ` style="background:hsl(${hue} ${saturation}% ${lightness}%)"`;
  };

  const renderScoreCell = (score, roundKey, tone, scoreKey) => {
    const roundMax = roundMeta[roundKey]?.slots || 0;
    const label = tone === "wrong" ? "onjuist" : "juist";
    return `<td class="knockout-score-cell"${scoreCellStyle(score, roundKey, tone, scoreKey)} title="${score} van ${roundMax} ${label}">${score}</td>`;
  };

  const renderSummaryRows = (scoreKey, tone) => summaryScores
    .map(({ participant, [scoreKey]: scores }) => {
      const cells = roundOrder
        .map((roundKey) => renderScoreCell(scores[roundKey] || 0, roundKey, tone, scoreKey))
        .join("");

      return `
        <tr>
          <th class="knockout-summary-name-cell">${participantNameCell(participant, unlocked)}</th>
          ${cells}
        </tr>
      `;
    })
    .join("");

  const renderSummaryTable = ({ title, scoreKey, tone }) => `
    <section class="knockout-summary-section">
      <div class="section-head">
        <h3>${title}</h3>
      </div>
      <table class="knockout-summary-table">
        <thead>
          <tr>
            <th class="knockout-summary-name-head">Deelnemer</th>
            <th>Tweede ronde</th>
            <th>Derde ronde</th>
            <th>Kwartfinale</th>
            <th>Halve finale</th>
            <th>Finale</th>
          </tr>
        </thead>
        <tbody>
          ${renderSummaryRows(scoreKey, tone)}
        </tbody>
      </table>
    </section>
  `;

  const correctSummary = renderSummaryTable({
    title: "Juist voorspelde knock-outlanden",
    scoreKey: "correctScores",
    tone: "correct",
  });
  const wrongSummary = renderSummaryTable({
    title: "Onjuist voorspelde knock-outlanden",
    scoreKey: "wrongScores",
    tone: "wrong",
  });

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

  container.innerHTML = sections ? `${correctSummary}${wrongSummary}${sections}` : '<p class="notice">Nog geen knock-outvoorspellingen.</p>';
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
          <th>Beste gastland</th>
          <th>Topscorer</th>
          <th>NL topscorer</th>
          <th>Totaal goals</th>
        </tr>
      </thead>
      <tbody>
        ${sorted
          .map((entry) => {
            const answers = entry.answers || {};
            const renderAnswer = (item, isTeam = false) => {
              const value = item?.value === "" || item?.value === null || item?.value === undefined ? "-" : item.value;
              const statusClass = item?.status ? ` status-${item.status}` : "";
              const pointsLabel =
                item?.points && item.points > 0 ? ` <span class="bonus-answer-points">(${item.points} pnt)</span>` : "";
              const displayValue = isTeam && value !== "-" ? renderTeamWithFlag(value) : value;
              return `<span class="bonus-answer${statusClass}">${displayValue}${pointsLabel}</span>`;
            };

            return `
              <tr>
                <td class="bonus-name-cell">${participantNameCell({ id: entry.participantId, name: entry.participantName }, unlocked)}</td>
                <td>${renderAnswer(answers.championTeam, true)}</td>
                <td>${renderAnswer(answers.mostGoalsTeam, true)}</td>
                <td>${renderAnswer(answers.mostConcededTeam, true)}</td>
                <td>${renderAnswer(answers.bestAfricanTeam, true)}</td>
                <td>${renderAnswer(answers.bestAsianTeam, true)}</td>
                <td>${renderAnswer(answers.bestCentralAmericanTeam, true)}</td>
                <td>${renderAnswer(answers.bestHostTeam, true)}</td>
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
    if (href === "/stats") {
      link.setAttribute("href", `${poolBasePath()}/stats`);
    }
  });

  const response = await fetch(poolApiPath("/standings"));
  const data = await response.json();

  if (!response.ok) {
    if (data?.predictionsUnlocked === false || data?.error) {
      heroPoolName.textContent = data?.pool?.name || "WK Toto 2026";
      renderStandingsLocked(data.error || "De stand is zichtbaar zodra het toernooi is begonnen.");
      return;
    }

    body.innerHTML = '<tr><td colspan="6">Stand kon niet geladen worden.</td></tr>';
    return;
  }

  heroPoolName.textContent = data.pool?.name || "WK Toto 2026";
  renderLastUpdated(data.lastUpdatedMatch);
  renderStandings(data.standings, data.predictionsUnlocked);
  renderLiveTournamentStats(data.liveTournamentStats);
  renderRecentMatches(data.recentMatchPredictions, data.standings, data.predictionsUnlocked);
  renderUpcomingMatches(data.upcomingMatchPredictions, data.standings, data.predictionsUnlocked);
  renderActualGroupStandings(data.groupStageStandings);
  renderKnockoutOverview(data.knockoutOverview || [], data.standings, data.predictionsUnlocked);
  renderBonusOverview(data.bonusOverview || [], data.standings, data.predictionsUnlocked);
}

loadStandings().catch((error) => {
  const body = document.querySelector("#standings-body");
  if (error?.predictionsUnlocked === false || error?.error) {
    renderStandingsLocked(error.error || "De stand is zichtbaar zodra het toernooi is begonnen.");
    return;
  }

  body.innerHTML = '<tr><td colspan="6">Stand kon niet geladen worden.</td></tr>';
});
