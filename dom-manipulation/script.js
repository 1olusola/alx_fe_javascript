/* script.js – Task 3 (Dynamic Content Filtering) + Tasks 1 & 2 features */

/* ---------- 1. Quote store (load from / save to localStorage) ---------- */
let quotes = [];

function loadQuotes() {
  const stored = localStorage.getItem('quotes');
  quotes = stored ? JSON.parse(stored) : [
    { text: "The only way to do great work is to love what you do.", category: "Motivation" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "Success is not final, failure is not fatal.", category: "Success" }
  ];
}

function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

/* ---------- 2. Core Task-1 functions ---------- */
function showRandomQuote() {
  const subset = getCurrentFilteredQuotes();
  if (!subset.length) {
    document.getElementById('quoteDisplay').innerHTML = '<p>No quotes available.</p>';
    return;
  }
  const { text, category } = subset[Math.floor(Math.random() * subset.length)];
  document.getElementById('quoteDisplay').innerHTML =
    `<p><em>"${text}"</em></p><p><strong>Category:</strong> ${category}</p>`;
  sessionStorage.setItem('lastQuote', JSON.stringify({ text, category }));
}

function createAddQuoteForm() {
  /* minimal placeholder required by Task 1 */
}

/* ---------- 3. Category filtering helpers ---------- */
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
  const value = document.getElementById('categoryFilter').value;
  localStorage.setItem('lastFilter', value);
  displayFilteredQuotes(value);
}

function displayFilteredQuotes(category) {
  const container = document.getElementById('quoteDisplay');
  container.innerHTML = '';
  const subset = getCurrentFilteredQuotes();

  if (!subset.length) {
    container.textContent = 'No quotes in this category.';
    return;
  }

  subset.forEach(({ text, category: cat }) => {
    const p = document.createElement('p');
    p.innerHTML = `<em>"${text}"</em> — <strong>${cat}</strong>`;
    container.appendChild(p);
  });
}

function getCurrentFilteredQuotes() {
  const filter = document.getElementById('categoryFilter').value;
  return filter === 'all' ? quotes : quotes.filter(q => q.category === filter);
}

/* ---------- 4. JSON export / import (Task 2) ---------- */
function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = 'quotes.json'; a.style.display = 'none';
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = () => {
    try {
      const imported = JSON.parse(fileReader.result);
      if (!Array.isArray(imported)) throw new Error('Invalid format');
      quotes.push(...imported);
      saveQuotes();
      populateCategories();
      filterQuotes(); // refresh current filter view
      alert('Quotes imported successfully!');
    } catch (e) { alert('Import failed – invalid JSON.'); }
  };
  fileReader.readAsText(event.target.files[0]);
  event.target.value = '';
}

/* ---------- 5. Add / update quotes ---------- */
function addQuote() {
  const textVal = document.getElementById('newQuoteText').value.trim();
  const catVal  = document.getElementById('newQuoteCategory').value.trim();
  if (!textVal || !catVal) { alert('Both fields required'); return; }

  quotes.push({ text: textVal, category: catVal });
  saveQuotes();
  populateCategories();
  filterQuotes(); // refresh current view
  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';
}

/* ---------- 6. Bootstrap ---------- */
document.addEventListener('DOMContentLoaded', () => {
  loadQuotes();
  populateCategories();

  const savedFilter = localStorage.getItem('lastFilter') || 'all';
  document.getElementById('categoryFilter').value = savedFilter;

  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
  displayFilteredQuotes(savedFilter);
});
