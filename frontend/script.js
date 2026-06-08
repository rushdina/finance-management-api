const API_URL = "http://localhost:5000/api";

const categorySelect = document.getElementById("category");
const transactionTableBody = document.getElementById("transactionTableBody");
const transactionForm = document.getElementById("transactionForm");

const totalIncome = document.getElementById("totalIncome");
const totalExpense = document.getElementById("totalExpense");
const balance = document.getElementById("balance");

let editTransactionId = null; // remember which transaction is currently being edited

// Load categories from backend and display them in dropdown select
const loadCategories = async () => {
  try {
    // browser sends HTTP GET request /api/categories to nodejs express backend server
    const response = await fetch(`${API_URL}/categories`);
    const categories = await response.json(); // frontend converts json back to js array of obj
    /*
    [
      { id: 1, name: "Food" },
      { id: 2, name: "Transport"}
    ]
    */

    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.id;
      option.textContent = category.name;

      categorySelect.appendChild(option);
    });
  } catch (error) {
    console.error("Failed to load categories:", error);
  }
};

// Load transactions from backend and display them in table
const loadTransactions = async () => {
  try {
    // sends HTTP GET /api/transactions
    const response = await fetch(`${API_URL}/transactions`);
    const transactions = await response.json();
    /*
    [
      {
        id: 2,
        title: "Monthly Salary",
        amount: "3500.00",
        type: "income",
        category: "Salary",
        transaction_date: "2026-05-31T16:00:00.000Z",
        created_at: "2026-06-07T16:14:50.395Z"
      }
    ]
    */

    transactionTableBody.innerHTML = "";

    transactions.forEach((transaction) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${transaction.title}</td>
        <td>$${transaction.amount}</td>
        <td>${transaction.type}</td>
        <td>${transaction.category}</td>
        <td>${transaction.transaction_date}</td>
        <td>
          <button onclick="editTransaction(${transaction.id})">Edit</button>
          <button onclick="deleteTransaction(${transaction.id})">Delete</button>
        </td>
      `;

      transactionTableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Failed to load transactions:", error);
  }
};

/**
 * Handles form submission and sends new transaction to backend
 * - editTransactionId is null -> create new transaction using POST
 * - editTransactionId has ID  -> update existing transaction using PUT
 */
transactionForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  try {
    const transactionData = {
      title: document.getElementById("title").value,
      amount: Number(document.getElementById("amount").value),
      type: document.getElementById("type").value,
      category_id: Number(document.getElementById("category").value),
      transaction_date: document.getElementById("transactionDate").value,
    };

    const url = editTransactionId
      ? `${API_URL}/transactions/${editTransactionId}`
      : `${API_URL}/transactions`;

    const method = editTransactionId ? "PUT" : "POST";

    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transactionData),
    });

    const result = await response.json(); // backend JSON response converted into JS obj
    console.log(result);
    /*
    {
    message: "Transaction created/updated successfully",
      transaction: {
        id: 6,
        title: "Shopee Refund",
        amount: "12.50",
        type: "income",
        category_id: 3,
        transaction_date: "2026-06-04T16:00:00.000Z",
        created_at: "2026-06-08T08:46:02.861Z"
      }
    }
    */

    transactionForm.reset(); // reset form fields
    editTransactionId = null; // set back to null
    loadTransactions(); // rerender transaction table with new transaction added
    loadSummary(); // rerender summary
  } catch (error) {
    console.error("Failed to save transaction:", error);
  }
});

// Loads summary totals from backend and displays them on page
const loadSummary = async () => {
  try {
    const response = await fetch(`${API_URL}/transactions/summary`);
    const summary = await response.json();
    /*
    {
      total_income: "3000.00",
      total_expense: "500.00",
      balance: "2500.00"
    }
    */

    totalIncome.textContent = summary.total_income;
    totalExpense.textContent = summary.total_expense;
    balance.textContent = summary.balance;
  } catch (error) {
    console.error("Failed to load summary:", error);
  }
};

// Deletes a transaction from the database through backend API
const deleteTransaction = async (id) => {
  try {
    // browser sends DELETE /api/transactions/5 to backend
    const response = await fetch(`${API_URL}/transactions/${id}`, {
      method: "DELETE",
    });

    const result = await response.json();
    console.log(result);
    /*
    {
      message: "Transaction deleted successfully",
        transaction: {
          id: 5,
          title: "Movie",
          amount: "10.00",
          type: "expense",
          category_id: 6,
          transaction_date: "2026-06-04T16:00:00.000Z",
          created_at: "2026-06-08T08:46:02.861Z"
        }
    }
   */

    loadTransactions();
    loadSummary();
  } catch (error) {
    console.error("Failed to delete transaction:", error);
  }
};

// Edit transaction
const editTransaction = async (id) => {
  try {
    const response = await fetch(`${API_URL}/transactions/${id}`);
    const transaction = await response.json();

    document.getElementById("title").value = transaction.title;
    document.getElementById("amount").value = transaction.amount;
    document.getElementById("type").value = transaction.type;
    document.getElementById("category").value = transaction.category_id;
    document.getElementById("transactionDate").value =
      transaction.transaction_date.split("T")[0];

    editTransactionId = id;
  } catch (error) {
    console.error("Failed to load transaction for editing:", error);
  }
};

// Initial calls when page first loads
loadCategories();
loadTransactions();
loadSummary();
