/**
 * @author einst_000
 */

var YearsMark = new Array();

function addDivOver(x, y, text) {
	var yearText = "<div id='new' class='Year'>"+text+"</div>";
	$('body').append(yearText);
	var newbar = document.getElementById("new");
	newbar.id = text;
	infoBox = $('#'+text);
	infoBox.css("left", x-0.5*infoBox.width() + "px");
	infoBox.css("top", y-infoBox.height() + "px");
	YearsMark.push(newbar);
}


function drawScale(hist) {
	var x=hist.offsetX;
	var canvas = document.getElementById("background");
	var context = canvas.getContext("2d");
	var yearscale = 0;

	for (var year = hist.StartYear; year < hist.EndYear; year += 1) {
		x = hist.yearToX(year);
		//yearscale += 1;
		
		if (year % 5 == 0) {
			if (year % 50 != 0) {
				//if(yearscale!=10){
				context.lineWidth = 1;
				context.moveTo(x, hist.offsetY - 3);
				context.lineTo(x, hist.offsetY + 3);
			} else {
				yearscale = 0;
				addDivOver(x, hist.offsetY - 5, year);
				context.lineWidth = 2;
				context.moveTo(x, hist.offsetY - 5);
				context.lineTo(x, hist.offsetY + 5);
			}
		}

	}
	context.stroke();

	
}


function drawAxis(currHistoryLevel){
	//alert("draw");
	var canvas = document.getElementById("background");
	var context = canvas.getContext("2d");

	context.lineWidth = 2;
	
	var X = currHistoryLevel.offsetX;
	var Y = currHistoryLevel.offsetY;
	var endX = currHistoryLevel.xEndX;
	var endY = currHistoryLevel.xEndY;
	
	//var X = 0;
	//var Y = 0;
	//var endX = currHistoryLevel.xEndX-currHistoryLevel.offsetX;
	//var endY = currHistoryLevel.xEndY;
	
	var arrowL = 10;
	context.moveTo(X,Y);
	context.lineTo(endX,endY);
	context.lineTo(endX-arrowL,endY+0.5*arrowL);
	context.moveTo(endX,endY);
	context.lineTo(endX-arrowL,endY-0.5*arrowL);
	
	/*endX = currHistoryLevel.yEndX;
	endY = currHistoryLevel.yEndY;
	arrowL = 10;
	
	context.moveTo(X,Y);
	context.lineTo(endX,endY);
	context.lineTo(endX-0.5*arrowL,endY-arrowL);
	context.moveTo(endX,endY);
	context.lineTo(endX+0.5*arrowL,endY-arrowL);
	*/
	context.stroke();
	
	drawScale(currHistoryLevel);
};

