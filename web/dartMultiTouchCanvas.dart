import 'dart:html';
import 'dart:math' as Math;

// Code kindly borrowed from http://paulirish.com/demo/multi
// Original code by Tim Branyen, Mike Taylr, Paul Irish & Boris Smus,

class Line {
  int x;
  int y;
  String color;
  Line([this.x=0,this.y=0,this.color="red"]);
}

class dartMultiTouchCanvas {

  Map lines;
  List colors = const["red", "green", "yellow", "blue", "magenta", "orangered"];
  CanvasRenderingContext2D context;
  Math.Random random = new Math.Random();

  // Used for testing on non-touch devices, such as the browser
  int mouseId = 0;
  bool mouseMoving = false;

  void run() {
    CanvasElement canvas = document.query("#canvas");
    context = canvas.getContext("2d");

    DivElement div = document.query("#div");
    canvas.width = div.scrollWidth;
    canvas.height= div.scrollHeight;

    context.lineWidth = (random.nextDouble() * 35).ceil();
    context.lineCap = "round";
    lines = {};
    canvas.on.touchStart.add(preDraw, false);
    canvas.on.touchMove.add(draw, false);

    // Used for testing on non-touch
    canvas.on.mouseDown.add(preDrawMouse, false);
    ///canvas.on.mouseUp.add(drawMouse, false);
    canvas.on.mouseMove.add(drawMouse);
    canvas.on.mouseUp.add(drawMouseStop);
  }

  preDraw(TouchEvent event) {
    event.touches.forEach((Touch t) {
       var id = t.identifier;
       var mycolor = colors[(random.nextDouble()*colors.length).floor().toInt()];
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


  drawMouseStop(MouseEvent event) => mouseMoving = false;
  preDrawMouse(MouseEvent event) {
    mouseMoving = true;
    mouseId++;
    var id = mouseId.toString();
    var mycolor = colors[(random.nextDouble()*colors.length).floor().toInt()];
    lines[id] = new Line(event.pageX, event.pageY, mycolor);
    event.preventDefault();
  }

  drawMouse(MouseEvent event) {
    if (!mouseMoving) return;

    var id = mouseId.toString();
    var moveX = event.pageX - lines[id].x;
    var moveY = event.pageY - lines[id].y;
    move(lines[id], moveX, moveY);
    lines[id].x = lines[id].x + moveX;
    lines[id].y = lines[id].y + moveY;
    event.preventDefault();
  }
}

void main() {
  new dartMultiTouchCanvas().run();
}
