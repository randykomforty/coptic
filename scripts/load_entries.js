import arrayStyling from "./dictionary_regexes.js";



/*
let addAndCorrectPage = document.querySelectorAll("#additions_and_corrections table tr td.page");
let addAndCorrectNote = document.querySelectorAll("#additions_and_corrections table tr td.note");
addAndCorrectPage.forEach(x => {
	x.innerHTML = applyRegexesAdditions(x);
});
addAndCorrectNote.forEach(x => {
	x.innerHTML = applyRegexesAdditions(x);
});

function applyRegexesAdditions(y) {
	let cellContent = [];
	cellContent[0] = y.innerHTML;
	for (let key in arrayStyling) {
		let regexStyling = new RegExp(arrayStyling[key][0], "msgu");
		cellContent[0] = cellContent[0].replace(regexStyling, arrayStyling[key][1]);
		cellContent[0] = cellContent[0].replace(/\\\\(\[|\]|\(|\))/mgs, "$1");
	}
	return cellContent[0];
}
*/