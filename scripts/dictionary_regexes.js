function language_replace(_, g1) {
	let lang;
	if (/\p{Script=Greek}/u.test(g1) || g1 === '·') {
		lang = "greek";
	} else if (/\p{Script=Coptic}/u.test(g1)) {
		lang = "coptic";
	} else if (/\p{Script=Arabic}/u.test(g1)) {
		lang = "arabic";
	} else if (/\p{Script=Hebrew}/u.test(g1)) {
		lang = "hebrew";
	} else if (/\p{Script=Syriac}/u.test(g1)) {
		lang = "aramaic";
	} else if (/\p{Script=Ethiopic}/u.test(g1)) {
		lang = "amharic";
	} else if (/\p{Script=Egyptian_Hieroglyphs}/u.test(g1)) {
		lang = "egypt-hiero";
	} else if (/^(?:[\p{Script=Latin}ꜢꜤʾʿ]\p{M}*|[ '\-=\.])+$/ui.test(g1)) {
		lang = "demotic";
	} else {
		console.error('Error! Can not determine the language of bracketed expression:', g1);
		return `[[${g1}]]`;
	}

	return `<span class="${lang}">${g1}</span>`;
}

	const arrayStyling = {
	//ampersand: [/&(?!amp;)/, "&amp;"],
	//ampersand: [/&amp\;/, "&"],
	//verbose: [/@(.+?)@/, "<span class=\"verbose\">$1<\/span>"],
	asterisk: [/\\\*/, "&ast;"],
	paragraph: [/(\n)/, "</p><p>"],
	tab: [/\\t/, "&nbsp; &nbsp; &nbsp; &nbsp;"],
	em: [/__(.+?)__/, "<em>$1<\/em>"],
	bold: [/\*(.+?)\*/, "<b>$1<\/b>"],
	italic: [/_(.+?)_/, "<i>$1<\/i>"],
	dialect: [/\[\[(S|B|A|F|O)\]\]/, "<i class=\"dialect\">$1<\/i>"],
	subdialect: [/\[\[(S|F|B|O)\^(a|f|b|af)\]\]/, "<i class=\"dialect\">$1<sup>$2<\/sup><\/i>"],
	subdialectLyco: [/\[\[(A\^2)\]\]/, "<i class=\"dialect\">A<sup class=\"non-italic\">2<\/sup><\/i>"],
	superscript: [/\^([-–—\w]+)/, "<sup>$1<\/sup>"],
	headword: [/\[\[\[(\(?\)?\[?\]?\.?\…?-?[\u2c80-\u2cff\u03e2-\u03ef].*?\]?)\]\]\]/, "<span class=\"headword coptic\">$1<\/span>"],
	language: [/(?<!\[)\[\[(.*?)\]\](?!\])/, language_replace],
	qualitative: [/†/, "<sup>†<\/sup>"],
	lineBreaks: [/\\n/, "</p><p>"],
	additionsAndCorrections: [/\/\/(.*?)\/\/(.*?)\/\//, "<del>$1</del><ins>$2</ins>"],
	footnotes: [/{{.*?}}/, ''],
	manual: [/{(.*?)}(?:{.*?})?/, '$1'],
};

export default arrayStyling;
