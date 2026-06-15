import arrayStyling from "../../scripts/dictionary_regexes.js";

const xmlhttp = new XMLHttpRequest();
let url = "";

//url = "../../crum/scripts/crum_entries.json";
url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRi58_OjFmoocU2cuHIV_4Vg0usWmEO_Gsz3cWfGGY2wnJo17y_88XV1aDBtClyoA/pub?gid=29611264&single=true&output=tsv";

xmlhttp.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
		//const fetchFromJSON = JSON.parse(this.responseText);
		const fetchFromJSON = this.responseText.trim().split('\n').map(line => line.trim()).filter(Boolean).slice(1).map(line => {
				return { headword: line.split('\t')[7 /* column index */] };
			});
		console.log(fetchFromJSON);
		const appliedRegexes = applyRegexesDictionary(fetchFromJSON);
		const convertedEntries = appliedRegexes;
		const addToDictionary = document.querySelector("#dictionary ul");
		addToDictionary.innerHTML += convertedEntries;
	}
	const entries = document.querySelectorAll(".entry");
	entries.forEach(x => {
		x.classList.toggle("collapse");
		x.querySelector(".togglable").addEventListener("click", function (e) {
			x.classList.toggle("collapse");
		});
	});
};
xmlhttp.open("GET", url);
xmlhttp.send();

function applyRegexesDictionary(x) {
	let processedText = "";
	for (let i = 0; i < x.length; i++) {
		let headword = x[i].headword;
		for (let key in arrayStyling) {
			let regexStyling = new RegExp(arrayStyling[key][0], "msgu");
			if (!headword) {
				 continue;
			}
			headword = headword.replace(regexStyling, arrayStyling[key][1]);
			//headword = headword.replace(/\\\\/, "");
		}
		if (headword) {
			processedText += '<li class="entry"><div class="togglable"></div><div class="definition"><p>' + headword + '</p></div></li>\n';
		}
	}
	let y = processedText;
	return y;
}

const container = document.querySelector("#container");
const menu = document.querySelector("#menu");
const tabMenu = document.querySelector("#menu ul");
const activeTab = document.querySelector("#menu > ul > li:nth-child(1) a");
const inactiveTabs = document.querySelectorAll("#menu ul li ul li a");
const allTabs = document.querySelectorAll("#menu a");
const tabContents = [
	document.querySelector("#preface"),
	document.querySelector("#list_of_abbreviations"),
	document.querySelector("#additions_and_corrections"),
	document.querySelector("#dictionary"),
	document.querySelector("#english_index"),
	document.querySelector("#greek_index"),
	document.querySelector("#arabic_index")
];

checkUrl();

activeTab.addEventListener("click", e => {
	e.preventDefault();
});

inactiveTabs.forEach((x, i) => {
	x.addEventListener("click", e => {
		e.preventDefault();
		window.history.pushState({}, "", x.href);
		checkUrl(e.target);
		container.scrollTo({
			top: 0
		});
	});
});

function checkUrl(linkToSwap) {
	for (let i = 0; i < inactiveTabs.length; i++) {
		inactiveTabs[i].parentElement.classList.remove("hide");
		tabContents[i].classList.remove("show");
	}
	let swap = (linkToSwap || inactiveTabs[0]);
	let abc = {};
	abc.incomingLink = swap.href;
	abc.incomingTitle = swap.innerHTML;
	if (activeTab.href != abc.incomingLink) {
		activeTab.href = abc.incomingLink;
		activeTab.innerHTML = abc.incomingTitle;
		swap.parentElement.classList.add("hide");
	}
	else {
		inactiveTabs[0].parentElement.classList.add("hide");
	}
	
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	const section = urlParams.get("section");
	console.log(section);
	switch (section) {
		case "preface":
			tabContents[0].classList.add("show");
		break;
		case "list_of_abbreviations":
			tabContents[1].classList.add("show");
		break;
		case "additions_and_corrections":
			tabContents[2].classList.add("show");
		break;
		case "dictionary":
			tabContents[3].classList.add("show");
		break;
		case "english_index":
			tabContents[4].classList.add("show");
		break;
		case "greek_index":
			tabContents[5].classList.add("show");
		break;
		case "arabic_index":
			tabContents[6].classList.add("show");
		break;
		default:
			tabContents[0].classList.add("show");
	}
}

const entries = document.querySelectorAll(".entry");

/*
entries.forEach(x => {
	const styles = window.getComputedStyle(x);
	const height = styles.height;
	x.style.background = "green";
	console.log(x.style.height);
	x.addEventListener("click", function (e) {
		x.classList.toggle("collapse");
	});
});
*/
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
	let cellContent = y.innerHTML;
	for (let key in arrayStyling) {
		let regexStyling = new RegExp(arrayStyling[key][0], "msgu");
		cellContent = cellContent.replace(regexStyling, arrayStyling[key][1]);
	}
	return cellContent;
}
*/
