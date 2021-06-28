// This variable records the current selected parameter
var SELECTED_ELEMENT = null
// The mode indicator, used to change current mode
const MODE_DICT = {
    content: "content",
    border: "border",
    line: "line",
    image: "image"
}
// The default mode is 'content'
var CURRENT_MODE = MODE_DICT.content
// This is used for the thick_border value iteration
const THICK_LIST = ['00', '10', '11', '01']
// This are the available color list for the designed elements
const COLOR_LIBRARY = {
    white: "white",
    red: "red",
    green: "lime",
    gray: "rgb(170, 170, 170)",
    black: "rgb(60, 60, 60)",
    yellow: "yellow",
    blue: "royalblue"
}

// Automatically create a reverse map for the color library        
const REV_COLOR_LIBRARY = {}
for (var propName in COLOR_LIBRARY) {
    var this_tag = COLOR_LIBRARY[propName]
    REV_COLOR_LIBRARY[this_tag] = propName
}
// console.log(REV_COLOR_LIBRARY)


// These are the colors that needs white font color
const DARK_COLORS = ["black", "royalblue", "red", "rgb(60, 60, 60)", "rgb(170, 170, 170)"]
// This is the default list for storing the src for the icons
var ICON_SRC_LIST = ['url("$NONE$")']
// The default color used when generating the grid
const DEFAULT_BACKGROUD = COLOR_LIBRARY.white

// The dictionary for all the IDs
const ID_DICT = {
    selected_border_color: "selected_border_color",
    selected_bg_color: "selected_bg_color",
    selected_default_background: "selected_default_background",
    console: "console",
    grid_size_input: "grid_size_input",
    grid_size_input_support: "grid_size_input_support",
    grid_section: "grid_section",
    selected_name: "selected_name",
    selected_text: "selected_text",
    mode_name: "mode_name",
    img: 'img',
    download_selector: "download_selector",
}
// The dictionary for all cell attributes
const ATTR_DICT = {
    name: "name",
    x_cord: "x_cord",
    y_cord: "y_cord",
    onclick: "onclick",
    border_color: "border_color",
    background_color: "background_color",
    thick_border: "thick_border",
    background_index: "background_index"
}

const CLASS_DICT = {
    cell: "cell",
    grid_line: "grid_line",
    clear_cell: "clear_cell",
    grid_cell: "grid_cell",
    clear_cell_modifier_width: "clear_cell_modifier_width",
    clear_cell_modifier_height: "clear_cell_modifier_height",
    grid_cell_modifier_right: "grid_cell_modifier_right",
    grid_cell_modifier_down: "grid_cell_modifier_down",
    line_segment: "line_segment",
    line_segment_vertical: "line_segment_vertical",
    line_segment_horizontal: "line_segment_horizontal"
}

// The dictionary of all element that uses the color lib
const COLOR_ID = [ID_DICT.selected_border_color, ID_DICT.selected_bg_color, ID_DICT.selected_default_background]

// Grid line status
const GRID_LINE_ORIENTATION = {
    vertical: "vertical",
    horizontal: "horizontal"
}

// The list of list that stores the data
var GRID_DATA = []
var GRID_DICT = []
var GRID_HEIGHT = 0
var GRID_WIDTH = 0
var GRID_LINE_DICT = {}

// The JSON for OUTPUT
var JSON_SRC = ""
// Load the local JSON if set to true
const JSON_FROM_LOCAL = false

const JSON_LOCATION_PUZZLE_OUTPUT = 'src/data.json'
// This function loads the necessary JSON file
function load_JSON() {

    if (JSON_FROM_LOCAL) {
        $.getJSON(JSON_LOCATION_PUZZLE_OUTPUT, data => {
            // console.log(data['author'])
            console.log(data)
            JSON_SRC = data
        })
    }
    else {
        $.getJSON('https://raw.githubusercontent.com/JackHKJ/GridDrawer/main/' + JSON_LOCATION_PUZZLE_OUTPUT, data => {
            console.log(data)
            JSON_SRC = data
        })
    }



}

// END OF DATA SEGMENT /////////////////////////////////////////////////////////////////////////////////////

function LOAD_COLOR_LIB() {
    // Add the color library to the dropdown list

    for (var this_id of COLOR_ID) {
        var this_element = document.getElementById(this_id)
        this_element.innerHTML = ''
        for (const [key, value] of Object.entries(COLOR_LIBRARY)) {
            this_element.innerHTML += '<option value="' + value + '">' + key + '</option>'
        }
    }
}

// The output types

const OUTPUT_TYPE_DICT = {
    General: "General",
    Nurikabe: "Nurikabe",
    Sudoku: "Sudoku"
}

function LOAD_OUTPUT_TYPE() {
    var this_element = document.getElementById(ID_DICT.download_selector)
    this_element.innerHTML = ''
    for (const [key, value] of Object.entries(OUTPUT_TYPE_DICT)) {
        this_element.innerHTML += '<option value="' + value + '">' + key + '</option>'
    }
}


// Functions that is activated after page load
window.addEventListener('load', function () {
    LOAD_COLOR_LIB()
    LOAD_OUTPUT_TYPE()
    load_JSON()
})

// END OF Initializers /////////////////////////////////////////////////////////////////////////////////////  

// This is the default function for creating the grid
function create_grid() {

    // Check the user selection of the default backgroun when selected
    // console.log(document.getElementById('selected_default_background').value)
    let selected_default_bg = REV_COLOR_LIBRARY[document.getElementById(ID_DICT.selected_default_background).value]

    // Create a grid of the given size
    // console.log("Creating a new grid")
    CURRENT_MODE = MODE_DICT.content
    document.getElementById(ID_DICT.mode_name).textContent = MODE_DICT.content
    document.getElementById(ID_DICT.selected_name).textContent = "None"
    // Get the size "grid_size_input"
    var size = parseInt(document.getElementById(ID_DICT.grid_size_input).value)
    var size_sup = parseInt(document.getElementById(ID_DICT.grid_size_input_support).value)
    if (size_sup == parseInt("NaN")) {
        size_sup = size
    }
    var grid = document.getElementById(ID_DICT.grid_section)

    // clean the current part
    grid.innerHTML = ""

    GRID_DICT = {}
    GRID_LINE_DICT = {}

    for (let i = 0; i < size + 2; i++) {
        var this_line = document.createElement('div')
        this_line.className = CLASS_DICT.grid_line
        for (let j = 0; j < size_sup + 2; j++) {

            var this_element = document.createElement("div")
            this_element.setAttribute(ATTR_DICT.name, i + '-' + j)
            this_element.setAttribute(ATTR_DICT.x_cord, i)
            this_element.setAttribute(ATTR_DICT.y_cord, j)

            this_element.setAttribute(ATTR_DICT.onclick, 'select(this)')
            // this_element.setAttribute('oncontextmenu', 'clear(this)')
            this_element.addEventListener('contextmenu', clear)
            // this_element.setAttribute('onwheel','scroll_handler(this)')
            this_element.addEventListener('wheel', scroll_handler)


            this_element.setAttribute(ATTR_DICT.border_color, COLOR_LIBRARY.white)
            // this_element.setAttribute('border_color', COLOR_LIBRARY[selected_default_bg])
            // Modify the background when selected
            this_element.setAttribute(ATTR_DICT.background_color, COLOR_LIBRARY.white)
            // this_element.setAttribute('background_color', COLOR_LIBRARY[selected_default_bg])


            this_element.setAttribute(ATTR_DICT.thick_border, '0000') //[top, right][bottom left]
            // this_element.style.backgroundImage = ICON_SRC_LIST[0]
            this_element.setAttribute(ATTR_DICT.background_index, 0)

            if (i == 0 || i == size + 1 || j == 0 || j == size_sup + 1) {
                this_element.className = CLASS_DICT.clear_cell
                if ((i, j) in [(0, 0), (size + 1, size_sup + 1)]) {
                    this_element.classList.add(CLASS_DICT.clear_cell_modifier_width)
                }
                if ((i == size & j == 0) || (i == size & j == size_sup + 1)) {
                    this_element.classList.add(CLASS_DICT.clear_cell_modifier_height)
                }

            }
            else {
                this_element.className = CLASS_DICT.grid_cell
                if (j == size_sup) {
                    this_element.classList.add(CLASS_DICT.grid_cell_modifier_right)
                }
                if (i == size) {
                    this_element.classList.add(CLASS_DICT.grid_cell_modifier_down)
                }
                this_element.style.boxShadow = COLOR_LIBRARY[selected_default_bg]
                this_element.style.background = COLOR_LIBRARY[selected_default_bg]

                this_element.setAttribute(ATTR_DICT.border_color, COLOR_LIBRARY[selected_default_bg])
                this_element.setAttribute(ATTR_DICT.background_color, COLOR_LIBRARY[selected_default_bg])
            }

            this_element.classList.add(CLASS_DICT.cell)
            this_element.textContent = ''
            GRID_DICT[this_element.getAttribute(ATTR_DICT.name)] = this_element
            var this_text = document.createElement("p")
            this_text.className = "cell_text"
            this_element.appendChild(this_text)


            this_line.appendChild(this_element)
        }
        grid.appendChild(this_line)
    }
    // End of creating the grid

    // Create the relative GRID_DATA for storage
    GRID_DATA = []
    GRID_HEIGHT = size
    GRID_WIDTH = size_sup
    for (let i = 0; i < size + 2; i++) {
        var this_line = []
        for (let j = 0; j < size_sup + 2; j++) {
            this_line.push("")
        }
        GRID_DATA.push(this_line)
    }
}

// This function will be called when a grid-cell is clicked (Select)
function select(e) {
    // modify_selected()
    SELECTED_ELEMENT = e
    // Update the selected name
    document.getElementById(ID_DICT.selected_name).textContent = e.getAttribute(ATTR_DICT.name)

    // Update the border/background color of the selected element to the display
    sel = document.getElementById(ID_DICT.selected_border_color)
    var options = Array.from(sel.options);
    // console.log(options)
    options.forEach((option, i) => {
        // console.log(option,i)
        if (option.value === SELECTED_ELEMENT.getAttribute(ATTR_DICT.border_color)) sel.selectedIndex = i;
    });

    sel = document.getElementById(ID_DICT.selected_bg_color)
    var options = Array.from(sel.options);
    // console.log(options)
    options.forEach((option, i) => {
        // console.log(option,i)
        if (option.value === SELECTED_ELEMENT.getAttribute(ATTR_DICT.background_color)) sel.selectedIndex = i;
    });

    let selected_text = document.getElementById(ID_DICT.selected_text)
    selected_text.value = e.querySelector(".cell_text").textContent
    // selected_text.focus(function () { this.select() })
    selected_text.select()

    modify_selected()
}

// This function is used to modify the display of the current cell
function modify_selected(e) {
    if (SELECTED_ELEMENT == null) {
        return
    }
    // Update the text value 
    SELECTED_ELEMENT.querySelector(".cell_text").textContent = document.getElementById(ID_DICT.selected_text).value

    GRID_DATA[SELECTED_ELEMENT.getAttribute(ATTR_DICT.x_cord)][SELECTED_ELEMENT.getAttribute(ATTR_DICT.y_cord)] = document.getElementById(ID_DICT.selected_text).value
    // console.log(GRID_DATA)
    // Update the border color
    SELECTED_ELEMENT.setAttribute(ATTR_DICT.border_color, document.getElementById(ID_DICT.selected_border_color).value)
    color_value = document.getElementById(ID_DICT.selected_border_color).value + " inset 0 0 0 4px"
    SELECTED_ELEMENT.style.boxShadow = color_value
    // Update the background color
    if (parseInt(SELECTED_ELEMENT.getAttribute(ATTR_DICT.background_index)) == 0) {
        SELECTED_ELEMENT.setAttribute(ATTR_DICT.background_color, document.getElementById(ID_DICT.selected_bg_color).value)
        color_value = document.getElementById(ID_DICT.selected_bg_color).value
        SELECTED_ELEMENT.style.background = color_value
    }
    // Adjust the font color if the color value is black
    if (DARK_COLORS.includes(color_value)) {
        SELECTED_ELEMENT.style.color = COLOR_LIBRARY.white
    }
    else {
        SELECTED_ELEMENT.style.color = COLOR_LIBRARY.black
    }
}

// This function is used to modify the selected cell, which will clear all the border/COLOR_LIBRARY on it
function clear(e) {
    e.preventDefault()
    // console.log("rk")
    // console.log(e)
    var target_element = e.target
    // console.log(target_element)
    select(target_element)
    if ((target_element.classList).contains(CLASS_DICT.grid_cell)) {
        document.getElementById(ID_DICT.selected_border_color).value = document.getElementById(ID_DICT.selected_default_background).value
    }
    else {
        document.getElementById(ID_DICT.selected_border_color).value = COLOR_LIBRARY.white
    }
    // Only clear the background when in content mode
    if (CURRENT_MODE == MODE_DICT.content) {
        if ((target_element.classList).contains(CLASS_DICT.grid_cell)) {
            document.getElementById(ID_DICT.selected_bg_color).value = document.getElementById(ID_DICT.selected_default_background).value
        }
        else {
            document.getElementById(ID_DICT.selected_bg_color).value = COLOR_LIBRARY.white
        }

    }
    modify_selected(target_element)
}


// This function is to handle the mouse scroll
function scroll_handler(e) {
    e.preventDefault()
    // console.log("scrolled")
    // console.log(e)
    var target_element = e.target
    var delta = parseFloat(e.deltaY)
    // console.log(delta)    
    select(target_element)
    // console.log(SELECTED_ELEMENT.getAttribute("background_color"))
    // Under content mode:
    if (CURRENT_MODE == MODE_DICT.content) {
        if (delta < 0) {
            target_element.setAttribute(ATTR_DICT.background_index, 0)
            // DeltaY < 0: Scroll on top
            let flag = false
            document.getElementById(ID_DICT.selected_bg_color).value = Object.entries(COLOR_LIBRARY)[0][0]
            for (const [key, value] of Object.entries(COLOR_LIBRARY)) {

                if (!flag && value == SELECTED_ELEMENT.getAttribute(ATTR_DICT.background_color)) {
                    flag = true
                    continue
                }
                if (flag) {
                    document.getElementById(ID_DICT.selected_bg_color).value = value
                    flag = false
                    break
                }
            }
        }
        else {
            // DeltaY > 0: Scroll to bottom
            let flag = false
            document.getElementById(ID_DICT.selected_border_color).value = Object.entries(COLOR_LIBRARY)[0][0]
            for (const [key, value] of Object.entries(COLOR_LIBRARY)) {

                if (!flag && value == SELECTED_ELEMENT.getAttribute(ATTR_DICT.border_color)) {
                    flag = true
                    continue
                }
                if (flag) {
                    document.getElementById(ID_DICT.selected_border_color).value = value
                    flag = false
                    break
                }
            }
        }

        modify_selected(target_element)
        return
    }
    // Under border mode, modify the thick_border iteratively
    // if (CURRENT_MODE == MODE_DICT.border){
    //     // border mode will not modify the clear cell
    //     if (target_element.classList.contains(classList.clear_cell)){
    //         return
    //     }
    //     let current_thick_status = target_element.getAttribute(ATTR_DICT.thick_border)
    //     TR = current_thick_status[0]+current_thick_status[1]
    //     BL = current_thick_status[2]+current_thick_status[3]
    //     // console.log(TR)
    //     // console.log(BL)
    //     // Modify [top right]
    //     if(delta < 0){
    //       let index = THICK_LIST.indexOf(TR)
    //       index = (index+1)%4
    //       TR = THICK_LIST[index]
    //     }
    //     // Modify [bottom left]
    //     else{
    //         let index = THICK_LIST.indexOf(BL)
    //         index = (index+1)%4
    //         BL = THICK_LIST[index]
    //     }
    //     current_thick_status = TR+BL
    //     // console.log(current_thick_status)
    //     thick_border_modifier(target_element, current_thick_status)
    //     target_element.setAttribute(ATTR_DICT.thick_border, current_thick_status)

    //     modify_selected(target_element)
    //     return
    // }
    if (CURRENT_MODE == MODE_DICT.image) {
        // let current_url = target_element.style.backgroundImage
        // console.log(current_url)
        // let index = ICON_SRC_LIST.indexOf(current_url)
        // console.log(index+'/'+ICON_SRC_LIST.length)
        index = parseInt(target_element.getAttribute(ATTR_DICT.background_index))


        if (delta < 0) {
            index = (index - 1 + ICON_SRC_LIST.length) % ICON_SRC_LIST.length

            // console.log(index)
            if (index != 0) {
                target_element.style.backgroundImage = ICON_SRC_LIST[index]
                // target_element.style.backgroundColor = 'white'
                target_element.style.backgroundPosition = "center center"
                target_element.style.backgroundSize = 'cover'
            }
            else {
                target_element.style.backgroundImage = "none"
            }
            // console.log(target_element.style.backgroundImage)
            target_element.setAttribute(ATTR_DICT.background_index, index)
        }
        else {
            // DeltaY > 0: Scroll to bottom
            let flag = false
            document.getElementById(ID_DICT.selected_border_color).value = Object.entries(COLOR_LIBRARY)[0][0]
            for (const [key, value] of Object.entries(COLOR_LIBRARY)) {

                if (!flag && value == SELECTED_ELEMENT.getAttribute(ATTR_DICT.border_color)) {
                    flag = true
                    continue
                }
                if (flag) {
                    document.getElementById(ID_DICT.selected_border_color).value = value
                    flag = false
                    break
                }
            }
            modify_selected()
        }

    }


}

// Function that iteratively switch the mode 
// Mode: content/border/image
function change_mode(e) {
    let mode_list = Object.keys(MODE_DICT)
    let index = mode_list.indexOf(CURRENT_MODE)
    index = (index + 1) % mode_list.length
    CURRENT_MODE = MODE_DICT[mode_list[index]]
    document.getElementById(ID_DICT.mode_name).textContent = MODE_DICT[mode_list[index]]
}

// Data segment for modifying the 'border' around the cells
const BORDER_NORMAL = '2px rgb(200, 200, 200) solid'
const BORDER_THICK = "2px black solid"
// Modifier function that adjust the border based on the attributes
function thick_border_modifier(target, status) {
    if (status[0] === "1") {
        target.style.borderTop = BORDER_THICK
    }
    else {
        target.style.borderTop = BORDER_NORMAL
    }
    if (status[1] === "1") {
        target.style.borderLeft = BORDER_THICK
    }
    else {
        target.style.borderLeft = BORDER_NORMAL
    }
    if (status[2] === "1") {
        target.style.borderBottom = BORDER_THICK
    }
    else {
        target.style.borderBottom = BORDER_NORMAL
    }
    if (status[3] === "1") {
        target.style.borderRight = BORDER_THICK
    }
    else {
        target.style.borderRight = BORDER_NORMAL
    }
}

// This function is used to upload the image for icons
function upload() {
    var input = document.getElementById(ID_DICT.img)
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            let result_src = e.target.result
            result_src = "url('" + result_src + "')"
            if (!ICON_SRC_LIST.includes(result_src)) {
                ICON_SRC_LIST.push(result_src)
            }
            // var element = document.getElementById('imgdiv')
            // element.style.backgroundColor = "yellow"
            // element.style.backgroundImage = result_src
        };
        reader.readAsDataURL(input.files[0]);
        let message = input.value
        message = message.slice(message.lastIndexOf("\\") + 1)
        document.getElementById(ID_DICT.console).textContent = message + " uploaded!"
    }

    // console.log(ICON_SRC_LIST)
}


// This function helps to output the necessary txt file
function export_to_TXT(content, filename, ending = "") {
    var file = new File([content], filename + ending, { type: "text/plain;charset=utf-8" });
    saveAs(file);
}

// function Nurikabe_output(e){   

//     var template = ''+ JSON_SRC['Nurikabe']['template']
//     template = template.replace('$HEIGHT$',GRID_HEIGHT)
//     template = template.replace('$WIDTH$',GRID_WIDTH)
//     var content = ''
//     var cell = ''+ JSON_SRC['Nurikabe']['cell']
//     var flag = false
//     for (let i = 0; i < GRID_HEIGHT; i++) {
//         for (let j = 0; j < GRID_WIDTH; j++) {
//             if(GRID_DATA[i+1][j+1] != ''){
//                 var thisline = cell.replace('$VALUE$',GRID_DATA[i+1][j+1]).replace('$X$',i).replace('$Y$',j)
//                 content += thisline
//                 flag = true
//             }
//         }
//     }
//     template = template.replace('$CONTENT$',content)
//     if(flag){
//         console.log(template)
//         return template
//     }
//     else{
//         console.log("Nothing to output! Empty board.")
//     }

// }


// function Sudoku_output(e){   

//     if(GRID_WIDTH!=GRID_HEIGHT){
//         console.log("Not a Sudoku board!")
//         return
//     }
//     var template = ''+ JSON_SRC['Sudoku']['template']
//     template = template.replace('$SIZE$',GRID_HEIGHT)
//     var content = ''
//     var cell = ''+ JSON_SRC['Sudoku']['cell']
//     var flag = false
//     for (let i = 0; i < GRID_HEIGHT; i++) {
//         for (let j = 0; j < GRID_WIDTH; j++) {
//             if(GRID_DATA[i+1][j+1] != '' && Number.isInteger(parseInt(GRID_DATA[i+1][j+1]))){
//                 var thisline = cell.replace('$VALUE$',GRID_DATA[i+1][j+1]).replace('$X$',i).replace('$Y$',j)
//                 content += thisline
//                 flag = true
//             }
//         }
//     }
//     template = template.replace('$CONTENT$',content)
//     if(flag){
//         console.log(template)
//         return template
//     }
//     else{
//         console.log("Nothing to output! Empty board.")
//     }

// }

function output_by_type() {

    // console.log(JSONfn.stringify())

    var this_type = document.getElementById(ID_DICT.download_selector).value + ""
    // console.log(this_type)
    var str = "" + JSON_SRC[this_type]['function']
    // console.log(str)
    var method = JSONfn.parse(JSONfn.stringify(str))
    var output = method()
    console.log("OUTPUT is:" + output)

    if (output != undefined) {
        export_to_TXT(output, this_type)
    }

}

// Click and toggle functionalities, record a list of element that cursur passed in TARGET_LIST
// The element passed by cursor
var TARGET_LIST = []
// The coordinates, or "name" attribute of a cell
var COORD_LIST = []
var MOUSE_DOWN_FLAG = false

// ondrag,ondrop,ondragend,ondragenter,ondragleave,ondragover = function(e){
//     e.preventDefault()
// }

// Clear the list and ready to record
onmousedown = function (e) {
    // if(e.target!=undefined && e.target.classList.contains(CLASS_DICT.cell)){
    //     select(e.target)
    // }    
    // console.log("mouse location:", e.clientX, e.clientY)
    TARGET_LIST = []
    COORD_LIST = []

    MOUSE_DOWN_FLAG = true
}

onmousemove = function (e) {
    if (MOUSE_DOWN_FLAG) {
        if (!TARGET_LIST.includes(e.target) && e.target.classList.contains(CLASS_DICT.grid_cell)) {
            TARGET_LIST.push(e.target)
        }
    }
}

onmouseup = function (e) {

    // console.log(e)

    // console.log("mouse location:", e.clientX, e.clientY)
    MOUSE_DOWN_FLAG = false
    console.log(TARGET_LIST)

    // Iteratively store all the names of the element (coordinates as name 'x-y')
    for (item of TARGET_LIST) {
        COORD_LIST.push(item.getAttribute(ATTR_DICT.name))
    }

    // Under border mode, user can press and drag the left mouse key to create border,
    // press and drag the right mouse key to clear the created border
    if (CURRENT_MODE == MODE_DICT.border) {

        console.log(COORD_LIST)
        // A left click, toggle the borders
        if (e.button == 0) {
            for (item of TARGET_LIST) {
                let x = parseInt(item.getAttribute(ATTR_DICT.x_cord))
                let y = parseInt(item.getAttribute(ATTR_DICT.y_cord))
                let border_str = ""

                if (COORD_LIST.includes((x - 1) + "-" + (y))) {
                    border_str += "0"
                }
                else {
                    border_str += "1"
                }
                if (COORD_LIST.includes((x) + "-" + (y - 1))) {
                    border_str += "0"
                }
                else {
                    border_str += "1"
                }
                if (COORD_LIST.includes((x + 1) + "-" + (y))) {
                    border_str += "0"
                }
                else {
                    border_str += "1"
                }
                if (COORD_LIST.includes((x) + "-" + (y + 1))) {
                    border_str += "0"
                }
                else {
                    border_str += "1"
                }

                console.log(item.getAttribute(ATTR_DICT.name) + ":" + border_str)

                thick_border_modifier(item, border_str)
                item.setAttribute(ATTR_DICT.thick_border, border_str)
                modify_selected(item)

            }
        }
        // A right click, clear the borders
        if (e.button == 2) {
            for (item of TARGET_LIST) {
                thick_border_modifier(item, "0000")
                item.setAttribute(ATTR_DICT.thick_border, "0000")
                modify_selected(item)
            }
        }

        // Select the last element as to simulate a click
        if (e.target != undefined && e.target.classList.contains(CLASS_DICT.cell)) {
            select(e.target)
        }
        return
    }

    // Under border mode, user can press and drag the left mouse key to create lines,
    // press and drag the right mouse key to clear the created lines
    if (CURRENT_MODE == MODE_DICT.line) {
        // left key for creating lines
        if (e.button == 0) {
            for (let i = 0; i < TARGET_LIST.length - 1; i++) {
                let element_1 = TARGET_LIST[i]
                let element_2 = TARGET_LIST[i + 1]
                let tie_breaker_result = line_tie_breaker(element_1, element_2)
                // console.log(tie_breaker_result)
                if (tie_breaker_result != undefined && !(tie_breaker_result[1] in GRID_LINE_DICT)) {
                    let line_seg = document.createElement("div")
                    line_seg.classList.add(CLASS_DICT.line_segment)
                    if (tie_breaker_result[2] == GRID_LINE_ORIENTATION.horizontal) {
                        line_seg.classList.add(CLASS_DICT.line_segment_horizontal)
                    }
                    if (tie_breaker_result[2] == GRID_LINE_ORIENTATION.vertical) {
                        line_seg.classList.add(CLASS_DICT.line_segment_vertical)
                    }
                    line_seg.style.left = (get_offset(tie_breaker_result[0]).left + 32) + "px"
                    line_seg.style.top = (get_offset(tie_breaker_result[0]).top + 32) + "px"
                    tie_breaker_result[0].appendChild(line_seg)
                    GRID_LINE_DICT[tie_breaker_result[1]] = tie_breaker_result[0]
                }
            }
        }



    }
}

// Function that finds the x,y coordinate of the top-left corner of a given element e
function get_offset(e) {
    var rect = e.getBoundingClientRect();
    return {
        left: rect.left + window.scrollX,
        top: rect.top + window.scrollY
    }
}

// Function that tells the priority of two cells (row>>col)
// e.g. 1-1 shall be listed before 2-1, 1-2 shall be listed before 1-3
// same name or name that is not adjacent shall be rejected, an undefined will be returned
// return will be in [prior_element, namestr, orientation] format
function line_tie_breaker(element_1, element_2) {
    // reject if cannot read the name
    let name_1 = ""
    let name_2 = ""
    let ret_str = ""
    let prior_element = null
    let orientation = null
    try {
        name_1 = element_1.getAttribute(ATTR_DICT.name)
        name_2 = element_2.getAttribute(ATTR_DICT.name)
    } catch (error) {
        console.log("Cannot get the info")
        return undefined
    }
    if (!(element_1.classList).contains(CLASS_DICT.cell) || !(element_2.classList).contains(CLASS_DICT.cell)) {
        console.log("Not a cell")
        return undefined
    }
    if (name_1 == name_2 || name_1 == "" || name_2 == "") {
        console.log("Empty or duplicate element inputed")
        return undefined
    }
    let x_1 = element_1.getAttribute(ATTR_DICT.x_cord)
    let x_2 = element_2.getAttribute(ATTR_DICT.x_cord)
    let y_1 = element_1.getAttribute(ATTR_DICT.y_cord)
    let y_2 = element_2.getAttribute(ATTR_DICT.y_cord)
    if (Math.abs(x_1 - x_2) > 1 || Math.abs(y_1 - y_2) > 1 || (Math.abs(x_1 - x_2) + Math.abs(y_1 - y_2)) > 2) {
        console.log("Not adjacent element")
        return undefined
    }
    if (x_1 < x_2 && y_1 == y_2) {
        ret_str = "v" + name_1 + name_2
        prior_element = element_1
        orientation = GRID_LINE_ORIENTATION.vertical
    }
    if (x_1 > x_2 && y_1 == y_2) {
        ret_str = "v" + name_2 + name_1
        prior_element = element_2
        orientation = GRID_LINE_ORIENTATION.vertical
    }
    if (y_1 < y_2 && x_1 == x_2) {
        ret_str = "h" + name_1 + name_2
        prior_element = element_1
        orientation = GRID_LINE_ORIENTATION.horizontal
    }
    if (y_1 > y_2 && x_1 == x_2) {
        ret_str = "h" + name_2 + name_1
        prior_element = element_2
        orientation = GRID_LINE_ORIENTATION.horizontal
    }
    if (prior_element != null) {
        return [prior_element, ret_str, orientation]
    }
    console.log("unknown error!")
    return undefined
}

// function set_offset_line(line, ID) {
//     line.style.left = (get_offset(GRID_DICT[ID]).left + 32) + "px"
//     line.style.top = (get_offset(GRID_DICT[ID]).top + 32) + "px"
// }


// function add_line() {
//     console.log(GRID_DICT['1-1'])
//     var line_seg = document.createElement("div")
//     line_seg.classList.add(CLASS_DICT.line_segment_horizontal)
//     line_seg.classList.add(CLASS_DICT.line_segment)
//     line_seg.style.left = (get_offset(GRID_DICT['1-1']).left + 32) + "px"
//     line_seg.style.top = (get_offset(GRID_DICT['1-1']).top + 32) + "px"
//     GRID_DICT["1-1"].appendChild(line_seg)

//     var line_seg = document.createElement("div")
//     line_seg.classList.add(CLASS_DICT.line_segment_vertical)
//     line_seg.classList.add(CLASS_DICT.line_segment)
//     line_seg.style.left = (get_offset(GRID_DICT['1-1']).left + 32) + "px"
//     line_seg.style.top = (get_offset(GRID_DICT['1-1']).top + 32) + "px"
//     GRID_DICT["1-1"].appendChild(line_seg)
// }
