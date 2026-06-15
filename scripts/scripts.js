import arrayStyling from "./dictionary_regexes.js";

const xmlhttp = new XMLHttpRequest();
let url = "";

url = "../crum/scripts/crum_entries.json";
xmlhttp.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
		const fetchFromJSON = JSON.parse(this.responseText);
		const appliedRegexes = applyRegexesDictionary(fetchFromJSON);
		const convertedEntries = appliedRegexes;
		const addAsSample = document.querySelector("#crum_sample p");
		addAsSample.innerHTML = convertedEntries;
		addAsSample.classList.toggle("loaded");
	}
};
xmlhttp.open("GET", url);
xmlhttp.send();

function applyRegexesDictionary(x) {
	let processedText = "";
	let randomLemma = 593;
	//let randomLemma = Math.floor(Math.random() * x.length);

		let headword = x[randomLemma].headword;
		for (let key in arrayStyling) {
			let regexStyling = new RegExp(arrayStyling[key][0], "msgu");
			headword = headword.replace(regexStyling, arrayStyling[key][1]);
		}
		processedText = headword;

	let y = processedText;
	return y;
}
