# 4 Using GNOME Core Libraries #
> GNOME core libraries are a collection of foundation utility classes and
functions. It covers many things from simple date-conversion functions to
virtual filesystem access management. GNOME would not be as powerful as it
is now without its core libraries. There are a lot of UI libraries out there that are
not successful because of the lack of this kind of power. No wonder there are
many libraries outside GNOME that also use GNOME core libraries to support
their functionalities.
> GNOME 核心库是基础工具类和函数的集合，它覆盖了很多，包括从简单的日期转换函数到虚拟文件系统的访问管理。
如果 GNOME 这些核心库，它现在也就不会这么强大。
有许多其它的界面图形库没有成功的原因就在于缺少这种核心库。
当然也有许多非 GNOME 库也使用了 GNOME 的核心库来实现他们的功能。

GNOME core libraries are composed from GLib and GIO, which are non-UI libraries for
supporting our UI applications. These libraries connect our programs with files, networks,
timers, and other important aspects in the operating system. Without this knowledge, we
can probably make a beautiful program, but we would be incapable of interacting with the
rest of the system.
GNOME 核心库由 GLib 和 GIO 组成，它们是非用户界面 (non-UI) 的库来支持用户界面 (UI) 的程序。
这些库把文件，网络，定时器和其它重要的操作系统功能与我们的程序连接起来。
没有这些库，我们可以做一个漂亮的程序，但有可能它无法与操作系统交互。

In this chapter we shall learn about:
在本章节我们将会学到：

- The GLib main loop and basic functions
- GLib 主循环和基本函数
- The GObject signaling system and properties
- GObject 信号系统和属性
- The GIO files, stream and networking
- GIO 中的文件，流和网络
- The GSettings configuration system
- GSettings 配置系统

Ok, lets get started.
好，现在就开始吧。

Before we start
## 开始之前

There are a few exercises in this chapter that need access to the Internet or the local
network. Make sure you have a good connection before running the program. Another
exercise requires access to removable hardware and mountable filesystems.
本章节有几个练习需要访问互联网或本地网络，所以在运行程序前请保证连接正常。
还有一个练习会移除硬件和挂载的文件系统。

In this chapter, we will do something different regarding the Vala exercises. Because the
nature of the discussions are independent of each other, each Vala exercise is done in its
own project instead of continuously modifying a file in a single project. So, in each Vala
exercise we will create a new project and work inside that project. The name of the project
will be noted so you can easily compare your project with the source code that accompanies
this book. Similar to the previous chapter, the project we create here is a Vala GTK+ (simple)
project. In the project properties, we should not tick on the GtkBuilder support for user
interface option and should pick No license in the License option.
在本章节关于 Vala 的练习我们稍做些调整。因为每一次所讨论的内容都是独立的，每一个 Vala 练习都在自己的独立的项目中。
而不是在一个项目中不断地修改代码。
因此，在每一个 Vala 练习中我们都会创建一个新的项目并在其中进行修改。
项目的名字也会让您容易比较书中的源代码。与前一章节类似，我们在这里创建的项目是一个 `Vala GTK+ (simple)` 项目。
在项目的属性中，请不要钩选 `GtkBuilder support for user interface` ，在 `License` 中选择 `No license` 即可。

In each exercise, the JavaScript code follows the Vala code and it is kept inside one file per
exercise. The functionalities of the JavaScript code would be exactly the same. So you can
opt to choose whether you want to use either the Vala or the JavaScript code, or both.
在每一个练习中，Vala 代码后会有 JavaScript 的代码，并保存在一个文件中。
因此您可以选择使用 Vala 代码，或者 JavaScript 代码，或者同时使用。

The GLib main loop
## GLib 主循环
GLib provides a main event loop, which takes care of the events coming from various
sources. With this event loop, we can catch these events and do the necessary processing.
GLib 提供了主事件循环机制，来处理来自不同源头的事件。
在这个事件循环中，我们可以捕获它们并做相应的处理。

Time for action – playing with the GLib main loop
### 实践环节 - 试试 GLib 主循环
Here, we will introduce ourselves to the GLib main loop.
1.	Create a new Vala project called core-mainloop and use this code in the Main class:
1. 创建一个新的 Vala 项目，起名为 `core-mainloop` ，并在 `Main` 类中添加下面的代码：
````JavaScript
using GLib;
public class Main : Object
{
	int counter = 0;
	bool printCounter() {
		stdout.printf("%d\n", counter++);
		return true;
	}
	public Main ()
	{
		Timeout.add(1000, printCounter);
	}
	static int main (string[] args)
	{
		Main main = new Main();
		var loop = new MainLoop();
		loop.run ();
		return 0;
	}
}
````
2.	And this is the JavaScript code's counterpart; you can name the script as core-mainloop.js :
2. 下面是 JavaScript 的代码，把这段脚本保存为 `core-mainloop.js` ：
````JavaScript
#!/usr/bin/env seed
GLib = imports.gi.GLib;
GObject = imports.gi.GObject;

Main = new GType({

	parent: GObject.Object.type,
	name: "Main",

	init: function() {

		var counter = 0;

		this.printCounter = function() {
			Seed.printf("%d", counter++);
			return true;
		};

		GLib.timeout_add(0, 1000, this.printCounter);
	}
});
var main = new Main();
var context = GLib.main_context_default();
var loop = new GLib.MainLoop.c_new(context);
loop.run();
````
3.	Run it. Do you notice that the program prints the counter and stays running?
You can do nothing except press the Ctrl + C key combination to kill it.
3. 运行下试试，您注意到程序会不停地打印出计数么？
这个时候您只需要 `Ctrl + C` 来停止程序即可。

What just happened?
### 发生了什么？
We have set up a GLib main loop with a single source of events, a timeout.
Initially, we set the counter variable to 0 .
int counter = 0;
We prepare a function called printCounter to print the counter variable's value, and
increase its value by one immediately after printing. Then we return true to indicate that
we want the counter to continue.
bool printCounter() {
stdout.printf("%d\n", counter++);
return true;
}
In the constructor, we create a Timeout object with a 1000 ms interval pointing to our
printCounter function. This means that printCounter will be called at every 1-second
interval, and it will be repeatedly called as long as printCounter returns true .
public Main ()
{
Timeout.add(1000, printCounter);
}
In the main function, we instantiate the Main class, create a MainLoop object, and call run .
This will cause the program to stay running until we manually terminate it. When the loop
is running, it can accept events submitted to it. The Timeout object that we created earlier
produces such an event. Whenever the timer interval expires, it notifies the main loop,
which in turn calls the printCounter function.
static int main (string[] args)
{
Main main = new Main();
var loop = new MainLoop();
loop.run ();
return 0;
}
Now, let's take a look at the JavaScript code. If you notice, the class structure is a bit different
from what we learned in the previous chapter. Here we use Seed Runtime's construction
of class.
GLib = imports.gi.GLib;
GObject = imports.gi.GObject;
Here, we import GLib and GObject . Then we construct a class called Main , which is based
on GObject .
Here is how we do it. The following code says that we subclass GType into a new class called
Main and pass the object structure into the argument.
Main = new GType({
parent: GObject.Object.type,
name: "Main",
The first member of the object is parent , which is the parent of our class. We assign it with
GObject.Object.type to denote that our class is derived from Object in the GObject
module that we imported previously. Then we name our class as Main . After that, we put
the functions inside the init function, which is also the constructor of the class.
The content of the class member is similar to what we've seen in the Vala code and it is quite
straightforward.
init: function() {
var counter = 0;
this.printCounter = function() {
Seed.printf("%d", counter++);
return true;
};
GLib.timeout_add(0, 1000, this.printCounter);
}
});
Then we have the code that is analogous to what we have in Vala's static main function.
Here we create our Main object and create the GLib's main loop.
var main = new Main();
var context = GLib.main_context_default();
var loop = new GLib.MainLoop.c_new(context);
loop.run();
Have a go hero – stopping the timeout
Our program counts forever. Can you make it stop after the counter reaches 10?
You can just play with the printCounter return value.
Or even better, can you make it stop totally, meaning that the program would exit after the
counter reaches 10?
You can ignore the return value and rearrange the code, and
somehow pass the loop object into the Main class. In the
printCounter function, you can call loop.quit()
whenever it reaches 10 to make the program break the main
loop programmatically.
