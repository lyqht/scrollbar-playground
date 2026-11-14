import("https://cdn.skypack.dev/copy-to-clipboard").then(
	(a) => (navigator.clipboard.writeText = a.default),
); // this is only required for users to be able to get the exported styles from the iframes in the article. If you are at the codepen or the main scrollbar playground, this is not necessary

const scrollbarDiv = document.getElementById("preview");
const heightInput = document.getElementById("scrollbar-height");
const widthInput = document.getElementById("scrollbar-width");
const borderRadiusInput = document.getElementById("scrollbar-border-radius");
const borderToggle = document.getElementById("scrollbar-border-toggle");
const buttonToggle = document.getElementById("scrollbar-button-toggle");
const numButtonConfigContainer = document.getElementById(
	"num-buttons-shown-container",
);
const singleButtonShownCheckbox = document.getElementById("button-show-single");
const doubleButtonShownCheckbox = document.getElementById("button-show-double");
const exportCSSButton = document.getElementById("export-css");
const exportCSSHint = document.getElementById("export-css-hint");
const thumbBoxShadowInput = document.getElementById(
	"scrollbar-thumb-box-shadow",
);
const standardWidthSelect = document.getElementById("scrollbar-standard-width");
const standardPreviewToggle = document.getElementById(
	"scrollbar-standard-preview-toggle",
);

const prettifyCSS = (css) => {
	css = css.replace(/\s*{\s*/g, " {\n");
	css = css.replace(/;\s*/g, ";\n");
	css = css.replace(/}\s*/g, "\n}\n");
	let indent = 0;
	return css
		.split("\n")
		.map((line) => {
			line = line.trim();
			if (line === "") return "";
			if (line.startsWith("}")) indent--;
			const res = "    ".repeat(Math.max(indent, 0)) + line;
			if (line.endsWith("{")) indent++;
			return res;
		})
		.filter(Boolean)
		.join("\n");
};

let defaultElementForStyling = "body"; // modify this for scrollbar styles to be applied to another element

const bindColorPicker = (el, property, defaultColor) => {
	const pickr = Pickr.create({
		el,
		default: defaultColor,
		theme: "nano",
		swatches: [
			"rgba(244, 67, 54, 1)",
			"rgba(233, 30, 99, 0.95)",
			"rgba(156, 39, 176, 0.9)",
			"rgba(103, 58, 183, 0.85)",
			"rgba(63, 81, 181, 0.8)",
			"rgba(33, 150, 243, 0.75)",
			"rgba(3, 169, 244, 0.7)",
			"rgba(0, 188, 212, 0.7)",
			"rgba(0, 150, 136, 0.75)",
			"rgba(76, 175, 80, 0.8)",
			"rgba(139, 195, 74, 0.85)",
			"rgba(205, 220, 57, 0.9)",
			"rgba(255, 235, 59, 0.95)",
			"rgba(255, 193, 7, 1)",
		],
		comparison: false,
		components: {
			preview: true,
			opacity: true,
			hue: true,
			interaction: {
				hex: true,
				rgba: true,
				hsla: true,
				hsva: true,
				cmyk: true,
				input: true,
				clear: true,
				save: true,
			},
		},
	});

	pickr
		.on("change", (color, instance) => {
			scrollbarDiv.style.setProperty(property, color.toHEXA());
		})
		.on("save", () => {});
};

const colorsPropertyArray = [
	{
		el: "#thumb-color-picker",
		property: "--scrollbar-thumb-color",
		defaultColor: "#3B82F6",
	},
	{
		el: "#track-color-picker",
		property: "--scrollbar-track-color",
		defaultColor: "#A1A1AA",
	},
	{
		el: "#button-color-picker",
		property: "--scrollbar-button-color",
		defaultColor: "#3F3F46",
	},
	{
		el: "#corner-color-picker",
		property: "--scrollbar-corner-color",
		defaultColor: "#FFFFFF",
	},
	{
		el: "#border-color-picker",
		property: "--scrollbar-border-color",
		defaultColor: "#FFFFFF",
	},
];

colorsPropertyArray.forEach(({ el, property, defaultColor }) =>
	bindColorPicker(el, property, defaultColor),
);

const setSizeFieldOnChange = (el, property) => {
	el.onchange = () => {
		scrollbarDiv.style.setProperty(property, `${el.value}px`);
	};
};

const sizePropertyArray = [
	{
		el: heightInput,
		property: "--scrollbar-height",
	},
	{
		el: widthInput,
		property: "--scrollbar-width",
	},
	{
		el: borderRadiusInput,
		property: "--scrollbar-border-radius",
	},
];

sizePropertyArray.forEach(({ el, property }) =>
	setSizeFieldOnChange(el, property),
);

thumbBoxShadowInput.oninput = () => {
	scrollbarDiv.style.setProperty(
		"--scrollbar-thumb-box-shadow",
		thumbBoxShadowInput.value,
	);
};

standardWidthSelect.onchange = () => {
	scrollbarDiv.style.setProperty(
		"--scrollbar-standard-width",
		standardWidthSelect.value,
	);
};

standardPreviewToggle.onchange = () => {
	scrollbarDiv.classList.toggle(
		"standard-preview",
		standardPreviewToggle.checked,
	);
};

borderToggle.onchange = () => {
	if (borderToggle.checked === false) {
		scrollbarDiv.style.setProperty("--scrollbar-border-thickness", "0px");
	} else {
		scrollbarDiv.style.setProperty("--scrollbar-border-thickness", "3px");
	}
};

buttonToggle.onchange = () => {
	if (buttonToggle.checked === false) {
		numButtonConfigContainer.style.visibility = "hidden";
		const cssRules = Object.values(document.styleSheets[1].cssRules);
		const scrollbarRules = cssRules.filter((rule) =>
			rule.cssText.includes("::-webkit-scrollbar-button"),
		);
		const foundRule = scrollbarRules[0];
		const indexOfScrollbarButtonRule = cssRules.indexOf(foundRule);
		document.styleSheets[1].deleteRule(indexOfScrollbarButtonRule);
	} else {
		numButtonConfigContainer.style.visibility = "visible";
		document.styleSheets[1].insertRule(`#preview::-webkit-scrollbar-button {
            background: var(--scrollbar-button-color, #3F3F46);
            border: var(--scrollbar-border-thickness, 3px) solid var(--scrollbar-border-color, rgb(255, 255, 255));
            border-radius: var(--scrollbar-border-radius, 4px);}`);
	}
};

singleButtonShownCheckbox.onchange = () => {
	scrollbarDiv.style.setProperty("--show-double-buttons", "none");
};

doubleButtonShownCheckbox.onchange = () => {
	scrollbarDiv.style.setProperty("--show-double-buttons", "block");
};

const validateCSS = async (cssStylesInText) => {
	const encodedStyles = encodeURI(cssStylesInText);
	const cssValidationResponse = await fetch(
		`https://jigsaw.w3.org/css-validator/validator?profile=css3&text=${encodedStyles}`,
	);
	const cssValidationResponseText = await cssValidationResponse.text();
	const parser = new DOMParser();
	const validationDoc = parser.parseFromString(
		cssValidationResponseText,
		"text/html",
	);
	return validationDoc.getElementsByClassName("error");
};

// Standard properties for browsers without ::-webkit-scrollbar (e.g. Firefox).
// They are wrapped in @supports because a non-auto scrollbar-color makes Chrome, Edge
// and Safari ignore the ::-webkit-scrollbar rules, which would throw away the detailed styles.
const buildStandardFallback = (selector) =>
	`@supports not selector(::-webkit-scrollbar) { ${selector} { ` +
	`scrollbar-color: var(--scrollbar-thumb-color, #3B82F6) var(--scrollbar-track-color, #A1A1AA); ` +
	`scrollbar-width: var(--scrollbar-standard-width, thin); } } `;

const buildExportedStyle = () => {
	const customProperties = scrollbarDiv.style.cssText;
	let exportedStyle = `${defaultElementForStyling} { ${customProperties} } `;
	exportedStyle += buildStandardFallback(defaultElementForStyling);
	const cssRules = Object.values(document.styleSheets[1].cssRules); // Google font styles were loaded first before index.css
	const scrollbarRules = cssRules.filter((rule) =>
		rule.cssText.includes("::-webkit-scrollbar"),
	);
	scrollbarRules.forEach((rule) => {
		// replaceAll: some rules list #preview more than once (e.g. the button rules)
		exportedStyle += rule.cssText.replaceAll(
			"#preview",
			defaultElementForStyling,
		);
	});
	return exportedStyle;
};

const showExportHint = (message) => {
	exportCSSHint.textContent = message;
	exportCSSHint.style.opacity = 1;
	setTimeout(() => {
		exportCSSHint.style.opacity = 0;
	}, 1500);
};

exportCSSButton.onclick = async () => {
	exportCSSButton.innerText = "Exporting...";
	const exportedStyle = buildExportedStyle();
	await navigator.clipboard.writeText(prettifyCSS(exportedStyle));
	showExportHint("Copied to your clipboard");
	exportCSSButton.innerText = "Export CSS";

	// The W3C check is informational only: it can lag behind newer CSS
	// such as @supports selector() and scrollbar-color, and it can be unreachable.
	try {
		const cssValidationErrorsCollection = await validateCSS(exportedStyle);
		if (cssValidationErrorsCollection.length > 0) {
			console.log({ cssValidationErrorsCollection });
		} else {
			console.log("No CSS validation errors found by W3C");
		}
	} catch (error) {
		console.log("Skipped W3C CSS validation", error);
	}
};
