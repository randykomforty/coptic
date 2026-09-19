function language_replace(_, g1) {
	let lang;
	if (/\p{Script=Greek}/u.test(g1) || g1 === '·') {
		lang = "greek";
	} else if (/\p{Script=Coptic}/u.test(g1) || g1 === '―') {
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
	} else if (/^(?:[\p{Script=Latin}ꜢꜤʾʿ]\p{M}*|[ '\-=\.·()])+$/ui.test(g1)) {
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
	tab: [/\\t/, "&nbsp; &nbsp; &nbsp;"],
	em: [/__(.+?)__/, "<em>$1<\/em>"],
	bold: [/\*(.+?)\*/, "<b>$1<\/b>"],
	italic: [/_(.+?)_/, "<i>$1<\/i>"],
	dialect: [/\[\[(S|B|A|F|O)\]\]/, "<i class=\"dialect\">$1<\/i>"],
	subdialect: [/\[\[(S|F|B|O)\^(a|f|b|af)\]\]/, "<i class=\"dialect\">$1<sup>$2<\/sup><\/i>"],
	subdialectLyco: [/\[\[(A\^2)\]\]/, "<i class=\"dialect\">A<sup class=\"non-italic\">2<\/sup><\/i>"],
	// Stacked letters: two letters written on top of one another, joined by a
	// double caret (e.g. ⲁ^^ⲃ). This must precede `superscript`, so the `^^` is
	// consumed before a lone `^` can grab it. These regexes run without the `u`
	// flag, so `\p{Letter}` is unavailable; we match the Coptic and Greek letter
	// ranges.
	stack: [/([ⲁ-ⲱϣ-ϯⳉα-ωΑ-Ω])\^\^([ⲁ-ⲱϣ-ϯⳉα-ωΑ-Ω])/, "<span class=\"stack\"><span class=\"stack-top\">$2<\/span><span class=\"stack-bottom\">$1<\/span><\/span>"],
	superscript: [/\^([-–—\wα-ωΑ-Ω]+)/, "<sup>$1<\/sup>"],
	// Four square brackets mark special-font (old) Coptic. This must precede
	// the triple-bracket (headword) and double-bracket (language) rules, so the
	// extra brackets are consumed first.
	oldCoptic: [/(?<!\[)\[\[\[\[(.*?)\]\]\]\](?!\])/, "<span class=\"old coptic\">$1<\/span>"],
	headword: [/\[\[\[(\(?\)?\[?\]?\.?\…?-?[\u2c80-\u2cff\u03e2-\u03ef].*?\]?)\]\]\]/, "<span class=\"headword coptic\">$1<\/span>"],
	language: [/(?<!\[)\[\[(.*?)\]\](?!\])/, language_replace],
	qualitative: [/†/, "<sup>†<\/sup>"],
	lineBreaks: [/\\n/, "</p><p>"],
	// An addendum may name the page it comes from, written immediately
	// after the closing `//` (e.g. `//ⲁ//ⲃ//717a`). It is matched so that
	// it is consumed rather than left in the text, and then dropped —
	// this rendering has nowhere to show it.
	additionsAndCorrections: [/\/\/(.*?)\/\/(.*?)\/\/(?:(?:\d{1,3}|[xiv]+)[ab])?/, "<del>$1</del><ins>$2</ins>"],
	// A footnote — `{text}{{note}}` — is an editorial note on an error of
	// Crum's. The note is nested inside the mark, rather than stashed in a data
	// attribute, so its HTML needs no escaping. This must precede `manual`, so
	// the paired braces are consumed before a lone `{...}` can grab them, and it
	// must follow `em` and `italic`, so that markup inside the note is already
	// rendered by the time it is captured.
	// NOTE: A footnote may contain neither a newline nor a `\n` token. Those are
	// substituted into paragraph breaks above, which would spill out of the
	// tooltip and corrupt the nesting.
	footnotes: [/{([^{}]*)}{{(.*?)}}/, "<span class=\"footnoted\"><span class=\"footnote-target\">$1<\/span><span class=\"mark\" tabindex=\"0\">※<span class=\"tooltip\">$2<\/span><\/span><\/span>"],
	manual: [/{(.*?)}(?:{.*?})?/, '$1'],
};

export default arrayStyling;
