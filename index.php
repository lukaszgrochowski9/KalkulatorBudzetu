<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kalkulator Budżetu Domowego</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div class="app-container">
        <header class="app-header">
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
                            <input type="number" id="amount" name="amount" step="0.01" placeholder="0.00" required>
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
                            <input type="date" id="date" name="date" required value="2026-04-20">
                        </div>
                        <button type="submit" class="btn-submit">Dodaj transakcję</button>
                    </form>
                </section>
            </div>
        </main>
    </div>
    <script src="js/script.js"></script>
</body>
</html>
