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

function Nurikabe_output(e){   

    var template = ''+ JSON_SRC['Nurikabe']['template']
    template = template.replace('$HEIGHT$',GRID_HEIGHT)
    template = template.replace('$WIDTH$',GRID_WIDTH)
    var content = ''
    var cell = ''+ JSON_SRC['Nurikabe']['cell']
    var flag = false
    for (let i = 0; i < GRID_HEIGHT; i++) {
        for (let j = 0; j < GRID_WIDTH; j++) {
            if(GRID_DATA[i+1][j+1] != ''){
                var thisline = cell.replace('$VALUE$',GRID_DATA[i+1][j+1]).replace('$X$',i).replace('$Y$',j)
                content += thisline
                flag = true
            }
        }
    }
    template = template.replace('$CONTENT$',content)
    if(flag){
        console.log(template)
        return template
    }
    else{
        console.log("Nothing to output! Empty board.")
    }

}


function Sudoku_output(e){   

    if(GRID_WIDTH!=GRID_HEIGHT){
        console.log("Not a Sudoku board!")
        return
    }
    var template = ''+ JSON_SRC['Sudoku']['template']
    template = template.replace('$SIZE$',GRID_HEIGHT)
    var content = ''
    var cell = ''+ JSON_SRC['Sudoku']['cell']
    var flag = false
    for (let i = 0; i < GRID_HEIGHT; i++) {
        for (let j = 0; j < GRID_WIDTH; j++) {
            if(GRID_DATA[i+1][j+1] != '' && Number.isInteger(parseInt(GRID_DATA[i+1][j+1]))){
                var thisline = cell.replace('$VALUE$',GRID_DATA[i+1][j+1]).replace('$X$',i).replace('$Y$',j)
                content += thisline
                flag = true
            }
        }
    }
    template = template.replace('$CONTENT$',content)
    if(flag){
        console.log(template)
        return template
    }
    else{
        console.log("Nothing to output! Empty board.")
    }

}

function GeneralWithBorderLabel_output(e) {
    let template = '' + JSON_SRC['GeneralWithBorderLabel']['template']
    template = template.replace('$HEIGHT$', GRID_HEIGHT)
    template = template.replace('$WIDTH$', GRID_WIDTH)
    let content = ''
    let cell = '' + JSON_SRC['GeneralWithBorderLabel']['cell']
    let clue = '' + JSON_SRC['GeneralWithBorderLabel']['clue']

    // Replacing the content of the grid
    let flag = false
    for (let i = 0; i < GRID_HEIGHT; i++) {
        for (let j = 0; j < GRID_WIDTH; j++) {
            if (GRID_DATA[i + 1][j + 1] != '') {
                let thisline = cell.replace('$VALUE$', GRID_DATA[i + 1][j + 1]).replace('$X$', i).replace('$Y$', j)
                content += thisline
                flag = true
            }
        }
    }
    template = template.replace('$CONTENT$', content)
    if (!flag) {
        console.log("Nothing to output! Empty board.")
        return undefined
    }
    // The east axis
    let east_axis = ''
    for (let i = 0; i < GRID_HEIGHT; i++) {
        if (GRID_DATA[i + 1][0] == '' || GRID_DATA[i + 1][GRID_WIDTH + 1] == '') {
            console.log("Missing east axis value pair, at column" + (i + 1))
            console.log(GRID_DATA[i + 1][0])
            console.log(GRID_DATA[i + 1][GRID_WIDTH + 1])
            return undefined
        }
        let this_line = clue.replace('$INDEX$', GRID_DATA[i + 1][0]).replace('$VALUE$', GRID_DATA[i + 1][GRID_WIDTH + 1])
        east_axis += this_line
    }
    template = template.replace('$AXISEAST$', east_axis)
    let south_axis = ''
    for (let j = 0; j < GRID_WIDTH; j++) {
        if (GRID_DATA[0][j + 1] == '' || GRID_DATA[GRID_HEIGHT][j + 1] == '') {
            console.log("Missing south axis value pair, at row" + (j + 1))
            console.log(GRID_DATA[0][j + 1])
            console.log(GRID_DATA[GRID_HEIGHT + 1][j + 1])
            return undefined
        }
        let this_line = clue.replace('$INDEX$', GRID_DATA[0][j + 1]).replace('$VALUE$', GRID_DATA[GRID_HEIGHT + 1][j + 1])
        south_axis += this_line
    }
    template = template.replace('$AXISSOUTH$', south_axis)
    return template
}

function test() {
    console.log(GeneralWithBorderLabel_output())
    console.log(JSONfn.stringify(GeneralWithBorderLabel_output))
}
