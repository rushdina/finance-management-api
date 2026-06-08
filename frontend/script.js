const API_URL = "http://localhost:5000/api";

const categorySelect = document.getElementById("category"); // <select id="category"></select>

// Load categories from backend and display them in dropdown select
const loadCategories = async () => {
  try {
    // browser sends HTTP GET request /api/categories to nodejs express backend server
    const response = await fetch(`${API_URL}/categories`);
    const categories = await response.json(); // frontend converts json back to js array of obj
    console.log(categories);

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
