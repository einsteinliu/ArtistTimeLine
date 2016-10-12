
var infoList = new Array();

function getFileList() {
	var readData = function(data, status) {
		var lines = data.split("\n");
		for(i=0;i<lines.length;i++){
			infoList[infoList.length]=lines[i];
		}
	};

	$.ajax({ 
		url : 'info.txt',
		dataType : 'text',
		success : readData
	});
}

function newBar(Info) {
	var htmlTest = "<div id='new' class='Bar'>" + Info + "</div>";
	$("body").append(htmlTest);
	var newbar = document.getElementById("new");
	newbar.id = Info;
	newbar.onmouseover = function(event) {
		newbar.style.border = "#ff33ff solid thick";
	};
	
	newbar.onmouseout = function(event) {
		newbar.style.border = "";
	};
	newbar.style.background = "yellow";
	newbar.style.width = "300px";
}

$(document).ready(function() {
	getFileList();
	
	function sortBy(a,b){
		return(b-a);
	};
	
	infoList.sort(sortBy);
	setTimeout(function() {
	
	for ( n = 0; n < infoList.length; n++) {
			newBar(infoList[n]);
	}
	}, 1000);
});
