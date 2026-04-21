const form = document.querySelector('.transaction-form');
const typeInput = document.querySelector('#type');
const nameInput = document.querySelector('#name');
const amountInput = document.querySelector('#amount');
const categoryInput = document.querySelector('#category');
const dateInput = document.querySelector('#date');

const balanceDisplay = document.querySelector('.balance .amount');
const incomesDisplay = document.querySelector('.incomes .amount');
const expensesDisplay = document.querySelector('.expenses .amount');
const transactionsList = document.querySelector('.transactions-list');
const filterBtns = document.querySelectorAll('.filter-btn');
const ctx = document.getElementById('expensesChart');
let chartInstance = null;

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let currentFilter = 'all';

function setDefaultDate() {
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
}

const categoryMap = {
    food: "Jedzenie",
    transport: "Transport",
    housing: "Mieszkanie",
    entertainment: "Rozrywka",
    salary: "Wynagrodzenie",
    other: "Inne"
};

function updateChart() {
    if (!ctx) return;
    
    const expenses = transactions.filter(t => t.type === 'expense');
    
    const dataByCategory = {};
    expenses.forEach(t => {
        const catName = categoryMap[t.category];
        dataByCategory[catName] = (dataByCategory[catName] || 0) + t.amount;
    });
    
    const labels = Object.keys(dataByCategory);
    const data = Object.values(dataByCategory);
    
    if (chartInstance) {
        chartInstance.destroy();
    }
    
    if (expenses.length === 0) {
        return;
    }
    
    chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: [
                    '#f87171', '#fbbf24', '#34d399', '#60a5fa', '#a78bfa', '#f472b6', '#a3e635'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { font: { family: "'Inter', sans-serif" }, color: '#6b7280' }
                }
            }
        }
    });
}

function updateSummary() {
    const incomes = transactions
        .filter(t => t.type === 'income')
        .reduce((acc, t) => acc + t.amount, 0);

    const expenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => acc + t.amount, 0);

    const balance = incomes - expenses;

    const formatAmount = (amount) => new Intl.NumberFormat('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount) + ' PLN';

    balanceDisplay.textContent = formatAmount(balance);
    incomesDisplay.textContent = formatAmount(incomes);
    expensesDisplay.textContent = formatAmount(expenses);

    if (balance >= 0) {
        balanceDisplay.classList.add('positive');
        balanceDisplay.classList.remove('negative');
    } else {
        balanceDisplay.classList.add('negative');
        balanceDisplay.classList.remove('positive');
    }
}

function deleteTransaction(id) {
    transactions = transactions.filter(t => t.id !== id);
    updateUI();
}

function updateUI() {
    transactionsList.innerHTML = '';

    let filteredTransactions = transactions;
    if (currentFilter !== 'all') {
        filteredTransactions = transactions.filter(t => t.type === currentFilter);
    }

    if (transactions.length === 0) {
        transactionsList.innerHTML = '<p class="empty-state">Brak transakcji. Dodaj pierwszą transakcję powyżej.</p>';
    } else if (filteredTransactions.length === 0) {
        transactionsList.innerHTML = '<p class="empty-state">Brak transakcji dla wybranego filtru.</p>';
    } else {
        const sortedTransactions = [...filteredTransactions].sort((a, b) => new Date(b.date) - new Date(a.date));
        sortedTransactions.forEach(transaction => {
        const sign = transaction.type === 'expense' ? '-' : '+';
        const item = document.createElement('div');
        item.classList.add('transaction-item', transaction.type);

        const dateObj = new Date(transaction.date);
        const dateStr = new Intl.DateTimeFormat('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' }).format(dateObj);
        const amountStr = new Intl.NumberFormat('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(transaction.amount) + ' PLN';

        item.innerHTML = `
            <div class="transaction-info">
                <h4>${transaction.name}</h4>
                <span>${categoryMap[transaction.category]} • ${dateStr}</span>
            </div>
            <div class="transaction-actions">
                <div class="transaction-amount">
                    ${sign}${amountStr}
                </div>
                <button class="btn-delete" onclick="deleteTransaction('${transaction.id}')">&times;</button>
            </div>
        `;

        transactionsList.appendChild(item);
        });
    }

    updateSummary();
    updateChart();
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

form.addEventListener('submit', function(e) {
    e.preventDefault();

    const transaction = {
        id: crypto.randomUUID(),
        type: typeInput.value,
        name: nameInput.value,
        amount: parseFloat(amountInput.value),
        category: categoryInput.value,
        date: dateInput.value
    };

    transactions.push(transaction);
    form.reset();
    setDefaultDate();
    updateUI();
});

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        updateUI();
    });
});

setDefaultDate();
updateUI();
