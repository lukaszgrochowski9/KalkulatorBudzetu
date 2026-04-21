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
});
