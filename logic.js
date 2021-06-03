var selected_element = null
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


function create_grid(){
    // Create a grid of the given size
    console.log("Creating grid")
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


function select(e){
    selected_element = e
    document.getElementById("selected_name").textContent = e.getAttribute("name")   

    sel = document.getElementById("selected_border_color")
    var options = Array.from(sel.options);
    console.log(options)
    options.forEach((option, i) => {
        console.log(option,i)
      if (option.value === selected_element.getAttribute("border_color")) sel.selectedIndex = i;
    });

    sel = document.getElementById("selected_bg_color")
    var options = Array.from(sel.options);
    console.log(options)
    options.forEach((option, i) => {
        console.log(option,i)
      if (option.value === selected_element.getAttribute("background_color")) sel.selectedIndex = i;
    });



    document.getElementById("selected_text").value = e.innerText
}

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