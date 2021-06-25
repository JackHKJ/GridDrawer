// This variable records the current selected parameter
var SELECTED_ELEMENT = null
// The mode indicator, used to change current mode
var MODE_DICT = {
    content:"content",
    border:"border",
    image:"image"
}
// The default mode is 'content'
var CURRENT_MODE = MODE_DICT.content
// This is used for the thick_border value iteration
var THICK_LIST = ['00','10','11','01']
// This are the available color list for the designed elements
var COLOR_LIBRARY = {
    white: "white",
    red: "red",
    green: "lime",
    gray:"rgb(170, 170, 170)",
    black: "rgb(60, 60, 60)",
    yellow: "yellow",
    blue: "royalblue" 
}

// Automatically create a reverse map for the color library        
var REV_COLOR_LIBRARY = {}
for(var propName in COLOR_LIBRARY)
{
    var this_tag = COLOR_LIBRARY[propName]    
    REV_COLOR_LIBRARY[this_tag]=propName
}
// console.log(REV_COLOR_LIBRARY)


// These are the colors that needs white font color
var DARK_COLORS = ["black","royalblue","red","rgb(60, 60, 60)","rgb(170, 170, 170)"]
// This is the default list for storing the src for the icons
var ICON_SRC_LIST = ['url("$NONE$")']
// The default color used when generating the grid
var DEFAULT_BACKGROUD = COLOR_LIBRARY.white

// The dictionary for all the IDs
var ID_DICT = {
    selected_border_color:"selected_border_color",
    selected_bg_color:"selected_bg_color",
    selected_default_background:"selected_default_background",
    console:"console",
    grid_size_input:"grid_size_input",
    grid_size_input_support:"grid_size_input_support",
    grid_section:"grid_section",
    selected_name:"selected_name",
    selected_text:"selected_text",
    mode_name:"mode_name",
    img:'img'
}
// The dictionary for all cell attributes
var ATTR_DICT = {
    name:"name",
    x_cord:"x_cord",
    y_cord:"y_cord",
    onclick:"onclick",
    border_color:"border_color",
    background_color:"background_color",
    thick_border:"thick_border",
    background_index:"background_index"
}

var CLASS_DICT = {
    grid_line:"grid_line",
    clear_cell:"clear_cell",
    grid_cell:"grid_cell",
    clear_cell_modifier_width:"clear_cell_modifier_width",
    clear_cell_modifier_height:"clear_cell_modifier_height",
    grid_cell_modifier_right:"grid_cell_modifier_right",
    grid_cell_modifier_down:"grid_cell_modifier_down"
}

// The dictionary of all element that uses the color lib
var COLOR_ID = [ID_DICT.selected_border_color, ID_DICT.selected_bg_color, ID_DICT.selected_default_background]

// The list of list that stores the data
var GRID_DATA = []
var GRID_HEIGHT = 0
var GRID_WIDTH = 0

// The JSON for OUTPUT
var JSON_SRC = ""


// This function loads the necessary JSON file
function load_JSON(){
    // $.getJSON('src/data.json',data=>{
    //     console.log(data['author'])
    //     // console.log(data['Nurikabe'])
    //     JSON_SRC = data
    // })

    $.getJSON('https://raw.githubusercontent.com/JackHKJ/GridDrawer/main/src/data.json',data=>{
        console.log(data)
        JSON_SRC = data
     })    

}

// END OF DATA SEGMENT /////////////////////////////////////////////////////////////////////////////////////

function LOAD_COLOR_LIB(){
    // Add the color library to the dropdown list
    
    for(var this_id of COLOR_ID){
        var this_element = document.getElementById(this_id)
        this_element.innerHTML = ''
        for(const [key, value] of Object.entries(COLOR_LIBRARY)){
            this_element.innerHTML += '<option value="'+ value +'">'+ key +'</option>'
        }
    }
}

// The output types

var OUTPUT_TYPE_DICT = {
    Nurikabe:"Nurikabe"
}

function LOAD_OUTPUT_TYPE(){
    var this_element = document.getElementById("download_selector")
    this_element.innerHTML = ''
    for(const [key, value] of Object.entries(OUTPUT_TYPE_DICT)){
        this_element.innerHTML += '<option value="'+ value +'">'+ key +'</option>'
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
function create_grid(){

    // Check the user selection of the default backgroun when selected
    // console.log(document.getElementById('selected_default_background').value)
    let selected_default_bg = REV_COLOR_LIBRARY[document.getElementById(ID_DICT.selected_default_background).value]

    // Create a grid of the given size
    // console.log("Creating a new grid")
    CURRENT_MODE = MODE_DICT.content
    // Get the size "grid_size_input"
    var size = parseInt(document.getElementById(ID_DICT.grid_size_input).value)   
    var size_sup = parseInt(document.getElementById(ID_DICT.grid_size_input_support).value)   
    if (size_sup == parseInt("NaN")){
        size_sup = size
    }
    var grid = document.getElementById(ID_DICT.grid_section)
    grid.innerHTML = "" // clean the current part
    
    for (let i = 0; i < size+2; i++) {
        var this_line = document.createElement('div')
        this_line.className = CLASS_DICT.grid_line
        for (let j = 0; j < size_sup + 2; j++) {          

            var this_element = document.createElement("div")
            this_element.setAttribute(ATTR_DICT.name,i+'-'+j)
            this_element.setAttribute(ATTR_DICT.x_cord,i)
            this_element.setAttribute(ATTR_DICT.y_cord,j)

            this_element.setAttribute(ATTR_DICT.onclick, 'select(this)') 
            // this_element.setAttribute('oncontextmenu', 'clear(this)')
            this_element.addEventListener('contextmenu', clear) 
            // this_element.setAttribute('onwheel','scroll_handler(this)')
            this_element.addEventListener('wheel',scroll_handler)
            

            this_element.setAttribute(ATTR_DICT.border_color, COLOR_LIBRARY.white)
            // this_element.setAttribute('border_color', COLOR_LIBRARY[selected_default_bg])
            // Modify the background when selected
            this_element.setAttribute(ATTR_DICT.background_color, COLOR_LIBRARY.white)
            // this_element.setAttribute('background_color', COLOR_LIBRARY[selected_default_bg])


            this_element.setAttribute(ATTR_DICT.thick_border,'0000') //[top, right][bottom left]
            // this_element.style.backgroundImage = ICON_SRC_LIST[0]
            this_element.setAttribute(ATTR_DICT.background_index,0)

            if(i==0||i==size+1||j==0||j==size_sup+1){
                this_element.className= CLASS_DICT.clear_cell
                if ((i,j)in[(0,0),(size+1,size_sup+1)]){
                    this_element.classList.add(CLASS_DICT.clear_cell_modifier_width)
                }
                if ((i==size & j==0)||(i==size & j==size_sup+1)){
                    this_element.classList.add(CLASS_DICT.clear_cell_modifier_height)
                }
                
            }
            else{
                this_element.className= CLASS_DICT.grid_cell
                if (j==size_sup){
                    this_element.classList.add(CLASS_DICT.grid_cell_modifier_right)
                }
                if(i==size){
                    this_element.classList.add(CLASS_DICT.grid_cell_modifier_down)
                }
                this_element.style.boxShadow = COLOR_LIBRARY[selected_default_bg] 
                this_element.style.background = COLOR_LIBRARY[selected_default_bg]
                
                this_element.setAttribute(ATTR_DICT.border_color, COLOR_LIBRARY[selected_default_bg])
                this_element.setAttribute(ATTR_DICT.background_color, COLOR_LIBRARY[selected_default_bg])
            }
                             
            this_element.innerText=''

            

            this_line.appendChild(this_element)
        }
        grid.appendChild(this_line)        
    }
    // End of creating the grid
    
    // Create the relative GRID_DATA for storage
    GRID_DATA = []
    GRID_HEIGHT = size
    GRID_WIDTH = size_sup
    for (let i = 0; i < size+2; i++) {
        var this_line = []
        for (let j = 0; j < size_sup + 2; j++) { 
            this_line.push("")
        }
        GRID_DATA.push(this_line)
    }
}

// This function will be called when a grid-cell is clicked (Select)
function select(e){
    // modify_selected()
    SELECTED_ELEMENT = e
    document.getElementById(ID_DICT.selected_name).textContent = e.getAttribute(ATTR_DICT.name)   

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
    selected_text.value = e.innerText
    selected_text.focus(function() {this.select()} )
    
    modify_selected()
}

// This function is used to modify the display of the current cell
function modify_selected(e){
    if(SELECTED_ELEMENT == null){
        return
    }
    // Update the text value 
    SELECTED_ELEMENT.innerText = document.getElementById(ID_DICT.selected_text).value
    GRID_DATA[SELECTED_ELEMENT.getAttribute(ATTR_DICT.x_cord)][SELECTED_ELEMENT.getAttribute(ATTR_DICT.y_cord)] = document.getElementById(ID_DICT.selected_text).value
    // console.log(GRID_DATA)
    // Update the border color
    SELECTED_ELEMENT.setAttribute(ATTR_DICT.border_color, document.getElementById(ID_DICT.selected_border_color).value)
    color_value = document.getElementById(ID_DICT.selected_border_color).value + " inset 0 0 0 4px"    
    SELECTED_ELEMENT.style.boxShadow = color_value 
    // Update the background color
    if(parseInt(SELECTED_ELEMENT.getAttribute(ATTR_DICT.background_index)) == 0){
        SELECTED_ELEMENT.setAttribute(ATTR_DICT.background_color, document.getElementById(ID_DICT.selected_bg_color).value)
        color_value = document.getElementById(ID_DICT.selected_bg_color).value
        SELECTED_ELEMENT.style.background = color_value 
    }    
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
    if((target_element.classList).contains(CLASS_DICT.grid_cell)){
        document.getElementById(ID_DICT.selected_border_color).value = document.getElementById(ID_DICT.selected_default_background).value 
    }
    else{
        document.getElementById(ID_DICT.selected_border_color).value = COLOR_LIBRARY.white
    }  
    // Only clear the background when in content mode
    if(CURRENT_MODE ==MODE_DICT.content){       
        if((target_element.classList).contains(CLASS_DICT.grid_cell)){
            document.getElementById(ID_DICT.selected_bg_color).value = document.getElementById(ID_DICT.selected_default_background).value    
        }
        else{
            document.getElementById(ID_DICT.selected_bg_color).value = COLOR_LIBRARY.white  
        }
          
    }
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
            target_element.setAttribute(ATTR_DICT.background_index,0)
            // DeltaY < 0: Scroll on top
            let flag = false
            document.getElementById(ID_DICT.selected_bg_color).value = Object.entries(COLOR_LIBRARY)[0][0]
            for(const [key, value] of Object.entries(COLOR_LIBRARY)){
    
                if(!flag && value == SELECTED_ELEMENT.getAttribute(ATTR_DICT.background_color)){
                    flag = true
                    continue
                }          
                if(flag){
                    document.getElementById(ID_DICT.selected_bg_color).value = value
                    flag = false
                    break
                }
            }
        }
        else{
            // DeltaY > 0: Scroll to bottom
            let flag = false
            document.getElementById(ID_DICT.selected_border_color).value = Object.entries(COLOR_LIBRARY)[0][0]
            for(const [key, value] of Object.entries(COLOR_LIBRARY)){
    
                if(!flag && value == SELECTED_ELEMENT.getAttribute(ATTR_DICT.border_color)){
                    flag = true
                    continue
                }          
                if(flag){
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
    if (CURRENT_MODE == MODE_DICT.border){
        // border mode will not modify the clear cell
        if (target_element.classList.contains(classList.clear_cell)){
            return
        }
        let current_thick_status = target_element.getAttribute(ATTR_DICT.thick_border)
        TR = current_thick_status[0]+current_thick_status[1]
        BL = current_thick_status[2]+current_thick_status[3]
        // console.log(TR)
        // console.log(BL)
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
        // console.log(current_thick_status)
        thick_border_modifier(target_element, current_thick_status)
        target_element.setAttribute(ATTR_DICT.thick_border, current_thick_status)

        modify_selected(target_element)
        return
    }
    if(CURRENT_MODE == MODE_DICT.image){
        // let current_url = target_element.style.backgroundImage
        // console.log(current_url)
        // let index = ICON_SRC_LIST.indexOf(current_url)
        // console.log(index+'/'+ICON_SRC_LIST.length)
        index = parseInt(target_element.getAttribute(ATTR_DICT.background_index))

        
        if(delta<0){
            index = (index - 1 + ICON_SRC_LIST.length) % ICON_SRC_LIST.length

            // console.log(index)
            if(index != 0){
                target_element.style.backgroundImage = ICON_SRC_LIST[index]
                // target_element.style.backgroundColor = 'white'
                target_element.style.backgroundPosition = "center center"
                target_element.style.backgroundSize = 'cover'
            }
            else{
                target_element.style.backgroundImage = "none"
            }
            // console.log(target_element.style.backgroundImage)
            target_element.setAttribute(ATTR_DICT.background_index,index)
        }
        else{
            // DeltaY > 0: Scroll to bottom
            let flag = false
            document.getElementById(ID_DICT.selected_border_color).value = Object.entries(COLOR_LIBRARY)[0][0]
            for(const [key, value] of Object.entries(COLOR_LIBRARY)){
    
                if(!flag && value == SELECTED_ELEMENT.getAttribute(ATTR_DICT.border_color)){
                    flag = true
                    continue
                }          
                if(flag){
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
function change_mode(e){
    let mode_list = Object.keys(MODE_DICT)
    let index = mode_list.indexOf(CURRENT_MODE)
    index = (index + 1) % mode_list.length    
    CURRENT_MODE = MODE_DICT[mode_list[index]]
    document.getElementById(ID_DICT.mode_name).textContent = MODE_DICT[mode_list[index]]
}

// Data segment for modifying the 'border' around the cells
var BORDER_NORMAL = '2px rgb(200, 200, 200) solid'
var BORDER_THICK =  "2px black solid"
// Modifier function that adjust the border based on the attributes
function thick_border_modifier(target, status){
    if(status[0] === "1"){
        target.style.borderTop = BORDER_THICK
    }
    else{
        target.style.borderTop = BORDER_NORMAL
    }
    if(status[1] === "1"){
        target.style.borderLeft = BORDER_THICK
    }
    else{
        target.style.borderLeft = BORDER_NORMAL
    }
    if(status[2] === "1"){
        target.style.borderBottom = BORDER_THICK
    }
    else{
        target.style.borderBottom = BORDER_NORMAL
    }
    if(status[3] === "1"){
        target.style.borderRight = BORDER_THICK
    }
    else{
        target.style.borderRight = BORDER_NORMAL
    }
}

// This function is used to upload the image for icons
function upload(){
    var input = document.getElementById(ID_DICT.img)
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            let result_src = e.target.result
            result_src = "url('" + result_src+ "')"
            if (!ICON_SRC_LIST.includes(result_src)){
                ICON_SRC_LIST.push(result_src)
            }
            // var element = document.getElementById('imgdiv')
            // element.style.backgroundColor = "yellow"
            // element.style.backgroundImage = result_src
        };
        reader.readAsDataURL(input.files[0]);
        let message = input.value
        message = message.slice(message.lastIndexOf("\\")+1)        
        document.getElementById(ID_DICT.console).textContent = message + " uploaded!"
    }
    
    // console.log(ICON_SRC_LIST)
}


// This function helps to output the necessary txt file
function export_to_TXT(content, filename) {    
    var file = new File([content], filename+".txt" , { type:  "text/plain;charset=utf-8"  });
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

function output_by_type(){

    var this_type = document.getElementById("download_selector").value + ""
    // console.log(this_type)
    var str = ""+JSON_SRC[this_type]['function']
    // console.log(str)
    var method = JSONfn.parse(JSONfn.stringify(str))
    var output = method()
    console.log("OUTPUT is:"+output)
    
    if(output != undefined){
        export_to_TXT(output,this_type)
    } 

}

