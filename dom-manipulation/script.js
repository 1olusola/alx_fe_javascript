// Array of quote objects with text and category
let quotes = [
    { text: "The only way to do great work is to love what you do.", category: "Motivation" },
    { text: "Innovation distinguishes between a leader and a follower.", category: "Leadership" },
    { text: "Life is what happens to you while you're busy making other plans.", category: "Life" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Dreams" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Success" }
];

// Function to display a random quote (as required)
function showRandomQuote() {
    if (quotes.length === 0) {
        document.getElementById('quoteDisplay').innerHTML = '<p>No quotes available. Please add some quotes first!</p>';
        return;
    }
    
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = `
        <p style="font-size: 1.5em; font-style: italic;">"${quote.text}"</p>
        <p style="color: #666; margin-top: 10px;">Category: <strong>${quote.category}</strong></p>
    `;
}

// Function to create and display the add quote form (as required)
function createAddQuoteForm() {
    const formContainer = document.getElementById('formContainer');
    
    // Check if form already exists
    if (document.getElementById('addQuoteForm')) {
        formContainer.removeChild(document.getElementById('addQuoteForm'));
        return;
    }
    
    // Create form elements
    const form = document.createElement('div');
    form.id = 'addQuoteForm';
    
    form.innerHTML = `
        <h3>Add New Quote</h3>
        <div>
            <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
            <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
            <button onclick="addQuote()">Add Quote</button>
        </div>
    `;
    
    formContainer.appendChild(form);
}

// Function to add a new quote (called from the form)
function addQuote() {
    const textInput = document.getElementById('newQuoteText');
    const categoryInput = document.getElementById('newQuoteCategory');
    
    const text = textInput.value.trim();
    const category = categoryInput.value.trim();
    
    if (!text || !category) {
        alert('Please fill in both fields!');
        return;
    }
    
    // Add new quote to array
    quotes.push({
        text: text,
        category: category
    });
    
    // Clear form inputs
    textInput.value = '';
    categoryInput.value = '';
    
    // Show confirmation
    alert('Quote added successfully!');
    
    // Optionally show the new quote
    showRandomQuote();
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Create the "Add Quote" button as specified in instructions
    const addButton = document.createElement('button');
    addButton.textContent = 'Add New Quote';
    addButton.onclick = createAddQuoteForm;
    document.body.appendChild(addButton);
    
    // Show initial quote
    showRandomQuote();
});
