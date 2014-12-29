#!/usr/bin/env gjs                                

const GLib = imports.gi.GLib;                            
const GObject = imports.gi.GObject;

function Main()
{
  this._init();
}

Main.prototype = {
  //parent: GObject.Object.type,
  //name: "Main",

  _init: function(){
    var counter = 0;
    this.printCounter = function() {
      print(counter++);
      return true;
    };
    GLib.timeout_add(0, 1000, this.printCounter);
  }
}

var main = new Main();
var loop = new GLib.MainLoop(null, false);
loop.run();
