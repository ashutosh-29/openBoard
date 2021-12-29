let iX,iY;
let headerHeight=document.querySelector(".headerDiv").offsetHeight;

let canvas=document.querySelector("canvas");
let colorPlate=document.querySelectorAll(".colorAll");
let sizeInput=document.querySelector(".sizeTool input");
canvas.style.background='white';
canvas.height=window.screen.height;
canvas.width=window.screen.width;

let tool=canvas.getContext('2d');
let isDraw=false;
let penColor='black';
let penSize=1;
let eraserColor='white';
let curTool='pencil';

let redoUndoArray=[];
let imgData=canvas.toDataURL();
redoUndoArray.push(imgData);
let tracker=0;
document.querySelector('.pencil').addEventListener('click',()=>{
    curTool='pencil';
});
document.querySelector('.eraser').addEventListener('click',()=>{
    curTool='eraser';
});
document.querySelector('.rect').addEventListener('click',()=>{
    curTool='rect';
});
document.querySelector('.circ').addEventListener('click',()=>{
    curTool='circ';
});
document.querySelector('.line').addEventListener('click',()=>{
    curTool='line';
});
document.querySelector('.fillColor').addEventListener('click',()=>{
    curTool='fillColor';
});
colorPlate.forEach(function(item,idx,arr){
    item.addEventListener("click",(e)=>{
        penColor=item.style.backgroundColor;
        document.querySelector('.currentColor').style.backgroundColor=penColor;
        console.log(penColor);
        });
    });

sizeInput.addEventListener('change',(e)=>{
    penSize=sizeInput.value;
})
canvas.addEventListener('mousedown',(e)=>{
    iX=e.clientX;
    iY=e.clientY;
    eraserColor=canvas.style.background;
    let data={
        x:e.clientX,
        y:e.clientY,
        penColor:penColor,
        eraserColor:eraserColor,
        penSize:penSize
    }
    socket.emit("beginPath",data)
});
canvas.addEventListener('mousemove',(e)=>{
    if(isDraw ){
        let data={
            x:e.clientX,
            y:e.clientY
        }
        socket.emit("drawStroke",data)
    }
});
canvas.addEventListener('mouseup',(e)=>{
    isDraw=false;
    let fX=e.clientX,fY=e.clientY;
    if(curTool=='rect'){
        tool.strokeRect(iX, iY-headerHeight, e.clientX-iX, e.clientY-iY);
    }
    else if(curTool=='circ'){
        let d=Math.sqrt(Math.pow(fX-iX,2)+Math.pow(fY-iY,2));
        tool.arc((iX+fX)/2, (fY+iY)/2-headerHeight, d/2, 0,Math.PI * 2);
        tool.stroke();
    }
    else if(curTool=='line'){
        tool.lineTo(fX,fY-headerHeight);
        tool.stroke();
    }
    let imgData=canvas.toDataURL();
    redoUndoArray.push(imgData);
    tracker=redoUndoArray.length-1;
});
document.querySelector(".undo").addEventListener('click',()=>{
    if(tracker>0)tracker--;
    console.log("undo");
    let data={
        arr:redoUndoArray,
        tr:tracker
    }
    socket.emit('setContent',data);
    
});
document.querySelector(".redo").addEventListener('click',()=>{
    if(tracker<redoUndoArray.length-1)tracker++;
    console.log("redo");
    let data={
        arr:redoUndoArray,
        tr:tracker
    }
    socket.emit('setContent',data);
});
function setContent(data){
    let imgData=data.arr[data.tr];
    let newImg=new Image();
    newImg.src=imgData;
    console.log(newImg);
    newImg.onload= (e)=>{
        console.log("loading..");
        tool.clearRect(0,0,canvas.width,canvas.height);
        tool.drawImage(newImg,0,0,canvas.width,canvas.height);
    }
}
function beginPath(data){
    if(curTool=='fillColor'){
        tool.clearRect(0,0,canvas.width,canvas.height);
        canvas.style.background=penColor;
    }
    else{
        tool.beginPath();
        if(curTool!='eraser')tool.strokeStyle=data.penColor;
        else {
            data.eraserColor=canvas.style.background;
            tool.strokeStyle=data.eraserColor;
        }
        if(curTool=='pencil'|| curTool=='eraser' || curTool=='line'){
            if(curTool!='line')isDraw=true;
            tool.moveTo(data.x,data.y-headerHeight);
        }
        tool.lineWidth=data.penSize;
    }
    
}
function drawStroke(data){
    tool.lineTo(data.x,data.y-headerHeight);
    tool.stroke();
}

socket.on("beginPath",(data)=>{
    beginPath(data);
});
socket.on("drawStroke",(data)=>{
    drawStroke(data);
});
socket.on("setContent",(data)=>{
    setContent(data);
});