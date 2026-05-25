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

const chartColors = ["#16b6ff", "#ff4d2d", "#bbff14", "#7a30ff", "#5df1d2", "#ff8a3d", "#2731b6", "#00a86b"];

function renderTeamWithFlag(team, label = team) {
  return window.teamFlags?.team(team, label) || label;
}

function updateNavigation() {
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
}

function renderLocked(message) {
  document.querySelector("#winner-chart").innerHTML = `<p class="notice">${message}</p>`;
  document.querySelector("#country-question-charts").innerHTML = `<p class="notice">${message}</p>`;
  document.querySelector("#willem-bindels-body").innerHTML = `<tr><td colspan="5">${message}</td></tr>`;
  document.querySelector("#group-match-stats").innerHTML = `<p class="notice">${message}</p>`;
}

function renderPieChart(container, title, values) {
  if (!values.length) {
    container.innerHTML = `
      <div class="stats-chart-card">
        <h3>${title}</h3>
        <p class="notice">Nog geen ingevulde voorspellingen.</p>
      </div>
    `;
    return;
  }

  const total = values.reduce((sum, entry) => sum + entry.count, 0);
  const canvas = document.createElement("canvas");
  canvas.width = 220;
  canvas.height = 220;
  const context = canvas.getContext("2d");
  let start = -Math.PI / 2;

  values.forEach((entry, index) => {
    const slice = (entry.count / total) * Math.PI * 2;
    context.beginPath();
    context.moveTo(110, 110);
    context.arc(110, 110, 92, start, start + slice);
    context.closePath();
    context.fillStyle = chartColors[index % chartColors.length];
    context.fill();
    start += slice;
  });

  const legend = document.createElement("div");
  legend.className = "stats-legend";
  legend.innerHTML = values
    .map(
      (entry, index) => `
        <div class="stats-legend-row">
          <span class="stats-swatch" style="background:${chartColors[index % chartColors.length]}"></span>
          <span>${renderTeamWithFlag(entry.value)}</span>
          <strong>${entry.count}</strong>
        </div>
      `,
    )
    .join("");

  container.innerHTML = `
    <div class="stats-chart-card">
      <h3>${title}</h3>
      <div class="stats-chart-content"></div>
    </div>
  `;
  const content = container.querySelector(".stats-chart-content");
  content.append(canvas, legend);
}

function formatMatch(match) {
  if (!match) {
    return "Nog niet beschikbaar";
  }

  return `${renderTeamWithFlag(match.homeTeam)} <span class="team-separator">-</span> ${renderTeamWithFlag(match.awayTeam)}`;
}

function renderWillemBindels(scores) {
  const body = document.querySelector("#willem-bindels-body");
  if (!scores.length) {
    body.innerHTML = '<tr><td colspan="5">Nog geen deelnemers.</td></tr>';
    return;
  }

  body.innerHTML = scores
    .map(
      (entry, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${entry.participantName}</td>
          <td class="points-cell">${entry.score ?? "-"}</td>
          <td>${entry.averageProbability ?? "-"}</td>
          <td>${entry.pickCount}</td>
        </tr>
      `,
    )
    .join("");
}

function renderGroupMatchStats(stats) {
  const highest = stats.highestScoringMatch;
  const lowest = stats.lowestScoringMatch;
  document.querySelector("#group-match-stats").innerHTML = `
    <div class="status-summary-card">
      <strong>Meeste punten</strong>
      <p>${highest ? `${formatMatch(highest.match)} (${highest.totalPoints} pnt)` : "Nog niet beschikbaar"}</p>
    </div>
    <div class="status-summary-card">
      <strong>Minste punten</strong>
      <p>${lowest ? `${formatMatch(lowest.match)} (${lowest.totalPoints} pnt)` : "Nog niet beschikbaar"}</p>
    </div>
    <div class="status-summary-card">
      <strong>Gemiddeld per gespeelde groepswedstrijd</strong>
      <p>${stats.averagePointsPerFinishedMatch ?? "Nog niet beschikbaar"}</p>
    </div>
    <div class="status-summary-card">
      <strong>Gespeelde groepswedstrijden</strong>
      <p>${stats.finishedMatchCount}</p>
    </div>
  `;
}

async function loadStats() {
  updateNavigation();
  const response = await fetch(poolApiPath("/stats"));
  const data = await response.json();
  document.querySelector("#hero-pool-name").textContent = data.pool?.name || "WK Toto 2026";

  if (!response.ok) {
    renderLocked(data.error || "Stats konden niet geladen worden.");
    return;
  }

  document.querySelector("#participant-count").textContent = `${data.participantCount} deelnemers`;
  renderPieChart(document.querySelector("#winner-chart"), "Wereldkampioen", data.winnerPredictions || []);

  const questionContainer = document.querySelector("#country-question-charts");
  questionContainer.innerHTML = "";
  for (const question of data.countryQuestionPredictions || []) {
    const holder = document.createElement("div");
    questionContainer.append(holder);
    renderPieChart(holder, question.label, question.values || []);
  }

  renderWillemBindels(data.willemBindelsScores || []);
  renderGroupMatchStats(data.groupMatchPointStats || {});
}

loadStats().catch(() => {
  renderLocked("Stats konden niet geladen worden.");
});
