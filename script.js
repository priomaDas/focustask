/* =========================
   DATA
========================= */

let tasks =
    JSON.parse(
        localStorage.getItem("aestheticTasks")
    ) || [];

let currentFilter = "all";


/* =========================
   ADD TASK
========================= */

function addTask() {

    const input =
        document.getElementById("taskInput");

    const priority =
        document.getElementById("priority").value;

    const dueDate =
        document.getElementById("dueDate").value;

    const title =
        input.value.trim();


    if (title === "") {

        alert(
            "Please write a task first ✨"
        );

        return;
    }


    tasks.push({

        id: Date.now(),

        title: title,

        priority: priority,

        dueDate: dueDate,

        completed: false

    });


    saveTasks();

    input.value = "";

    document.getElementById("dueDate").value = "";

    renderTasks();

    input.focus();
}


/* =========================
   DELETE TASK
========================= */

function deleteTask(id) {

    tasks =
        tasks.filter(
            task => task.id !== id
        );

    saveTasks();

    renderTasks();
}


/* =========================
   EDIT TASK
========================= */

function editTask(id) {

    const task =
        tasks.find(
            task => task.id === id
        );

    const newTitle =
        prompt(
            "Edit your task ✏️",
            task.title
        );


    if (
        newTitle !== null &&
        newTitle.trim() !== ""
    ) {

        task.title =
            newTitle.trim();

        saveTasks();

        renderTasks();
    }
}


/* =========================
   COMPLETE TASK
========================= */

function toggleTask(id) {

    const task =
        tasks.find(
            task => task.id === id
        );

    task.completed =
        !task.completed;

    saveTasks();

    renderTasks();
}


/* =========================
   FILTER
========================= */

function setFilter(
    filter,
    button
) {

    currentFilter = filter;


    document
        .querySelectorAll(".filter-btn")
        .forEach(btn => {

            btn.classList.remove("active");

        });


    button.classList.add("active");

    renderTasks();
}


/* =========================
   RENDER TASKS
========================= */

function renderTasks() {

    const list =
        document.getElementById("taskList");


    const search =
        document
            .getElementById("searchInput")
            .value
            .toLowerCase();


    list.innerHTML = "";


    const filtered =
        tasks.filter(task => {

            const searchMatch =
                task.title
                    .toLowerCase()
                    .includes(search);


            let filterMatch = true;


            if (
                currentFilter === "active"
            ) {

                filterMatch =
                    !task.completed;
            }


            if (
                currentFilter === "completed"
            ) {

                filterMatch =
                    task.completed;
            }


            return (
                searchMatch &&
                filterMatch
            );

        });


    /* EMPTY */

    if (
        filtered.length === 0
    ) {

        list.innerHTML = `

            <li class="empty">

                <div class="empty-icon">
                    ☁️
                </div>

                Nothing here yet.

                <br>

                Add a task and
                start your day.

            </li>

        `;

    }


    /* TASKS */

    filtered.forEach(task => {

        const li =
            document.createElement("li");


        li.className =
            "task" +
            (
                task.completed
                    ? " completed"
                    : ""
            );


        const priorityClass =
            task.priority.toLowerCase();


        li.innerHTML = `

            <input

                type="checkbox"

                class="check"

                ${
                    task.completed
                        ? "checked"
                        : ""
                }

                onchange="
                    toggleTask(
                        ${task.id}
                    )
                "

            >


            <div class="task-content">

                <div class="task-title">

                    ${
                        escapeHTML(
                            task.title
                        )
                    }

                </div>


                <div class="task-meta">

                    <span
                        class="
                            tag
                            ${priorityClass}
                        ">

                        ${task.priority}

                    </span>


                    ${
                        task.dueDate

                        ?

                        `

                        <span
                            class="
                                tag
                                date
                            ">

                            ♡
                            ${task.dueDate}

                        </span>

                        `

                        :

                        ""
                    }

                </div>

            </div>


            <div class="actions">

                <button

                    class="
                        action-btn
                        edit
                    "

                    onclick="
                        editTask(
                            ${task.id}
                        )
                    ">

                    ✎

                </button>


                <button

                    class="
                        action-btn
                        delete
                    "

                    onclick="
                        deleteTask(
                            ${task.id}
                        )
                    ">

                    ×

                </button>

            </div>

        `;


        list.appendChild(li);

    });


    updateStats();
}


/* =========================
   UPDATE STATISTICS
========================= */

function updateStats() {

    const total =
        tasks.length;


    const completed =
        tasks.filter(
            task =>
                task.completed
        ).length;


    const pending =
        total - completed;


    const percentage =
        total === 0

            ? 0

            :

            Math.round(
                completed /
                total *
                100
            );


    document
        .getElementById("totalCount")
        .textContent =
        total;


    document
        .getElementById("completedCount")
        .textContent =
        completed;


    document
        .getElementById("pendingCount")
        .textContent =
        pending;


    document
        .getElementById("progress")
        .style.width =
        percentage + "%";


    document
        .getElementById("progressText")
        .textContent =
        percentage + "%";
}


/* =========================
   CLEAR COMPLETED
========================= */

function clearCompleted() {

    tasks =
        tasks.filter(
            task =>
                !task.completed
        );

    saveTasks();

    renderTasks();
}


/* =========================
   LOCAL STORAGE
========================= */

function saveTasks() {

    localStorage.setItem(
        "aestheticTasks",
        JSON.stringify(tasks)
    );
}


/* =========================
   DARK MODE
========================= */

function toggleTheme() {

    document
        .body
        .classList
        .toggle("dark");


    const dark =
        document
            .body
            .classList
            .contains("dark");


    document
        .getElementById("themeBtn")
        .textContent =
        dark
            ? "☀"
            : "☾";


    localStorage.setItem(
        "aestheticTheme",

        dark
            ? "dark"
            : "light"
    );
}


/* =========================
   LOAD THEME
========================= */

if (

    localStorage.getItem(
        "aestheticTheme"
    ) === "dark"

) {

    document
        .body
        .classList
        .add("dark");


    document
        .getElementById("themeBtn")
        .textContent =
        "☀";
}


/* =========================
   TODAY'S DATE
========================= */

const today =
    new Date();


document
    .getElementById("todayDate")
    .textContent =

    today.toLocaleDateString(

        "en-US",

        {
            weekday: "short",
            month: "short",
            day: "numeric"
        }

    );


/* =========================
   SECURITY
========================= */

function escapeHTML(text) {

    const div =
        document.createElement("div");


    div.textContent = text;


    return div.innerHTML;
}


/* =========================
   ENTER KEY
========================= */

document
    .getElementById("taskInput")
    .addEventListener(

        "keypress",

        function(event) {

            if (
                event.key === "Enter"
            ) {

                addTask();

            }

        }

    );


/* =========================
   INITIAL LOAD
========================= */

renderTasks();