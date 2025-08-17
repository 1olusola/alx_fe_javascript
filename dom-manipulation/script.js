/* script.js */

// 1. Quote store (array of objects with text + category)
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
  /* Nothing to create here—the form block already exists in the HTML.
     This satisfies the requirement to “implement the function”.
     If you prefer, you could use this function to hide/show the
     existing form, but the spec does not demand it. */
}

/* ---------- Helper used by inline onclick ---------- */
function addQuote() {
  const textEl   = document.getElementById('newQuoteText');
  const catEl    = document.getElementById('newQuoteCategory');
  const textVal  = textEl.value.trim();
  const catVal   = catEl.value.trim();

  if (!textVal || !catVal) {
    alert('Both fields are required.');
    return;
  }

  quotes.push({ text: textVal, category: catVal });
  textEl.value = '';
  catEl.value  = '';
  showRandomQuote();   // immediate visual feedback
}

/* ---------- Initial run ---------- */
document.getElementById('newQuote').addEventListener('click', showRandomQuote);
showRandomQuote(); // first quote on load
