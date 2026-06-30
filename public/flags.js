(function () {
  const codes = {
    Algerije: "dz",
    Argentinie: "ar",
    "Argentini\u00eb": "ar",
    "Argentini\u00c3\u00ab": "ar",
    Australie: "au",
    "Australi\u00eb": "au",
    "Australi\u00c3\u00ab": "au",
    Belgie: "be",
    "Belgi\u00eb": "be",
    "Belgi\u00c3\u00ab": "be",
    "Bosnie en Herzegovina": "ba",
    "Bosni\u00eb en Herzegovina": "ba",
    "Bosni\u00c3\u00ab en Herzegovina": "ba",
    Brazilie: "br",
    "Brazili\u00eb": "br",
    "Brazili\u00c3\u00ab": "br",
    Canada: "ca",
    Colombia: "co",
    Curacao: "cw",
    "DR Congo": "cd",
    Duitsland: "de",
    Ecuador: "ec",
    Egypte: "eg",
    Engeland: "gb-eng",
    Frankrijk: "fr",
    Ghana: "gh",
    Haiti: "ht",
    "Ha\u00efti": "ht",
    "Ha\u00c3\u00afti": "ht",
    Irak: "iq",
    Iran: "ir",
    Ivoorkust: "ci",
    Japan: "jp",
    Jordanie: "jo",
    "Jordani\u00eb": "jo",
    "Jordani\u00c3\u00ab": "jo",
    Kaapverdie: "cv",
    Kroatie: "hr",
    "Kroati\u00eb": "hr",
    "Kroati\u00c3\u00ab": "hr",
    Marokko: "ma",
    Mexico: "mx",
    Nederland: "nl",
    "Nieuw-Zeeland": "nz",
    Noorwegen: "no",
    Oezbekistan: "uz",
    Oostenrijk: "at",
    Panama: "pa",
    Paraguay: "py",
    Portugal: "pt",
    Qatar: "qa",
    "Saoedi-Arabie": "sa",
    "Saoedi-Arabi\u00eb": "sa",
    "Saoedi-Arabi\u00c3\u00ab": "sa",
    Schotland: "gb-sct",
    Senegal: "sn",
    Spanje: "es",
    Tsjechie: "cz",
    "Tsjechi\u00eb": "cz",
    "Tsjechi\u00c3\u00ab": "cz",
    Tunesie: "tn",
    "Tunesi\u00eb": "tn",
    "Tunesi\u00c3\u00ab": "tn",
    Turkije: "tr",
    Uruguay: "uy",
    VS: "us",
    "Verenigde Staten": "us",
    "Zuid-Afrika": "za",
    "Zuid-Korea": "kr",
    Zweden: "se",
    Zwitserland: "ch",
  };

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function canonicalTeamName(team) {
    const value = String(team || "").trim();
    const comparable = value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\uFFFD/g, "")
      .replace(/[^a-z]/gi, "")
      .toLocaleLowerCase("nl-NL");

    if (comparable === "curacao" || comparable === "curaao") {
      return "Curacao";
    }
    if (["australie", "australia", "australi"].includes(comparable)) {
      return "Australië";
    }

    return value;
  }

  function flag(team) {
    const code = codes[canonicalTeamName(team)];
    if (!code) {
      return "";
    }

    return `<img class="team-flag" src="/flags/${code}.svg" alt="" aria-hidden="true" loading="lazy">`;
  }

  function team(teamName, label = teamName) {
    const normalizedTeam = canonicalTeamName(teamName);
    const icon = flag(normalizedTeam);
    const text = escapeHtml(canonicalTeamName(label));
    return icon ? `<span class="team-with-flag">${icon}<span>${text}</span></span>` : text;
  }

  window.teamFlags = { canonicalTeamName, flag, team };
})();
