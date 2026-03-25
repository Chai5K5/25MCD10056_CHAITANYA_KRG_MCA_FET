const btn = document.querySelector("#add_task");
const taskInput = document.querySelector("#task_input");
const priorityInput = document.querySelector("#priority");
const deadlineInput = document.querySelector("#deadline");
const container = document.querySelector("#tasks_container");
const filterBtns = document.querySelectorAll(".filter-btn");
const sortSelect = document.querySelector("#sort");

const totalEl = document.querySelector("#total");
const completedEl = document.querySelector("#completed");
const pendingEl = document.querySelector("#pending");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

function debounce(func, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => func(...args), delay);
    };
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

btn.addEventListener("click", () => {
    const title = taskInput.value.trim();
    const priority = priorityInput.value;
    const deadline = deadlineInput.value;

    if (!title) return alert("Task cannot be empty");

    tasks.push({
        id: Date.now(),
        title,
        priority,
        deadline,
        completed: false
    });

    saveTasks();
    renderTasks();

    taskInput.value = "";
});

function renderTasks() {
    container.innerHTML = "";

    let filtered = tasks.filter(task => {
        if (currentFilter === "completed") return task.completed;
        if (currentFilter === "pending") return !task.completed;
        return true;
    });

    const sortType = sortSelect.value;

    if (sortType === "priority") {
        filtered.sort((a, b) => b.priority - a.priority);
    } else if (sortType === "deadline") {
        filtered.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    }

    filtered.forEach(task => {
        const isOverdue = task.deadline && new Date(task.deadline) < new Date();

        const card = document.createElement("div");
        card.className = `card mt-3 ${isOverdue ? "overdue" : ""}`;

        const priorityClass =
            task.priority == 3 ? "bg-danger" :
            task.priority == 2 ? "bg-warning" :
            "bg-success";

        card.innerHTML = `
            <div class="card-body">
                <h5 class="${task.completed ? "completed" : ""}">
                    ${task.title}
                </h5>

                <span class="badge ${priorityClass}">${getPriorityText(task.priority)}</span>
                <small class="ms-2">${task.deadline || ""}</small>

                <div class="mt-3">
                    <button class="btn btn-success btn-sm toggle">✅</button>
                    <button class="btn btn-danger btn-sm delete">🗑️</button>
                </div>
            </div>
        `;

        card.querySelector(".toggle").addEventListener("click", () => {
            task.completed = !task.completed;
            saveTasks();
            renderTasks();
        });

        card.querySelector(".delete").addEventListener("click", () => {
            tasks = tasks.filter(t => t.id !== task.id);
            saveTasks();
            renderTasks();
        });

        container.appendChild(card);
    });

    updateCounters();
}

function updateCounters() {
    totalEl.textContent = tasks.length;
    completedEl.textContent = tasks.filter(t => t.completed).length;
    pendingEl.textContent = tasks.filter(t => !t.completed).length;
}

const handleFilter = debounce((type) => {
    currentFilter = type;
    renderTasks();
}, 300);

filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        handleFilter(btn.dataset.filter);
    });
});

sortSelect.addEventListener("change", renderTasks);

function getPriorityText(p) {
    return p == 3 ? "High" : p == 2 ? "Medium" : "Low";
}
renderTasks();