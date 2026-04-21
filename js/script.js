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

let transactions = [];

const categoryMap = {
    food: "Jedzenie",
    transport: "Transport",
    housing: "Mieszkanie",
    entertainment: "Rozrywka",
    salary: "Wynagrodzenie",
    other: "Inne"
};

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

function updateUI() {
    transactionsList.innerHTML = '';

    transactions.forEach(transaction => {
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
            <div class="transaction-amount">
                ${sign}${amountStr}
            </div>
        `;

        transactionsList.appendChild(item);
    });

    updateSummary();
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
    updateUI();
});

updateUI();
