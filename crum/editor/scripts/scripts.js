import arrayStyling from "../../../scripts/dictionary_regexes.js";
let editorText = document.querySelector("#editor_text");
let previewBase = document.querySelector("#rendered_view");
let previewRendered = document.querySelector("#rendered_view p");
editorText.oninput = () => previewBase.scrollTo({
	top: editorText.scrollHeight,
	behavior: "smooth"
});
const scrollToBottom = (previewRendered);
applyRegexes(editorText);
editorText.addEventListener("input", applyRegexes);
editorText.addEventListener("keydown", function(e) {
	if (e.keyCode === 9) { // tab key
		e.preventDefault();  // this will prevent us from tabbing out of the editor
		// now insert four non-breaking spaces for the tab key
		var editor = document.getElementById("editor_text");
		var doc = editor.ownerDocument.defaultView;
		var sel = doc.getSelection();
		var range = sel.getRangeAt(0);

		var tabNode = document.createTextNode("	");
		range.insertNode(tabNode);

		range.setStartAfter(tabNode);
		range.setEndAfter(tabNode); 
		sel.removeAllRanges();
		sel.addRange(range);
	}
});
function applyRegexes(x) {
	let processedText = (x.innerHTML||this.innerHTML);
	//let processedText = editorText.innerHTML;
	for (let key in arrayStyling) {
		let regexStyling = new RegExp(arrayStyling[key][0], "msgu");
		processedText = processedText.replace(regexStyling, arrayStyling[key][1]);
	}
	previewRendered.innerHTML = processedText;
}