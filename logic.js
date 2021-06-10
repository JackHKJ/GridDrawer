// This variable records the current selected parameter
var SELECTED_ELEMENT = null
// The mode indicator, used to change current mode
var MODE_DICT = {
    content:"content",
    border:"border"
}
var CURRENT_MODE = MODE_DICT.content
// This is used for the thick_border value iteration
var THICK_LIST = ['00','10','11','01']
// This are the available color list for the designed elements
var COLOR_LIBRARY = {
    white: "white",
    red: "red",
    green: "lime",
    yellow: "yellow",
    blue: "royalblue",
    black: "black"
}

var DARK_COLORS = ["black","royalblue","red"]

// This is the default function for creating the grid
function create_grid(){
    // Create a grid of the given size
    console.log("Creating a new grid")
    // Get the size
    var size = parseInt(document.getElementById("grid_size_input").value)   
    var grid = document.getElementById("grid_section")
    grid.innerHTML = "" // clean the current part
    
    for (let i = 0; i < size+2; i++) {
        var this_line = document.createElement('div')
        this_line.className = "grid_line"
        for (let j = 0; j < size+2; j++) {          

            var this_element = document.createElement("div")
            this_element.setAttribute("name",i+'-'+j)
            this_element.setAttribute('onclick', 'select(this)') 
            // this_element.setAttribute('oncontextmenu', 'clear(this)')
            this_element.addEventListener('contextmenu', clear) 
            // this_element.setAttribute('onwheel','scroll_handler(this)')
            this_element.addEventListener('wheel',scroll_handler)


            this_element.setAttribute('border_color', COLOR_LIBRARY.white)
            this_element.setAttribute('background_color', COLOR_LIBRARY.white)
            this_element.setAttribute('thick_border','0000') //[top, right][bottom left]

            if(i==0||i==size+1||j==0||j==size+1){
                this_element.className="clear_cell"
                if ((i,j)in[(0,0),(size+1,size+1)]){
                    this_element.classList.add("clear_cell_modifier_width")
                }
                if ((i==size & j==0)||(i==size & j==size+1)){
                    this_element.classList.add("clear_cell_modifier_height")
                }
                
            }
            else{
                this_element.className="grid_cell"
                if (j==size){
                    this_element.classList.add("grid_cell_modifier_right")
                }
                if(i==size){
                    this_element.classList.add("grid_cell_modifier_down")
                }
            }
                             
            this_element.innerText=''
            this_line.appendChild(this_element)
        }
        grid.appendChild(this_line)
        
    }
}

// This function will be called when a grid-cell is clicked (Select)
function select(e){
    modify_selected()
    SELECTED_ELEMENT = e
    document.getElementById("selected_name").textContent = e.getAttribute("name")   

    sel = document.getElementById("selected_border_color")
    var options = Array.from(sel.options);
    // console.log(options)
    options.forEach((option, i) => {
        // console.log(option,i)
      if (option.value === SELECTED_ELEMENT.getAttribute("border_color")) sel.selectedIndex = i;
    });

    sel = document.getElementById("selected_bg_color")
    var options = Array.from(sel.options);
    // console.log(options)
    options.forEach((option, i) => {
        // console.log(option,i)
      if (option.value === SELECTED_ELEMENT.getAttribute("background_color")) sel.selectedIndex = i;
    });

    let selected_text = document.getElementById("selected_text")
    selected_text.value = e.innerText
    selected_text.focus(function() {this.select()} )
    
}

// This function is used to modify the display of the current cell
function modify_selected(e){
    if(SELECTED_ELEMENT == null){
        return
    }
    // Update the text value 
    SELECTED_ELEMENT.innerText = document.getElementById("selected_text").value
    // Update the border color
    SELECTED_ELEMENT.setAttribute("border_color", document.getElementById("selected_border_color").value)
    color_value = document.getElementById("selected_border_color").value + " inset 0 0 0 4px"    
    SELECTED_ELEMENT.style.boxShadow = color_value 
    // Update the background color
    SELECTED_ELEMENT.setAttribute("background_color", document.getElementById("selected_bg_color").value)
    color_value = document.getElementById("selected_bg_color").value
    SELECTED_ELEMENT.style.background = color_value 
    // Adjust the font color if the color value is black
    if(DARK_COLORS.includes(color_value)){
        SELECTED_ELEMENT.style.color = COLOR_LIBRARY.white
    }
    else{
        SELECTED_ELEMENT.style.color = COLOR_LIBRARY.black
    }
}

// This function is used to modify the selected cell, which will clear all the border/COLOR_LIBRARY on it
function clear(e){
    e.preventDefault()
    // console.log("rk")
    // console.log(e)
    var target_element = e.target
    // console.log(target_element)
    select(target_element)
    document.getElementById("selected_border_color").value = COLOR_LIBRARY.white
    document.getElementById("selected_bg_color").value = COLOR_LIBRARY.white
    modify_selected(target_element)
}

// This function is to handle the mouse scroll
function scroll_handler(e){
    e.preventDefault()
    // console.log("scrolled")
    // console.log(e)
    var target_element = e.target
    var delta = parseFloat(e.deltaY)
    // console.log(delta)    
    select(target_element)
    // console.log(SELECTED_ELEMENT.getAttribute("background_color"))
    // Under content mode:
    if (CURRENT_MODE == MODE_DICT.content){
        if(delta < 0){
            // DeltaY < 0: Scroll on top
            let flag = false
            document.getElementById("selected_bg_color").value = Object.entries(COLOR_LIBRARY)[0][0]
            for(const [key, value] of Object.entries(COLOR_LIBRARY)){
    
                if(!flag && value == SELECTED_ELEMENT.getAttribute("background_color")){
                    flag = true
                    continue
                }          
                if(flag){
                    document.getElementById("selected_bg_color").value = value
                    flag = false
                    break
                }
            }
        }
        else{
            // DeltaY > 0: Scroll to bottom
            let flag = false
            document.getElementById("selected_border_color").value = Object.entries(COLOR_LIBRARY)[0][0]
            for(const [key, value] of Object.entries(COLOR_LIBRARY)){
    
                if(!flag && value == SELECTED_ELEMENT.getAttribute("border_color")){
                    flag = true
                    continue
                }          
                if(flag){
                    document.getElementById("selected_border_color").value = value
                    flag = false
                    break
                }
            }
        }
    }
    // Under border mode, modify the thick_border iteratively
    else{
        let current_thick_status = target_element.getAttribute('thick_border')
        TR = current_thick_status[0]+current_thick_status[1]
        BL = current_thick_status[2]+current_thick_status[3]
        console.log(TR)
        console.log(BL)
        // Modify [top right]
        if(delta < 0){
          let index = THICK_LIST.indexOf(TR)
          index = (index+1)%4
          TR = THICK_LIST[index]
        }
        // Modify [bottom left]
        else{
            let index = THICK_LIST.indexOf(BL)
            index = (index+1)%4
            BL = THICK_LIST[index]
        }
        current_thick_status = TR+BL
        console.log(current_thick_status)
        thick_border_modifier(target_element, current_thick_status)
        target_element.setAttribute('thick_border', current_thick_status)
    }
    
    modify_selected(target_element)
}

function change_mode(e){
    if(CURRENT_MODE == MODE_DICT.content){
        CURRENT_MODE = MODE_DICT.border
        document.getElementById("mode_name").textContent = MODE_DICT.border
    }
    else{
        CURRENT_MODE = MODE_DICT.content
        document.getElementById("mode_name").textContent = MODE_DICT.content
    }
}

function thick_border_modifier(target, status){
    if(status[0] === "1"){
        target.style.borderTop = "2px black solid"
    }
    else{
        target.style.borderTop = '2px rgb(200, 200, 200) solid'
    }
    if(status[1] === "1"){
        target.style.borderRight = "2px black solid"
    }
    else{
        target.style.borderRight = '2px rgb(200, 200, 200) solid'
    }
    if(status[2] === "1"){
        target.style.borderBottom = "2px black solid"
    }
    else{
        target.style.borderBottom = '2px rgb(200, 200, 200) solid'
    }
    if(status[3] === "1"){
        target.style.borderLeft = "2px black solid"
    }
    else{
        target.style.borderLeft = '2px rgb(200, 200, 200) solid'
    }
}