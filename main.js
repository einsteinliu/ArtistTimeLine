/**
 * @author einst_000
 */

var scroll = 0;
var BarGroups;
var MainOffsetX = 30;
var MainOffsetY = 30;
var infoBox = null;
var infoList = new Array();
var containtLoaded = false;
var justGenerated = false;
var onInfoBox = false;
var personFolder = "person\\";
var histLevel;

function addCoverDiv(zindex) {
	var cdiv="<div id='coverdiv'></div>";
	$('body').append(cdiv);
	var iWidth = $(window).width();
	var iHeight = $(window).height();
	var stop = $(document).scrollTop();
	var sleft = $(document).scrollLeft(); 
	var divStyle = "position:absolute;left:"+sleft+"px;top:"+stop+"px;width:" + iWidth + "px;height:" + Math.max($(document).height(), iHeight) + "px;filter:Alpha(Opacity=30);opacity:0.3;background-color:#000000;"+"z-index:"+zindex +";" ;
	$("#coverdiv").attr("style", divStyle);
}  

function HistoryLevel(offsetX, offsetY, xEndX, xEndY, yEndX, yEndY,StartYear,EndYear) {
	this.offsetX = offsetX;
	this.offsetY = offsetY;
	this.xEndX = xEndX;
	this.xEndY = xEndY;
	this.yEndX = yEndX;
	this.yEndY = yEndY;
	this.StartYear = StartYear;
	this.EndYear = EndYear;
	this.yearToPx = function(years){
		return Math.round((this.xEndX-this.offsetX)*years/(this.EndYear-this.StartYear));
	};
	this.yearToX = function(year){
		return Math.round(this.offsetX + (this.xEndX-this.offsetX)*(year-this.StartYear)/(this.EndYear-this.StartYear));
	};
}

function Bar(Div,information){
	this.div = Div;
	this.info = information;
}

function Info() {
  this.Keys = new Array();
  this.Values = new Array();
  this.Images = new Array();
  this.bornYear = 0;
  this.deadYear = 0;
  this.get = function(key){
  	for(g=0;g<this.Keys.length;g++){
  		if(this.Keys[g]==key){
  			return this.Values[g];
  		}
  	}
  	return null;
  };
}

function readInfoFile(infoFile)
{
	var lines = getFileLines(infoFile);
}

function BarGroup(element) {
	this.left = 0;
	this.top = 0;
	this.bottom = 0;
	this.right = 0;
	this.id = "BarGroup";
	this.Bars = new Array();
	this.element = element;
}

function newGroup(left, top, groupID, currBarGroups) {
	var htmlTest = "<div id='new' class='BarGroup'></div>";
	$('body').prepend(htmlTest);
	var newgroup = document.getElementById("new");
	newgroup.id = groupID;
	newgroup.style.left = left + "px";
	newgroup.style.top = top + "px";
	var barGroup = new BarGroup(newgroup);
	barGroup.left = left;
	barGroup.top = top;
	barGroup.id = groupID;
	var l = BarGroups.length;
	BarGroups[BarGroups.length] = barGroup;
}

function removeInfoBox() {
	var stop = $(document).scrollTop();
	var sleft = $(document).scrollLeft(); 
	infoBox.animate({ top:500+stop+'px' }, { duration: 200, queue: false, complete: function() { this.remove(); } });
	$("#coverdiv").remove();
	infoBox = null; 
}

function newBar(group,color,barInfo,hist) {
	
/*	var id = barInfo.Values[0].replace(" ", "");
	var text = barInfo.Values[0];
	var born = barInfo.Values[1].split("-")[0];
	var dead = barInfo.Values[1].split("-")[1]; 
	*/
	var id,text,born,dead;
	for(i=0;i<barInfo.Values.length;i++){
        
		if(barInfo.Keys[i]=="Name"){
			id = barInfo.Values[i].replace(" ", "");
			text = barInfo.Values[i];
		}
		else if(barInfo.Keys[i]=="Life Time"){
			born = barInfo.Values[i].split("-")[0];
			barInfo.bornYear = born;
			dead = barInfo.Values[i].split("-")[1]; 
			barInfo.deadYear = dead;
		}
		else{
			continue;
		}
	}
	
	var htmlTest = "<div id='new' class='Bar'>" + text + "</div>";
	$("#" + group.id).append(htmlTest);
	var newbar = document.getElementById("new");
	newbar.id = id;
	
	newbar.onmouseover = function(event) {
		newbar.style.border = "#ff33ff solid thick";
	};
	
	newbar.onmouseout = function(event) {
		newbar.style.border = "";
	};
	newbar.onclick = function(event) {
		var image = "";
		if (infoBox != null) {
			removeInfoBox();
		} else {
			var str = "";
			var image = "";
			for(i=0;i<barInfo.Values.length;i++){
				if (barInfo.Keys[i] != "Image") {
					str += "<br \>"+"<b>" + barInfo.Keys[i] + "<br \>" + "</b>";
					str += barInfo.Values[i].replace(/\r/g,"<br \>").replace(/\n/g,"<br \>");
				}
				else{
					image = personFolder + barInfo.Values[i];
				}
			}
			str += "<br \><br \>";
			var width = document.documentElement.clientWidth;
			var height = document.documentElement.clientHeight;

			var stop = $(document).scrollTop();
			var sleft = $(document).scrollLeft(); 
			//alert(stop);
			//alert(sleft);
			var info;
			if(image!=""){
				info = "<div id='infoBox' class='Info'><img class='InfoImage' src='"+image+"' height=300px/>"+str+"</div>";
			}
			else{
				info = "<div id='infoBox' class='Info'>"+str+"</div>";
			}
			$('body').append(info);
			infoBox = $('#infoBox');
			infoBox.css("top",-height+10+stop+"px");
			infoBox.css("width",0.72*width+"px");
			infoBox.css("height",height-10+"px");
			infoBox.animate({top:stop+"px"},200);
			infoBox.css("left", 0.5*(0.28*width)+ sleft + "px");
			addCoverDiv(infoBox.css("z-index")-1);
			justGenerated = true;
			infoBox.hover(function(){onInfoBox=true;},function(){onInfoBox=false;});
			//infoBox.css("top", event.pageY + "px");
			//infoBox.css("left", event.pageX + "px");
		}
	};
	
	//newbar.style.border = "1px solid blue";
	newbar.style.background = color;
	newbar.style.width = hist.yearToX(dead)-hist.yearToX(born)+"px";
	//newbar.style.left = "0px";
	newbar.style.left = hist.yearToX(born)+"px";
	
	var l = group.Bars.length;
	var currBar = new Bar(newbar,barInfo);
	group.Bars.push(currBar);
	//group.Bars.push(id);
}

function getFileInfo(fileLines){
	var info = new Info;
	var i=0;
	while(i<fileLines.length){
			if(fileLines[i].charAt(0)=="#"){
				var key = fileLines[i].substring(1,fileLines[i].indexOf("#",2));
				info.Keys[info.Keys.length] = key;
				//alert(key);
				i++;
				var value="";
				while(i<fileLines.length){
					if(fileLines[i].charAt(0)!="#"){
						value += fileLines[i];
						i++;
					}
					else{
						break;
					}
				}
				info.Values[info.Values.length] = value;
				//alert(value);
			}
			else{
				i++;
			}
	}
	
	infoList[infoList.length]=info;
}

function getFileLines(file){
	$.ajax({
		async:false,
		url : file,
		dataType : 'text',
		success : function(data) {
			getFileInfo(data.split("\n"));
		}
	});
}



function getFileList() {
	
	var readData = function(data, status) {
		var files = data.split("\n");
		for(i=0;i<files.length;i++){
			if (files[i].search(".txt") != -1) {
				getFileLines(personFolder + files[i]);
			}
		}
	};

	$.ajax({
		async:false,
		url : personFolder + 'files.txt',
		dataType : 'text',
		success : readData
	});
}


function shiftYear(year) {
	diff = histLevel.yearToPx(year);
	//alert(document.getElementById("background").offsetLeft);
	var left = document.getElementById("background").offsetLeft + diff;
	document.getElementById("background").style.left = left + "px";

	for ( i = 0; i < YearsMark.length; i++) {
		var year = YearsMark[i];
		year.style.left = year.offsetLeft + diff + "px";
	}
	
	left = document.getElementById("Italy").offsetLeft + diff;
	document.getElementById("Italy").style.left = left + "px";
	/*for(i=scroll;i<BarGroups[0].Bars.length;i++){
		var bar = BarGroups[0].Bars[i].div;
		bar.style.left = bar.offsetLeft + diff + "px";
	}*/
}

//txtFiles function
$(document).ready(function() {
	BarGroups = new Array();
	var canvas = document.getElementById("background");
	
	canvas.width = window.screen.width - 100;
	canvas.height = window.screen.height - 150;
	histLevel = new HistoryLevel(MainOffsetX, MainOffsetY, canvas.width - 10, MainOffsetX, MainOffsetY, canvas.height - 10,1250,1600);
	var startX = histLevel.yearToX(1000);
	var endX = histLevel.yearToX(1980);
	
	canvas.width = endX - startX;
	canvas.height = window.screen.height - 150;
	canvas.style.left = startX + "px";
	
	histLevel.offsetX = startX;
	histLevel.xEndX = endX;
	histLevel.StartYear = 1000;
	histLevel.EndYear = 1980;
		
	newGroup(MainOffsetX, MainOffsetY, "Italy");

	getFileList();
	drawAxis(histLevel);
	
	
	function sortBy(a,b){
		var Life1 = a.get("Life Time");
		var Life2 = b.get("Life Time");
		if((Life1!=null)&&(Life2!=null)){
			return (Life1.split("-")[0]-Life2.split("-")[0]);
		}
		else{
			return 0;
		}
	};
	
	infoList.sort(sortBy);
	for ( n = 0; n < infoList.length; n++) {
		if(infoList[n].get("Life Time")!="")
			newBar(BarGroups[0], '#ff33ff', infoList[n], histLevel);
	}

	document.onclick = function(event) {
		if (!onInfoBox) {
			if (infoBox != null) {
				if (!justGenerated) {
					removeInfoBox();
				} else {
					justGenerated = false;
				}
			}
		}
	};

   //different browser, different event
   //for IE, chrome: wheelDelta, for FF: detail
	

	$(document).bind('mousewheel DOMMouseScroll', function(event, delta) {
		//alert(event.originalEvent.detail);
		
		if (infoBox == null) {
			var scrollTo = null;

			if (event.type == 'mousewheel') {
				scrollTo = (event.originalEvent.wheelDelta * -1);
			} else if (event.type == 'DOMMouseScroll') {
				scrollTo = event.originalEvent.detail;
			}

			if (scrollTo) {
				event.preventDefault();
				//$(this).scrollTop($(this).scrollTop());
			}
			
			if (scroll >= 0) {
				
				var diff = 0;
				
				
				//document.getElementById("background").style.left = "100px";
				//histLevel.StartYear = BarGroups[0].Bars[scroll].info.bornYear - 10;
				//histLevel.EndYear = histLevel.StartYear + 350;
				//drawScale(histLevel);
				if (event.originalEvent.detail < 0) {
					//document.getElementById(BarGroups[0].Bars[scroll]).style.display="none";
					BarGroups[0].Bars[scroll].div.style.display = "none";
					diff = BarGroups[0].Bars[scroll].info.bornYear - BarGroups[0].Bars[scroll+1].info.bornYear;
					scroll = scroll + 1;

				} 
				else {
					//document.getElementById(BarGroups[0].Bars[scroll]).style.display="block";
					diff = BarGroups[0].Bars[scroll].info.bornYear - BarGroups[0].Bars[scroll-1].info.bornYear;
					BarGroups[0].Bars[scroll].div.style.display = "block";
					if (scroll > 0)
						scroll = scroll - 1;
				}
				shiftYear(diff);
			}

		}
	});

	$(window).resize(function(){  
		if(infoBox!=null){
			var width = document.documentElement.clientWidth;
			var height = document.documentElement.clientHeight;
			var stop = $(document).scrollTop();
			var sleft = $(document).scrollLeft();
			infoBox.css("width",0.72*width+"px");
			infoBox.css("height",height+"px");
			infoBox.css("left", 0.5*(0.28*width)+ sleft + "px");
			$("#coverdiv").css("width",width);
			$("#coverdiv").css("height",height);
		}
	});
	
	infoBox = null;
});

