// Renders the entries of one of Kasser's books from the Kasser sheet into
// #dictionary. Each book has a tab of its own in the sheet, and the table names
// its tab in a `data-gid` attribute.
import render from "./render.js";

const dictionary = document.querySelector("#dictionary");
const url = `https://docs.google.com/spreadsheets/d/1sGTjLGFtehosDszPNPur_isYfIDo-jRoAfKax9mJJbU/export?format=tsv&gid=${dictionary.dataset.gid}`;

function parse(tsv) {
	const [header, ...lines] = tsv.split(/\r?\n/).map(line => line.split("\t"));
	const column = name => {
		const i = header.indexOf(name);
		if (i < 0) {
			throw new Error(`The Kasser sheet has no ${name} column.`);
		}
		return i;
	};
	const kasser = column("Kasser");
	const vide = column("_v_");
	const entry = column("Entry");
	return lines
		.filter(cells => cells[entry])
		.map(cells => ({ kasser: cells[kasser], vide: !!cells[vide], entry: cells[entry] }));
}

function rows(entries) {
	// Like the printed page, name a column only where it begins.
	return entries.map((e, i) => {
		const kasser = i > 0 && entries[i - 1].kasser === e.kasser ? "" : e.kasser;
		const klass = e.vide ? ' class="vide"' : "";
		return `<tr${klass}><td>${kasser}</td><td>${render(e.entry)}</td></tr>`;
	}).join("\n");
}

fetch(url)
	.then(response => {
		if (!response.ok) {
			throw new Error(`Fetching the Kasser sheet failed: ${response.status}`);
		}
		return response.text();
	})
	.then(tsv => {
		const entries = parse(tsv);
		if (entries.length) {
			dictionary.innerHTML = rows(entries);
		}
	})
	// The hand-written rows stay in place as a fallback.
	.catch(error => console.error(error));
