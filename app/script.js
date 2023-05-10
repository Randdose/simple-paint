const toolBar = document.querySelector("#tool-bar")
let tool = "brush";

// Add click handler to all tools. the click handler applies the class "selected" to the clicked tool, and changes the variable "tool" to it's Id
toolBar.querySelectorAll(".option-button").forEach(e => {
	e.onclick = () => {
		e.parentElement.querySelector(".selected").classList.remove("selected");
		e.classList.add("selected");
		tool = e.id
	}
});

// Drawing board constants
const board = document.getElementById('board');
const boardEffects = document.getElementById('effect-board');

const ctx = board.getContext('2d');
const effectCtx = boardEffects.getContext('2d');

// Offset is how much the position of the board was changed by CSS from the original location
let offsetX;
let offsetY;

// Mouse position and info
let currX;
let currY;

let startX;
let startY;
let test = 0;

let endX;
let endY;

let isDown = false;

// Dialogue element
const dial = document.querySelector("#dialogue")

// shows specified dialogue, cannot show more than one at a time
function showDialogue(dialogue){
	dial.querySelector("#dialogue_content").src = `../assets/dialogues/${dialogue}/${dialogue}Dialogue.html`
	dial.parentElement.style.visibility = 'visible'
}

// hides the dialogue
function hideDialogue(){
	dial.parentElement.style.visibility = 'collapse'
}

function updatePreview(){
	dial.querySelector('iframe').contentWindow.document.querySelector('iframe').src = saveFrame();
}

function download(){
	let saveButton = document.createElement('a');
	saveButton.href = saveFrame();
	saveButton.download = 'image.png';
	saveButton.click();
}

// Drawing settings called 'tweaks'
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

// User settings
let settings = {
	
	maxSaveFrames : 20
	
}

// Saved frames array and the index at which the user is currently at
let savedFrames = [];
let currentIndex = -1;

// Side bar
const rightSideBar = document.querySelector("#right-side_bar")

const colorPicker = rightSideBar.querySelector(".current_color-selector")
colorPicker.addEventListener("change", () => {
	tweaks.drawColor = colorPicker.value
})

board.onmouseup = () => {
	currentIndex++;
	savedFrames += saveData();
}

board.onmousedown = () => {
}

function clearBoard(){
	ctx.clearRect(0, 0, board.width, board.height);
}

function undo(){

	clearBoard();

	img = new Image();
	img.src = savedFrames[currentIndex - 1]
	currentIndex >= 0 ? currentIndex-- : currentIndex = currentIndex;

	img.onload = () => {
		drawImage(0, 0, img, board);
		//ctx.drawImage(img, 0, 0);
	}

}

function redo(){

	clearBoard();

	img = new Image();
	img.src = savedFrames[currentIndex+1]

	img.onload = () => {
		drawImage(0,0,img,board)
	}
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

const colorDropper = {
	
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
		// path: new Path2D()
	}

}

boardEffects.addEventListener('mousedown', (e) => {
	
	isDown = true;
	
	// ctx.lineWidth = tweaks.drawWidth;
	// ctx.strokeStyle = effectCtx.strokeStyle = tweaks.drawColor;
	// ctx.fillStyle = effectCtx.fillStyle = tweaks.fillColor;
	// ctx.lineCap = effectCtx.lineCap = tweaks.tipType;
	// ctx.lineJoin = effectCtx.lineJoin = tweaks.joinType;
	
	currX = e.offsetX;
	currY = e.offsetY;
	
	eval(tool).down(e);

});

boardEffects.addEventListener('mousemove', (e) => {
	
	currX = e.offsetX;
	currY = e.offsetY;

	ctx.lineWidth = tweaks.drawWidth;
	ctx.strokeStyle = effectCtx.strokeStyle = tweaks.drawColor;
	ctx.fillStyle = effectCtx.fillStyle = tweaks.fillColor;
	ctx.lineCap = effectCtx.lineCap = tweaks.tipType;
	ctx.lineJoin = effectCtx.lineJoin = tweaks.joinType;
	
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
	savedFrames.push(saveData(ctx));
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
	return board.toDataURL(`image/${type}`||'png', 1.0);
	
}

function saveData(ctx, settings){

	//returns data of the board which can be drawn onto the canvas
	return ctx.getImageData(0, 0, board.width, board.height, settings)

}

/*function drawImage(x, y, src, cboard){

	//create img element with it's source set to src
	img = new Image();
	img.crossorigin = "anonymous";
	img.src = src;

	cctx = cboard.getContext("2d");

	//draw the image from x,y to the end of the canvas(board)
	img.onload = async function () {
		cctx.drawImage(img, x, y);
	}
}*/

function drawData(x, y, data, cctx){

	cctx.putImageData(data, x, y);

}

function getPixelColor(x, y, context){
	
	return `${context.getImageData(x, y, 1, 1).data[0]}, ${context.getImageData(x, y, 1, 1).data[1]}, ${context.getImageData(x, y, 1, 1).data[2]}`;
	
}

// Document shortcuts
document.addEventListener('keydown', e => {
	
	if(e.ctrlKey){
		console.log(e);

		switch(e.key){
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
});
