const scrollbarDiv = document.getElementById("fake-window")
const heightInput = document.getElementsByName("scrollbar-height")[0]
const widthInput = document.getElementsByName("scrollbar-width")[0]
const borderRadiusInput = document.getElementsByName("scrollbar-border-radius")[0]

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