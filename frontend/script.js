// =====================================================
// STUDYBUDDY - COMPLETE SCRIPT.JS
// =====================================================


// =====================================================
// PAGE NAVIGATION
// =====================================================

function showPage(pageId, button) {
    const pages = document.querySelectorAll(".page");

    pages.forEach(page => {
        page.classList.remove("active");
    });

    const selectedPage = document.getElementById(pageId);

    if (selectedPage) {
        selectedPage.classList.add("active");
    }

    const navItems = document.querySelectorAll(".nav-item");

    navItems.forEach(item => {
        item.classList.remove("active");
    });

    if (button) {
        button.classList.add("active");
    }
}


// =====================================================
// TASKS
// =====================================================

let studyTasks = JSON.parse(
    localStorage.getItem("studyTasks")
) || [];


function saveTasks() {
    localStorage.setItem(
        "studyTasks",
        JSON.stringify(studyTasks)
    );
}


function addTask() {

    const input = document.getElementById("taskInput");

    if (!input) return;

    const text = input.value.trim();

    if (!text) {
        showToast("Please enter a task.");
        return;
    }

    studyTasks.push({
        id: Date.now(),
        text: text,
        completed: false,
        createdAt: new Date().toISOString()
    });

    saveTasks();

    input.value = "";

    renderTasks();
    updateUI();

    showToast("Task added successfully!");
}


function toggleTask(id) {

    const task = studyTasks.find(
        task => task.id === id
    );

    if (!task) return;

    task.completed = !task.completed;

    saveTasks();

    renderTasks();
    updateUI();
}


function deleteTask(id) {

    studyTasks = studyTasks.filter(
        task => task.id !== id
    );

    saveTasks();

    renderTasks();
    updateUI();

    showToast("Task deleted.");
}


function renderTasks() {

    const taskList = document.getElementById("taskList");
    const dashboardTasks =
        document.getElementById("dashboardTasks");

    if (taskList) {

        if (studyTasks.length === 0) {

            taskList.innerHTML = `
                <div class="empty-state">
                    No tasks yet. Add your first task!
                </div>
            `;

        } else {

            taskList.innerHTML = studyTasks
                .map(task => `
                    <div class="task-item ${task.completed ? "completed" : ""}">

                        <label class="task-check">

                            <input
                                type="checkbox"
                                ${task.completed ? "checked" : ""}
                                onchange="toggleTask(${task.id})"
                            >

                            <span></span>

                        </label>

                        <div class="task-text">
                            ${escapeHTML(task.text)}
                        </div>

                        <button
                            class="delete-btn"
                            onclick="deleteTask(${task.id})"
                        >
                            🗑️
                        </button>

                    </div>
                `)
                .join("");
        }
    }


    if (dashboardTasks) {

        const recentTasks = studyTasks.slice(-5).reverse();

        if (recentTasks.length === 0) {

            dashboardTasks.innerHTML = `
                <div class="empty-state">
                    No tasks for today.
                </div>
            `;

        } else {

            dashboardTasks.innerHTML = recentTasks
                .map(task => `
                    <div class="task-item ${task.completed ? "completed" : ""}">

                        <label class="task-check">

                            <input
                                type="checkbox"
                                ${task.completed ? "checked" : ""}
                                onchange="toggleTask(${task.id})"
                            >

                            <span></span>

                        </label>

                        <div class="task-text">
                            ${escapeHTML(task.text)}
                        </div>

                    </div>
                `)
                .join("");
        }
    }
}


// =====================================================
// NOTES
// =====================================================

let studyNotes = JSON.parse(
    localStorage.getItem("studyNotes")
) || [];


function saveNotes() {
    localStorage.setItem(
        "studyNotes",
        JSON.stringify(studyNotes)
    );
}


function addNote() {

    const titleInput =
        document.getElementById("noteTitle");

    const contentInput =
        document.getElementById("noteContent");

    if (!titleInput || !contentInput) return;

    const title = titleInput.value.trim();
    const content = contentInput.value.trim();

    if (!title || !content) {
        showToast("Please enter a title and note.");
        return;
    }

    studyNotes.push({
        id: Date.now(),
        title: title,
        content: content,
        createdAt: new Date().toISOString()
    });

    saveNotes();

    titleInput.value = "";
    contentInput.value = "";

    renderNotes();
    updateUI();

    showToast("Note saved!");
}


function deleteNote(id) {

    studyNotes = studyNotes.filter(
        note => note.id !== id
    );

    saveNotes();

    renderNotes();
    updateUI();

    showToast("Note deleted.");
}


function renderNotes() {

    const noteGrid =
        document.getElementById("noteGrid");

    if (!noteGrid) return;

    if (studyNotes.length === 0) {

        noteGrid.innerHTML = `
            <div class="empty-state">
                No notes yet. Create your first note!
            </div>
        `;

        return;
    }

    noteGrid.innerHTML = studyNotes
        .map(note => `
            <div class="note-card">

                <div class="note-header">

                    <h3>
                        ${escapeHTML(note.title)}
                    </h3>

                    <button
                        class="delete-btn"
                        onclick="deleteNote(${note.id})"
                    >
                        🗑️
                    </button>

                </div>

                <p>
                    ${escapeHTML(note.content)}
                </p>

            </div>
        `)
        .join("");
}


// =====================================================
// FOCUS TIMER
// =====================================================

let timerSeconds = 25 * 60;

let timerInterval = null;

let timerRunning = false;

let totalFocusMinutes =
    Number(localStorage.getItem("totalFocusMinutes")) || 0;


function updateTimerDisplay() {

    const minutes =
        Math.floor(timerSeconds / 60);

    const seconds =
        timerSeconds % 60;

    const display =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;


    const display1 =
        document.getElementById("timerDisplay");

    const display2 =
        document.getElementById("timerDisplay2");


    if (display1) {
        display1.textContent = display;
    }

    if (display2) {
        display2.textContent = display;
    }
}


function startTimer() {

    if (timerRunning) return;

    timerRunning = true;

    timerInterval = setInterval(() => {

        if (timerSeconds > 0) {

            timerSeconds--;

            updateTimerDisplay();

        } else {

            clearInterval(timerInterval);

            timerRunning = false;

            totalFocusMinutes += 25;

            localStorage.setItem(
                "totalFocusMinutes",
                totalFocusMinutes
            );

            updateUI();

            showToast("🎉 Focus session completed!");

        }

    }, 1000);
}


function pauseTimer() {

    if (timerInterval) {
        clearInterval(timerInterval);
    }

    timerRunning = false;
}


function resetTimer() {

    if (timerInterval) {
        clearInterval(timerInterval);
    }

    timerRunning = false;

    timerSeconds = 25 * 60;

    updateTimerDisplay();
}


// =====================================================
// STUDY PLANNER
// =====================================================

let studyPlans = JSON.parse(
    localStorage.getItem("studyPlans")
) || [];


function saveStudyPlans() {

    localStorage.setItem(
        "studyPlans",
        JSON.stringify(studyPlans)
    );
}


function addStudyPlan() {

    const subjectInput =
        document.getElementById("planSubject");

    const timeInput =
        document.getElementById("planTime");

    const durationInput =
        document.getElementById("planDuration");

    const dayInput =
        document.getElementById("planDay");

    const priorityInput =
        document.getElementById("planPriority");


    if (
        !subjectInput ||
        !timeInput ||
        !durationInput ||
        !dayInput ||
        !priorityInput
    ) {
        return;
    }


    const subject =
        subjectInput.value.trim();

    const time =
        timeInput.value;

    const duration =
        Number(durationInput.value);

    const day =
        Number(dayInput.value);

    const priority =
        priorityInput.value;


    if (!subject) {

        showToast("Please enter a subject.");

        return;
    }


    studyPlans.push({
        id: Date.now(),
        subject: subject,
        time: time,
        duration: duration,
        day: day,
        priority: priority
    });


    saveStudyPlans();

    subjectInput.value = "";

    renderStudyPlanner();

    showToast("Study session added!");
}


function deleteStudyPlan(id) {

    studyPlans = studyPlans.filter(
        plan => plan.id !== id
    );

    saveStudyPlans();

    renderStudyPlanner();

    showToast("Study session deleted.");
}


function getWeekDates() {

    const today = new Date();

    const day = today.getDay();

    const mondayOffset =
        day === 0 ? -6 : 1 - day;

    const monday = new Date(today);

    monday.setDate(
        today.getDate() + mondayOffset
    );

    monday.setHours(0, 0, 0, 0);

    const dates = [];

    for (let i = 0; i < 7; i++) {

        const date = new Date(monday);

        date.setDate(
            monday.getDate() + i
        );

        dates.push(date);
    }

    return dates;
}


function formatTime(time) {

    if (!time) return "";

    const [hours, minutes] =
        time.split(":");

    let hour =
        parseInt(hours, 10);

    const suffix =
        hour >= 12 ? "PM" : "AM";

    hour =
        hour % 12 || 12;

    return `${hour}:${minutes} ${suffix}`;
}


function renderStudyPlanner() {

    const weekGrid =
        document.getElementById("weekGrid");

    if (!weekGrid) return;


    const weekDates =
        getWeekDates();


    const dayNames = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
    ];


    weekGrid.innerHTML =
        weekDates.map((date, index) => {

            const dayNumber =
                date.getDay();

            const plans =
                studyPlans.filter(
                    plan => plan.day === dayNumber
                );


            return `
                <div
                    class="week-day"
                    onclick="selectPlannerDay(${dayNumber})"
                >

                    <div class="week-day-header">

                        <strong>
                            ${dayNames[index]}
                        </strong>

                        <span>
                            ${date.getDate()}
                        </span>

                    </div>

                    <div class="week-day-sessions">

                        ${
                            plans.length === 0

                            ? `
                                <small>
                                    No sessions
                                </small>
                              `

                            : plans.map(plan => `
                                <div class="plan-item">

                                    <strong>
                                        ${escapeHTML(plan.subject)}
                                    </strong>

                                    <span>
                                        ${formatTime(plan.time)}
                                        ·
                                        ${plan.duration} min
                                    </span>

                                    <small>
                                        ${escapeHTML(plan.priority)}
                                    </small>

                                    <button
                                        class="delete-btn"
                                        onclick="event.stopPropagation(); deleteStudyPlan(${plan.id})"
                                    >
                                        🗑️
                                    </button>

                                </div>
                            `).join("")
                        }

                    </div>

                </div>
            `;

        }).join("");


    const count =
        studyPlans.length;

    const minutes =
        studyPlans.reduce(
            (total, plan) =>
                total + Number(plan.duration || 0),
            0
        );

    const highPriority =
        studyPlans.filter(
            plan => plan.priority === "High"
        ).length;

    const subjects =
        new Set(
            studyPlans.map(
                plan => plan.subject.toLowerCase()
            )
        ).size;


    const sessionCount =
        document.getElementById("planSessionCount");

    const minutesElement =
        document.getElementById("planMinutes");

    const highElement =
        document.getElementById("planHigh");

    const subjectsElement =
        document.getElementById("planSubjects");


    if (sessionCount) {
        sessionCount.textContent = count;
    }

    if (minutesElement) {
        minutesElement.textContent =
            `${minutes} min`;
    }

    if (highElement) {
        highElement.textContent =
            highPriority;
    }

    if (subjectsElement) {
        subjectsElement.textContent =
            subjects;
    }
}


function selectPlannerDay(day) {

    const dayInput =
        document.getElementById("planDay");

    if (dayInput) {
        dayInput.value = String(day);
    }
}


// =====================================================
// CALENDAR
// =====================================================

function createCalendar() {

    const calendar =
        document.getElementById("calendar");

    if (!calendar) return;


    const monthName =
        document.getElementById("monthName");


    const today =
        new Date();

    const year =
        today.getFullYear();

    const month =
        today.getMonth();


    if (monthName) {

        monthName.textContent =
            today.toLocaleString(
                "default",
                {
                    month: "long",
                    year: "numeric"
                }
            );
    }


    const firstDay =
        new Date(
            year,
            month,
            1
        ).getDay();


    const daysInMonth =
        new Date(
            year,
            month + 1,
            0
        ).getDate();


    let html = `
        <div class="calendar-header">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
        </div>

        <div class="calendar-grid">
    `;


    for (let i = 0; i < firstDay; i++) {

        html += `
            <div class="calendar-day empty"></div>
        `;
    }


    for (let day = 1; day <= daysInMonth; day++) {

        const isToday =
            day === today.getDate();


        html += `
            <div
                class="calendar-day ${isToday ? "today" : ""}"
                onclick="selectPlannerDay(new Date(${year}, ${month}, ${day}).getDay())"
            >
                ${day}
            </div>
        `;
    }


    html += `
        </div>
    `;


    calendar.innerHTML = html;
}


// =====================================================
// PROGRESS
// =====================================================

function updateProgress() {

    const completedTasks =
        studyTasks.filter(
            task => task.completed
        ).length;


    const totalTasks =
        studyTasks.length;


    const percentage =
        totalTasks === 0
            ? 0
            : Math.round(
                (completedTasks / totalTasks) * 100
            );


    const progressPercent =
        document.getElementById(
            "progressPercent"
        );

    const progressPercent2 =
        document.getElementById(
            "progressPercent2"
        );

    const mainProgress =
        document.getElementById(
            "mainProgress"
        );

    const goalText =
        document.getElementById(
            "goalText"
        );


    if (progressPercent) {
        progressPercent.textContent =
            `${percentage}%`;
    }

    if (progressPercent2) {
        progressPercent2.textContent =
            `${percentage}%`;
    }

    if (mainProgress) {
        mainProgress.style.width =
            `${percentage}%`;
    }

    if (goalText) {
        goalText.textContent =
            `${completedTasks} / ${totalTasks} tasks`;
    }


    const progressTasks =
        document.getElementById(
            "progressTasks"
        );

    const progressTime =
        document.getElementById(
            "progressTime"
        );

    const progressNotes =
        document.getElementById(
            "progressNotes"
        );


    if (progressTasks) {
        progressTasks.textContent =
            completedTasks;
    }

    if (progressTime) {
        progressTime.textContent =
            `${totalFocusMinutes}m`;
    }

    if (progressNotes) {
        progressNotes.textContent =
            studyNotes.length;
    }
}


function createWeeklyProgress() {

    const weeklyBars =
        document.getElementById(
            "weeklyBars"
        );

    if (!weeklyBars) return;


    const completed =
        studyTasks.filter(
            task => task.completed
        ).length;


    const values = [
        completed,
        completed,
        completed,
        completed,
        completed,
        completed,
        completed
    ];


    const max =
        Math.max(...values, 1);


    const days = [
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat",
        "Sun"
    ];


    weeklyBars.innerHTML =
        values.map(
            (value, index) => {

                const height =
                    Math.max(
                        10,
                        (value / max) * 100
                    );


                return `
                    <div class="bar-item">

                        <div
                            class="bar"
                            style="height: ${height}%"
                        >
                            <span>
                                ${value}
                            </span>
                        </div>

                        <small>
                            ${days[index]}
                        </small>

                    </div>
                `;
            }
        ).join("");
}


// =====================================================
// SETTINGS
// =====================================================

function toggleSetting(button) {

    if (!button) return;

    button.classList.toggle("active");

    showToast("Setting updated.");
}


function resetData() {

    const confirmed =
        confirm(
            "Are you sure you want to reset all your StudyBuddy data?"
        );


    if (!confirmed) return;


    localStorage.removeItem("studyTasks");
    localStorage.removeItem("studyNotes");
    localStorage.removeItem("studyPlans");
    localStorage.removeItem("totalFocusMinutes");


    studyTasks = [];
    studyNotes = [];
    studyPlans = [];
    totalFocusMinutes = 0;


    renderTasks();
    renderNotes();
    renderStudyPlanner();
    updateUI();


    showToast("All data has been reset.");
}


// =====================================================
// TOAST
// =====================================================

function showToast(message) {

    const toast =
        document.getElementById("toast");

    if (!toast) return;


    toast.textContent = message;

    toast.classList.add("show");


    setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);
}


// =====================================================
// AI ASSISTANT
// =====================================================

async function askAI() {

    const input =
        document.getElementById("aiQuestion");

    const box =
        document.getElementById("aiResponse");


    if (!input || !box) return;


    const question =
        input.value.trim();


    if (!question) {

        box.innerHTML =
            `<p>⚠️ Enter something first.</p>`;

        return;
    }


    // Show loading message

    box.innerHTML = `
        <p>🤖 Thinking...</p>
    `;


    try {

        const response =
            await fetch(
                "https://studybuddy-1-helv.onrender.com/api/ai",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        question: question
                    })
                }
            );


        if (!response.ok) {

            throw new Error(
                `Server error: ${response.status}`
            );
        }


        const data =
            await response.json();


        const answer =
            data.answer ||
            data.message ||
            data.response ||
            "No response received.";


        // IMPORTANT:
        // Format AI response instead of using
        // escapeHTML() directly.

        box.innerHTML =
            formatAIResponse(answer);


    } catch (error) {

        console.error(
            "AI Error:",
            error
        );


        box.innerHTML = `
            <p>
                ⚠️ Unable to connect to the AI server.
            </p>

            <p>
                Please try again in a few seconds.
            </p>
        `;
    }
}


// =====================================================
// AI RESPONSE FORMATTER
// =====================================================

function formatAIResponse(text) {

    if (!text) {
        return "<p>No response received.</p>";
    }


    // First escape HTML for security

    let safeText =
        escapeHTML(String(text));


    // Normalize line breaks

    safeText =
        safeText.replace(/\r\n/g, "\n");

    safeText =
        safeText.replace(/\r/g, "\n");


    // -------------------------------------------------
    // Code blocks
    // -------------------------------------------------

    const codeBlocks = [];

    safeText =
        safeText.replace(
            /```([\s\S]*?)```/g,
            function(match, code) {

                const placeholder =
                    `___CODEBLOCK_${codeBlocks.length}___`;

                codeBlocks.push(
                    `<pre><code>${code.trim()}</code></pre>`
                );

                return placeholder;
            }
        );


    // -------------------------------------------------
    // Headings
    // -------------------------------------------------

    safeText =
        safeText.replace(
            /^### (.+)$/gm,
            "<h3>$1</h3>"
        );

    safeText =
        safeText.replace(
            /^## (.+)$/gm,
            "<h2>$1</h2>"
        );

    safeText =
        safeText.replace(
            /^# (.+)$/gm,
            "<h1>$1</h1>"
        );


    // -------------------------------------------------
    // Bold
    // -------------------------------------------------

    safeText =
        safeText.replace(
            /\*\*(.*?)\*\*/g,
            "<strong>$1</strong>"
        );


    // -------------------------------------------------
    // Italic
    // -------------------------------------------------

    safeText =
        safeText.replace(
            /(?<!\*)\*([^*\n]+)\*(?!\*)/g,
            "<em>$1</em>"
        );


    // -------------------------------------------------
    // Inline code
    // -------------------------------------------------

    safeText =
        safeText.replace(
            /`([^`\n]+)`/g,
            "<code>$1</code>"
        );


    // -------------------------------------------------
    // Unordered lists
    // -------------------------------------------------

    safeText =
        safeText.replace(
            /^[\-\*] (.+)$/gm,
            "<li>$1</li>"
        );


    safeText =
        safeText.replace(
            /(<li>.*<\/li>(?:\n|$))+/g,
            function(match) {

                const items =
                    match
                        .replace(/\n/g, "")
                        .trim();

                return `<ul>${items}</ul>`;
            }
        );


    // -------------------------------------------------
    // Ordered lists
    // -------------------------------------------------

    safeText =
        safeText.replace(
            /^\d+\.\s+(.+)$/gm,
            "<li>$1</li>"
        );


    // -------------------------------------------------
    // Restore code blocks
    // -------------------------------------------------

    codeBlocks.forEach(
        (block, index) => {

            safeText =
                safeText.replace(
                    `___CODEBLOCK_${index}___`,
                    block
                );
        }
    );


    // -------------------------------------------------
    // Paragraph formatting
    // -------------------------------------------------

    const parts =
        safeText.split(/\n{2,}/);


    safeText =
        parts
            .map(part => {

                part = part.trim();

                if (!part) {
                    return "";
                }


                // Don't wrap block elements

                if (
                    part.startsWith("<h1>") ||
                    part.startsWith("<h2>") ||
                    part.startsWith("<h3>") ||
                    part.startsWith("<ul>") ||
                    part.startsWith("<pre>")
                ) {
                    return part;
                }


                return `<p>${part.replace(/\n/g, "<br>")}</p>`;
            })
            .join("");


    return safeText;
}


// =====================================================
// HTML ESCAPE
// =====================================================

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// =====================================================
// LOGIN
// =====================================================

function loginUser(event) {

    event.preventDefault();


    const emailInput =
        document.getElementById(
            "loginEmail"
        );

    const passwordInput =
        document.getElementById(
            "loginPassword"
        );

    const error =
        document.getElementById(
            "loginError"
        );


    if (!emailInput || !passwordInput) {
        return;
    }


    const email =
        emailInput.value.trim();

    const password =
        passwordInput.value.trim();


    if (!email || !password) {

        if (error) {
            error.textContent =
                "Please enter email and password.";
        }

        return;
    }


    // Demo login

    localStorage.setItem(
        "studyBuddyUser",
        email
    );


    if (error) {
        error.textContent = "";
    }


    applyLoggedInUser();


    showToast("Welcome to StudyBuddy! 🚀");
}


function applyLoggedInUser() {

    const email =
        localStorage.getItem(
            "studyBuddyUser"
        );


    if (!email) return;


    const loginScreen =
        document.getElementById(
            "loginScreen"
        );


    if (loginScreen) {
        loginScreen.style.display = "none";
    }


    const sidebarUser =
        document.getElementById(
            "sidebarUser"
        );


    if (sidebarUser) {

        const username =
            email.split("@")[0];

        sidebarUser.textContent =
            username;
    }


    const welcomeSpan =
        document.querySelector(
            ".welcome h1 span"
        );


    if (welcomeSpan) {

        const username =
            email.split("@")[0];

        welcomeSpan.textContent =
            `${username} 👋`;
    }
}


function logoutUser() {

    localStorage.removeItem(
        "studyBuddyUser"
    );


    const loginScreen =
        document.getElementById(
            "loginScreen"
        );


    if (loginScreen) {
        loginScreen.style.display = "flex";
    }


    showToast("Logged out successfully.");
}


function checkLogin() {

    const user =
        localStorage.getItem(
            "studyBuddyUser"
        );


    if (user) {
        applyLoggedInUser();
    }
}


// =====================================================
// UPDATE UI
// =====================================================

function updateUI() {

    const completedTasks =
        studyTasks.filter(
            task => task.completed
        ).length;


    const dashTasks =
        document.getElementById(
            "dashTasks"
        );

    const dashNotes =
        document.getElementById(
            "dashNotes"
        );

    const dashHours =
        document.getElementById(
            "dashHours"
        );


    if (dashTasks) {
        dashTasks.textContent =
            completedTasks;
    }


    if (dashNotes) {
        dashNotes.textContent =
            studyNotes.length;
    }


    if (dashHours) {

        const hours =
            totalFocusMinutes / 60;

        dashHours.textContent =
            `${hours.toFixed(1)}h`;
    }


    renderTasks();
    renderNotes();
    renderStudyPlanner();

    updateProgress();
    createWeeklyProgress();
}


// =====================================================
// INITIAL LOAD
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        updateUI();

        createCalendar();

        updateTimerDisplay();

        checkLogin();

    }
);


// =====================================================
// ENTER KEY FOR AI
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        const aiInput =
            document.getElementById(
                "aiQuestion"
            );


        if (aiInput) {

            aiInput.addEventListener(
                "keydown",
                function(event) {

                    if (
                        event.key === "Enter"
                    ) {

                        event.preventDefault();

                        askAI();
                    }

                }
            );
        }

    }
);