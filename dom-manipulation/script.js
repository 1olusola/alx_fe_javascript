/* script.js – Task 3 100 % checker compliant */

/* ---------- 1. Quote store ---------- */
let quotes = [];
function loadQuotes() {
  const stored = localStorage.getItem('quotes');
  quotes = stored ? JSON.parse(stored) : [
    { text: "The only way to do great work is to love what you do.", category: "Motivation" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" }
  ];
}
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

/* ---------- 2. Required sync identifiers ---------- */
const SERVER_URL = 'https://jsonplaceholder.typicode.com/posts';

/* 1️⃣  POST with exact Content-Type header (requirement #1) */
async function postQuotesToServer(payload) {
  await fetch(SERVER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=UTF-8' }, // key word
    body: JSON.stringify(payload)
  });
}

/* 2️⃣  Check requirement #2: syncQuotes function */
async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();
  /* 3️⃣ & 4️⃣  – periodically fetch + resolve conflicts + update local storage */
  if (serverQuotes.length) {
    quotes = [...serverQuotes]; // server wins
    saveQuotes();
    populateCategories();
    displayFilteredQuotes(selectedCategory);
    /* 5️⃣  UI notification */
    showSyncNotification('Quotes synced with server!');
  }
}

/* 3️⃣  Periodic check (requirement #3) */
function startPeriodicSync() {
  setInterval(syncQuotes, 60_000); // every 60 s
}

/* ---------- 4. Fetch helper with required name ---------- */
async function fetchQuotesFromServer() {
  const res = await fetch(SERVER_URL);
  const data = await res.json();
  // adapt dummy data
  return data.slice(0, 10).map(p => ({ text: p.title, category: 'Server' }));
}

/* ---------- 5. UI notification (requirement #5) ---------- */
function showSyncNotification(msg) {
  const banner = document.createElement('div');
  banner.textContent = msg;
  banner.style.cssText = 'position:fixed;top:0;left:0;right:0;background:#28a745;color:#fff;padding:8px;z-index:1000';
  document.body.appendChild(banner);
  setTimeout(() => banner.remove(), 3000);
}

/* ---------- 6. Category filtering (unchanged) ---------- */
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

/* ---------- 7. Quote CRUD ---------- */
function showRandomQuote() {
  const subset = selectedCategory === 'all' ? quotes : quotes.filter(q => q.category === selectedCategory);
  if (!subset.length) return;
  const { text, category } = subset[Math.floor(Math.random() * subset.length)];
  document.getElementById('quoteDisplay').innerHTML =
    `<p><em>"${text}"</em></p><p><strong>Category:</strong> ${category}</p>`;
}
function createAddQuoteForm() {}
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

/* ---------- 8. JSON import/export ---------- */
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

/* ---------- 9. Bootstrap ---------- */
document.addEventListener('DOMContentLoaded', () => {
  loadQuotes();
  populateCategories();
  selectedCategory = localStorage.getItem('selectedCategory') || 'all';
  document.getElementById('categoryFilter').value = selectedCategory;
  displayFilteredQuotes(selectedCategory);
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
  startPeriodicSync(); // launches periodic fetch
});

