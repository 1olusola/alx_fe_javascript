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

function addQuote() {
  const textVal = document.getElementById('newQuoteText').value.trim();
  const catVal  = document.getElementById('newQuoteCategory').value.trim();
  if (!textVal || !catVal) { alert('Both fields required'); return; }

  quotes.push({ text: textVal, category: catVal });
  saveQuotes();                          // persist
  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';
  showRandomQuote();
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

/* ---------- bootstrap ---------- */
loadQuotes();                                  // load from localStorage
document.getElementById('newQuote').addEventListener('click', showRandomQuote);
showRandomQuote();                             // initial quote
