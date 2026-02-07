const size = 15;
let timer = 0;
let interval;
let undoStack = [];
let locked = false;
const lockKey = "nonogramSolved";

/* ===== SOLUTION ===== */

const solution = [
[1,1,1,1,1,0,0,1,1,1,0,0,1,1,1],
[1,0,0,0,1,0,1,1,1,0,1,0,1,0,1],
[1,0,1,0,1,0,1,0,1,0,1,0,1,0,1],
[1,0,1,1,1,0,1,0,1,0,1,1,1,0,1],
[1,0,0,0,1,0,1,0,1,0,1,0,0,0,1],
[1,1,1,1,1,0,1,0,1,0,1,1,1,1,1],
[0,0,0,0,0,0,1,0,1,0,0,0,0,0,0],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[0,0,0,0,0,0,1,0,1,0,0,0,0,0,0],
[1,1,1,1,1,0,1,0,1,0,1,1,1,1,1],
[1,0,0,0,1,0,1,0,1,0,1,0,0,0,1],
[1,0,1,1,1,0,1,0,1,0,1,1,1,0,1],
[1,0,1,0,1,0,1,0,1,0,1,0,1,0,1],
[1,0,0,0,1,0,1,1,1,0,1,0,0,0,1],
[1,1,1,1,1,0,0,1,1,1,0,0,1,1,1],
];

/* ===== START ===== */

function startGame(){
  if(localStorage.getItem(lockKey)){
    alert("Already solved on this device.");
    return;
  }

  document.getElementById("startScreen").style.display="none";
  document.getElementById("gameArea").style.display="block";

  buildGame();
  startTimer();
}

/* ===== TIMER ===== */

function startTimer(){
  interval=setInterval(()=>{
    timer++;
    let m=Math.floor(timer/60).toString().padStart(2,'0');
    let s=(timer%60).toString().padStart(2,'0');
    document.getElementById("timer").innerText=`Time: ${m}:${s}`;
  },1000);
}

/* ===== BUILD ===== */

function buildGame(){
  const container=document.getElementById("game");
  const table=document.createElement("table");

  for(let r=0;r<size;r++){
    const tr=document.createElement("tr");

    for(let c=0;c<size;c++){
      const td=document.createElement("td");
      td.className="cell";
      td.dataset.row=r;
      td.dataset.col=c;

      td.onclick=function(){
        if(locked) return;

        if(this.classList.contains("xmark"))
          this.classList.remove("xmark");

        this.classList.toggle("fill");
        undoStack.push(this);
      };

      td.oncontextmenu=function(e){
        e.preventDefault();
        if(locked) return;

        if(this.classList.contains("fill"))
          this.classList.remove("fill");

        this.classList.toggle("xmark");
        undoStack.push(this);
      };

      tr.appendChild(td);
    }
    table.appendChild(tr);
  }
  container.appendChild(table);
}

/* ===== UNDO ===== */

function undoMove(){
  const last=undoStack.pop();
  if(last){
    last.classList.remove("fill");
    last.classList.remove("xmark");
  }
}

/* ===== CLEAR ===== */

function clearGrid(){
  if(locked) return;
  document.querySelectorAll(".cell").forEach(cell=>{
    cell.classList.remove("fill");
    cell.classList.remove("xmark");
  });
}

/* ===== SUBMIT ===== */

function submitPuzzle(){
  if(locked) return;

  let correct=true;

  document.querySelectorAll(".cell").forEach(cell=>{
    let r=cell.dataset.row;
    let c=cell.dataset.col;
    let filled=cell.classList.contains("fill")?1:0;
    if(filled!=solution[r][c]) correct=false;
  });

  if(correct){
    locked=true;
    clearInterval(interval);
    localStorage.setItem(lockKey,"true");
    showResult("Correct! Code: "+generateCode());
  }else{
    showResult("Incorrect Solution");
  }
}

/* ===== CODE ===== */

function generateCode(){
  const chars="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  let code="";
  for(let i=0;i<52;i++){
    code+=chars[Math.floor(Math.random()*chars.length)];
  }
  return code;
}

/* ===== RESULT ===== */

function showResult(msg){
  document.getElementById("resultMessage").innerText=msg;
}
