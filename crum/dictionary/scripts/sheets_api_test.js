//import { apiKey } from "../../../secrets.js";
import arrayStyling from "../../../scripts/dictionary_regexes.js";

const spreadsheetId = '1G9yatQe8I-FTeAKXm66f7-1X2GNDu84VPo5J0hh25gc';
//const spreadsheetId = '2PACX-1vS9eqfhUiqnzmm4DakfUSkkkwKfow7rWWFUWgnKPf-84II_HIZ2h15y7ybo9cflrtJ2aLBAIDO5zLGr';
//const apiKey1 = apiKey;
const apiKey = "";
const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/dictionary?key=${apiKey}`;

let fullViewToRender = document.querySelector("#full-view");
let collectedEntries = [];

function applyRegexes(x) {
	let processedText = x;
	for (let key in arrayStyling) {
		let regexStyling = new RegExp(arrayStyling[key][0], "msgu");
		processedText = processedText.replace(regexStyling, arrayStyling[key][1]);
	}
	return processedText;
}

async function fetchGoogleSheetData() {
	try {
		
		// Fetch data from Google Sheets API
		const response = await fetch(url);
		const data = await response.json();
		
		const rows = data.values;
		console.log(rows);
		
		const fullView = document.querySelector('#full-view');

		for (let i = 1; i < rows.length; i++) {
			
			collectedEntries.push(rows[i][7]);
		}
		
		for (let i = 1; i < collectedEntries.length; i++) {
			const cellElement = document.createElement('p');
			let unregexedText = collectedEntries[i];
			if (!unregexedText) {
				continue;
			}
			let regexedText = applyRegexes(unregexedText);
			cellElement.innerHTML = regexedText;
			fullView.appendChild(cellElement);
			}
	}
	catch (error) {
		console.error('Error fetching Google Sheets data:', error);
	}
}

document.addEventListener('DOMContentLoaded', fetchGoogleSheetData);





