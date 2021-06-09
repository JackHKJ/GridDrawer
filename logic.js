// This variable records the current selected parameter
var selected_element = null
// This are the available color list for the designed elements
var border_color = {
    white: "white",
    red: "red",
    green: "lime",
    yellow: "yellow",
    blue: "royalblue",
    black: "black"
}
var bg_color = {
    white: "white",
    red: "red",
    green: "lime",
    yellow: "yellow",
    blue: "royalblue",
    black: "black"
}

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


            this_element.setAttribute('border_color', border_color.white)
            this_element.setAttribute('background_color', bg_color.white)

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
    selected_element = e
    document.getElementById("selected_name").textContent = e.getAttribute("name")   

    sel = document.getElementById("selected_border_color")
    var options = Array.from(sel.options);
    // console.log(options)
    options.forEach((option, i) => {
        // console.log(option,i)
      if (option.value === selected_element.getAttribute("border_color")) sel.selectedIndex = i;
    });

    sel = document.getElementById("selected_bg_color")
    var options = Array.from(sel.options);
    // console.log(options)
    options.forEach((option, i) => {
        // console.log(option,i)
      if (option.value === selected_element.getAttribute("background_color")) sel.selectedIndex = i;
    });

    let selected_text = document.getElementById("selected_text")
    selected_text.value = e.innerText
    selected_text.focus(function() {this.select()} )
    
}

// This function is used to modify the display of the current cell
function modify_selected(e){
    if(selected_element == null){
        return
    }
    selected_element.innerText = document.getElementById("selected_text").value

    selected_element.setAttribute("border_color", document.getElementById("selected_border_color").value)
    color_value = document.getElementById("selected_border_color").value + " solid 4px"    
    selected_element.style.border = color_value 

    selected_element.setAttribute("background_color", document.getElementById("selected_bg_color").value)
    color_value = document.getElementById("selected_bg_color").value
    selected_element.style.background = color_value 

}

// This function is used to modify the selected cell, which will clear all the border/bg_color on it
function clear(e){
    e.preventDefault()
    // console.log("rk")
    // console.log(e)
    var target_element = e.target
    // console.log(target_element)
    select(target_element)
    document.getElementById("selected_border_color").value = border_color.white
    document.getElementById("selected_bg_color").value = bg_color.white
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
    // console.log(selected_element.getAttribute("background_color"))

    if(delta < 0){
        // DeltaY < 0: Scroll on top
        let flag = false
        document.getElementById("selected_bg_color").value = Object.entries(bg_color)[0][0]
        for(const [key, value] of Object.entries(bg_color)){

            if(!flag && value == selected_element.getAttribute("background_color")){
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
        document.getElementById("selected_border_color").value = Object.entries(bg_color)[0][0]
        for(const [key, value] of Object.entries(border_color)){

            if(!flag && value == selected_element.getAttribute("border_color")){
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
    modify_selected(target_element)
}

