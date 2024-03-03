let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

// Hiển thị danh sách chi tiêu
function showExpenses() {
    const expenseList = document.getElementById('expenseList');
    expenseList.innerHTML = '';

    let totalExpense = 0;
    let totalExpenseByMonth = {};

    expenses.forEach((expense, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${expense.date}</td>
            <td>${expense.name}</td>
            <td>${expense.amount}</td>
            <td>
                <i onclick="editExpense(${index})" class="fa-solid fa-pen-to-square color-icon"></i>
                <i onclick="deleteExpense(${index})" class="fa-solid fa-trash color-icon-trash"></i>
            </td>
        `;
        expenseList.appendChild(row);

        totalExpense += expense.amount;

        const month = expense.date.substring(0, 7);
        if (totalExpenseByMonth[month]) {
            totalExpenseByMonth[month] += expense.amount;
        } else {
            totalExpenseByMonth[month] = expense.amount;
        }
    });

    const totalExpenseElement = document.getElementById('totalExpense');
    totalExpenseElement.textContent = totalExpense;

    const totalExpenseByMonthElement = document.getElementById('totalExpenseByMonth');
    totalExpenseByMonthElement.innerHTML = '';

    Object.keys(totalExpenseByMonth).forEach((month) => {
        const monthTotalRow = document.createElement('div');
        monthTotalRow.innerHTML = `
            <div class="container-month">
                <p class="per-month">${month}</p>
                <div>
                    <p class="total-month">${totalExpenseByMonth[month]} VNĐ</p>

                </div>
            </div>
        `;
        totalExpenseByMonthElement.appendChild(monthTotalRow);
    });

    // Lưu dữ liệu vào local storage
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

function addExpense() {
    const expenseName = document.getElementById('expenseName').value;
    const expenseAmount = parseFloat(document.getElementById('expenseAmount').value);
    const expenseDate = document.getElementById('expenseDate').value;

    if (expenseName.trim() === '' || expenseAmount <= 0 || expenseDate === '') {
        alert('Vui lòng nhập thông tin chi tiêu hợp lệ.');
        return;
    }

    const expense = {
        name: expenseName,
        amount: expenseAmount,
        date: expenseDate
    };

    expenses.push(expense);

    sortExpenses();
    showExpenses();

    // Reset các trường input sau khi thêm chi tiêu
    document.getElementById('expenseName').value = '';
    document.getElementById('expenseAmount').value = '';
    document.getElementById('expenseDate').value = new Date().toISOString().slice(0, 10);
}

function editExpense(index) {
    const expense = expenses[index];

    const expenseNameInput = document.getElementById('expenseName');
    const expenseAmountInput = document.getElementById('expenseAmount');
    const expenseDateInput = document.getElementById('expenseDate');

    expenseNameInput.value = expense.name;
    expenseAmountInput.value = expense.amount;
    expenseDateInput.value = expense.date;

    // Remove the expense from the list
    expenses.splice(index, 1);

    // Update the expenses list and recalculate totals
    showExpenses();

    // Change the button text to "Chỉnh sửa"
    const addButton = document.getElementById('addExpenseButton');
    addButton.textContent = 'Lưu';
    addButton.onclick = function() {
        updateExpense(index);
    };
}

function updateExpense(index) {
    const expenseName = document.getElementById('expenseName').value;
    const expenseAmount = parseFloat(document.getElementById('expenseAmount').value);
    const expenseDate = document.getElementById('expenseDate').value;

    if (expenseName.trim() === '' || expenseAmount <= 0 || expenseDate === '') {
        alert('Vui lòng nhập thông tin chi tiêu hợp lệ.');
        return;
    }

    const expense = {
        name: expenseName,
        amount: expenseAmount,
        date: expenseDate
    };

    expenses.splice(index, 0, expense);

    sortExpenses();
    showExpenses();

    // Reset the input fields
    document.getElementById('expenseName').value = '';
    document.getElementById('expenseAmount').value = '';
    document.getElementById('expenseDate').value = new Date().toISOString().slice(0, 10);

    // Change the button text back to "Thêm chi tiêu"
    const addButton = document.getElementById('addExpenseButton');
    addButton.textContent = 'Thêm chi tiêu';
    addButton.onclick = function() {
        addExpense();
    };
}


function deleteExpense(index) {
    // Remove the expense from the list
    expenses.splice(index, 1);

    // Update the expenses list and recalculate totals
    showExpenses();
}

function sortExpenses() {
    expenses.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
    });
}

// Show the initial list of expenses
sortExpenses();
showExpenses();