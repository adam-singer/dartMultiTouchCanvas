import 'dart:html';
import 'dart:math' as Math;
import 'rtclient.dart';
import 'drive_v2_schema.dart' as drive;
import 'dart:json' as JSON;
import 'package:js/js.dart' as js;
import 'package:logging/logging.dart';

_setupLogger() {
  Logger.root.level = Level.ALL;
  Logger.root.on.record.add((LogRecord r) {
    StringBuffer sb = new StringBuffer();
    sb
    ..add(r.time.toString())
    ..add(":")
    ..add(r.loggerName)
    ..add(":")
    ..add(r.level.name)
    ..add(":")
    ..add(r.sequenceNumber)
    ..add(": ")
    ..add(r.message.toString());
    print(sb.toString());
  });
}

// Code kindly borrowed from http://paulirish.com/demo/multi
// Original code by Tim Branyen, Mike Taylr, Paul Irish & Boris Smus,

//typedef void OnAddedValueCallback(Line line);

class ValueChangedEvent {
  var property;
  var newValue;
  var oldValue;
  ValueChangedEvent(this.property, this.newValue, this.oldValue);
}

class MultiTouchModel {
  Logger _logger = new Logger("MultiTouchModel");
  js.Proxy _doc;
  js.Proxy get document => _doc;
  var _eventRouter;
  bool newModel;

  dartMultiTouchCanvas multiTouchCanvas; // TODO(adam): move this out of the model.

  List _defaultLines = []; //new Map<String, String>();
  String _linesName = "lines";
  js.Proxy _lines;
  void addLine(Line line) {
    print(line.toJson());
    js.scoped(() {
      _lines.push(line.toJson());
    });
  }

//  OnAddedValueCallback onAddedValueHandler;

  void _linesOnAddValuesChangedEvent(addedValue) {
    _logger.fine("_linesOnAddValuesChangedEvent addedValue = ${addedValue}");
    _logger.fine("_linesOnAddValuesChangedEvent addedValue.index = ${addedValue.index}");
    var insertedLine = _lines.get(addedValue.index);
    //print("parsed = ${JSON.parse(js.context.JSON.stringify(insertedLine))}");
    var line = new Line.fromJson(insertedLine);

    multiTouchCanvas.move(line, line.moveX, line.moveY);
//    if (onAddedValueHandler != null) {
//      onAddedValueHandler(line);
//    }
  }


  MultiTouchModel({bool this.newModel: true});

  void initializeModel(js.Proxy model) {
    _logger.fine("creating new model $newModel");

    if (newModel) {
      _createNewModel(model);
    }
  }

  void onFileLoaded(js.Proxy doc) {
    _bindModel(doc);
    multiTouchCanvas = new dartMultiTouchCanvas();

    multiTouchCanvas.run();
  }

  void _createNewModel(js.Proxy model) {
    _logger.fine("_createNewModel adding list");
    var list = model.createList(js.array(_defaultLines));
    model.getRoot().put(_linesName, list);
  }

  void _bindModel(js.Proxy doc) {
    _doc = doc;
    js.retain(_doc);

    _logger.fine("retained _doc");

    _eventRouter = new js.Callback.many((valueChangedEvent) {
      _logger.fine("_eventRouter");
      _logger.fine("valueChangedEvent.property = ${valueChangedEvent.property}");
    });

    doc.getModel().getRoot().addValueChangedListener(_eventRouter);

    _lines = doc.getModel().getRoot().get(_linesName);

    _lines.addValuesAddedListener(new js.Callback.many(_linesOnAddValuesChangedEvent));
    js.retain(_lines);
    _logger.fine("_lines retained");
  }

  void close() {
    js.scoped((){
      _doc.getModel().getRoot().removeValueChangedListener(_eventRouter);
      js.release(_doc);
    });
  }
}


class Line {
  int x;
  int y;
  String color;
  int moveX = 0;
  int moveY = 0;
  Line([this.x=0,this.y=0,this.color="red"]);
  Line.fromJson(String json) {
    // TODO(adam): use the new serilizer
    Map map = JSON.parse(json);
    if (map.containsKey("x")) {
      this.x = map["x"];
    }

    if (map.containsKey("y")) {
      this.y = map["y"];
    }

    if (map.containsKey("color")) {
      this.color = map["color"];
    }

    if (map.containsKey("moveX")) {
      this.moveX = map["moveX"];
    }

    if (map.containsKey("moveY")) {
      this.moveY = map["moveY"];
    }
  }

  String toJson() => JSON.stringify({ "x": x, "y": y, "color": color, "moveX": moveX, "moveY": moveY});

}

MultiTouchModel model;

class dartMultiTouchCanvas {


  Map lines;
  List colors = const["red", "green", "yellow", "blue", "magenta", "orangered"];
  CanvasRenderingContext2D context;
  Math.Random random = new Math.Random();

  // Used for testing on non-touch devices, such as the browser
  int mouseId = 0;
  bool mouseMoving = false;

  void run() {
    CanvasElement canvas = new CanvasElement();
    context = canvas.getContext("2d");
    DivElement div = document.query("#div");
    div.children.add(canvas);
    canvas.width = div.scrollWidth;
    canvas.height= div.scrollHeight;

    context.lineWidth = (random.nextDouble() * 35).ceil();
    context.lineCap = "round";
    lines = {};
    canvas.onTouchStart.listen(preDraw);
    canvas.onTouchMove.listen(draw);

    // Used for testing on non-touch
    canvas.onMouseDown.listen(preDrawMouse);
    canvas.onMouseMove.listen(drawMouse);
    canvas.onMouseUp.listen(drawMouseStop);
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
    //model.lines = { "$id": lines[id].toJson() };
    //model.addLine(lines[id]);
    event.preventDefault();
  }

  drawMouse(MouseEvent event) {
    if (!mouseMoving) return;

    var id = mouseId.toString();
    var moveX = event.pageX - lines[id].x;
    var moveY = event.pageY - lines[id].y;
    move(lines[id], moveX, moveY);
    lines[id].moveX = moveX;
    lines[id].moveY = moveY;
    model.addLine(lines[id]);
    lines[id].x = lines[id].x + moveX;
    lines[id].y = lines[id].y + moveY;

    event.preventDefault();
  }
}

RealTimeLoader rtl;
void main() {
  _setupLogger();
  Logger logger = new Logger("main");
  ButtonElement newCanvasButton = query("#createNewCanvasButton");
  ButtonElement openButton = query("#openButton");
  InputElement fileIdInput = query("#fileIdInput");

  openButton.onClick.listen((MouseEvent event) {
    logger.fine("openButton ${fileIdInput.value}");
    if (fileIdInput.value.isEmpty) {
      logger.fine("fileIdInput is empty");
      return;
    }

    var fileId = fileIdInput.value;

    if (model != null) {
      model.close();
    }

    if (rtl != null) {
      model = new MultiTouchModel(newModel: false);
      loadRealTimeFile(fileId, model.onFileLoaded, model.initializeModel);
    } else {
      rtl = new RealTimeLoader(clientId: '299615367852.apps.googleusercontent.com', apiKey: 'AIzaSyC8UF7N5I5b42FFU1ieDumfZ2MFdCHY_M8');
      rtl.start().then((bool isComplete) {
        logger.fine("isComplete = ${isComplete}");
        model = new MultiTouchModel(newModel: false);
        loadRealTimeFile(fileId, model.onFileLoaded, model.initializeModel);
      });
    }
  });

  newCanvasButton.onClick.listen((MouseEvent event) {
    rtl = new RealTimeLoader(clientId: '299615367852.apps.googleusercontent.com', apiKey: 'AIzaSyC8UF7N5I5b42FFU1ieDumfZ2MFdCHY_M8');

    rtl.start().then((bool isComplete) {
      logger.fine("isComplete = ${isComplete}");
      createRealTimeFile("dartMultiTouchCanvas").then((drive.File data) {
        logger.fine("dartMultiTouchCanvas file created, data = ${data}");
        String fileId = data.id;
        logger.fine("fileId=$fileId");
        fileIdInput.value = fileId;
        getFileMetadata(fileId).then((List data) {
          logger.fine("fileId=$fileId, data = ${data}");
        });

        model = new MultiTouchModel(newModel: true);

        loadRealTimeFile(fileId, model.onFileLoaded, model.initializeModel);
      });
    });
  });
}
