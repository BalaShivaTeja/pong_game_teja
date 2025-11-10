const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");
const paddleWidth = 10, paddleHeight = 80;
let player = { x: 10, y: canvas.height / 2 - paddleHeight/ 2, score: 0 };
let cpu = { x: canvas.width - paddleWidth - 10, y: canvas.height / 2 - paddleHeight/ 2, score: 0 };
let ball = { x: canvas.width / 2, y: canvas.height / 2, vx: 5, vy: 3, size: 10 };
canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  player.y = e.clientY - rect.top - paddleHeight/2;
  if (player.y < 0) player.y = 0;
  if (player.y + paddleHeight > canvas.height) player.y = canvas.height - paddleHeight;
});
function drawRect(x,y,w,h,color="#FFF"){
  ctx.fillStyle = color;
  ctx.fillRect(x,y,w,h);
}
function drawBall(){
  ctx.fillStyle = "#FFD700";
  ctx.fillRect(ball.x, ball.y, ball.size, ball.size);
}
function resetBall(winner){
  if (winner) winner.score++;
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.vx = (Math.random() > 0.5 ? 1 : -1) * 5;
  ball.vy = (Math.random() * 4 - 2);
  updateScore();
}
function updateScore(){
  document.getElementById("score").innerText = `Player: ${player.score} — CPU: ${cpu.score}`;
}
function gameLoop(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ball.x += ball.vx;
  ball.y += ball.vy;
  const center = cpu.y + paddleHeight/2;
  if (center < ball.y - 10) cpu.y += 4;
  else if (center > ball.y + 10) cpu.y -= 4;
  if (cpu.y < 0) cpu.y = 0;
  if (cpu.y + paddleHeight > canvas.height) cpu.y = canvas.height - paddleHeight;
  if (ball.y <= 0 || ball.y + ball.size >= canvas.height) ball.vy = -ball.vy;
  if (ball.x <= player.x + paddleWidth && ball.x >= player.x && ball.y + ball.size >= player.y && ball.y <= player.y + paddleHeight) {
    ball.vx = -ball.vx;
    ball.x = player.x + paddleWidth;
    const delta = (ball.y + ball.size / 2) - (player.y + paddleHeight/2);
    ball.vy = delta * 0.15;
  }
  if (ball.x + ball.size >= cpu.x && ball.x + ball.size <= cpu.x + paddleWidth && ball.y + ball.size >= cpu.y && ball.y <= cpu.y + paddleHeight) {
    ball.vx = -ball.vx;
    ball.x = cpu.x - ball.size;
    const delta = (ball.y + ball.size / 2) - (cpu.y + paddleHeight/2);
    ball.vy = delta * 0.15;
  }
  if (ball.x < 0) resetBall(cpu);
  if (ball.x > canvas.width) resetBall(player);
  drawRect(player.x, player.y, paddleWidth, paddleHeight);
  drawRect(cpu.x, cpu.y, paddleWidth, paddleHeight);
  drawBall();
  requestAnimationFrame(gameLoop);
}
document.getElementById("restart").addEventListener("click", () => {
  player.score = cpu.score = 0;
  updateScore();
  resetBall();
});
updateScore();
resetBall();
requestAnimationFrame(gameLoop);
