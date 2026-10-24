// Renders an entry in the Kasser transcription syntax into HTML.
// The syntax is defined in the ⲣⲉⲙⲛ̀Ⲭⲏⲙⲓ pipeline, at
// dictionary/marcion_sourceforge_net/kasser.py. This is a port of its
// substitutions, minus the validation, which the pipeline already enforces.

// A siglum: an optional asterisk, a base, then any sequence of superscripts
// (`^`) and subscripts (`~`). A² is a base of its own.
const siglumRegex = /^(\*)?(A\^2|\p{Script=Latin})((?:[\^~][^\^~]+)*)$/u;
const siglumMarkRegex = /([\^~])([^\^~]+)/gu;

function siglumReplace(_, g1) {
	const siglum = g1.match(siglumRegex);
	if (!siglum) {
		console.error("Error! Invalid siglum:", g1);
		return `[[${g1}]]`;
	}
	const [, asterisk, base, marks] = siglum;
	let html = asterisk ? "&ast;" : "";
	html += base === "A^2" ? "<i>A</i><sup>2</sup>" : `<i>${base}</i>`;
	for (const [, marker, mark] of marks.matchAll(siglumMarkRegex)) {
		html += marker === "^" ? `<sup><i>${mark}</i></sup>` : `<sub>${mark}</sub>`;
	}
	return `<span class="dialect">${html}</span>`;
}

function languageReplace(_, g1) {
	// An asterisk marks a Coptic form as a reconstruction.
	const asterisk = g1.startsWith("*") ? "&ast;" : "";
	const text = g1.replace(/^\*/, "");
	let lang;
	if (/\p{Script=Greek}/u.test(text)) {
		lang = "greek";
	} else if (/\p{Script=Coptic}/u.test(text)) {
		lang = "coptic";
	} else {
		console.error("Error! Can not determine the language of bracketed expression:", g1);
		return `[[${g1}]]`;
	}
	return `<span class="${lang}">${asterisk}${text}</span>`;
}

function addendumReplace(_, del, ins) {
	return (del ? `<del>${del}</del>` : "") + (del && ins ? " " : "") + (ins ? `<ins>${ins}</ins>` : "");
}

// The order is load-bearing; it follows kasser.py.
const substitutions = [
	[/&/g, "&amp;"],
	[/</g, "&lt;"],
	[/>/g, "&gt;"],
	// Italics take a single underscore or a double one, rendered alike.
	[/(__?)(.+?)\1/g, "<i>$2</i>"],
	// A siglum must be matched before other bracketed text.
	[/(?<!\[)\[\[(\*?\p{Script=Latin}[^\[\]]*)\]\](?!\])/gu, siglumReplace],
	[/(?<!\[)\[\[(.*?)\]\](?!\])/gu, languageReplace],
	// A subscript outside a siglum is parenthesized, a number, or a word:
	// [[ⲁⲁ]]~(h), (ManiP~(qq)), M~2M~4, (C 206,46 ~vl?).
	[/~(\([^()]*\)|\d+|[a-z?]+)/g, "<sub>$1</sub>"],
	[/\\n/g, "</p><p>"],
	// A superscript outside a siglum.
	[/\^([-–—\w\p{L}]+)/gu, "<sup>$1</sup>"],
	[/\/\/(.*?)\/\/(.*?)\/\//g, addendumReplace],
];

export default function render(entry) {
	for (const [regex, replacement] of substitutions) {
		entry = entry.replace(regex, replacement);
	}
	return `<p>${entry}</p>`;
}
