#import('dart:html');

// Code kindly borrowed from http://paulirish.com/demo/multi 
// Original code by Tim Branyen, Mike Taylr, Paul Irish & Boris Smus, 

class Line {
  num x;
  num y;
  num color;
  Line([this.x=0,this.y=0,this.color=0]);
}

class dartMultiTouchCanvas {

  Map lines;
  List colors = const["red", "green", "yellow", "blue", "magenta", "orangered"];
  CanvasRenderingContext2D context;
  
  dartMultiTouchCanvas() {
  }

  void run() {
    CanvasElement canvas = document.query("#canvas");
    context = canvas.getContext("2d");
    
    document.query("#div").rect.then((ElementRect r) {
      canvas.width = r.scroll.width;
      canvas.height = r.scroll.height;
    });
        
    context.lineWidth = (Math.random() * 35).ceil();
    context.lineCap = "round";
    lines = {};
    canvas.on.touchStart.add(preDraw, false);
    canvas.on.touchMove.add(draw, false);
  }

  preDraw(TouchEvent event) {
    event.touches.forEach((Touch t) {
       var id = t.identifier;
       var mycolor = colors[(Math.random()*colors.length).floor().toInt()];
       lines[id] = new Line(t.pageX, t.pageY, mycolor);
    });
    
    event.preventDefault();
  }
  
  draw(TouchEvent event) {
    event.touches.forEach((Touch t) {
      var id = t.identifier;
      var moveX = t.pageX - lines[id].x;
      var moveY = t.pageY - lines[id].y;
      move(lines[id], moveX, moveY);
      lines[id].x = lines[id].x + moveX;
      lines[id].y = lines[id].y + moveY;
    });
    
    event.preventDefault();
  }
  
  move(line, changeX, changeY) {
    context.strokeStyle = line.color;
    context.beginPath();
    context.moveTo(line.x, line.y);
    
    context.lineTo(line.x + changeX, line.y + changeY);
    context.stroke();
    context.closePath();
  }
 
}

void main() {
  new dartMultiTouchCanvas().run();
}
