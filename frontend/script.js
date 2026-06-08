const API_URL = "http://localhost:5000/api";

const categorySelect = document.getElementById("category"); // <select id="category"></select>

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

loadCategories();

const transactionTableBody = document.getElementById("transactionTableBody");

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
          <button>Edit</button>
          <button>Delete</button>
        </td>
      `;

      transactionTableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Failed to load transactions:", error);
  }
};

loadTransactions();
