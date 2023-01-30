styles.sort((a,b) => (a.category > b.category) ? 1 : ((b.category > a.category) ? -1 : 0));
var currentStyle;
var StylesPerPage;
var CurrentPage;
var CurrentCategory;
var loadComplete = false;
var totalPages = Math.trunc(styles.length/StylesPerPage);
function resetPage(){
    currentStyle = 1;
    StylesPerPage = 20;
	CurrentPage = 1;
	CurrentCategory = -1;
	loadComplete = false;
	$("#fancyTexts").html("")
}
var normal;

// Function will call at start
$(document).ready(function () {
    resetPage();
	loadDefaultStyle();
});

(function($) {
$.fn.donetyping = function(callback){
    var _this = $(this);
    var x_timer;    
    _this.keyup(function (){
        clearTimeout(x_timer);
        x_timer = setTimeout(clear_timer, 50);
    }); 

    function clear_timer(){
        clearTimeout(x_timer);
        callback.call(_this);
    }
}
})(jQuery);

$('#StylishTextInput').donetyping(function(callback){
    $(this).delay(400).queue(function() {
		currentStyle = 1;
    	CurrentCategory = -1;
    	normal = this.value;
    
    	$share_url = website_url + "?stylish-text=" + normal;
    	$('#share_url').html($share_url);
    	if(normal == ''){
    		loadDefaultStyle()
    	}else{
    		updateView();
    	}
	    $(this).dequeue();
    });
});

function loadDefaultStyle(){
	currentStyle = 1;
	CurrentCategory = -1;
	var inputValue = $("#StylishTextInput").val();
	normal = "Stylish Text";
	if(inputValue != ''){
		normal = inputValue;
		$share_url = website_url + "?stylish-text=" + normal;
		$('#share_url').html($share_url);
	}else{
		$share_url = website_url;
		$('#share_url').html($share_url);
	}
	updateView();
}
function LoadMoreStyles(){
	if((currentStyle) > styles.length){
		loadComplete = true;
	}else{
		CurrentPage++;
		updateView();
	}
}

// New Styles Will Add Here
function updateView() {
	// Unique Fancy Texts
	var fancyText = "";
	var currentStyleLocal = currentStyle;
	var currentPageLocal = CurrentPage;
	var stylesPerPageLocal = StylesPerPage;

	var iterations = (currentPageLocal * stylesPerPageLocal);
	if(iterations > styles.length){
		iterations = styles.length;
	}

	for (let r = currentStyleLocal - 1; r < iterations; r++){
		fancyText += displayStyles(styles[r],normal,r);
		currentStyle++;
	}

	if(fancyText != ""){
		// Making Changes To UI
		$("#fancyTexts").append($(fancyText))
	}
}

function displayStyles(style, normal, index){
	var fancyText = "";
	var categoryObject = categories.find(o => o.id === CurrentCategory);
    var styleNameWithUnderscore = style["name"].toLowerCase().replace(/ /g, "_");
    
	if(CurrentCategory != style["category"]){
		CurrentCategory = style["category"];
		var categoryTitle = categories.find(o => o.id === CurrentCategory).title;
		var categorObj = categories.find(o => o.id === CurrentCategory);
		var categoryNameWithUnderscore = categoryTitle.toLowerCase().replace(/ /g, "_");
		var selectParameterForCategory = '.'+categoryNameWithUnderscore;
		if ($(selectParameterForCategory)[0]){
		    
		}else{
		    if('ad_before' in categorObj){
    			if(categorObj.ad_before){
    			    fancyText += "<div class='row mt-2 mb-2'><div class='col-12'>";
    				fancyText += categorObj.ad_code;
    				fancyText += "</div></div>";
    			}
    		}
		    fancyText += "<h2 class='"+categoryNameWithUnderscore+"'>"+categoryTitle+"</h2>";
		}
	}
	var selectParameter = '.style_'+styleNameWithUnderscore;
	if ($(selectParameter)[0]){
        $(selectParameter).val(normal[style["name"]]());
    } else {
        if('ad_before' in style){
    		if(style.ad_before){
    			fancyText += "<div class='row mt-2 mb-2'><div class='col-12'>";
    			fancyText += style.ad_code;
    			fancyText += "</div></div>";
    		}
    	}
        fancyText += "<p class='mb-2'>" + style["title"] + "</p>";
        fancyText += "<div class='p-3-mobile row shadow-lg p-3 m-1 mb-3 bg-white rounded stylish_text'> <div class='col-9 col-md-11 col-md-11 justify-content-center align-self-center'><input readonly type='text' id='copy_" + index + "' value='"+ normal[style["name"]]() +"' class='StylishTextInput style_"+styleNameWithUnderscore+"'></div> <div class='col-3 col-md-1 col-lg-1 text-right'> <a data-clipboard-action='copy' data-clipboard-target='#copy_" + index + "' class='btn btn-sm btn-outline-dark copybutton'>Copy</a> </div></div>";
    }
	return fancyText;
}

$(function () {
	var intv = setInterval(function () {
		$(".copybutton").html("Copy");
	}, 2000);
	$("body").on("click", ".copybutton", function () {
		$(".copybutton").html("Copy");
		$(this).html("Copied");
		clearInterval(intv);
	});
});

var clipboard = new ClipboardJS(".copybutton");
clipboard.on("success", function (e) {
	showToast("Stylish Text Coppied Successfully");
});
clipboard.on("error", function (e) {
	console.log(e);
});

function copyToClipboard(element) {
	var $temp = $("<input>");
	$("body").append($temp);
	$temp.val($(element).text()).select();
	var successful = document.execCommand("copy");
	$temp.remove();
    $("#LinkCopySuccess").css("display", "inline-block");
    $(this).delay(1000).queue(function() {
        $("#LinkCopySuccess").css("display", "none");
        $(this).dequeue();
     });
}

$(window).bind('scroll', function() {
    if($(window).scrollTop() - 120 >= $('.stylescontainer').offset().top + $('.stylescontainer').outerHeight() - window.innerHeight) {
		console.log(loadComplete);
		if(loadComplete == false){
			$("#loader").css("display", "inline-block");
		}
		$(this).delay(400).queue(function() {
			if(!loadComplete){
				LoadMoreStyles();
			}
			$("#loader").css("display", "none");
			$(this).dequeue();
		 });
    }
});

function test(){
    alert($('.style_gstars').val());
}
