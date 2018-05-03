 "use strict";

b4w.register("camera_move_styles", function(exports, require) {

var m_app     	= require("app");
var m_cont    	= require("container");
var m_cfg     	= require("config");
var m_data    	= require("data");
var m_scenes  	= require("scenes");
var m_version 	= require("version");
var m_preloader = require("preloader");

var DEBUG = (m_version.type() === "RELEASE");

var _selected_obj = null;

var _data_folder = "data/";
var _data_format = ".json";
var _current_model = null;
var _file_names = [];
var _btn_names = [];
var _help_info = null;
var _help_trigger = 0;
var _btn_show_trigger = []
var _btn_description = []

// Script for reading files
function loadJSON(callback) {
    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
    xobj.open('GET', 'data/info.json', true);
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.response);
          }
    };
    xobj.send(null);
 }

exports.init = function() {
    m_app.init({
        canvas_container_id: "main_canvas_container",
        callback: init_cb,
        physics_enabled: false,
        alpha: true,
        // show_fps: true,
        autoresize: true,
        console_verbose: true,
        gl_debug: true
    });
}

// Scrolling buttons
function up_scroll(){
    document.getElementById('scrolling').scrollTop -= 15; // vertical scroll increments
}
function down_scroll(){
    document.getElementById('scrolling').scrollTop += 15; // vertical scroll increments
}
// Loading inti, preloader and parse json file
function init_cb(canvas_elem, success) {
    // m_cfg.apply_quality(m_cfg.P_HIGH); // Loading quality LOW,HIGH,ULTRA
    if (!success) {
        console.log("b4w init failure");
        return;
    }

    m_preloader.create_preloader();

    window.onresize = m_cont.resize_to_container;
    m_cont.resize_to_container();

    loadJSON(function(response) {
		// Parse JSON string into object
		var actual_JSON = JSON.parse(response);
		for(var i = 0; i < actual_JSON.data.length;i++){
		    _file_names.push(_data_folder + actual_JSON.data[i].name_file);
		    _btn_names.push(actual_JSON.data[i].name_btn)
		    _btn_show_trigger.push(actual_JSON.data[i].show_trigger)
		    _btn_description.push(actual_JSON.data[i].descr)
		}

		_help_info = actual_JSON.question
		document.getElementById("up_scroll").addEventListener("click", up_scroll);
		document.getElementById("down_scroll").addEventListener("click", down_scroll);
		load(_file_names[0]);
	});

}
// Preloader anim
function preloader_cb(percentage) {
    m_preloader.update_preloader(percentage);
}


//Function for showing help information
function load_help(){
    var help = document.getElementById("help_text")
    if(_help_info != null){
        help.textContent = _help_info
	}
}

//Load first object first :)
function load(first_obj) {
    _current_model = m_data.load(_file_names[0], load_cb, preloader_cb);
    init_interface();
    load_help();
}

function load_cb(data_id) {
    m_app.enable_camera_controls();
    var camera = m_scenes.get_active_camera();    
}

function init_interface(){
    var scrolling = document.getElementById("scrolling");

    for(var i = 0; i < _file_names.length; i++){
        if (_btn_show_trigger[i] == 1){
	        var container = document.createElement("div");
	        container.className = "container noselect";
	        container.id = i;
	        var scenes_name = document.createElement("a");

	        if (i == _current_model)
	            scenes_name.className = "inv_text";
	        else
	            scenes_name.className = "text";

	        scenes_name.textContent = _btn_names[i];
	        container.onclick = button_index;
	        container.appendChild(scenes_name);
	        scrolling.appendChild(container);
        }
    }
}

// Loading files with loading protection
var _file_loaded = true;
function button_index(e) {
	e = e || window.event;
	var target = e.target || e.srcElement;

	// Check loaded pos and block clicking on elements
	// Also change 
    var loaded_cb = function(data_id, success){
        _file_loaded = true;
        var selected_btn = document.querySelector('.inv_text');
		selected_btn.classList.remove('inv_text');
		selected_btn.className = 'text';
		target.classList.remove('inv_text');
		target.className = 'inv_text';
		m_app.enable_camera_controls();
    }
    if(_file_loaded){
        _file_loaded = false;
		m_data.unload(_current_model);
		_current_model = m_data.load(_file_names[this.id], loaded_cb, null, true);

        var description_text = document.getElementById("description_text");
        description_text.textContent = _btn_description[this.id]
    }
}


});
b4w.require("camera_move_styles").init();
