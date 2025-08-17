/* script.js – Task 2 enhancement (Web Storage + JSON) */

let quotes = [];   // will be filled from localStorage or defaults

/* ---------- Web Storage helpers ---------- */
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

function loadQuotes() {
  const stored = localStorage.getItem('quotes');
  if (stored) {
    quotes = JSON.parse(stored);
  } else {
    // default starter set if nothing in storage
    quotes = [
      { text: "The only way to do great work is to love what you do.", category: "Motivation" },
      { text: "Life is what happens when you're busy making other plans.", category: "Life" },
      { text: "Success is not final, failure is not fatal.", category: "Success" }
    ];
  }
}

/* ---------- Core Task 1 functions (unchanged) ---------- */
function showRandomQuote() {
  if (!quotes.length) {
    document.getElementById('quoteDisplay').textContent = 'No quotes available.';
    return;
  }
  const { text, category } = quotes[Math.floor(Math.random() * quotes.length)];
  document.getElementById('quoteDisplay').innerHTML =
    `<p><em>"${text}"</em></p><p><strong>Category:</strong> ${category}</p>`;

  /* Session-storage demo: remember last shown quote */
  sessionStorage.setItem('lastQuote', JSON.stringify({ text, category }));
}

function createAddQuoteForm() {
  /* minimal placeholder as per Task 1 spec */
}

/* addQuote() – update categories & current filter */
function addQuote() {
  const textVal = document.getElementById('newQuoteText').value.trim();
  const catVal  = document.getElementById('newQuoteCategory').value.trim();
  if (!textVal || !catVal) { alert('Both fields required'); return; }

  quotes.push({ text: textVal, category: catVal });
  saveQuotes();                       // already existed
  populateCategories();               // NEW
  const currentFilter = document.getElementById('categoryFilter').value;
  displayFilteredQuotes(currentFilter); // NEW

  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';
}

/* ---------- JSON export ---------- */
function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href        = url;
  a.download    = 'quotes.json';
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ---------- JSON import (exact signature from Step 2) ---------- */
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function () {
    try {
      const importedQuotes = JSON.parse(fileReader.result);
      if (!Array.isArray(importedQuotes)) throw new Error('Invalid format');
      quotes.push(...importedQuotes);
      saveQuotes();
      alert('Quotes imported successfully!');
      showRandomQuote();
    } catch (e) {
      alert('Import failed – invalid JSON.');
    }
  };
  fileReader.readAsText(event.target.files[0]);
  event.target.value = ''; // reset file input
}


/* 1. Extract unique categories from quotes */
function populateCategories() {
  const cats = [...new Set(quotes.map(q => q.category))].sort();
  const sel  = document.getElementById('categoryFilter');
  sel.innerHTML = '<option value="all">All Categories</option>'; // reset
  cats.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = c;
    sel.appendChild(opt);
  });
}

/* 2. Filter quotes & save last choice */
function filterQuotes() {
  const value = document.getElementById('categoryFilter').value;
  localStorage.setItem('lastFilter', value);          // remember choice
  displayFilteredQuotes(value);
}

/* 3. Display quotes for chosen category */
function displayFilteredQuotes(category) {
  const container = document.getElementById('quoteDisplay');
  container.innerHTML = '';
  const subset = category === 'all' ? quotes : quotes.filter(q => q.category === category);

  if (!subset.length) {
    container.textContent = 'No quotes in this category.';
    return;
  }

  const ul = document.createElement('ul');
  subset.forEach(({ text, category: cat }) => {
    const li = document.createElement('li');
    li.innerHTML = `<em>"${text}"</em> — <strong>${cat}</strong>`;
    ul.appendChild(li);
  });
  container.appendChild(ul);
}

/* 4. Restore last filter on load */
function restoreLastFilter() {
  const saved = localStorage.getItem('lastFilter') || 'all';
  document.getElementById('categoryFilter').value = saved;
  displayFilteredQuotes(saved);
}

/* ---------- bootstrap ---------- */
document.getElementById('newQuote').addEventListener('click', showRandomQuote);
showRandomQuote();                             // initial quote
/* ---------- bootstrap additions ---------- */
document.addEventListener('DOMContentLoaded', () => {
  loadQuotes();         // from Task-2
  populateCategories(); // NEW
  restoreLastFilter();  // NEW
});
