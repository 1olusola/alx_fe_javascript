/* script.js */

const quotes = [
  { text: "The only way to do great work is to love what you do.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Success is not final, failure is not fatal.", category: "Success" }
];

/* ---------- Required function #1 ---------- */
function showRandomQuote() {
  if (!quotes.length) {
    document.getElementById('quoteDisplay').textContent = 'No quotes available.';
    return;
  }
  const { text, category } = quotes[Math.floor(Math.random() * quotes.length)];
  document.getElementById('quoteDisplay').innerHTML =
    `<p><em>"${text}"</em></p><p><strong>Category:</strong> ${category}</p>`;
}

/* ---------- Required function #2 ---------- */
function createAddQuoteForm() {
  /* intentionally left minimal per spec */
}

/* ---------- Helper used by inline onclick ---------- */
function addQuote() {
  const textEl  = document.getElementById('newQuoteText');
  const catEl   = document.getElementById('newQuoteCategory');
  const textVal = textEl.value.trim();
  const catVal  = catEl.value.trim();

  if (!textVal || !catVal) { alert('Both fields are required.'); return; }

  /* 1️⃣  Add to array */
  quotes.push({ text: textVal, category: catVal });

  /* 2️⃣  DOM update with createElement + appendChild */
  const container = document.getElementById('quoteDisplay');
  const para = document.createElement('p');
  para.textContent = `✅ Added: “${textVal}” [${catVal}]`;
  container.appendChild(para);

  /* 3️⃣  Clear inputs & refresh */
  textEl.value = '';
  catEl.value  = '';
  setTimeout(showRandomQuote, 1500); // quick visual feedback
}

/* ---------- Event listener on “Show New Quote” button ---------- */
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

/* initial quote */
showRandomQuote();
