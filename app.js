const participants = [
  {
    id: "amara", name: "Amara Okafor", initials: "AO", role: "Product designer", city: "Brooklyn, NY", availability: "Open to teammates",
    skills: ["Figma", "UX research", "Prototyping", "Design systems", "Accessibility"], interests: ["Climate tech", "Civic tech", "Public transit"],
    seeking: ["Backend developer", "Data / AI"], bio: "Designing small, thoughtful tools for a more livable city. I love turning messy problems into clear experiences.",
    color: "#f0c9b4", newest: 5
  },
  {
    id: "leo", name: "Leo Kim", initials: "LK", role: "Backend engineer", city: "San Francisco, CA", availability: "Open to teammates",
    skills: ["Node.js", "APIs", "PostgreSQL", "Python", "Cloud"], interests: ["Climate tech", "Civic tech", "Open source"],
    seeking: ["Product thinker", "UX / UI designer"], bio: "I like building reliable things that make ambitious ideas feel possible. Happy to own data, APIs and the unglamorous bits.",
    color: "#c7d4ff", newest: 4
  },
  {
    id: "sofia", name: "Sofia Martinez", initials: "SM", role: "ML engineer", city: "Austin, TX", availability: "Open to teammates",
    skills: ["Python", "Machine learning", "NLP", "Data viz", "APIs"], interests: ["AI for good", "Education", "Accessibility"],
    seeking: ["Frontend developer", "Product designer"], bio: "ML engineer who wants to make useful AI feel understandable, especially in learning and accessibility.",
    color: "#d6e9a0", newest: 3
  },
  {
    id: "priya", name: "Priya Shah", initials: "PS", role: "Product strategist", city: "Toronto, ON", availability: "Open to teammates",
    skills: ["Product strategy", "User research", "Pitching", "Analytics", "Figma"], interests: ["AI for good", "Education", "Climate tech"],
    seeking: ["Frontend developer", "Data scientist"], bio: "I help teams focus on the problem worth solving, then tell a clear story about why it matters.",
    color: "#f5d889", newest: 2
  },
  {
    id: "noah", name: "Noah Bennett", initials: "NB", role: "Full-stack developer", city: "Chicago, IL", availability: "Open to teammates",
    skills: ["React", "TypeScript", "Node.js", "SQL", "APIs"], interests: ["Open source", "Climate tech", "Fintech"],
    seeking: ["Product thinker", "Visual designer"], bio: "Builder who moves between front and back end. Looking for a problem with real-world stakes and a team that ships.",
    color: "#e5cae8", newest: 1
  },
  {
    id: "camila", name: "Camila Rocha", initials: "CR", role: "UX / UI designer", city: "Lisbon, PT", availability: "Open to teammates",
    skills: ["Figma", "Prototyping", "Accessibility", "Brand design", "React"], interests: ["Civic tech", "Education", "Public transit"],
    seeking: ["Full-stack developer", "ML engineer"], bio: "Product designer who prototypes in code. I care about accessible experiences and ideas that improve everyday life.",
    color: "#bfe3d8", newest: 0
  }
];

const quickSkills = ["Node.js", "Python", "Figma", "APIs", "Product strategy", "React"];
const teamNeeds = ["Backend", "Product", "Design"];
const myInterests = ["Climate tech", "AI for good", "Civic tech"];
const activeSkills = new Set();
const interested = new Set();
let searchTerm = "";
let sortMode = "recommended";
let toastTimeout;

const els = {
  search: document.querySelector("#search-input"),
  skillFilters: document.querySelector("#skill-filters"),
  profileList: document.querySelector("#profile-list"),
  recommendations: document.querySelector("#recommendations"),
  empty: document.querySelector("#empty-state"),
  resultsCount: document.querySelector("#results-count"),
  activeFilterLabel: document.querySelector("#active-filter-label"),
  sort: document.querySelector("#sort-select"),
  dialog: document.querySelector("#profile-dialog"),
  dialogContent: document.querySelector("#dialog-content"),
  toast: document.querySelector("#toast")
};

function scoreMatch(person) {
  const role = person.role.toLowerCase();
  const roleFit = (role.includes("backend") || role.includes("full-stack") || role.includes("product") || role.includes("designer") || role.includes("ml")) ? 1 : 0;
  const shared = person.interests.filter((interest) => myInterests.includes(interest));
  const complementarySkills = person.skills.filter((skill) => /node|api|postgres|sql|python|machine|product|research|figma|prototyp/i.test(skill));
  return Math.min(98, 52 + roleFit * 10 + shared.length * 7 + Math.min(complementarySkills.length, 3) * 3);
}

function compatibilityText(person) {
  const shared = person.interests.filter((interest) => myInterests.includes(interest));
  const complement = person.skills.filter((skill) => /node|api|postgres|sql|python|machine|product|research|figma|prototyp/i.test(skill)).slice(0, 2);
  const pieces = [];
  pieces.push(`${person.role} brings a different strength to your frontend background.`);
  if (shared.length) pieces.push(`You both care about ${shared.slice(0, 2).join(" and ")}.`);
  if (complement.length) pieces.push(`Their ${complement.join(" and ")} skills could help round out the build.`);
  return pieces.join(" ");
}

function renderQuickSkills() {
  els.skillFilters.innerHTML = quickSkills.map((skill) => `
    <button class="filter-chip" type="button" data-skill="${skill}" aria-pressed="${activeSkills.has(skill)}">${skill}</button>
  `).join("");
}

function getMatches() {
  const needle = searchTerm.trim().toLowerCase();
  let matches = participants.filter((person) => {
    const text = [person.name, person.role, person.city, ...person.skills, ...person.interests, ...person.seeking].join(" ").toLowerCase();
    const searchOK = !needle || text.includes(needle);
    const skillsOK = activeSkills.size === 0 || [...activeSkills].some((skill) => person.skills.includes(skill));
    return searchOK && skillsOK;
  });
  if (sortMode === "recommended") matches = matches.sort((a, b) => scoreMatch(b) - scoreMatch(a));
  if (sortMode === "name") matches = matches.sort((a, b) => a.name.localeCompare(b.name));
  if (sortMode === "newest") matches = matches.sort((a, b) => b.newest - a.newest);
  return matches;
}

function profileCard(person) {
  const score = scoreMatch(person);
  return `
    <article class="person-card">
      <div class="avatar" style="--avatar:${person.color}" aria-hidden="true">${person.initials}</div>
      <div class="person-main">
        <div class="person-name-row"><h3 class="person-name">${person.name}</h3><span class="open-badge">Open to team up</span></div>
        <div class="person-meta">${person.role} <span aria-hidden="true">·</span> ${person.city}</div>
        <p class="person-bio">${person.bio}</p>
        <div class="tags" aria-label="Skills">${person.skills.slice(0, 4).map((skill, index) => `<span class="tag ${index === 0 ? "skill-blue" : ""}">${skill}</span>`).join("")}</div>
      </div>
      <div class="card-side">
        <div class="fit-pill">${score}% FIT</div><div class="fit-caption">TEAM MATCH</div>
        <div class="card-actions">
          <button class="button button-light button-small" type="button" data-action="profile" data-id="${person.id}">View profile</button>
          <button class="button button-light button-small ${interested.has(person.id) ? "is-interested" : ""}" type="button" data-action="interest" data-id="${person.id}" aria-pressed="${interested.has(person.id)}">${interested.has(person.id) ? "Interested ✓" : "＋ Interested"}</button>
        </div>
      </div>
    </article>`;
}

function renderProfiles() {
  const matches = getMatches();
  els.profileList.innerHTML = matches.map(profileCard).join("");
  els.profileList.hidden = matches.length === 0;
  els.empty.hidden = matches.length !== 0;
  els.resultsCount.textContent = `${matches.length} ${matches.length === 1 ? "builder" : "builders"}`;
  const filters = [...activeSkills];
  const bits = [];
  if (searchTerm.trim()) bits.push(`“${searchTerm.trim()}”`);
  if (filters.length) bits.push(filters.join(" or "));
  els.activeFilterLabel.textContent = bits.length ? `Filtered by ${bits.join(" · ")}` : "Showing everyone";
  document.querySelector("#people-count").textContent = String(participants.length).padStart(2, "0");
}

function renderRecommendations() {
  const recs = participants.slice().sort((a, b) => scoreMatch(b) - scoreMatch(a)).slice(0, 3);
  els.recommendations.innerHTML = recs.map((person) => `
    <button class="recommendation" type="button" data-action="profile" data-id="${person.id}" aria-label="View ${person.name}, ${scoreMatch(person)} percent fit">
      <span class="rec-avatar" style="--avatar:${person.color}">${person.initials}</span>
      <span><span class="rec-name">${person.name.split(" ")[0]} ${person.name.split(" ").at(-1)[0]}.</span><span class="rec-role">${person.role}</span></span>
      <span class="rec-score">${scoreMatch(person)}%</span>
    </button>`).join("");
}

function openProfile(id) {
  const person = participants.find((candidate) => candidate.id === id);
  if (!person) return;
  const isInterested = interested.has(id);
  els.dialogContent.innerHTML = `
    <div class="dialog-profile-head">
      <div class="dialog-avatar" style="background:${person.color}">${person.initials}</div>
      <div><h2 id="dialog-name">${person.name}</h2><p>${person.role} · ${person.city}</p></div>
    </div>
    <div class="open-badge">${person.availability}</div>
    <div class="dialog-section"><h3>ABOUT</h3><p>${person.bio}</p></div>
    <div class="dialog-section"><h3>SKILLS</h3><div class="tags">${person.skills.map((skill) => `<span class="tag skill-blue">${skill}</span>`).join("")}</div></div>
    <div class="dialog-section"><h3>PROJECT INTERESTS</h3><div class="tags">${person.interests.map((interest) => `<span class="tag">${interest}</span>`).join("")}</div></div>
    <div class="dialog-section"><h3>HOPING TO MEET</h3><div class="tags">${person.seeking.map((need) => `<span class="tag">${need}</span>`).join("")}</div></div>
    <div class="compatibility"><strong>${scoreMatch(person)}% TEAM FIT</strong><p>${compatibilityText(person)}</p></div>
    <div class="dialog-actions"><button class="button button-dark" type="button" data-action="interest" data-id="${person.id}" aria-pressed="${isInterested}">${isInterested ? "Interest sent ✓" : "＋ Express interest"}</button><button class="button button-light" type="button" data-action="close-dialog">Maybe later</button></div>
    <p class="person-meta">Demo only — interest is not sent or saved.</p>`;
  els.dialog.showModal();
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("visible");
  window.clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => els.toast.classList.remove("visible"), 2600);
}

function updateInterest(id) {
  const person = participants.find((candidate) => candidate.id === id);
  if (!person) return;
  if (interested.has(id)) {
    interested.delete(id);
    showToast(`Demo interest removed for ${person.name.split(" ")[0]}.`);
  } else {
    interested.add(id);
    showToast(`Interest noted for ${person.name.split(" ")[0]} — demo only, nothing was sent.`);
  }
  renderProfiles();
  if (els.dialog.open) openProfile(id);
}

function resetFilters() {
  searchTerm = "";
  activeSkills.clear();
  els.search.value = "";
  renderQuickSkills();
  renderProfiles();
}

els.search.addEventListener("input", (event) => {
  searchTerm = event.target.value;
  renderProfiles();
});
els.skillFilters.addEventListener("click", (event) => {
  const button = event.target.closest("[data-skill]");
  if (!button) return;
  const skill = button.dataset.skill;
  activeSkills.has(skill) ? activeSkills.delete(skill) : activeSkills.add(skill);
  renderQuickSkills();
  renderProfiles();
});
els.sort.addEventListener("change", (event) => {
  sortMode = event.target.value;
  renderProfiles();
});
document.querySelector("#clear-filters").addEventListener("click", resetFilters);
document.querySelector("#empty-reset").addEventListener("click", resetFilters);
document.addEventListener("click", (event) => {
  const action = event.target.closest("[data-action]");
  if (!action) return;
  if (action.dataset.action === "profile") openProfile(action.dataset.id);
  if (action.dataset.action === "interest") updateInterest(action.dataset.id);
  if (action.dataset.action === "close-dialog") els.dialog.close();
});
els.dialog.addEventListener("click", (event) => {
  if (event.target === els.dialog) els.dialog.close();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
    event.preventDefault();
    els.search.focus();
  }
});

renderQuickSkills();
renderRecommendations();
renderProfiles();
