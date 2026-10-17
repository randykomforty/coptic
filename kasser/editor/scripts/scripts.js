// A live preview of the Kasser transcription syntax. Each line of the editor
// holds one entry, as it would be typed in the Entry column of the sheet.
import render from "../../scripts/render.js";

const editorText = document.querySelector("#editor_text");
const renderedView = document.querySelector("#rendered_view");

function preview() {
	renderedView.innerHTML = editorText.innerText
		.split("\n")
		.filter(line => line.trim())
		.map(line => `<div class="entry">${render(line)}</div>`)
		.join("\n");
}

preview();
editorText.addEventListener("input", preview);
