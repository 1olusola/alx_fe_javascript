/* script.js – Task 3 (sync + conflict resolution) */

/* ---------- 1. Quote store ---------- */
let quotes = [];
function loadQuotes() {
  const stored = localStorage.getItem('quotes');
  quotes = stored ? JSON.parse(stored) : [];
}
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

/* ---------- 2. Server mock (JSONPlaceholder endpoints) ---------- */
const SERVER_URL = 'https://jsonplaceholder.typicode.com/posts'; // dummy endpoint

/* 2a. GET – simulate fetch */
async function fetchFromServer() {
  try {
    const res = await fetch(SERVER_URL);
    const data = await res.json();
    // adapt dummy data to our shape
    return data.slice(0, 10).map(p => ({ text: p.title, category: 'Server' }));
  } catch {
    return [];
  }
}

/* 2b. POST – simulate push */
async function pushToServer(payload) {
  try {
    await fetch(SERVER_URL, { method: 'POST', body: JSON.stringify(payload), headers:{ 'Content-type':'application/json; charset=UTF-8'} });
    return true;
  } catch {
    return false;
  }
}

/* ---------- 3. Sync logic ---------- */
let lastServerFetch = localStorage.getItem('lastServerFetch') || 0;
const SYNC_INTERVAL = 60_000; // 1 min

async function syncWithServer(force = false) {
  const now = Date.now();
  if (!force && now - lastServerFetch < SYNC_INTERVAL) return; // throttle

  const serverQuotes = await fetchFromServer();
  if (!serverQuotes.length) return;

  // simple conflict resolution: server wins
  const merged = [...serverQuotes];
  quotes = merged;
  saveQuotes();
  lastServerFetch = now;
  localStorage.setItem('lastServerFetch', lastServerFetch);

  populateCategories();
  displayFilteredQuotes(selectedCategory);
  showSyncBanner('Quotes updated from server');
}

/* ---------- 4. Conflict / sync UI ---------- */
function showSyncBanner(msg) {
  const banner = document.createElement('div');
  banner.id = 'syncBanner';
  banner.textContent = msg;
  banner.style.cssText = 'position:fixed;top:0;left:0;right:0;background:#28a745;color:#fff;padding:8px;text-align:center;z-index:1000';
  document.body.appendChild(banner);
  setTimeout(() => banner.remove(), 3000);
}

/* ---------- 5. Manual sync button ---------- */
function createSyncControls() {
  if (document.getElementById('syncBtn')) return;
  const btn = document.createElement('button');
  btn.id = 'syncBtn';
  btn.textContent = 'Sync Now';
  btn.onclick = () => syncWithServer(true);
  document.body.appendChild(btn);
}

/* ---------- 6. Periodic sync ---------- */
function startPeriodicSync() {
  setInterval(() => syncWithServer(), SYNC_INTERVAL);
}

/* ---------- 7. Category filtering (unchanged) ---------- */
let selectedCategory = localStorage.getItem('selectedCategory') || 'all';
function populateCategories() {
  const cats = [...new Set(quotes.map(q => q.category))].sort();
  const sel  = document.getElementById('categoryFilter');
  sel.innerHTML = '<option value="all">All Categories</option>';
  cats.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = c;
    sel.appendChild(opt);
  });
}
function filterQuotes() {
  selectedCategory = document.getElementById('categoryFilter').value;
  localStorage.setItem('selectedCategory', selectedCategory);
  displayFilteredQuotes(selectedCategory);
}
function displayFilteredQuotes(category) {
  const container = document.getElementById('quoteDisplay');
  container.innerHTML = '';
  const subset = category === 'all' ? quotes : quotes.filter(q => q.category === category);
  if (!subset.length) { container.textContent = 'No quotes here.'; return; }
  subset.forEach(({ text, category: cat }) => {
    const p = document.createElement('p');
    p.innerHTML = `<em>"${text}"</em> — <strong>${cat}</strong>`;
    container.appendChild(p);
  });
}

/* ---------- 8. Quote CRUD (unchanged) ---------- */
function showRandomQuote() {
  const subset = selectedCategory === 'all' ? quotes : quotes.filter(q => q.category === selectedCategory);
  if (!subset.length) return;
  const { text, category } = subset[Math.floor(Math.random() * subset.length)];
  document.getElementById('quoteDisplay').innerHTML =
    `<p><em>"${text}"</em></p><p><strong>Category:</strong> ${category}</p>`;
}
function createAddQuoteForm() { /* placeholder */ }
function addQuote() {
  const textVal = document.getElementById('newQuoteText').value.trim();
  const catVal  = document.getElementById('newQuoteCategory').value.trim();
  if (!textVal || !catVal) { alert('Both fields required'); return; }
  quotes.push({ text: textVal, category: catVal });
  saveQuotes();
  populateCategories();
  displayFilteredQuotes(selectedCategory);
  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';
}

/* ---------- 9. JSON import/export (unchanged) ---------- */
function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = 'quotes.json'; a.style.display = 'none';
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
function importFromJsonFile(event) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const imported = JSON.parse(reader.result);
      if (!Array.isArray(imported)) throw new Error('Bad format');
      quotes = imported;
      saveQuotes();
      populateCategories();
      displayFilteredQuotes(selectedCategory);
      alert('Imported & synced.');
    } catch { alert('Import failed'); }
  };
  reader.readAsText(event.target.files[0]);
  event.target.value = '';
}

/* ---------- 10. Initialise ---------- */
document.addEventListener('DOMContentLoaded', () => {
  loadQuotes();
  populateCategories();
  selectedCategory = localStorage.getItem('selectedCategory') || 'all';
  document.getElementById('categoryFilter').value = selectedCategory;
  displayFilteredQuotes(selectedCategory);
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
  createSyncControls();
  startPeriodicSync();
});
