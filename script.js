document.addEventListener("DOMContentLoaded", function () {
    const taskInput = document.getElementById("task");
    const addTaskButton = document.getElementById("add-task");
    const errorMessage = document.getElementById("error-message");
    const taskList = document.querySelector(".task-list");
    const showAllButton = document.getElementById("show-all");
    const showActiveButton = document.getElementById("show-active");
    const showCompletedButton = document.getElementById("show-completed");

    // Lataa tallennetut tehtävät localstoragesta
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    // Päivitä tehtävälista
    function updateTaskList() {
        taskList.innerHTML = "";

        tasks.forEach((task, index) => {
            const taskItem = document.createElement("div");
            taskItem.className = `task-item ${task.completed ? "completed" : ""}`;
            taskItem.innerHTML = `
                <span>${task.text}</span>
                <button class="delete" data-index="${index}">Poista</button>
            `;
            taskList.appendChild(taskItem);
        });

        updateTaskCount();
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    // Päivitä tehtävien lukumäärä
    function updateTaskCount() {
        const activeTasks = tasks.filter((task) => !task.completed).length;
        const taskCount = tasks.length;

        showAllButton.textContent = `Näytä kaikki (${taskCount})`;
        showActiveButton.textContent = `Näytä aktiiviset (${activeTasks})`;
        showCompletedButton.textContent = `Näytä tehdyt (${taskCount - activeTasks})`;
    }

    // Lisää uusi tehtävä
    addTaskButton.addEventListener("click", () => {
        const taskText = taskInput.value.trim();

        if (taskText) {
            tasks.push({ text: taskText, completed: false });
            taskInput.value = "";
            errorMessage.style.display = "none";
            updateTaskList();
        } else {
            errorMessage.style.display = "block";
        }
    });

    // Poista tehtävä
    taskList.addEventListener("click", (e) => {
        if (e.target.classList.contains("delete")) {
            const index = e.target.getAttribute("data-index");
            tasks.splice(index, 1);
            updateTaskList();
        }
    });

    // Merkitse tehtävä tehdyksi/avoimeksi
    taskList.addEventListener("click", (e) => {
        if (e.target.tagName === "SPAN") {
            const index = Array.from(taskList.children).indexOf(e.target.parentElement);
            tasks[index].completed = !tasks[index].completed;
            updateTaskList();
        }
    });

    // Näytä kaikki tehtävät
    showAllButton.addEventListener("click", () => {
        taskList.innerHTML = "";
        updateTaskList();
    });

    // Näytä vain aktiiviset tehtävät
    showActiveButton.addEventListener("click", () => {
        taskList.innerHTML = "";
        tasks
            .filter((task) => !task.completed)
            .forEach((task, index) => {
                const taskItem = document.createElement("div");
                taskItem.className = `task-item`;
                taskItem.innerHTML = `
                    <span>${task.text}</span>
                    <button class="delete" data-index="${index}">Poista</button>
                `;
                taskList.appendChild(taskItem);
            });
    });

    // Näytä vain tehdyt tehtävät
    showCompletedButton.addEventListener("click", () => {
        taskList.innerHTML = "";
        tasks
            .filter((task) => task.completed)
            .forEach((task, index) => {
                const taskItem = document.createElement("div");
                taskItem.className = `task-item completed`;
                taskItem.innerHTML = `
                    <span>${task.text}</span>
                    <button class="delete" data-index="${index}">Poista</button>
                `;
                taskList.appendChild(taskItem);
            });
    });

    // Päivitä alustava tehtävälista
    updateTaskList();
});
