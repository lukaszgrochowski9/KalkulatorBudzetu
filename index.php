<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kalkulator Budżetu Domowego</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/style.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
    <div class="app-container">
        <header class="app-header">
            <button id="theme-toggle" class="theme-toggle-btn" title="Przełącz motyw">🌙</button>
            <h1>Kalkulator Budżetu</h1>
            <p>Zarządzaj swoimi finansami w prosty sposób</p>
        </header>

        <main class="app-main">
            <section class="summary-section">
                <div class="summary-card balance">
                    <h3>Aktualne Saldo</h3>
                    <p class="amount positive">4 500,00 PLN</p>
                </div>
                <div class="summary-card incomes">
                    <h3>Przychody</h3>
                    <p class="amount">7 000,00 PLN</p>
                </div>
                <div class="summary-card expenses">
                    <h3>Wydatki</h3>
                    <p class="amount">2 500,00 PLN</p>
                </div>
            </section>

            <div class="content-grid">
                <div class="left-column">
                    <section class="form-section">
                        <h2>Dodaj transakcję</h2>
                    <form action="#" method="POST" class="transaction-form">
                        <div class="form-group">
                            <label for="type">Typ</label>
                            <select id="type" name="type" required>
                                <option value="expense">Wydatek</option>
                                <option value="income">Przychód</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="name">Nazwa</label>
                            <input type="text" id="name" name="name" placeholder="np. Zakupy spożywcze" required>
                        </div>
                        <div class="form-group">
                            <label for="amount">Kwota (PLN)</label>
                            <input type="number" id="amount" name="amount" step="0.01" min="0.01" placeholder="0.00" required>
                        </div>
                        <div class="form-group">
                            <label for="category">Kategoria</label>
                            <select id="category" name="category" required>
                                <option value="food">Jedzenie</option>
                                <option value="transport">Transport</option>
                                <option value="housing">Mieszkanie</option>
                                <option value="entertainment">Rozrywka</option>
                                <option value="salary">Wynagrodzenie</option>
                                <option value="other">Inne</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="date">Data</label>
                            <input type="date" id="date" name="date" required>
                        </div>
                        <button type="submit" class="btn-submit">Dodaj transakcję</button>
                    </form>
                </section>
                </div>
                <div class="right-column" style="display: flex; flex-direction: column; gap: 2rem;">
                    <section class="list-section">
                        <div class="list-header">
                        <h2>Ostatnie transakcje</h2>
                        <div class="filters">
                            <button class="filter-btn active" data-filter="all">Wszystkie</button>
                            <button class="filter-btn" data-filter="income">Przychody</button>
                            <button class="filter-btn" data-filter="expense">Wydatki</button>
                        </div>
                    </div>
                    <div class="transactions-list">
                        <div class="transaction-item expense">
                            <div class="transaction-info">
                                <h4>Zakupy w supermarkecie</h4>
                                <span>Jedzenie • 20 Kwietnia 2026</span>
                            </div>
                            <div class="transaction-amount">
                                -150,00 PLN
                            </div>
                        </div>
                        <div class="transaction-item income">
                            <div class="transaction-info">
                                <h4>Wypłata</h4>
                                <span>Wynagrodzenie • 10 Kwietnia 2026</span>
                            </div>
                            <div class="transaction-amount">
                                +7 000,00 PLN
                            </div>
                        </div>
                        <div class="transaction-item expense">
                            <div class="transaction-info">
                                <h4>Paliwo</h4>
                                <span>Transport • 5 Kwietnia 2026</span>
                            </div>
                            <div class="transaction-amount">
                                -250,00 PLN
                            </div>
                        </div>
                    </div>
                </section>
                <section class="chart-section">
                    <h2>Wydatki wg kategorii</h2>
                    <div class="chart-container">
                        <canvas id="expensesChart"></canvas>
                    </div>
                </section>
                </div>
            </div>
        </main>
    </div>
    <script src="js/script.js"></script>
</body>
</html>
