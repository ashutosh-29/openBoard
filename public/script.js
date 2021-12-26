let menu=document.querySelector(".menu");
let expand=document.querySelector(".expandTool");
let contract=document.querySelector(".contractTool");

expand.addEventListener("click",
    function(){
        menu.style.display="flex";
        contract.style.display="flex";
        expand.style.display="none";
    });
contract.addEventListener("click",
    function(){
        menu.style.display="none";
        contract.style.display="none";
        expand.style.display="flex";
    });

let downloadFileBtn=document.querySelector(".downloadFile");
downloadFileBtn.addEventListener("click",()=>{
    let url=canvas.toDataURL();
    let a=document.createElement('a');
    a.href=url;
    a.download="image.jpg";
    a.click();
});
let stickyNotesBtn=document.querySelector(".stickyNotesBtn");
stickyNotesBtn.addEventListener("click",
    function(){
        let div=document.createElement('div');
        div.setAttribute('class','stickyNotesContainer');
        div.innerHTML=`<div class="stickyNotesHeader"><span class="material-icons-outlined stickyMinimise">remove_circle_outline</span><span class="material-icons-outlined stickyCross">cancel</span></div><div class="stickyContentArea"><textarea class="stickyTextArea" ></textarea></div>`;
        document.querySelector('body').append(div);
        
        let minimiseBtn=div.querySelector(".stickyMinimise");
        let isMinimise=false;
        minimiseBtn.addEventListener('click',()=>{
            isMinimise=!isMinimise;
            if(isMinimise){
                let contentArea=div.querySelector('.stickyContentArea');
                contentArea.style.display='none';
            }
            else{
                let contentArea=div.querySelector('.stickyContentArea');
                contentArea.style.display='';
            }
        });
        let closeBtn=div.querySelector(".stickyCross");
        closeBtn.addEventListener('click',()=>{
            closeBtn.parentElement.parentElement.remove();
        });
        dragAndDrop(div);
    });




    let stickyImageBtn=document.querySelector(".stickyImageBtn");
    stickyImageBtn.addEventListener("click",
        function(){
            let input=document.createElement('input');
            input.setAttribute('type','file');
            input.click();
            input.addEventListener('change',()=>{
                let imgFile=input.files[0];
                let url=URL.createObjectURL(imgFile);
                console.log(url);
                let div=document.createElement('div');
            div.setAttribute('class','stickyNotesContainer');
            div.innerHTML=`<div class='stickyNotesHeader'><span class='material-icons-outlined stickyMinimise'>remove_circle_outline</span><span class='material-icons-outlined stickyCross'>cancel</span></div><div class='stickyContentArea'><img src='${url}'></div>`;
            document.querySelector('body').append(div);
            
            let minimiseBtn=div.querySelector(".stickyMinimise");
            let isMinimise=false;
            minimiseBtn.addEventListener('click',()=>{
                isMinimise=!isMinimise;
                if(isMinimise){
                    let contentArea=div.querySelector('.stickyContentArea');
                    contentArea.style.display='none';
                }
                else{
                    let contentArea=div.querySelector('.stickyContentArea');
                    contentArea.style.display='';
                }
            });
            let closeBtn=div.querySelector(".stickyCross");
            closeBtn.addEventListener('click',()=>{
                closeBtn.parentElement.parentElement.remove();
            });
            dragAndDrop(div);
            });
            
        });





function dragAndDrop(div){
    div.onmousedown = function(event) {
        let shiftX = event.clientX - div.getBoundingClientRect().left;
        let shiftY = event.clientY - div.getBoundingClientRect().top;
        div.style.position = 'absolute';
        div.style.zIndex = 1000;
        //document.body.append(div);
        moveAt(event.pageX, event.pageY);
        function moveAt(pageX, pageY) {
          div.style.left = pageX - shiftX + 'px';
          div.style.top = pageY - shiftY + 'px';
        }
        function onMouseMove(event) {
          moveAt(event.pageX, event.pageY);
        }
        document.addEventListener('mousemove', onMouseMove);
        div.onmouseup = function() {
          document.removeEventListener('mousemove', onMouseMove);
          div.onmouseup = null;
        };
      };   
}