#!/usr/bin/env seed

GLib = imports.gi.GLib;
GObject = imports.gi.GObject;

Main = new GType({
  parent: GObject.Object.type,
  name: "Main",
  init: function(self) {
    this.get_name = function() {
      return this.keyFile.get_string("General", "name");
    }

    this.get_version = function() {
      return this.keyFile.get_integer("General", "version");
    }

    this.keyFile = new GLib.KeyFile.c_new();
    this.keyFile.load_from_file("core-keyfile.ini");
  }
});

var main = new Main();
Seed.printf("%s %d", main.get_name(), main.get_version());
