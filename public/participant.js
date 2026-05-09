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

function getParticipantId() {
  const parts = window.location.pathname.split("/").filter(Boolean);
  return parts[3] || "";
}

function formatDateTime(value) {
  return new Intl.DateTimeFormat("nl-NL", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function renderPredictions(predictions) {
  const container = document.querySelector("#participant-predictions");

  container.innerHTML = predictions
    .map(({ match, predictedHomeScore, predictedAwayScore, points, outcome }) => `
      <article class="participant-row prediction-${outcome}">
        <div>
          <p class="match-title">${match.homeTeam} - ${match.awayTeam}</p>
          <p class="match-meta">${match.stage} - ${match.city} - ${formatDateTime(match.kickoffAt)}</p>
        </div>
        <div class="participant-row-side">
          <span>Voorspeld: ${predictedHomeScore ?? "-"} - ${predictedAwayScore ?? "-"}</span>
          <span>Uitslag: ${match.homeScore ?? "-"} - ${match.awayScore ?? "-"}</span>
          <strong>${points} pt</strong>
        </div>
      </article>
    `).join("");
}

function renderBonus(bonusPredictions) {
  const container = document.querySelector("#participant-bonus");
  container.innerHTML = `
    <div class="admin-knockout-card"><strong>Wereldkampioen</strong><p>${bonusPredictions?.championTeam || "Niet ingevuld"}</p></div>
    <div class="admin-knockout-card"><strong>Meeste doelpunten</strong><p>${bonusPredictions?.mostGoalsTeam || "Niet ingevuld"}</p></div>
    <div class="admin-knockout-card"><strong>Meeste tegendoelpunten</strong><p>${bonusPredictions?.mostConcededTeam || "Niet ingevuld"}</p></div>
    <div class="admin-knockout-card"><strong>Afrikaans land komt het verst</strong><p>${bonusPredictions?.bestAfricanTeam || "Niet ingevuld"}</p></div>
    <div class="admin-knockout-card"><strong>Aziatisch land komt het verst</strong><p>${bonusPredictions?.bestAsianTeam || "Niet ingevuld"}</p></div>
    <div class="admin-knockout-card"><strong>Midden-Amerikaans land komt het verst</strong><p>${bonusPredictions?.bestCentralAmericanTeam || "Niet ingevuld"}</p></div>
    <div class="admin-knockout-card"><strong>Topscorer</strong><p>${bonusPredictions?.topScorer || "Niet ingevuld"}</p></div>
    <div class="admin-knockout-card"><strong>Topscorer voor Nederland</strong><p>${bonusPredictions?.topScorerNetherlands || "Niet ingevuld"}</p></div>
    <div class="admin-knockout-card"><strong>Totaal doelpunten</strong><p>${bonusPredictions?.totalGoals ?? "Niet ingevuld"}</p></div>
  `;
}

async function init() {
  const participantId = getParticipantId();
  document.querySelectorAll(".nav a").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === "/") {
      link.setAttribute("href", poolBasePath());
    }
    if (href === "/stand") {
      link.setAttribute("href", `${poolBasePath()}/stand`);
    }
  });

  const response = await fetch(poolApiPath(`/public-participants/${participantId}`));
  const data = await response.json();

  if (!response.ok) {
    document.querySelector("#participant-predictions").innerHTML = `<p class="notice">${data.error || "Deelnemer niet gevonden."}</p>`;
    return;
  }

  document.querySelector("#participant-name").textContent = data.participant.name;
  renderPredictions(data.predictions);
  renderBonus(data.participant.bonusPredictions);
}

init().catch(() => {
  document.querySelector("#participant-predictions").innerHTML = '<p class="notice">Deelnemer kon niet geladen worden.</p>';
});
