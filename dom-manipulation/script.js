// Advanced DOM Manipulation Quote Generator
class QuoteManager {
    constructor() {
        this.quotes = [
            { text: "The only way to do great work is to love what you do.", category: "Motivation", author: "Steve Jobs" },
            { text: "Innovation distinguishes between a leader and a follower.", category: "Leadership", author: "Steve Jobs" },
            { text: "Life is what happens to you while you're busy making other plans.", category: "Life", author: "John Lennon" },
            { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Dreams", author: "Eleanor Roosevelt" },
            { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Success", author: "Winston Churchill" },
            { text: "The only impossible journey is the one you never begin.", category: "Motivation", author: "Tony Robbins" },
            { text: "In the middle of difficulty lies opportunity.", category: "Wisdom", author: "Albert Einstein" },
            { text: "Be yourself; everyone else is already taken.", category: "Life", author: "Oscar Wilde" }
        ];
        
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.loadQuotes();
        this.bindEvents();
        this.updateCategoryFilter();
        this.updateQuoteCount();
    }

    loadQuotes() {
        const savedQuotes = localStorage.getItem('quotes');
        if (savedQuotes) {
            this.quotes = JSON.parse(savedQuotes);
        }
    }

    saveQuotes() {
        localStorage.setItem('quotes', JSON.stringify(this.quotes));
    }

    bindEvents() {
        // Main buttons
        document.getElementById('newQuoteBtn').addEventListener('click', () => this.showRandomQuote());
        document.getElementById('toggleFormBtn').addEventListener('click', () => this.toggleForm());
        document.getElementById('categoryFilter').addEventListener('change', (e) => this.filterQuotes(e.target.value));
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'n') {
                e.preventDefault();
                this.showRandomQuote();
            }
            if (e.ctrlKey && e.key === 'a') {
                e.preventDefault();
                this.toggleForm();
            }
        });
    }

    getFilteredQuotes() {
        if (this.currentFilter === 'all') {
            return this.quotes;
        }
        return this.quotes.filter(quote => quote.category === this.currentFilter);
    }

    showRandomQuote() {
        const filteredQuotes = this.getFilteredQuotes();
        
        if (filteredQuotes.length === 0) {
            this.displayMessage('No quotes available for this category!', 'error');
            return;
        }

        const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
        const quote = filteredQuotes[randomIndex];
        
        this.displayQuote(quote);
        this.addToHistory(quote);
    }

    displayQuote(quote) {
        const display = document.getElementById('quoteDisplay');
        
        // Create fade effect
        display.style.opacity = '0';
        
        setTimeout(() => {
            display.innerHTML = '';
            display.className = 'fade-in';
            
            const quoteText = this.createElement('p', {
                className: 'quote-text',
                textContent: `"${quote.text}"`
            });
            
            const quoteMeta = this.createElement('div', {
                className: 'quote-meta'
            });
            
            const category = this.createElement('span', {
                className: 'quote-category',
                textContent: quote.category
            });
            
            if (quote.author) {
                const author = this.createElement('span', {
                    style: 'margin-left: 15px; color: #666; font-style: italic;',
                    textContent: `— ${quote.author}`
                });
                quoteMeta.appendChild(author);
            }
            
            quoteMeta.insertBefore(category, quoteMeta.firstChild);
            
            display.appendChild(quoteText);
            display.appendChild(quoteMeta);
            
            display.style.opacity = '1';
        }, 300);
    }

    filterQuotes(category) {
        this.currentFilter = category;
        this.showRandomQuote();
    }

    updateCategoryFilter() {
        const select = document.getElementById('categoryFilter');
        const categories = [...new Set(this.quotes.map(quote => quote.category))].sort();
        
        // Clear existing options except "All"
        select.innerHTML = '<option value="all">All Categories</option>';
        
        categories.forEach(category => {
            const option = this.createElement('option', {
                value: category,
                textContent: category
            });
            select.appendChild(option);
        });
    }

    updateQuoteCount() {
        const count = this.getFilteredQuotes().length;
        const total = this.quotes.length;
        const filterText = this.currentFilter === 'all' ? 'all categories' : `category: ${this.currentFilter}`;
        
        document.getElementById('quoteCount').textContent = 
            `${count} quotes in ${filterText} (Total: ${total} quotes)`;
    }

    toggleForm() {
        const form = document.getElementById('addQuoteForm');
        const btn = document.getElementById('toggleFormBtn');
        
        if (form.style.display === 'none') {
            form.style.display = 'block';
            btn.textContent = 'Hide Form';
            document.getElementById('newQuoteText').focus();
        } else {
            form.style.display = 'none';
            btn.textContent = 'Add New Quote';
        }
    }

    addQuote() {
        const textInput = document.getElementById('newQuoteText');
        const categoryInput = document.getElementById('newQuoteCategory');
        const authorInput = document.getElementById('newQuoteAuthor');
        
        const text = textInput.value.trim();
        const category = categoryInput.value.trim();
        const author = authorInput.value.trim();
        
        // Validation
        if (!text) {
            this.displayMessage('Please enter a quote!', 'error');
            textInput.focus();
            return;
        }
        
        if (!category) {
            this.displayMessage('Please enter a category!', 'error');
            categoryInput.focus();
            return;
        }
        
        // Create new quote
        const newQuote = {
            text: text,
            category: category,
            author: author || null,
            id: Date.now()
        };
        
        // Add to array
        this.quotes.push(newQuote);
        this.saveQuotes();
        
        // Update UI
        this.updateCategoryFilter();
        this.updateQuoteCount();
        this.clearForm();
        this.displayMessage('Quote added successfully!', 'success');
        
        // Show the new quote
        this.currentFilter = category;
        document.getElementById('categoryFilter').value = category;
        this.showRandomQuote();
    }

    displayMessage(message, type) {
        const messageDiv = document.getElementById('formMessage');
        messageDiv.className = type;
        messageDiv.textContent = message;
        
        setTimeout(() => {
            messageDiv.textContent = '';
            messageDiv.className = '';
        }, 3000);
    }

    clearForm() {
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';
        document.getElementById('newQuoteAuthor').value = '';
    }

    addToHistory(quote) {
        // Optional: Add viewing history
        console.log('Viewed:', quote.text);
    }

    // Utility method for creating elements
    createElement(tag, attributes = {}) {
        const element = document.createElement(tag);
        
        Object.keys(attributes).forEach(key => {
            if (key === 'textContent') {
                element.textContent = attributes[key];
            } else if (key === 'innerHTML') {
                element.innerHTML = attributes[key];
            } else {
                element.setAttribute(key, attributes[key]);
            }
        });
        
        return element;
    }

    // Advanced feature: Export quotes
    exportQuotes() {
        const dataStr = JSON.stringify(this.quotes, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'quotes.json';
        link.click();
    }

    // Advanced feature: Import quotes
    importQuotes(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedQuotes = JSON.parse(e.target.result);
                if (Array.isArray(importedQuotes)) {
                    this.quotes = [...this.quotes, ...importedQuotes];
                    this.saveQuotes();
                    this.updateCategoryFilter();
                    this.updateQuoteCount();
                    this.displayMessage('Quotes imported successfully!', 'success');
                }
            } catch (error) {
                this.displayMessage('Error importing quotes. Please check the file format.', 'error');
            }
        };
        reader.readAsText(file);
    }
}

// Initialize the application
const quoteManager = new QuoteManager();

// Global functions for HTML onclick handlers
function addQuote() {
    quoteManager.addQuote();
}

function clearForm() {
    quoteManager.clearForm();
}

// Additional utility functions
function showStats() {
    const categories = [...new Set(quoteManager.quotes.map(q => q.category))];
    const stats = categories.map(cat => 
        `${cat}: ${quoteManager.quotes.filter(q => q.category === cat).length} quotes`
    ).join('\n');
    
    alert(`Quote Statistics:\n\nTotal Quotes: ${quoteManager.quotes.length}\nCategories: ${categories.length}\n\n${stats}`);
}

// Add some easter eggs
document.addEventListener('keydown', (e) => {
    if (e.key === 'F1') {
        e.preventDefault();
        alert('Dynamic Quote Generator v2.0\n\nKeyboard Shortcuts:\n- Ctrl+N: New random quote\n- Ctrl+A: Toggle add quote form\n- F1: This help\n- F2: Show statistics');
    }
});
