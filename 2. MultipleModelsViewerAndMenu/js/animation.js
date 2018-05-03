var _close_open_btn = 0;
function closeNav() {
	if(_close_open_btn == 0){
		_close_open_btn = 1;
		document.getElementById("side_bar").style.width = "0px";
		document.getElementById("scroll_bar_back").style.width = "0px";
		document.getElementById("scroll_bar_back").style.border = "0px";
		document.getElementById("scroll_bar").style.width = "0px";
		document.getElementById("side_btn").textContent = "Open";
		document.getElementById("name").style.display = "none";
		document.getElementById("side_bar_button_div").style.marginLeft= "0px";
	}else{
		_close_open_btn = 0;
		document.getElementById("side_bar").style.width = "450px";
		document.getElementById("scroll_bar_back").style.width = "450px";
		document.getElementById("scroll_bar_back").style.border = "2px solid white";
		document.getElementById("side_btn").textContent = "Close";
		document.getElementById("scroll_bar").style.width = "450px";
		// document.getElementById("name").style.width = "450px";
		document.getElementById("name").style.display = "block";
		document.getElementById("side_bar_button_div").style.marginLeft = "450px";	
	}
}