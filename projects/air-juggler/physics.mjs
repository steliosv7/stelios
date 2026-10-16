export function advance(ball,paddle,dt){
 ball.vy+=400*dt;ball.x+=ball.vx*dt;ball.y+=ball.vy*dt;
 if(ball.x<12){ball.x=12;ball.vx=Math.abs(ball.vx)}
 if(ball.x>838){ball.x=838;ball.vx=-Math.abs(ball.vx)}
 if(ball.y<12){ball.y=12;ball.vy=Math.abs(ball.vy)}
 if(ball.vy>0&&ball.y+12>=412&&ball.y+12<=440&&Math.abs(ball.x-paddle)<75){ball.y=400;ball.vy=-Math.min(520,Math.abs(ball.vy)*1.02);ball.vx=(ball.x-paddle)*5;return 'hit'}
 return ball.y>510?'miss':null;
}
