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
### 刚刚发生了什么？
We have set up a GLib main loop with a single source of events, a timeout.
Initially, we set the counter variable to 0 .
我们创建了一个 GLib 的主循环，并包含一个 timeout 事件源。
在程序的开始我们把 counter 变量设置为 0 。

````JavaScript
int counter = 0;
````

We prepare a function called printCounter to print the counter variable's value, and
increase its value by one immediately after printing. Then we return true to indicate that
we want the counter to continue.
我们准备了一个叫 printCounter 的函数来打印 counter 变量的值，在打印后我们会立即给它加一。
然后返回 true 来表明继续计数。

````JavaScript
bool printCounter() {
	stdout.printf("%d\n", counter++);
	return true;
}
````

In the constructor, we create a Timeout object with a 1000 ms interval pointing to our
printCounter function. This means that printCounter will be called at every 1-second
interval, and it will be repeatedly called as long as printCounter returns true .
在构造函数内，我们创建一个 Timeout 对象，以 1000 毫秒的间隔和 printCounter 函数为参数。
这也就是我们想每隔 1 秒 printCounter 函数都会被调用，只要 printCounter 函数返回 true ，
它就会重复地被调用。

````JavaScript
public Main ()
{
	Timeout.add(1000, printCounter);
}
````

In the main function, we instantiate the Main class, create a MainLoop object, and call run .
This will cause the program to stay running until we manually terminate it. When the loop
is running, it can accept events submitted to it. The Timeout object that we created earlier
produces such an event. Whenever the timer interval expires, it notifies the main loop,
which in turn calls the printCounter function.
在 main 函数中，我们把 Main 类实例化，创建一个 MainLoop 对象并调用 run 函数来运行它。
这将会让程序持续的运行直到我们手动结束它。当 loop 运行时，它会接受到提交给它的事件。
我们先前创建的 Timeout 对象就会产生这类事件。当定时器 (timer) 的时间间隔到达时，它会通知
主循环，接着调用 printCounter 函数。
````JavaScript
static int main (string[] args)
{
	Main main = new Main();
	var loop = new MainLoop();
	loop.run ();
	return 0;
}
````

Now, let's take a look at the JavaScript code. If you notice, the class structure is a bit different
from what we learned in the previous chapter. Here we use Seed Runtime's construction
of class.
现在看一下 JavaScript 的代码，您会注意到类的结构与前一章节所学到的不太一样，这我们使用了
Seed 类的运行时构建。
````JavaScript
GLib = imports.gi.GLib;
GObject = imports.gi.GObject;
````

Here, we import GLib and GObject . Then we construct a class called Main , which is based
on GObject .
这我们导入了 GLib 和 GObject ，然后构造一个基于 GObject 的类，也就是 Main 。 

Here is how we do it. The following code says that we subclass GType into a new class called
Main and pass the object structure into the argument.
看看我们怎么做的，下面的代码显示了我们创建一个基于 GType 的新类叫 Main ，并传递一个对象结构体
作为参数。

````JavaScript
Main = new GType({
	parent: GObject.Object.type,
	name: "Main",
````

The first member of the object is parent , which is the parent of our class. We assign it with
GObject.Object.type to denote that our class is derived from Object in the GObject
module that we imported previously. Then we name our class as Main . After that, we put
the functions inside the init function, which is also the constructor of the class.
The content of the class member is similar to what we've seen in the Vala code and it is quite
straightforward.
对象的第一个成员是 parent ，表示这个类的父类。我们给它赋值为 GObject.Object.type ，表示我们的类
是从我们之前导入的 GObject 中的 Object 派生出来的。
然后我们给我们的类起名为 Main ，之后我们在类的构造函数即 init 函数中添加了一些函数
类成员的内容与我们之前 Vala 的代码很相似，代码也很简单明了。

````JavaScript
	init: function() {
		var counter = 0;

		this.printCounter = function() {
			Seed.printf("%d", counter++);
			return true;
		};
		GLib.timeout_add(0, 1000, this.printCounter);
	}
});
````

Then we have the code that is analogous to what we have in Vala's static main function.
Here we create our Main object and create the GLib's main loop.
接下来的代码与 Vala 中静态 main 函数的类似了，创建 Main 对象和 GLib 主循环。
````JavaScript
var main = new Main();
var context = GLib.main_context_default();
var loop = new GLib.MainLoop.c_new(context);
loop.run();
````

Have a go hero – stopping the timeout
### 大胆实践 - 如何停止 timeout

Our program counts forever. Can you make it stop after the counter reaches 10?
我们的程序会一直数下去，您能够让它在 10 次后停下来么？

----
You can just play with the printCounter return value.
> ✔ 您只需要修改 printCounter 的返回值。

-----

Or even better, can you make it stop totally, meaning that the program would exit after the
counter reaches 10?
还有更好的方法，您可以完全的停止它么？也就是让程序 10 次计数后退出。

You can ignore the return value and rearrange the code, and
somehow pass the loop object into the Main class. In the
printCounter function, you can call loop.quit()
whenever it reaches 10 to make the program break the main
loop programmatically.
----
> ✔ 您可以忽略返回值，重新更改下代码，把 loop 对象放到 Main 类中。
在 printCounter 函数，当到达 10 次时您可以调用 loop.quit() 来中止程序的主循环。

-----

GObject signals
## GObject 信号

GObject provides a signaling mechanism that we can hook into. In the previous chapter, we
have discussed the Vala signaling system. Internally, it is actually using the GObject signaling
system, but it is so transparent that it is seamlessly integrated into the language itself.
GObject 提供了一个信号机制，我们可以挂个钩子进去。在前一章节，我们已经讨论了 Vala 的信号系统。
其实在本质上它是使用了 GObject 信号系统，但它是如此地透明以至于无缝的结合在语言自身中。

Time for action – handling GObject signals
### 实践环节 - 处理 GOject 信号
Let us see how to do it in JavaScript:
让我们看一下在 JavaScript 中怎么做：
1. Create a new script called core-signals.js and fill it with the following code:
1. 创建一个新的脚本叫 core-signals.js ，并输入下面的代码：
````JavaScript
#!/usr/bin/env seed

GLib = imports.gi.GLib;
GObject = imports.gi.GObject;

Main = new GType({
  parent: GObject.Object.type,
  name: "Main",
  signals: [
    {
      name: "alert",
      parameters: [GObject.TYPE_INT]
    }
  ],
  init: function(self) {
    var counter = 0;

    this.printCounter = function() {
      Seed.printf("%d", counter++);
      if (counter > 9) {
        self.signal.alert.emit(counter);
      }
      return true;
    };

    GLib.timeout_add(0, 1000, this.printCounter);
  }
});

var main = new Main();

var context = GLib.main_context_default();
var loop = new GLib.MainLoop.c_new(context);

main.signal.connect('alert', function(object, counter) {
  Seed.printf("Counter is %d, let's stop here", counter);
  loop.quit();
});
loop.run();
````

2. Run it and notice the messages printed:
2. 运行后的结果如下：
````
0
1
2
3
4
5
6
7
8
9
Counter is 10, let's stop here
````

What just happened?
### 刚刚发生了什么？
With the GObject signaling system, we can subscribe for notifications that are emitted by
an object. We just need to provide a handler that will perform some action upon receiving
the signal.
在 GObject 信号系统内我们可以订阅一个对象发生的通知。
我们需要提供一个处理函数来在接收到信号的时候执行一些动作。

Here, we declare our signal in an array by putting an object with names and parameters as
the content of the object. The parameter type is the type that is known by the GLib system.
If our signal does not have any parameters, we can omit it.
我们以一个数组的方式声明了一个信号，其中放了一个以名字 (name) 和参数 (parameters) 为内容的对象
参数的类型是 GLib 系统中的已经定义的类型。 如果对象没有任何参数，我们可以忽略它。
````JavaScript
signals: [
  {
    name: "alert",
    parameters: [GObject.TYPE_INT]
  }
],

main.signal.connect('alert', function(object, counter) {
  Seed.printf("Counter is %d, let's stop here", counter);
  loop.quit();
});
````

Then we subscribe to the signal and provide a closure that just prints the counter value and
breaks the main loop. Note that the parameter is defined in the second parameter of the
closure. The first parameter is reserved for the object itself.
然后我们订阅这个信号并提供一个闭包函数来打印 counter 的数值并中止主循环。
请注意一下闭包函数的第二个参数。第一个参数为对象自身所保留。
Finally, we emit the signal by calling the signal by its name. self is the Main class we pass in
the init function.
最后，我们通过名字来调用信号发出信号，self 是我们在 init 函数中的 Main 类。
````JavaScript
if (counter > 9) {
  self.signal.alert.emit(counter);
}
````

As soon as we call this, the signal will be processed in the main loop and will be delivered
to the objects that subscribe to it.
只要我们一调用这个函数，信号就会被主循环所处理，把它传给订阅的对象。

Have a go hero – writing it in Vala
### 大胆实践 - 在 Vala 中写下代码
Compared with the previous code, signal declaration, emission, and subscription are easier
in Vala, as we've seen it the last time. How about trying to write the previous code in Vala?
与之前的代码比较一下，信号的声明，信号的发出和订阅，这些在 Vala 中都很容易。
怎么在 Vala 中实现前面的代码呢？

GLib properties
## GLib 属性
Properties are key-value pairs in a storage system that are available in all instances of
GObject, which is the base class for all objects in the GNOME system. One useful feature
of properties is that we can subscribe for changes when the value is changed.
Time for action – accessing properties
### 实践环节 - 访问属性
We are going to learn how to set and get a value to and from a property as well as monitor
the changes.
1.	Create a new script called core-properties.js and fill it with this code:
1. 创建一个新的脚本，并起名为 core-properties.js ，并输入下面的代码：

````JavaScript
#!/usr/bin/env seed

GLib = imports.gi.GLib;
GObject = imports.gi.GObject;

Main = new GType({
  parent: GObject.Object.type,
  name: "Main",
  properties: [
    {
      name: 'counter',
      type: GObject.TYPE_INT,
      default_value: 0,
      minimum_value: 0,
      maximum_value: 1024,
      flags: (GObject.ParamFlags.CONSTRUCT
        | GObject.ParamFlags.READABLE
        | GObject.ParamFlags.WRITABLE),
    }
  ],
  init: function(self) {
    this.print_counter = function() {
      Seed.printf("%d", self.counter++);
      return true;
    }

    this.monitor_counter = function(obj, gobject, data) {
      Seed.print("Counter value has changed to " + obj.counter);
    }

    GLib.timeout_add(0, 1000, this.print_counter);
    self.signal.connect("notify::counter", this.monitor_counter);
  }
});

var main = new Main();
var context = GLib.main_context_default();
var loop = new GLib.MainLoop.c_new(context);
loop.run();
````

2. And this is the Vala counterpart (you can create a new project called
core-properties and fill core_properties.vala with this code):
在 Vala 的代码如下（您可以创建一个新的项目叫 core-properties 并把下面的代码保存到 core_properties.vala 文件中）：
````JavaScript
using GLib;

public class Main : Object
{
  public int counter {
    set construct;
    get;
    default = 0;
  }

  public bool print_counter() {
    stdout.printf("%d\n", counter ++);
    return true;
  }

  public void monitor_counter() {
    stdout.printf ("Counter value has changed to %d\n", counter);
  }

  public Main ()
  {
  }

  construct {
    Timeout.add(1000, print_counter);
    notify["counter"].connect ((obj)=> {
      monitor_counter ();
    });
  }

  static int main (string[] args)
  {
    Gtk.init (ref args);
    var app = new Main ();
    Gtk.main ();
    return 0;
  }
}
````
3. Run it and notice the messages printed. Note that you can press the Ctrl + C
combination keys to stop the program.
````
Counter value has changed to 0
Counter value has changed to 1
0
Counter value has changed to 2
1
Counter value has changed to 3
2
Counter value has changed to 4
3
Counter value has changed to 5
4
Counter value has changed to 6
5..
````
What just happened?
###  刚刚发生了什么？
In the JavaScript code, we need to declare the properties inside the properties array, and
fill it with the property's object.
Here we describe that our property has the name counter and is of type integer. It needs
to declare the default, minimum, and maximum values. It also needs the flags. From the
flags, we can see GObject.ParamFlags.CONSTRUCT , which means that the property is
initialized in the construction phase. It means that the default value is set when the object is
created. We also see that it is readable and writable.

````JavaScript
  properties: [
    {
      name: 'counter',
      type: GObject.TYPE_INT,
      default_value: 0,
      minimum_value: 0,
      maximum_value: 1024,
      flags: (GObject.ParamFlags.CONSTRUCT
        | GObject.ParamFlags.READABLE
        | GObject.ParamFlags.WRITABLE),
    }
  ],
````

In the following code, we subscribe for changes. We use the signaling system and the name
of the signal is constructed with the notify:: keyword followed by the property's name.
After this, every change that happens to the property will trigger the signal handler.

````JavaScript
  self.signal.connect("notify::counter", this.monitor_counter);
````

Here we set the value of the property by increasing its value. Note that here we modify the
value; hence the value monitor will be triggered first, and then the actual value is printed
by printf .

````JavaScript
this.print_counter = function() {
  Seed.printf("%d", self.counter++);
  return true;
}
````

And the following code shows how to read the value:

````JavaScript
this.monitor_counter = function(obj, gobject, data) {
  Seed.print("Counter value has changed to " + obj.counter);
}
````

In contrast with the JavaScript code, the properties declaration in Vala is very simple. The
declaration is similar to the normal variable declaration with some additions.

In the following code, the set construct expression means that it is writable and the
default value is initialized in the construction phase. get means that it is readable, and
default defines the default value.

````JavaScript
public int counter {
  set construct;
  get;
  default = 0;
}
````

However, there is no mechanism to set the minimum and maximum value.

Then we see how reading and writing the property are done like reading and writing a
normal variable. From outside the class, we can use the normal way to refer a member
variable, which is by using an object name followed by a dot and the property name.

````JavaScript
public bool print_counter() {
  stdout.printf("%d\n", counter ++);
  return true;
}

public void monitor_counter() {
  stdout.printf ("Counter value has changed to %d\n", counter);
}
````

Subscribing for changes also uses the usual signaling mechanism, with the exception that we
insert the property name in square brackets following the signal name, notify .

````JavaScript
notify["counter"].connect ((obj)=> {
monitor_counter ();
}
````

There is something new in the code; something we have not seen before. It is the
construct keyword. It is basically an alternative way to construct an object similar to the
normal constructors. This style of construction is close to how GObject construction is being
carried out in the actual generated C code.
Despite the differences between these JavaScript and Vala codes, both allow the use of a
property just like a plain member of the class. So, in both languages, you can access the
counter property as main.counter (assuming that the object's name is main ).

Pop quiz – why the value of zero is printed out
### 问答环节
From the output, we saw this:
Counter value has changed to 0
Q1. We did not set the counter to 0 explicitly, did we? So, why did it happen?
1.	 Because the property has the set construct keyword defined.
2.	 Because 0 is the default value.
Have a go hero – making a property read - only
### 大胆实践 - 让一个属性为只读
When a property is read-only, we can no longer set its value. Now, let's try to make the
counter property read-only. Hint: Play with the property flag.
