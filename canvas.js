var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
c.addEventListener('mousemove', MouseMoved);

var score = 0;
var circles = [];
resetCircles();

var me = new Circle(0, 0, 15, "black", 0, 0);
function MouseMoved(event) {
   me.setLocation(event.clientX, event.clientY);
}

var health = new Health();

setInterval(function() {
   var circle = new Circle(Math.random() * c.width, Math.random() * c.height, 10, getRandomColor(), Math.random() * 10 - 5, Math.random() * 10 - 5);
   circles.push(circle);
}, 1000)
window.requestAnimationFrame(draw);


///////////////////////////////////

function restart() {
   score = 0;
   resetCircles();
   health = new Health();
   window.requestAnimationFrame(draw);
}

function resetCircles() {
   circles = [];
   for (var i = 0; i < 5; i++) {
      var circle = new Circle(Math.random() * c.width, Math.random() * c.height, 10, getRandomColor(), Math.random() * 10 - 5, Math.random() * 10 - 5);
      circles.push(circle);
   }
}

function getRandomColor() {
   var letters = '0123456789ABCDEF';
   var color = '#';
   for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
   }
   return color;
}

function Health() {
   this.health = 100;
   this.loseHealth = function() {
      this.health = this.health - 1;
   }
   this.isAlive = function() {
      if (this.health > 0) {
         return true;
      }
      return false;
   }
   this.draw = function() {
      ctx.fillStyle = "red";
      ctx.fillRect(0, c.height - 10, (c.width / 100) * this.health, 10);
   }
}

function Circle(x, y, r, color, dx, dy) {
   this.x = x;
   this.y = y;
   this.r = r;
   this.color = color;
   this.dx = dx;
   this.dy = dy;

   this.setLocation = function(x, y) {
      this.x = x;
      this.y = y;
   }

   this.draw = function() {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
      ctx.fill();
   }

   this.update = function() {
      this.x = this.x + this.dx;
      this.y = this.y + this.dy;
      if (this.y + this.r > c.height) {
         this.dy = this.dy * -1;
         this.y = c.height - this.r;
      }
      if (this.y - this.r < 0) {
         this.dy = this.dy * -1;
         this.y = 0 + this.r;
      }
      if (this.x + this.r > c.width) {
         this.dx = this.dx * -1;
         this.x = c.width - this.r;
      }
      if (this.x - this.r < 0) {
         this.dx = this.dx * -1;
         this.x = 0 + this.r;
      }
   }
}

function checkCollision(me, circles) {
   for (var i = 0; i < circles.length; i++) {
      var dx = me.x - circles[i].x;
      var dy = me.y - circles[i].y;
      var distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < me.r + circles[i].r) {
         return true;
      }
   }
   return false;
}

function draw() {
   clearCanvas();
   health.draw();
   me.draw();
   for (var i = 0; i < circles.length; i++) {
      circles[i].update();
      circles[i].draw();
   }
   if (checkCollision(me, circles)) {
      health.loseHealth();
   }
   if (health.isAlive() == false) {
      alert("GAME OVER! Score: " + score);
      clearCanvas();
      return;
   }

   score++;
   ctx.font = "20px Arial";
   ctx.fillStyle = "grey";
   ctx.fillText("Score: " + score, 0, 20);
   window.requestAnimationFrame(draw);
}

function clearCanvas() {
   ctx.fillStyle = "white";
   ctx.fillRect(0, 0, c.width, c.height);
}
