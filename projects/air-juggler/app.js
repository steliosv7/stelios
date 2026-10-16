import {advance} from './physics.mjs';
const $=id=>document.getElementById(id),canvas=$('game'),ctx=canvas.getContext('2d'),video=$('video');
let paddle=425,ball,score=0,lives=3,running=false,paused=false,last=0,keys=new Set(),stream=null,tracker=null,tracking=false,loading=false,lastFrame=-1,lastInference=0;
function resetBall(){ball={x:200+Math.random()*450,y:100,vx:100,vy:20}}resetBall();
function updateScore(){$('score').textContent=`Score ${score} · Lives ${lives}`}
function move(e){const r=canvas.getBoundingClientRect();paddle=Math.max(65,Math.min(785,(e.clientX-r.left)*850/r.width))}
canvas.addEventListener('pointermove',move);canvas.addEventListener('pointerdown',e=>{canvas.focus();canvas.setPointerCapture(e.pointerId);move(e)});
canvas.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight',' '].includes(e.key)){e.preventDefault();keys.add(e.key);if(e.key===' '&&running)togglePause()}});window.addEventListener('keyup',e=>keys.delete(e.key));window.addEventListener('blur',()=>{keys.clear();if(running&&!paused)togglePause()});
function togglePause(){if(!running)return;paused=!paused;$('pause').textContent=paused?'Resume':'Pause';$('status').textContent=paused?'Paused.':'Keep it in the air.'}
$('pause').onclick=togglePause;$('start').onclick=()=>{score=0;lives=3;running=true;paused=false;resetBall();updateScore();$('pause').disabled=false;$('pause').textContent='Pause';$('start').textContent='Restart';$('status').textContent='Keep it in the air.';canvas.focus()};
function stopCamera(){tracking=false;if(stream)stream.getTracks().forEach(t=>t.stop());stream=null;video.srcObject=null;video.hidden=true;if(tracker)tracker.close();tracker=null;lastFrame=-1;$('camera').disabled=false;$('stop-camera').disabled=true;$('status').textContent='Camera stopped. Pointer and keyboard controls are active.'}
$('stop-camera').onclick=stopCamera;
$('camera').onclick=async()=>{if(loading||tracking)return;loading=true;$('camera').disabled=true;$('status').textContent='Loading hand tracking…';try{
 if(!navigator.mediaDevices?.getUserMedia)throw Error('Camera needs HTTPS or localhost and a supported browser.');
 const {HandLandmarker,FilesetResolver}=await import('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.18/+esm');
 const vision=await FilesetResolver.forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.18/wasm');
 tracker=await HandLandmarker.createFromOptions(vision,{baseOptions:{modelAssetPath:'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task'},runningMode:'VIDEO',numHands:1});
 stream=await navigator.mediaDevices.getUserMedia({video:{width:640,height:480},audio:false});video.srcObject=stream;await video.play();video.hidden=false;tracking=true;$('stop-camera').disabled=false;$('status').textContent='Camera active. Move your index finger left and right.';
 }catch(err){stopCamera();$('status').textContent='Hand tracking unavailable: '+err.message+' You can still play with pointer or keyboard.'}finally{loading=false}};
function frame(t){const dt=Math.min((t-last)/1000,.025);last=t;
 if(tracking&&video.readyState>=2&&video.currentTime!==lastFrame&&t-lastInference>66){try{const result=tracker.detectForVideo(video,t);lastFrame=video.currentTime;lastInference=t;if(result.landmarks.length){const target=(1-result.landmarks[0][8].x)*850;paddle=Math.max(65,Math.min(785,paddle*.55+target*.45))}}catch(err){stopCamera();$('status').textContent='Tracking stopped: '+err.message}}
 if(running&&!paused){paddle=Math.max(65,Math.min(785,paddle+((keys.has('ArrowRight')?1:0)-(keys.has('ArrowLeft')?1:0))*560*dt));const event=advance(ball,paddle,dt);if(event==='hit'){score++;updateScore()}if(event==='miss'){lives--;updateScore();resetBall();if(lives===0){running=false;$('pause').disabled=true;$('status').textContent=`Game over. ${score} successful hits. Press Restart to try again.`}}}
 ctx.fillStyle='#202833';ctx.fillRect(0,0,850,480);ctx.strokeStyle='#ffffff0a';for(let x=0;x<850;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,480);ctx.stroke()}for(let y=0;y<480;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(850,y);ctx.stroke()}
 ctx.fillStyle='#eea04e';ctx.beginPath();ctx.arc(ball.x,ball.y,12,0,Math.PI*2);ctx.fill();ctx.fillStyle='#a5c6e5';ctx.fillRect(paddle-65,412,130,10);ctx.fillStyle='#adbac8';ctx.font='13px monospace';ctx.fillText(paused?'PAUSED':running?'KEEP IT UP':'AIR JUGGLER / PRESS START',25,35);requestAnimationFrame(frame)}
window.addEventListener('pagehide',stopCamera);requestAnimationFrame(frame);
