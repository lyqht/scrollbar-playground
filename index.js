const scrollbarDiv = document.getElementById("fake-window")
const heightInput = document.getElementById("scrollbar-height")
const widthInput = document.getElementById("scrollbar-width")
const borderRadiusInput = document.getElementById("scrollbar-border-radius")
const borderToggle = document.getElementById("scrollbar-border-toggle")
const buttonToggle = document.getElementById("scrollbar-button-toggle")
const numButtonConfigContainer = document.getElementById("num-buttons-shown-container")
const singleButtonShownCheckbox = document.getElementById('button-show-single')
const doubleButtonShownCheckbox = document.getElementById('button-show-double')
const exportCSSButton = document.getElementById('export-css')

let defaultElementForStyling = "body" // modify this for scrollbar styles to be applied to another element
let defaultCSSProperties = `
    --scrollbar-height: 20px;
    --scrollbar-widtht: 20px;
    --scrollbar-border-radius: 4px;
    --scrollbar-thumb-color: #3B82F6;
    --scrollbar-button-color: #3F3F46;
    --scrollbar-track-color: #A1A1AA;
    --scrollbar-corner-color: #FFFFFF;
    --scrollbar-border-thickness: 3px;
    --scrollbar-border-color: #FFFFFF;
`

const bindColorPicker = (el, property, defaultColor) => {
    const pickr = Pickr.create({
        el,
        default: defaultColor,
        theme: 'nano',
        swatches: [
            'rgba(244, 67, 54, 1)',
            'rgba(233, 30, 99, 0.95)',
            'rgba(156, 39, 176, 0.9)',
            'rgba(103, 58, 183, 0.85)',
            'rgba(63, 81, 181, 0.8)',
            'rgba(33, 150, 243, 0.75)',
            'rgba(3, 169, 244, 0.7)',
            'rgba(0, 188, 212, 0.7)',
            'rgba(0, 150, 136, 0.75)',
            'rgba(76, 175, 80, 0.8)',
            'rgba(139, 195, 74, 0.85)',
            'rgba(205, 220, 57, 0.9)',
            'rgba(255, 235, 59, 0.95)',
            'rgba(255, 193, 7, 1)'
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
                save: true
            }
        }
    });

    pickr.on('change', (color, instance) => {
        scrollbarDiv.style.setProperty(property, color.toHEXA())
    }).on('save', () => { })
}

const colorsPropertyArray = [
    {
        el: "#thumb-color-picker",
        property: "--scrollbar-thumb-color",
        defaultColor: "#3B82F6"
    },
    {
        el: "#track-color-picker",
        property: "--scrollbar-track-color",
        defaultColor: "#A1A1AA"
    },
    {
        el: "#button-color-picker",
        property: "--scrollbar-button-color",
        defaultColor: "#3F3F46"
    },
    {
        el: "#corner-color-picker",
        property: "--scrollbar-corner-color",
        defaultColor: "#FFFFFF"
    },
    {
        el: "#border-color-picker",
        property: "--scrollbar-border-color",
        defaultColor: "#FFFFFF"
    },
]

colorsPropertyArray.forEach(({ el, property, defaultColor }) => bindColorPicker(el, property, defaultColor))

const setSizeFieldOnChange = (el, property) => {
    el.onchange = () => { scrollbarDiv.style.setProperty(property, `${el.value}px`) }
}

const sizePropertyArray = [
    {
        el: heightInput,
        property: "--scrollbar-height"
    },
    {
        el: widthInput,
        property: "--scrollbar-width"
    },
    {
        el: borderRadiusInput,
        property: "--scrollbar-border-radius"
    }
]

sizePropertyArray.forEach(({ el, property }) => setSizeFieldOnChange(el, property))

borderToggle.onchange = () => {
    if (borderToggle.checked === false) {
        scrollbarDiv.style.setProperty("--scrollbar-border-thickness", "0px")
    } else {
        scrollbarDiv.style.setProperty("--scrollbar-border-thickness", "3px")
    }
}

buttonToggle.onchange = () => {
    if (buttonToggle.checked === false) {
        numButtonConfigContainer.style.visibility = 'hidden';
        const cssRules = Object.values(document.styleSheets[1].cssRules)
        const scrollbarRules = cssRules.filter(rule => rule.cssText.includes('::-webkit-scrollbar-button'))
        const foundRule = scrollbarRules[0]
        const indexOfScrollbarButtonRule = cssRules.indexOf(foundRule)
        document.styleSheets[1].deleteRule(indexOfScrollbarButtonRule)
    } else {
        numButtonConfigContainer.style.visibility = 'visible';
        document.styleSheets[1].insertRule(`#fake-window::-webkit-scrollbar-button {
            background: var(--scrollbar-button-color, #3F3F46);
            border: var(--scrollbar-border-thickness, 3px) solid var(--scrollbar-border-color, rgb(255, 255, 255));
            border-radius: var(--scrollbar-border-radius, 4px);}`)
    }
}

singleButtonShownCheckbox.onchange = () => {
    scrollbarDiv.style.setProperty("--show-double-buttons", "none")
}

doubleButtonShownCheckbox.onchange = () => {
    scrollbarDiv.style.setProperty("--show-double-buttons", "block")
}


exportCSSButton.onclick = () => {
    let customProperties = scrollbarDiv.style.cssText.length > 0 ? scrollbarDiv.style.cssText : defaultCSSProperties
    let exportedStyle = `${defaultElementForStyling} { ${customProperties} } `
    const cssRules = Object.values(document.styleSheets[1].cssRules)
    const scrollbarRules = cssRules.filter(rule => rule.cssText.includes('::-webkit-scrollbar'))
    scrollbarRules.forEach(rule => {
        const modifiedRule = rule.cssText.replace("#fake-window", defaultElementForStyling)
        exportedStyle += modifiedRule
    });
    navigator.clipboard.writeText(exportedStyle)
}