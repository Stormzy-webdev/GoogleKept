//Two pieces of input are used to create a component in the page when a button is clicked 
//Input Process Output Pattern

const noteCreator = document.querySelector(".note-creator");
const titleInput = document.getElementById("title");
const noteInput = document.getElementById("note");
const closeButton = document.getElementById("close-note");
const paletteToggle = document.getElementById("palette-toggle");
const colorPopover = document.getElementById("color-popover");

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

    titleElement.textContent = title;
    noteElement.textContent = note;

    container.appendChild(titleElement);
    container.appendChild(noteElement);
    container.className = "note";
    return container;
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
