//Two pieces of input are used to create a component in the page when a button is clicked 
//Input Process Output Pattern

const noteCreator = document.querySelector(".note-creator");
const titleInput = document.getElementById("title");
const noteInput = document.getElementById("note");
const closeButton = document.getElementById("close-note");
const paletteToggle = document.getElementById("palette-toggle");
const colorPopover = document.getElementById("color-popover");
const colorInput = document.getElementById("background-color");
let hasCustomColor = false;
const themeToggle = document.getElementById("theme-toggle");
const themeIcon = themeToggle.querySelector(".material-symbols-outlined");

function expandCreator() {
    noteCreator.classList.add("expanded");
    noteCreator.classList.remove("collapsed");
}

function collapseCreator() {
    noteCreator.classList.add("collapsed");
    noteCreator.classList.remove("expanded");
    colorPopover.classList.remove("open");
    colorPopover.setAttribute("aria-hidden", "true");
}

noteCreator.addEventListener("click", expandCreator);
noteCreator.addEventListener("focusin", expandCreator);

function readInput() {
    let title = titleInput.value;
    let note = noteInput.value;

    return [title, note];
}


function createNote(title, note) {
    let container = document.createElement('div');
    let titleElement = document.createElement('h2');
    let noteElement = document.createElement('p');
    let deleteButton = document.createElement('button');

    titleElement.textContent = title;
    noteElement.textContent = note;
    deleteButton.textContent = "Delete";
    deleteButton.className = "note-delete";
    deleteButton.addEventListener("click", () => {
        container.remove();
    });

    if (hasCustomColor && colorInput.value) {
        container.style.backgroundColor = colorInput.value;
        container.style.color = getReadableTextColor(colorInput.value);
    }

    container.appendChild(titleElement);
    container.appendChild(noteElement);
    container.appendChild(deleteButton);
    container.className = "note";
    return container;
}

// some how gets adjust the text using calculations based on the background color.
function getReadableTextColor(hexColor) {
    let hex = hexColor.replace("#", "");
    if (hex.length === 3) {
        hex = hex.split("").map((c) => c + c).join("");
    }
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    const toLinear = (c) => {
        const s = c / 255;
        return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    };
    const R = toLinear(r);
    const G = toLinear(g);
    const B = toLinear(b);
    const luminance = 0.2126 * R + 0.7152 * G + 0.0722 * B;
    const contrastWithWhite = (1.05) / (luminance + 0.05);
    const contrastWithBlack = (luminance + 0.05) / 0.05;
    return contrastWithBlack >= contrastWithWhite ? "#1c1c1c" : "#f7f7f7";
}

function syncCreatorTextColor() {
    const bg = colorInput.value;
    if (hasCustomColor && bg) {
        const textColor = getReadableTextColor(bg);
        noteCreator.style.color = textColor;
        titleInput.style.color = textColor;
        noteInput.style.color = textColor;
    } else {
        noteCreator.style.color = "";
        titleInput.style.color = "";
        noteInput.style.color = "";
    }
}
    

function displayNote() {
    let [title, note] = readInput();
    let container = createNote(title, note);

    let noteList = document.getElementById("note-list");
    noteList.appendChild(container);

}

function finalizeAndCollapse() {
    let [title, note] = readInput();
    if (title.trim() || note.trim()) {
        displayNote();
    }
    titleInput.value = "";
    noteInput.value = "";
    collapseCreator();
}

closeButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    finalizeAndCollapse();
});

paletteToggle.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    expandCreator();
    colorPopover.classList.toggle("open");
    const isOpen = colorPopover.classList.contains("open");
    colorPopover.setAttribute("aria-hidden", isOpen ? "false" : "true");
});

colorInput.addEventListener("input", () => {
    hasCustomColor = true;
    noteCreator.style.backgroundColor = colorInput.value;
    syncCreatorTextColor();
});

titleInput.addEventListener("input", syncCreatorTextColor);
noteInput.addEventListener("input", syncCreatorTextColor);

document.addEventListener("click", (event) => {
    if (colorPopover.classList.contains("open") && !colorPopover.contains(event.target) && event.target !== paletteToggle) {
        colorPopover.classList.remove("open");
        colorPopover.setAttribute("aria-hidden", "true");
        return;
    }
    if (!noteCreator.contains(event.target) && !noteCreator.classList.contains("collapsed")) {
        finalizeAndCollapse();
    }
});

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    themeIcon.textContent = isDark ? "light_mode" : "dark_mode";
    themeToggle.setAttribute("aria-label", isDark ? "Toggle light mode" : "Toggle dark mode");
});
