document.addEventListener("DOMContentLoaded", () => {
    const totalIncomeElement = document.getElementById("total-income");
    const totalExpensesElement = document.getElementById("total-expenses");
    const netBalanceElement = document.getElementById("net-balance");
    const descriptionInput = document.getElementById("description");
    const amountInput = document.getElementById("amount");
    const entriesList = document.getElementById("entries");
    const addBtn = document.getElementById("add-btn");
    const resetBtn = document.getElementById("reset-btn");
    const filters = document.querySelectorAll('input[name="filter"]');

    let entries = JSON.parse(localStorage.getItem("entries")) || [];

    function updateTotals() {
        const totalIncome = entries.filter(e => e.type === "income").reduce((sum, e) => sum + e.amount, 0);
        const totalExpenses = entries.filter(e => e.type === "expense").reduce((sum, e) => sum + e.amount, 0);
        const netBalance = totalIncome - totalExpenses;

        totalIncomeElement.textContent = totalIncome;
        totalExpensesElement.textContent = totalExpenses;
        netBalanceElement.textContent = netBalance;
    }

    function renderEntries(filter = "all")  {
        entriesList.innerHTML = "";
        const filteredEntries = filter === "all" ? entries : entries.filter(e => e.type === filter);
        filteredEntries.forEach((entry, index) => {
            const listItem = document.createElement("li");
            listItem.innerHTML = `${entry.description} - ${entry.amount} <button onclick="editEntry(${index})">Edit</button> <button onclick="deleteEntry(${index})">Delete</button>`;
            entriesList.appendChild(listItem);
        });
    }

    window.addEntry=() => {
        const description = descriptionInput.value;
        const amount = parseFloat(amountInput.value);
        if (!description || isNaN(amount)) return;

        const type = document.querySelector('input[name="filter"]:checked').value;
        entries.push({ description, amount, type });
        localStorage.setItem("entries", JSON.stringify(entries));
        updateTotals();
        resetForm();
    }

    window.editEntry = (index) =>  {
        const entry = entries[index];
        descriptionInput.value = entry.description;
        amountInput.value = entry.amount;
        deleteEntry(index);
        resetForm();
    }

    window.deleteEntry = (index) => {
        entries.splice(index, 1);
        localStorage.setItem("entries", JSON.stringify(entries));
        renderEntries();
        updateTotals();
          }

    function resetForm() {
        descriptionInput.value = "";
        amountInput.value = "";
        document.querySelector('input[name="filter"][value="all"]').checked = true;
    }

    addBtn.addEventListener("click", addEntry);
    resetBtn.addEventListener("click", resetForm);
    filters.forEach(filter => filter.addEventListener("change", () => renderEntries(filter.value)));

   });
