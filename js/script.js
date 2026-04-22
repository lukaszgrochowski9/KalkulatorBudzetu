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

let transactions = [];
let currentFilter = 'all';

// Month navigation state
const now = new Date();
let currentMonth = now.getMonth();   // 0-11
let currentYear = now.getFullYear();

const prevMonthBtn = document.getElementById('prev-month');
const nextMonthBtn = document.getElementById('next-month');
const currentMonthDisplay = document.getElementById('current-month-display');

function getMonthLabel(year, month) {
    return new Intl.DateTimeFormat('pl-PL', { month: 'long', year: 'numeric' }).format(new Date(year, month, 1));
}

function updateMonthDisplay() {
    currentMonthDisplay.textContent = getMonthLabel(currentYear, currentMonth)
        .replace(/^./, c => c.toUpperCase());
}

function getFilteredByMonth(list) {
    return list.filter(t => {
        const d = new Date(t.date);
        return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
    });
}

prevMonthBtn.addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) { currentMonth = 11; currentYear--; }
    updateMonthDisplay();
    updateUI();
});

nextMonthBtn.addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) { currentMonth = 0; currentYear++; }
    updateMonthDisplay();
    updateUI();
});

updateMonthDisplay();

const customCategoryGroup = document.querySelector('#custom-category-group');
const customCategoryInput = document.querySelector('#custom-category');

function setDefaultDate() {
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
}

const defaultCategoryMap = {
    food: "Jedzenie",
    transport: "Transport",
    housing: "Mieszkanie",
    entertainment: "Rozrywka",
    salary: "Wynagrodzenie"
};

let categoryMap = { ...defaultCategoryMap };

function loadProfileData() {
    const profileId = ProfileManager.getActiveProfileId();
    if (!profileId) return;

    const txKey = ProfileManager.getTransactionsKey(profileId);
    const catKey = ProfileManager.getCategoryMapKey(profileId);

    transactions = JSON.parse(localStorage.getItem(txKey)) || [];

    const savedCats = JSON.parse(localStorage.getItem(catKey));
    if (savedCats) {
        categoryMap = savedCats;
    } else {
        categoryMap = { ...defaultCategoryMap };
    }
    delete categoryMap.other;
}

function saveProfileData() {
    const profileId = ProfileManager.getActiveProfileId();
    if (!profileId) return;

    const txKey = ProfileManager.getTransactionsKey(profileId);
    const catKey = ProfileManager.getCategoryMapKey(profileId);

    localStorage.setItem(txKey, JSON.stringify(transactions));
    localStorage.setItem(catKey, JSON.stringify(categoryMap));
}

function populateCategories() {
    categoryInput.innerHTML = '';
    for (const [key, value] of Object.entries(categoryMap)) {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = value;
        categoryInput.appendChild(option);
    }
    const customOption = document.createElement('option');
    customOption.value = 'custom';
    customOption.textContent = '+ Dodaj własną...';
    customOption.style.fontWeight = 'bold';
    categoryInput.appendChild(customOption);
}

categoryInput.addEventListener('change', (e) => {
    if (e.target.value === 'custom') {
        customCategoryGroup.style.display = 'flex';
        customCategoryInput.required = true;
    } else {
        customCategoryGroup.style.display = 'none';
        customCategoryInput.required = false;
    }
});

function generateColors(count) {
    const colors = ['#f87171', '#fbbf24', '#34d399', '#60a5fa', '#a78bfa', '#f472b6', '#a3e635', '#fb923c', '#2dd4bf', '#818cf8', '#e879f9', '#facc15', '#4ade80', '#38bdf8', '#c084fc'];
    if (count <= colors.length) return colors.slice(0, count);
    const result = [...colors];
    for (let i = colors.length; i < count; i++) {
        result.push(`hsl(${(i * 137.5) % 360}, 70%, 60%)`);
    }
    return result;
}

function updateChart() {
    if (!ctx) return;

    const monthTransactions = getFilteredByMonth(transactions);
    const expenses = monthTransactions.filter(t => t.type === 'expense');

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

    const textColor = getComputedStyle(document.body).getPropertyValue('--text-muted').trim() || '#6b7280';

    chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: generateColors(data.length),
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: { font: { family: "'Inter', sans-serif" }, color: textColor }
                }
            }
        }
    });
}

function updateSummary() {
    const monthTransactions = getFilteredByMonth(transactions);

    const incomes = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((acc, t) => acc + t.amount, 0);

    const expenses = monthTransactions
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

    const monthTransactions = getFilteredByMonth(transactions);

    let filteredTransactions = monthTransactions;
    if (currentFilter !== 'all') {
        filteredTransactions = monthTransactions.filter(t => t.type === currentFilter);
    }

    if (monthTransactions.length === 0) {
        transactionsList.innerHTML = '<p class="empty-state">Brak transakcji w tym miesiącu.</p>';
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

            const authorBadge = transaction.profileName
                ? `<span class="transaction-author">${transaction.profileAvatar || '👤'} ${transaction.profileName}</span>`
                : '';

            item.innerHTML = `
            <div class="transaction-info">
                <h4>${transaction.name}</h4>
                <span>${categoryMap[transaction.category]} • ${dateStr}</span>
                ${authorBadge}
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
    saveProfileData();
}

form.addEventListener('submit', function (e) {
    e.preventDefault();

    let finalCategory = categoryInput.value;

    if (finalCategory === 'custom') {
        const newCatName = customCategoryInput.value.trim();
        if (!newCatName) return;

        finalCategory = 'cat_' + Date.now();
        categoryMap[finalCategory] = newCatName;
        saveProfileData();
        populateCategories();
    }

    const activeProfile = ProfileManager.getActiveProfile();
    const transaction = {
        id: crypto.randomUUID(),
        type: typeInput.value,
        name: nameInput.value,
        amount: parseFloat(amountInput.value),
        category: finalCategory,
        date: dateInput.value,
        profileName: activeProfile ? activeProfile.name : '',
        profileAvatar: activeProfile ? activeProfile.avatar : ''
    };

    transactions.push(transaction);
    form.reset();
    setDefaultDate();
    customCategoryGroup.style.display = 'none';
    customCategoryInput.required = false;
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

// ═══════ PROFILE INTEGRATION ═══════

window.onProfileSelected = function(profile) {
    loadProfileData();
    populateCategories();
    currentFilter = 'all';
    filterBtns.forEach(b => b.classList.remove('active'));
    filterBtns[0].classList.add('active');
    updateMonthDisplay();
    updateUI();
};

// Dark Theme Logic
const themeToggleBtn = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('theme');

if (currentTheme === 'dark') {
    document.body.classList.add('dark-theme');
    themeToggleBtn.textContent = '☀️';
}

themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    let theme = 'light';
    if (document.body.classList.contains('dark-theme')) {
        theme = 'dark';
        themeToggleBtn.textContent = '☀️';
    } else {
        themeToggleBtn.textContent = '🌙';
    }
    localStorage.setItem('theme', theme);
    updateChart(); // refresh chart colors
});

