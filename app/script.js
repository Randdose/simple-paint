const toolBar = document.querySelector("#tool-bar")
let tool = "brush";

// adds click handler to all tools. the click handler applies the class "selected" to the clicked tool, and changes the variable "tool" to it's Id
toolBar.querySelectorAll(".option-button").forEach(e => {
	e.onclick = () => {
		e.parentElement.querySelector(".selected").classList.remove("selected");
		e.classList.add("selected");
		tool = e.id
	}
});

//drawing board
const board = document.getElementById('board');
const boardEffects = document.getElementById('effect-board');

const ctx = board.getContext('2d');
const effectCtx = boardEffects.getContext('2d');

let offsetX;
let offsetY;

let img;

//mouse position
let currX;
let currY;

let startX;
let startY;

let endX;
let endY;

let isDown = false;

//dialogue
const dial = document.querySelector("#dialogue")

// shows specified dialogue, cannot show more than one at a time
function showDialogue(dialogue){
	//dial.querySelector("#dialogue_content").src = `../assets/dialogues/${dialogue}Dialogue.html`
	dial.parentElement.style.visibility = 'visible'
}

//hides the dialogue
function hideDialogue(){
	dial.parentElement.style.visibility = 'collapse'
}

function updatePreview(){
	dial.querySelector("iframe").src = saveFrame();
}

function download(){
	var saveButton = document.createElement('a');
	saveButton.href = saveFrame();
	saveButton.download = 'image.png';
	saveButton.click();
}

//drawing settings called 'tweaks'
let tweaks = {
	drawWidth : 5,
	drawColor : 'black',
	fillColor : 'black',
	tipType:'round',
	joinType:'round'
}

let effectTweaks = {
	
	drawWidth : 5,
	drawColor : 'black',
	fillColor : 'black',
	tipType:'round',
	joinType:'round'
	
}

let settings = {
	
	maxSaveFrames : 20
	
}

//saved frames array and the index at which the user is currently at
let savedFrames = [];
let currentIndex = 0;

function clearBoard(){
	ctx.clearRect(0, 0, board.width, board.height);
}

function undo(){

	img = new Image();
	img.src = savedFrames[currentIndex-1];
	clearBoard();
	console.log(img);
	ctx.drawImage(img, 0, 0);
	currentIndex--;

}

function redo(){
	
	img = new Image();
	img.src = savedFrames[currentIndex+1];
	clearBoard();
	console.log(img);
	ctx.drawImage(img, 0, 0);
	currentIndex++;

}

//get mouseDown for all of the page
document.body.addEventListener('mousedown', () => {isDown = true;});
document.body.addEventListener('mouseup', () => {isDown = false;});
document.body.addEventListener('mouseleave', () => {isDown = false;});

Array.from(document.querySelectorAll('.panel .slider')).forEach(e => {

	e.addEventListener('click', e => {
		newpanel = e.target.parentNode;

		newpanel.classList.toggle('used');
	})

});

//define all pre-made tools
const brush = {
	
	down : (e) => {ctx.moveTo(currX, currY); ctx.beginPath();},
	move : (e) => {if(isDown){ctx.lineTo(currX, currY); ctx.stroke();} return},
	up : () => {ctx.closePath();},
	specialEffect : (e) => {effectCtx.beginPath(); effectCtx.arc(currX, currY, tweaks.drawWidth/2, 0, 2 * Math.PI); effectCtx.closePath(); effectCtx.fill();},
	clearOnMove : true,
	def_vals : {
	
		
	
	}
};

const eraser = {
	
	down : (e) => {if(isDown){ctx.clearRect(currX - (tweaks.drawWidth/2), currY - (tweaks.drawWidth/2), tweaks.drawWidth, tweaks.drawWidth);}},
	move : (e) => {if(isDown){ctx.clearRect(currX - (tweaks.drawWidth/2), currY - (tweaks.drawWidth/2), tweaks.drawWidth, tweaks.drawWidth);}},
	up : () => {},
	specialEffect : (e) => {effectCtx.beginPath(); effectCtx.rect(currX - (tweaks.drawWidth/2), currY - (tweaks.drawWidth/2), tweaks.drawWidth, tweaks.drawWidth); effectCtx.stroke(); effectCtx.closePath();},
	clearOnMove : true
	
};

const rectangle = {

	down : (e) => {},
	move : (e) => {},
	up : (e) => {},
	speialEffect : (e) => {},
	clearOnMove : true,
	def_vals : {
		
	},
	saved_vals : {
		useBrush : true
	}

}

const text = {
	
	down : (e) => {},
	
};

const colorPicker = {
	
	down : (e) => {},
	move : (e) => {},
	up : (e) => {console.log(getPixelColor(currX, currY, ctx)); console.log(`${currX}, ${currY}`);},
	specialEffect : (e) => {
		effectCtx.beginPath(); effectCtx.strokeStyle = 'black';
		effectCtx.moveTo(currX, currY+3); effectCtx.lineTo(currX, currY+15);
		effectCtx.moveTo(currX, currY-3); effectCtx.lineTo(currX, currY-15);
		effectCtx.moveTo(currX+3, currY); effectCtx.lineTo(currX+15, currY);
		effectCtx.moveTo(currX-3, currY); effectCtx.lineTo(currX-15, currY);
		effectCtx.closePath(); effectCtx.closePath(); effectCtx.stroke()
	},
	clearOnMove : true,
	def_vals : {
	
		drawColor : 'white'
	
	}
};

const select = {

	down : (e) => {},
	move : (e) => {},
	up : (e) => {},
	specialEffect : (e) => {},
	clearOnMove : true,
	def_vals : {

	},
	saved_vals : {
		mode : 'replace',
		shape : 'rect',
		path: new Path2D()
	}

}

boardEffects.addEventListener('mousedown', (e) => {
	
	isDown = true;
	
	ctx.lineWidth = tweaks.drawWidth;
	ctx.strokeStyle = effectCtx.strokeStyle = tweaks.drawColor;
	ctx.fillStyle = effectCtx.fillStyle = tweaks.fillColor;
	ctx.lineCap = effectCtx.lineCap = tweaks.tipType;
	ctx.lineJoin = effectCtx.lineJoin = tweaks.joinType;
	
	currX = e.offsetX;
	currY = e.offsetY;
	
	eval(tool).down(e);

});

boardEffects.addEventListener('mousemove', (e) => {
	
	currX = e.offsetX;
	currY = e.offsetY;
	
	eval(tool).move(e);
	if(eval(tool).clearOnMove = true){effectCtx.clearRect(0,0,board.width,board.height)}
	eval(tool).specialEffect(e);
	
});

boardEffects.addEventListener('mouseup', (e) => {

	isDown = false;
	eval(tool).up(e);
	if(savedFrames.length === settings.maxSaveFrames){
		savedFrames.shift()
		currentIndex -= 1;
	}
	savedFrames.push(saveFrame());
	currentIndex += 1;

});

boardEffects.addEventListener('mouseleave', (e) => {
	
	isDown = false;
	effectCtx.clearRect(0,0,board.width,board.height);
	//effectTweaks = Object.assign(effectTweaks, eval(tool).effectTweaks);
	
});

boardEffects.addEventListener('mouseEnter', (e) => {
	
	//effectTweaks = Object.assign(effectTweaks, eval(tool).effectTweaks);
	
});

function saveFrame(type){
	
	//returns the board's image and if a type is NOT supplied it uses png
	return board.toDataURL(type||'png');
	
}

function drawImage(x, y, src, cboard){

	//create img element with it's source set to src
	img = document.createElement("img");
	img.src = src;

	//get ctx of the current board: currentctx
	cctx = cboard.getContext("2d");

	//draw the image from x,y to the end of the canvas(board)
	cctx.drawImage(img, x, y, cboard.width, cboard.height);

}

function getPixelColor(x, y, context){
	
	return `${context.getImageData(x, y, 1, 1).data[0]}, ${context.getImageData(x, y, 1, 1).data[1]}, ${context.getImageData(x, y, 1, 1).data[2]}`;
	
}

//rest of tools

//color info

/*color info referes to the bg and fg color panel*/
/*document.querySelectorAll('#color-info')[0].addEventListener('click', () => {
	document.querySelectorAll('#color-info')[0].classList.toggle('used');
});

const shadePicker_canvas = document.querySelectorAll('#shade-picking_canvas')[0];
const shadePicker_ctx = shadePicker_canvas.getContext('2d');

const grd = shadePicker_ctx.createLinearGradient(0,0,360,0);
grd.addColorStop(0, 'white');
grd.addColorStop(1, 'red');
shadePicker_ctx.fillStyle = grd;
shadePicker_ctx.fillRect(0,0,360,25);

const colorPicker_canvas = document.querySelector('#color-picking_canvas');
const colorPicker_ctx = colorPicker_canvas.getContext('2d');

const grd2 = colorPicker_ctx.createLinearGradient(0, 0, colorPicker_canvas.width, colorPicker_canvas.height);
grd2.addColorStop(0, 'white');
grd2.addColorStop(0.5, 'red');
grd2.addColorStop(1, 'black');
colorPicker_ctx.fillStyle = grd2;
colorPicker_ctx.fillRect(0, 0, 360, 360);

Array.from(document.querySelectorAll('.color-board')).forEach(
	el => el.addEventListener('mousemove', (e) => {
		document.querySelector('#stroke-color').style.background = `rgb(${getPixelColor(e.offsetX, e.offsetY, colorPicker_ctx)})`;
}));

//document shortcuts
document.addEventListener('keydown', e => {
	
	if(e.ctrlKey){
		switch(e.key){
			case 'H' :
				toolbar.classList.toggle('hidden-bar');
				break;
				
			case 'z' :
				undo();
				break;

			case 'Z' :
				redo();
				break;
		}
	}
	else{console.log('else')}
	console.log(e);
});*/
