let expenses = [];
let total = 0;
let chart;

// Hardcoded user credentials
const user = { username: "suyash", password: "1234" };

// Login function
function login() {
  const u = document.getElementById("username").value.trim();
  const p = document.getElementById("password").value.trim();

  if (u === user.username && p === user.password) {
    // Hide login page
    document.getElementById("loginPage").classList.add("hidden");

    // Dynamically create tracker page
    loadTrackerPage();
  } else {
    alert("Invalid username or password!");
  }
}

// Logout function
function logout() {
  // Remove tracker page from DOM
  const trackerPage = document.getElementById("trackerPage");
  if (trackerPage) trackerPage.remove();

  // Show login page
  document.getElementById("loginPage").classList.remove("hidden");

  // Reset data
  expenses = [];
  total = 0;
  if (chart) chart.destroy();
}

// Function to dynamically load tracker page
function loadTrackerPage() {
  const body = document.body;
  const trackerHTML = `
    <div class="tracker-page" id="trackerPage">
      <header>
        <h1>💰 Expense Tracker by Suyash</h1>
        <button id="logoutBtn">Logout</button>
      </header>

      <div class="tracker-body">
        <div class="input-card">
          <input type="text" id="desc" placeholder="Expense Description">
          <input type="number" id="amount" placeholder="Amount (₹)">
          <button id="addBtn">Add Expense</button>
        </div>

        <ul id="expenseList"></ul>

        <div class="total-card">
          <h3>Total Spent: ₹<span id="totalAmount">0</span></h3>
          <canvas id="expenseChart" width="300" height="300"></canvas>
        </div>
      </div>
    </div>
  `;

  body.insertAdjacentHTML("beforeend", trackerHTML);

  // Attach event listeners **after tracker page is created**
  document.getElementById("logoutBtn").addEventListener("click", logout);
  document.getElementById("addBtn").addEventListener("click", addExpense);
}

// Function to add an expense
function addExpense() {
  const descInput = document.getElementById("desc");
  const amountInput = document.getElementById("amount");
  const desc = descInput.value.trim();
  const amt = parseFloat(amountInput.value);

  if (!desc || isNaN(amt) || amt <= 0) {
    alert("Please enter a valid description and amount");
    return;
  }

  expenses.push({ desc, amt });
  total += amt;
  document.getElementById("totalAmount").innerText = total;

  renderExpenses();
  updateChart();

  descInput.value = "";
  amountInput.value = "";
}

// Render expenses list
function renderExpenses() {
  const list = document.getElementById("expenseList");
  list.innerHTML = "";

  expenses.forEach((e, index) => {
    const li = document.createElement("li");

    // Add description, amount, and delete button
    li.innerHTML = `
      ${e.desc} <span>₹${e.amt}</span>
      <button class="delete-btn" data-index="${index}">🗑️</button>
    `;

    list.appendChild(li);
  });

  // Add event listeners to delete buttons
  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", (event) => {
      const idx = event.target.dataset.index;
      removeExpense(idx);
    });
  });
}


function removeExpense(index) {
  // Subtract the amount from total
  total -= expenses[index].amt;
  document.getElementById("totalAmount").innerText = total;

  // Remove expense from array
  expenses.splice(index, 1);

  // Re-render list and chart
  renderExpenses();
  updateChart();
}


// Update Chart.js pie chart
function updateChart() {
  const ctx = document.getElementById("expenseChart").getContext("2d");
  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: expenses.map(e => e.desc),
      datasets: [{
        data: expenses.map(e => e.amt),
        backgroundColor: [
          "#74b9ff", "#55efc4", "#ffeaa7", "#fab1a0", "#a29bfe", "#fd79a8"
        ],
        borderWidth: 1,
      }]
    },
    options: {
      plugins: {
        legend: { labels: { color: "#fff" } }
      }
    }
  });
}
