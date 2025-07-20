const courses = [
    { id: "mat1", name: "Matemáticas I", prereq: [] },
    { id: "bio1", name: "Biología General", prereq: [] },
    { id: "qui1", name: "Química General", prereq: [] },
    { id: "intro", name: "Intro Biotec", prereq: [] },
    { id: "mat2", name: "Matemáticas II", prereq: ["mat1"] },
    { id: "qui2", name: "Química Orgánica", prereq: ["qui1"] },
    { id: "fis1", name: "Física I", prereq: [] },
    { id: "proc1", name: "Intro Procesos", prereq: [] },
    { id: "mol", name: "Biología Molecular", prereq: ["bio1", "qui2"] },
    { id: "gen", name: "Ingeniería Genética", prereq: ["mol"] }
];

const states = ["pending", "in-progress", "completed"];
const stateLabels = { "pending": "⏳", "in-progress": "📘", "completed": "✅" };

function loadProgress() {
    return JSON.parse(localStorage.getItem("progress") || "{}");
}

function saveProgress(progress) {
    localStorage.setItem("progress", JSON.stringify(progress));
}

function resetProgress() {
    localStorage.removeItem("progress");
    location.reload();
}

function createCourseElement(course, progress) {
    const div = document.createElement("div");
    div.className = "course";
    div.id = course.id;
    div.innerText = `${course.name}`;
    const state = progress[course.id] || "pending";
    div.classList.add(state);
    div.innerText = `${stateLabels[state]} ${course.name}`;

    const updateState = () => {
        let currentState = progress[course.id] || "pending";
        let nextState = states[(states.indexOf(currentState) + 1) % states.length];
        progress[course.id] = nextState;
        saveProgress(progress);
        renderGrid();
    };

    div.onclick = () => {
        if (course.prereq.every(p => progress[p] === "completed")) {
            updateState();
        } else {
            alert("Primero debes completar los prerrequisitos.");
        }
    };

    return div;
}

function renderGrid() {
    const progress = loadProgress();
    const grid = document.getElementById("grid");
    grid.innerHTML = "";
    courses.forEach(course => {
        const el = createCourseElement(course, progress);
        grid.appendChild(el);
    });
}

document.addEventListener("DOMContentLoaded", renderGrid);
