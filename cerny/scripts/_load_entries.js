const xmlhttp = new XMLHttpRequest();
const url = "./scripts/crum_entries.json";

xmlhttp.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
		const fetchFromJSON = JSON.parse(this.responseText);
		const appliedRegexes = applyRegexes(fetchFromJSON);
		const convertedEntries = countReplacements(appliedRegexes);
		const addToDictionary = document.querySelector("#dictionary ul");
		addToDictionary.innerHTML += convertedEntries;
		//console.log(addToDictionary.outerHTML);
	}
	const dict_entries = document.querySelectorAll("#dictionary > ul > li.entry > ul > li:first-child");
	dict_entries.forEach(dict_entry => {
		dict_entry.addEventListener("click", function (e) {
			dict_entry.classList.toggle("collapse");
		});
	});
};
xmlhttp.open("GET", url, true);
xmlhttp.send();

const indent = [/\t/, "<span class=\"indent-space\"> </span>"];
const bold = [/\*\[(.*?)\]/, "<b>$1<\/b>"];
const italic = [/\_\[(.*?)\]/, "<i>$1<\/i>"];
const superscript = [/\^(\d)/, "<sup>$1<\/sup>"];
const qualitative = [/\^\+/, "<sup>†<\/sup>"];
const dialect = [/\_d\[(.)\]/, "<i class=\"dialect\">$1<\/i>"];
const subdialect = [/\_d\[(.)([a-zA-Z])\]/, "<i class=\"dialect\">$1<sup>$2<\/sup><\/i>"];
const subdialectLyco = [/\_d\[(.)([0-9])\]/, "<i class=\"dialect lycopolitan\">$1<sup>$2<\/sup><\/i>"];
const headword = [/\~co1\[(.*?)\]/, "<span class=\"headword coptic\">$1<\/span>"];
const coptic = [/\~co\[(.*?)\]/, "<span class=\"coptic\">$1<\/span>"];
const greek = [/\~gr\[(.*?)\]/, "<span class=\"greek\">$1<\/span>"];
const arabic = [/\~ab\[(.*?)\]/, "<span class=\"arabic\">$1<\/span>"];
const hebrew = [/\~he\[(.*?)\]/, "<span class=\"hebrew\">$1<\/span>"];
const aramaic = [/\~am\[(.*?)\]/, "<span class=\"aramaic\">$1<\/span>"];
const arrayStyling = [bold, italic, superscript, qualitative, dialect, subdialect, subdialectLyco, headword, coptic, greek, arabic, hebrew, aramaic];
const liOpen = [/{-(?!-)/, "<li>"];
const liOpenSubsection = [/{s-/, "<li class=\"subsection\">"];
const liOpenGroup = [/{g-/, "<li class=\"group\">"];
const liClose = [/(?<!-)-}/, "</li>"];
const ulOpen = [/({--)/, "<ul>"];
const ulClose = [/(--})/, "</ul>"];
const arrayListing = [liOpen, liOpenSubsection, liOpenGroup, liClose, ulOpen, ulClose];

function applyRegexes(x) {
	let processedText = "";
	for (let i = 0; i < x.length; i++) {
		processedText += '<li class="entry">';
		processedText += '<ul>';
		processedText += '<li>' + x[i].headword + '</li>\n';
		processedText += '<li>' + x[i].expanded + '</li>\n';
		processedText += '</ul>';
		processedText += '</li>';
	}
	let y = processedText;
	for (let i = 0; i < arrayStyling.length; i++) {
		let regexStyling = new RegExp(arrayStyling[i][0], "msgu");
		y = y.replace(regexStyling, arrayStyling[i][1]);
	}
	return y;
}

function countReplacements(z) {
	for (let i = 0; i < arrayListing.length; i++) {
	let regexListing = new RegExp(arrayListing[i][0], "msgu");
		z = z.replace(regexListing, arrayListing[i][1]);
	}
	return z;
}
