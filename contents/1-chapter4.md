# 4 Using GNOME Core Libraries #

> GNOME 核心库是基础工具类和函数的集合，它覆盖了很多东西，包括从简单的日期转换函数到虚拟文件系统的访问管理。如果没有 GNOME 这些核心库，它现在也就不会这么强大。许多其它的界面图形库没有成功的原因就在于缺少这种核心库。当然也有许多 GNOME 之外的库也使用了 GNOME 的核心库来实现他们的功能。

GNOME 核心库由 GLib 和 GIO 组成，它们是非用户界面 (non-UI) 的库来支持用户界面 (UI) 的程序。
这些库把文件，网络，定时器和其它重要的操作系统功能与我们的程序连接起来。
没有这些库，我们可以做一个漂亮的程序，但有可能它无法与操作系统交互。

在本章节我们将会学到：

- GLib 主循环和基本函数
- GObject 信号系统和属性
- GIO 中的文件，流和网络
- GSettings 配置系统

好，现在就开始吧。

## 开始之前

本章节有几个练习需要访问互联网或本地网络，所以在运行程序前请保证网络连接正常。
还有一个练习需要访问可移除的硬件和可挂载的文件系统。

在本章节关于 Vala 的练习我们稍做些调整。因为每一次所讨论的内容都是独立的，每一个 Vala 练习都在自己的独立的项目中。而不是在一个项目中不断地修改代码。
因此，在每一个 Vala 练习中我们都会创建一个新的项目并在其中进行修改。
项目的名字也会让您容易比较书中的源代码。与前一章节类似，我们在这里创建的项目是一个 `Vala GTK+ (simple)` 项目。
在项目的属性中，请不要钩选 **GtkBuilder support for user interface** ，在 **License** 中选择 **No license** 即可。

在每一个练习中，JavaScript 的代码都会保存在一个单独的文件中，并附在 Vala 代码后面。
因此您可以选择使用 Vala 代码，或者 JavaScript 代码，或者同时使用。

## GLib 主循环

GLib 提供了主事件循环机制，来处理来自不同源头的事件。
在这个事件循环中，我们可以捕获这些事件并做相应的处理。

### 实践环节 - 试试 GLib 主循环

接下来就让我们了解一下 GLib 主循环。

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

3. 运行下试试，您注意到程序会不停地打印出计数了么？
这个时候您只需要 **Ctrl + C** 来停止程序即可。

### 刚刚发生了什么？

我们创建了一个 GLib 的主循环，并包含一个唯一的超时(`timeout`)事件源。
在程序的开始我们把 `counter` 变量设置为 0 。

````JavaScript
int counter = 0;
````

我们准备了一个 `printCounter` 的函数来打印 `counter` 变量的值，在打印后我们会立即给它加一。
然后返回 `true` 来表明让计数继续。

````JavaScript
bool printCounter() {
	stdout.printf("%d\n", counter++);
	return true;
}
````

在构造函数内，我们创建一个以 1000 毫秒为间隔的 `Timeout` 对象，并指向之前的 `printCounter` 函数。
这也就意味着每隔 1 秒 `printCounter` 函数都会被调用，并且只要 `printCounter` 函数返回 `true` ，
它就会重复地被调用。

````JavaScript
public Main ()
{
	Timeout.add(1000, printCounter);
}
````

在 `main` 函数中，我们把 `Main` 类实例化，然后创建一个 `MainLoop` 对象并调用 `run` 函数来运行它。
这将会让程序持续的运行直到我们手动结束它。当后循环 (`loop`)运行时，它会接受到提交给它的所有事件。
我们先前创建的 `Timeout` 对象就会产生如此事件。当定时器 (`timer`) 的时间间隔到达时，它会通知主循环，接着调用 `printCounter` 函数。

````JavaScript
static int main (string[] args)
{
	Main main = new Main();
	var loop = new MainLoop();
	loop.run ();
	return 0;
}
````

现在看一下 JavaScript 的代码，您会注意到类的结构与前一章节所学到的不太一样，这我们使用了
Seed 类的运行时构建。(TODO)

````JavaScript
GLib = imports.gi.GLib;
GObject = imports.gi.GObject;
````

这我们导入了 `GLib` 和 `GObject` ，然后构造一个基于 `GObject` 的类，我们起名为 `Main` 。 

看看我们怎么做的，下面的代码显示了我们创建一个基于 `GType` 的新类叫 `Main` ，并传递一个对象结构体
作为参数。

````JavaScript
Main = new GType({
	parent: GObject.Object.type,
	name: "Main",
````

对象的第一个成员是 `parent` ，表示这个类的父类。我们给它赋值为 `GObject.Object.type` ，表示我们的类是从我们之前导入的 `GObject` 中的 `Object` 派生出来的。
然后我们给我们的类起名为 `Main` ，之后我们在类的构造函数即 `init` 函数中添加了一些功能。

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

接下来的代码与 Vala 中静态 `main` 函数类似，创建 `Main` 对象和 GLib 主循环。

````JavaScript
var main = new Main();
var context = GLib.main_context_default();
var loop = new GLib.MainLoop.c_new(context);
loop.run();
````

### 大胆实践 - 如何停止 timeout

我们的程序会一直计数下去，您能够让它在 10 次后停下来么？

----
> ✔ 您只需要修改 `printCounter` 的返回值。

-----

或者做得再好一些，您可以做到完全地停止么？也就是让程序 10 次计数后程序退出。

----
> ✔ 您可以忽略返回值，重新更改下代码，把 `loop` 对象传到 `Main` 类中。在 `printCounter` 函数，当到达 10 次时您可以调用 `loop.quit()` 来中止程序的主循环。

-----

## GObject 信号

GObject 提供了一个信号机制，我们可以挂个钩子进去。在前一章节，我们已经讨论了 Vala 的信号系统。
其实在本质上它是使用了 GObject 信号系统，但它是如此地透明以至于无缝的结合在语言自身中。

### 实践环节 - 处理 GOject 信号

让我们看一下在 JavaScript 中怎么做：

1. 创建一个新的脚本叫 `core-signals.js` ，并输入下面的代码：

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

### 刚刚发生了什么？

在 GObject 信号系统内我们可以订阅一个对象发出的通知。
我们只需要提供一个处理函数来在接收到信号的时候执行一些动作。

我们以一个数组的方式声明了一个信号，其中放了一个以名字 (`name`) 和参数 (`parameters`) 为内容的对象。
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

然后我们订阅这个信号并提供一个闭包函数来打印 `counter` 的数值并中止主循环。
请注意一下闭包函数的第二个参数。第一个参数为对象自身所保留。

最后，我们通过信号的名字来发出信号，`self` 是我们传入到 `init` 函数中的 `Main` 类。

````JavaScript
      if (counter > 9) {
        self.signal.alert.emit(counter);
      }
````

只要我们一调用这个函数，信号就会被主循环所处理，并把它传给订阅的对象。

### 大胆实践 - 在 Vala 中写下代码

对比上面的代码，信号的声明，信号的发出和订阅，这些在 Vala 中都很容易，之前我们也尝试过。
让我们试试在 Vala 中实现前面的代码怎么样？

## GLib 属性

属性是存储在系统中的键值对，GObject 的所有实例都可以使用，GObject 是 GNOME 系统上所有对象的基类。
一个有用的特性就是我们可以订阅属性的变化通知，即当发生的值改变时会收到通知。

### 实践环节 - 访问属性

我们将学习下如何设置和获取属性的值并监视任何改变。

1. 创建一个新的脚本，并起名为 `core-properties.js` ，并输入下面的代码：

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

2. 在 Vala 的代码如下（您可以创建一个新的项目叫 `core-properties` 并把下面的代码保存到 `core_properties.vala` 文件中）：

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

3. 运行后会显示下面的结果，您仍需要按 `Ctrl + C` 来停止程序。

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

###  刚刚发生了什么？

在 JavaScript 代码中，我们需要在 `properties` 数组里声明属性，并把属性的对象填入到其中。

这里我们属性的名字是 `counter` ，类型为整型 (integer) 。
它需要定义一个缺省值，最小值和最大值，它还需要设置标志。
在标志里 `GObject.ParamFlags.CONSTRUCT` 意味着属性在对象构造阶段初始化。
也就是说当对象创建时，属性就被设置了缺省值。另外，这个值可读也可写。

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

接下来，我们订阅变化通知，这需要使用信号系统，信号的名字由 `notify::` 关键字和属性的名字组成。
在这之后，每当属性值发生变化时都会触发信号处理函数。

````JavaScript
  self.signal.connect("notify::counter", this.monitor_counter);
````

然后，我们让属性值不断累加。
我们在下面的代码中修改属性的值，因此属性值的监视器将首先被触发，然后实际的值才被 `printf` 打印出来。

````JavaScript
this.print_counter = function() {
  Seed.printf("%d", self.counter++);
  return true;
}
````

下面的代码展示给我们如何读取这个数值：

````JavaScript
this.monitor_counter = function(obj, gobject, data) {
  Seed.print("Counter value has changed to " + obj.counter);
}
````

与 JavaScript 代码对比来看，在 Vala 中属性的声明就十分简单了。
与正常变量的声明差不多，就是附带了一些额外的东东。

在下面的代码，`set construct` 表达式意味着这个属性是可写的，缺省值在对象的构造阶段被初始化。
`get` 意味着它是可读的，`default` 定义了缺省值。

````JavaScript
public int counter {
  set construct;
  get;
  default = 0;
}
````

然而，您会发现我们在此无法设置最小值和最大值。

接下来， 与读取和修改一个正常的变量一样，让我们看看如何读取和修改属性值。
在类的外部，我们使用常用的方式来引用成员变量，也就是使用对象名后面跟一个点和属性的名字。

````JavaScript
public bool print_counter() {
  stdout.printf("%d\n", counter ++);
  return true;
}

public void monitor_counter() {
  stdout.printf ("Counter value has changed to %d\n", counter);
}
````

订阅变化通知也使用信号机制，我们只需把属性值放到方括号中并放到信号名 `notify` 后面。

````JavaScript
    notify["counter"].connect ((obj)=> {
      monitor_counter ();
    });
````

这段代码引入了些新的东西，我们之前没有见过，也就是关键字 `construct` 。
它是构造一个对象的基本方式，与正常的构造函数一样。
它更类似于 GObject 构造函数是如何被实施到实际生成的 C 代码。

尽管在 JavaScript 和 Vala 的代码中存在些差异，但是它们都可以像使用类的成员一样使用属性。
因此，你可以用 `main.counter` 来访问 `counter` 属性（假设对象的名字是 `main` ）。

### 小测验 - 为什么零这个值也被打印出来了

从输出的结果我们会看到下面这行：

````
Counter value has changed to 0
````

问：我们并没有明显地给 counter 设置为 0 的值，是吧？那么发生了什么？

1. 因为属性被关键字 `set construct` 定义了

2. 因为 0 是缺省值。

### 大胆实践 - 让一个属性为只读

当一个属性是只读的，我们就不能够更改它的值。现在，就来把 `counter` 属性设成只读的吧。
提示：看看属性的标志位。

Configuration files
## 配置文件
In many cases we need to somehow read from a configuration file in order to customize
how our program should behave. Here, we will learn how to use the simplest configuration
mechanism in GLib using a configuration file. Imagine that we have a configuration file and
it contains the name and version of our application so that we can print it somewhere inside
our program.
在很多情况下我们都会多少从配置文件中读取些配置信息来订制化我们的程序。
在此我们将了解如何来通过最简单的 GLib 的配制机制使用配置文件。
设想一下我们有一个配置文件，它包含程序的名字和版本，以至于我们可以在程序中打印出这些信息。

Time for action – reading configuration files
### 实践环节 - 读取配置文件
Here's how to do it:
下面介绍如何来做：
1.	Create a configuration file; let's call it core-keyfile.ini . Its content is as follows:
1. 创建一个配置文件，起名为 `core-keyfile.ini` ，输入下面的内容：
````
[General]
name = "This is name"
version = 1
````
2.	 Create a new Vala project and name it core-keyfile . Put the core-keyfile.
ini file inside the project directory (but not in src ).
2. 创建一个新的项目，起名为 `core-keyfile` ，并把 `core-keyfile.ini` 放到项目的目录下（不是`src`目录下）。
3.	 Edit core_keyfile.vala to look like this:
3. 按下面来编辑 `core_keyfile.vala` ：
````JavaScript
using GLib;

public class Main : Object
{
  KeyFile keyFile = null;
  public Main ()
  {
    keyFile = new KeyFile();
    keyFile.load_from_file("core-keyfile.ini", 0);
  }

  public int get_version()
  {
    return keyFile.get_integer("General", "version");
  }

  public string get_name()
  {
    return keyFile.get_string("General", "name");
  }

  static int main (string[] args)
  {
    var app = new Main ();
    stdout.printf("%s %d\n", app.get_name(), app.get_version());

    return 0;
  }
}
````

4. The JavaScript code (let's call it core-keyfile.js ) looks like this (remember to
put the .ini file in the same directory as the script):
4. JavaScript 的代码（让我们起名为`core-keyFile.js` ）如下（记住把 .ini 的文件放置到同一目录下）：
````JavaScript
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
````
5. Run the program and look at the output:
5. 运行后的结果：
````
"This is name" 1
````
What just happened?
### 刚刚发生了什么？
The configuration file we are using has a key-value pairs structure conforming to the
Desktop Entry Specification document of freedesktop.org . In the GNOME platform,
this structure is commonly used, mainly in the .desktop files, which are used by the
launcher. People using Windows might find this similar to the .ini format, which is also
used for configuration.
我们在此处在配置文件中使用的键值对的结构遵守 freedesktop.org 的桌面配置文件规范（Desktop Entry Specification）。
在 GNOME 环境下，这是一个十分常用的结构，主要使用在 `.desktop` 文件中，这类文件被桌面启动器所使用。
使用 Windows 的用户在 .ini 配置文件中也能看到类似的格式。

GLib provides the KeyFile class to access this type of configuration file. In our constructor,
we have this snippet:
GLib 提供了 `KeyFile` 类来访问这种类型的配置文件，在构造函数中的代码如下：

````JavaScript
keyFile = new KeyFile();
keyFile.load_from_file("core-keyfile.ini", 0);
````

It initializes an object of KeyFile , and loads the core-keyfile.ini file into the object.
它初始化了一个 `KeyFile` 对象，并把 `core-keyfile.ini` 加载到对象中。

If we jump a bit in our core-keyfile.ini file, we have a section, as shown, written inside
a pair of square brackets.
看一下 `core-keyFile.ini` 文件，在方括号内为段标记。

````
[General]
````

And then all the entries following it can be accessed by specifying the section name. Here we
provide two methods, get_version() and get_name() , as shortcuts to get the value of
the name and version entries in the configuration file.
然后，段下面的所有的条目都可以通过指定段的名字来访问。
在这我们提供了两个方法 `get_version()` 秋 `get_name()` 来获取配置文件中 `name` 和 `version` 条目的值。

````
public int get_version()
{
  return keyFile.get_integer("General", "version");
}

public string get_name()
{
  return keyFile.get_string("General", "name");
}
````

Inside the methods, we just get the integer value from the version entry and get the string
value from the name entry. We also see that we obtain the entries under the General
section. And in these methods we just return the value immediately.
在这两个方法内，从 version 条目我们读取一个整型数值，从 name 条目获取一个字符串。
这些都是从 General 段下的条目获得的。
在这两个方法中我们立即返回获取的值。


As shown in the following code, we consume the values from the methods and print them:
如下面代码所示，我们打印出获取的值：

````
stdout.printf("%s %d\n", app.get_name(), app.get_version());
````

Quite easy, isn't it? The JavaScript code is also easy and straightforward; so it does not need
to be explained further.
很容易吧？ JavaScript 代码也很容易且容易明白，就不用再进一步解释了吧。

Have a go hero – multi-section configuration
### 大胆实践 - 多个段的配置文件
Let's try adding more sections inside the configuration file and accessing the values. Imagine
that we have a specific section called License that has license_file and customer_id
as the entries. Imagine that we will use this information later to check whether the customer
has the right to use the software.
让我们在配置文件中添加多个段，然后再读取其中的内容。
假设我们有一个段叫 License ，下面有 license_file 和 customer_id 条目。
我们使用这些信息来检查用户是否有权力使用软件。

GIO, the input/output library
## GIO 输入/输出库
In real life, our program must be able to access files wherever they are stored, locally or
remotely. Imagine that we have a set of files that we need to read. The files are spread both
locally and remotely. GIO will make it easy for us to manipulate these files as it provides an
API to interact with our files in an abstract way.
在实际的应用中我们程序都会访问存储在本地或远程的文件。
假设我们有一大堆文件需要读取，这些文件中有本地的也有远程的。GIO 提供 API 使得操作这些文件非常容易。

Time for action – accessing files
### 实践环节 - 访问文件
Let's see how it works:
让我看下怎么做：
1. Let's create a new script called core-files.js , and fill it with these lines:
1. 创建一个新的 `core-files.js` 脚本，输入下面的代码：

````JavaScript
#!/usr/bin/env seed

GLib = imports.gi.GLib;
Gio = imports.gi.Gio;
GObject = imports.gi.GObject;

Main = new GType({
  parent: GObject.Object.type,
  name: "Main",
  init: function(self) {
    this.start = function() {
      var file = null;
      var files = ["http://en.wikipedia.org/wiki/Text_file",
      "core-files.js"];

      for (var i = 0; i < files.length; i++) {
        if (files[i].match(/^http:/)) {
          file = Gio.file_new_for_uri(files[i]);
        } else {
          file = Gio.file_new_for_path(files[i]);
        }

        var stream = file.read();
        var data_stream = new Gio.DataInputStream.c_new(stream);
        var data = data_stream.read_until("", 0);

        Seed.print(data)
      }
    }
  }
});

var main = new Main();
main.start();
````

2. Alternatively, you can create a Vala project called core-files . Fill
src/core_files.vala with this code:
2. 或者，您可以创建一个 Vala 项目，起名为 `core-files` ，然后输入下面的代码到 `src/core_files.vala` 文件中：

````JavaScript
using GLib;

public class Main : Object
{
  public Main ()
  {
  }

  public void start ()
  {
    File file = null;
    string[] files = {"http://en.wikipedia.org/wiki/Text_file",
    "src/core_files.vala"};

    for (var i = 0; i < files.length; i++) {
      if (files[i].has_prefix("http:")) {
        file = File.new_for_uri(files[i]);
      } else {
        file = File.new_for_path(files[i]);
      }

      var stream = file.read();
      var data_stream = new DataInputStream(stream);

      size_t data_read;
      var data = data_stream.read_until("", out data_read);
      stdout.printf(data);
    }
  }

  static int main (string[] args)
  {
    var app = new Main ();
    app.start();
    return 0;
  }
}
````

3. Run the program, and notice that it fetches the Wikipedia page from the Internet as
well as the source code of the program from the local directory.
3. 运行程序，您会发现它会从网络上抓取 Wikipedia 页面，并显示本地目录下的程序的源代码。

What just happened?
### 刚刚发生了什么？
GIO aims to provide a set of powerful virtual filesystem APIs. It provides a set of interfaces
that serve as a foundation to be extended by the specific implementation. For example, here
we use the GFile interface that defines the functions for a file. The GFile API does not tell
us where the file is located, how the file is read, or other such details. It just provides the
functions and that's it. The specific implementation that is transparent to the application
developers will do all the hard work. Let's see what this means.
GIO 致力于提供一系列的强大的虚拟文件系统 API 。
它提供了很多接口来作为基础架构，应用程序可以按具体的实现来进行扩展。
GFile 接口不会告诉您文件在哪，怎么读取文件和其它内在的细节。它只提供功能仅此而已。
具体的实现对应用程序开发者很透明，也需要他们做很多工作。
让我们在下面详细了解一下。

In the following code, we get the file location from the array files . Then we check if the
location has an HTTP protocol identifier or not; if yes, we create the GFile object using
file_new_for_uri , otherwise we use file_new_for_path . We can, of course, use
file_new_for_uri even for the local file, but we need to prepend the file:// protocol
identifier to the filename.
下面的代码，从数组文件获取文件的存放位置，然后检查是否有 HTTP 协议的标识，如果有的话，我们
使用 file_new_for_uri 来创建 GFile 对象，否则使用 file_new_for_path 。
当然我们也可以使用 file_new_for_uri 来创建本地文件对象，但需要加上 `file://` 协议做为文件名的前缀。

````JavaScript
        if (files[i].match(/^http:/)) {
          file = Gio.file_new_for_uri(files[i]);
        } else {
          file = Gio.file_new_for_path(files[i]);
        }
````

This is the only difference between handling the remote file and the local file. And after
that we can access files either from the local drive or from a web server by using the same
function with GIO.
这是处理远程文件和本地文件的唯一差别。在这之后我们或者从本地驱动器或网络服务器访问文件时都使用同一个函数。

````JavaScript
        var stream = file.read();
        var data_stream = new Gio.DataInputStream.c_new(stream);
        var data = data_stream.read_until("", 0);
````

Here we use the read function to get the GFileInputStream object. Notice here that the
API provides the same function wherever the file is.
我们使用 `read` 函数来获取 `GFileInputStream` 对象。
请注意 API 提供同一个函数而不关心文件在哪。

The resulting object is a stream. A stream is a sequence of data that flows from one end
to the other. The stream can be passed to an object and can transform it to become another
stream or just consume it.
返回的对象是一个流。流是一系列的数据从一端流向另一端。
流可以被传到一个对象，并可以转换为另一个流或只是使用它。

In our case, we get the stream initially from the file.read function. We transfer this
stream into GDataInputStream in order to easily read the data. With the new stream, we
ask GIO to read the data until we find nothing, which means it has reached the end of the
file. And then we spit the data out onto the screen.
在我们的代码中，我们使用 `file.read` 函数来初始化流 (strem) 。
我们把这个流传入到 GDataInputStream 来读取文件的数据。
通过新的流我们让 GIO 来读取数据直到读完所有的数据，也就是读到文件的结尾。
然后把数据显示到屏幕上。

Network access with GIO
## GIO 访问网络
GIO provides adequate functions to access the network. Here we will learn how to create
socket client and server programs. Imagine that we are building a simple chat program that
can send data from one end to another.
GIO 也提供了许多访问网络的函数。接下来我们将了解到如何创建套接字 (socket) 来为客户端和服务端程序所用。
假设我们创建一个简单的聊天程序，能够从一端发送数据到另一端。

Time for action – accessing a network
### 实践环节 - 访问网络
For brevity, we will do it only in JavaScript now; you can look at the Vala program in
core-server and core-client projects code that accompany this book. Ok, so let's see
what are the steps needed to access the network.
简单起见，我们将只提供 JavaScript 的代码，您也可以参考 `core-server` 和 `core-client` 项目中的 Vala 代码。
好，看看访问网络需要几步。

1. Create a new script called core-server.js and fill it with these lines:
1. 创建 `core-server.js` 文件，并输入下面的代码：
````JavaScript
#!/usr/bin/env seed

GLib = imports.gi.GLib;
Gio = imports.gi.Gio;
GObject = imports.gi.GObject;

Main = new GType({
  parent: GObject.Object.type,
  name: "Main",
  init: function(self) {
    this.process = function(connection) {
      var input = new Gio.DataInputStream.c_new (connection.get_input_stream());
      var data = input.read_upto("\n", 1);
      Seed.print("data from client: " + data);
      var output = new Gio.DataOutputStream.c_new (connection.get_output_stream());
      output.put_string(data.toUpperCase());
      output.put_string("\n");
      connection.get_output_stream().flush();
    }

    this.start = function() {
      var service = new Gio.SocketService();
      service.add_inet_port(9000, null);
      service.start();
      while (1) {
        var connection = service.accept(null);
        this.process(connection);
      }
    }
  }
});

var main = new Main();
main.start();
````

2. Run this script. The program will stay running until we press Ctrl + C.
2. 运行这个脚本，这个程序会一直运行直到我们按 `Ctrl + C` 来停止它。

3. Then create another script called core-client.js ; here is the code:
3. 然后，我们创建 `core-client.js` ，下面是它的代码：

````JavaScript
#!/usr/bin/env seed

GLib = imports.gi.GLib;
Gio = imports.gi.Gio;
GObject = imports.gi.GObject;

Main = new GType({
  parent: GObject.Object.type,
  name: "Main",
  init: function(self) {

    this.start = function() {
    var address = new Gio.InetAddress.from_string("127.0.0.1");
    var socket = new Gio.InetSocketAddress({address: address,
    port: 9000});
    var client = new Gio.SocketClient ();
    var conn = client.connect (socket);

    Seed.printf("Connected to server");

    var output = conn.get_output_stream();
    var output_stream = new Gio.DataOutputStream.c_new(output);

    var message = "Hello\n";
    output_stream.put_string(message);
    output.flush();

    var input = conn.get_input_stream();
    var input_stream = new Gio.DataInputStream.c_new(input);
    var data = input_stream.read_upto("\n", 1);
    Seed.printf("Data from server: " + data);
    }
  }
});
var main = new Main();
main.start();
````

4. Run this program and notice the output of both the server and the client programs.
They can talk to each other!
4. 在另一个终端页面运行这个客户端程序，看一下服务端和客户端程序的输出，它们之间可以通信了！

运行两次客户端程序：
````
$ ./core-client.js 
Connected to server
Data from server: HELLO
$ ./core-client.js 
Connected to server
Data from server: HELLO
````

在服务端程序，您会看到接收到两次消息：
````
$ ./core-server.js 
data from client: Hello
data from client: Hello

````

What just happened?
### 刚刚发生了什么？
GIO provides high-level as well as low-level networking APIs that are really easy to use.
Let's take a look at the server first.
GIO 提供了易于使用的上层和底层的网络 API 。
让先看看服务端。
Here we open a service in port number 9000 . It is an arbitrary number; you can use your
own number if you want, with some restrictions:
我们打开的一个服务端口 9000 。这是一个随意的数字，您在限制范围内可以使用自己想用的端口：

````JavaScript
      var service = new Gio.SocketService();
      service.add_inet_port(9000, null);
      service.start();
````

You can't run the service if there is already another service running with a port number that
is the same as yours. Also, you have to run your program as root if you want to use a port
number below 1024.
当另一个服务和您人程序使用同一个端口，您就无法运行服务程序。如果您想使用小于 1024 的端口，
您必须具有 root 权限。
And then we enter an infinite loop that is called when the service is accepting an incoming
connection. Here, we just call our process function to handle the connection. That's it.
然后我们进入无限的循环中，当接受到一个连接，我们调用 `process` 函数来处理连接。

````JavaScript
      while (1) {
        var connection = service.accept(null);
        this.process(connection);
}
````

The server's basic activity is defined as easily as that. The details of the processing is
another story.
服务端的行为定义的非常简单，处理的细节就是另一个故事了。

Then, we create a GDataInputStream object based on the input stream coming from the
connection. And then we read the data in until we find the end of line character which is \n .
It is one character, so we put 1 there as well. And then we print the incoming data.
然后，我们基于来自于连接的流来创建 `GDataOutputStream` 对象。
接下来读取数据直到我们找到一行的最后一个字符 `\n` 。
它是一个字符，因此我们使用 1 来作为另一个参数。最后打印收到的数据。
````JavaScript
      var input = new Gio.DataInputStream.c_new (connection.get_input_stream());
      var data = input.read_upto("\n", 1);
      Seed.print("data from client: " + data);

````

To make things interesting, we want to return something to the client. Here we create an
object of the GDataOutputStream class that is coming from the connection object. We
change the data coming from the client to uppercase, and we send it back through the
stream. In the end, we make sure everything is sent by flushing down the pipe. That's all
on the server side.
为了让事情更有趣，我们在客户端返回一些东东。
因此我们创建 GDataOutputStream 类，也是基于连接对象。
我们改变从客户端传来的数据为大写，通过流再发送回去。
最后，我们把官道清空来保证所有的东东都被发送出去。
这些就是服务端做的那些事儿。

````JavaScript
      var output = new Gio.DataOutputStream.c_new (connection.get_output_stream());
      output.put_string(data.toUpperCase());
      output.put_string("\n");
      connection.get_output_stream().flush();
````

On the client side, initially, we make an object of GInetAddress . The object is then fed
into GInetSocketAddress so we can define the port of the address that we want to
connect to.
在客户端我们创建一个 `GInetAddress` 对象，然后传给 `GInetSocketAddress` 对象，这样我们
可以把想要连接的地址的端口加进来。

````JavaScript
    var address = new Gio.InetAddress.from_string("127.0.0.1");
    var socket = new Gio.InetSocketAddress({address: address,
    port: 9000});
````

Then we connect the socket object with SocketClient into GSocketClient . After this,
if everything is OK, the connection to the server is established.
然后，我们用 `SocketClient` 来连接套接字。这样就万事具备，与服务端的连接就建立好了。

````JavaScript
    var client = new Gio.SocketClient ();
    var conn = client.connect (socket);
````

On the client side, in principle, the process occurs in the opposite way as it would occur on
the server side. Here we create GDataOutputStream first, based on the stream coming
from the connection object. Then we just send the message into it. We also want to flush it
so all the remaining data in the pipeline is flushed out.
在客户端基本上与服务端所做的处理相反。我们先基于连接对象的流来创建 `GDataInputStream` 。
然后向它发送信息。我们也需要清空它，这样在管道中所有剩余的数据都会被发送出去。

````JavaScript
    var output = conn.get_output_stream();
    var output_stream = new Gio.DataOutputStream.c_new(output);

    var message = "Hello\n";
    output_stream.put_string(message);
    output.flush();
````

Then, we expect to get something from the server; so we create an input stream object.
We read from it until we find a newline, and we print the data.
然后，我们希望能够从服务端获取些东东，我们创建输入流对象。
当有一行新的数据时我们会读取它，并打印出来。

````JavaScript
    var input = conn.get_input_stream();
    var input_stream = new Gio.DataInputStream.c_new(input);
    var data = input_stream.read_upto("\n", 1);
    Seed.printf("Data from server: " + data);
````

Have a go hero – making an echo server
### 大胆实践 - 让服务器有回显功能
Echo server is a service that returns everything that is sent to it as it is, without any
modifications. For example, if we send "Hello", the server will also send back "Hello".
Sometimes it is used for checking whether the connection between two hosts is working.
How about modifying the server program to be an echo server?
回显服务端是能把所有发送出的东西原封原样地返送回来。例如，发送 "Hello" ，服务端将发送回 "Hello" 。
这在检查两个主机之间的连接是否正常工作时很有用。
那么如何更改服务端的程序来实现回显服务端？

We can put it in an infinite loop, but if we type "quit", the server disconnects.
我们可以把它放到无限的循环中，如果输入 "quit" ，与服务端断开连接。

Understanding GSettings
## 理解 GSettings
Previously, we have used the GLib configuration parser to read our application configuration.
Now we will try to use a more advanced settings system with GSettings. With this, we can
access configurations throughout the GNOME platform, including all the applications that
use the system.
之前我们使用 GLib 配置解析器来读取我们应用程序的配置。
现在我们准备使用一个更高级的配置系统 `GSettings` ，我们可以访问整个 GNOME 平台的配置，包括
所有使用 GSettings 的应用程序的配置。

Time for action – learning GSettings
### 实践环节 - 学习 GSettings
Let's see what the GSettings configuration system looks like as visualized by the
dconf-editor tool:
让我们先通过 `dconf-editor` 来可视化地看下 GSettings 配置系统：
1.	Launch a terminal.
1. 打开一个终端。
2.	Run dconf-editor from the terminal.
2. 运行 `dconf-editor` 。
3.	Navigate through the org tree on the left-hand side of the application, and go
through gnome, desktop, and then background.
3. 在程序的左侧浏览一下 `org` 树，看下其下面的 `gnome` ，`desktop` ，然后 `background` 。

What just happened?
### 刚刚发生了什么？
GSettings is a new introduction in GNOME 3. Before, the configuration was handled with
GConf. In GNOME 3, every shipped GNOME application has been migrated to use GSettings.
The concept of storing the settings in GConf and GSettings remains the same, that is, by
using key-value pairs. However, GSettings contains improvements in many aspects, including
more restrictive usage by enforcing schema as metadata. With GConf, we can freely store
and read any values from the system.
GSettings 在 GNOME 3 中引入的。之前使用 GConf 来处理配置。
在 GNOME 3 上的每一个 GNOME 应用程序都迁移到使用 GSettings 。
在 GSettings 和 GConf 上保存设置的理念都是一样的，都使用键值对。
然而，GSettings 在很多方面都有改进，包括强制使用 schema 作为 metadata 的限定用法。
GConf 我们可以自由的存储和读取系统的任何值。

GSettings is actually only a top-level layer. Underneath, there is a low-level system called
dconf, which handles the actual storing and reading of the values. The tool we discuss here
shows the keys and values in a hierarchy so we can browse, read, and even write a new value
(if the schema says it's writable, of course).
GSettings 实际上处于高级层次，而底层的系统是 dconf ，由它来处理实际的数值的存储和读取。
我们在这讨论的工具以层次来展示键和值，我们可以浏览，读取，甚至写一个新的值（当然得需要 schema 设置为可写的）。

In the screenshot we can see that org.gnome.desktop.background has many entries;
one of them is picture-uri , which contains the URI of the desktop's background image.
在截图您可以看见 org.gnome.desktop.background 下面有很多条目，picture-uri 就是其中之一，
它包含了桌面背景图片的位置 (URI) 。

GSettings API
## GSettings API
In this book, the API is more interesting than the administrative tools. After we see GSettings
visually, it is time to access GSettings through API.
在本书中，API 比较管理工具更有趣些，在我们对 GSettings 有了直观的认识后，就让我们来通过 API 使用 GSettings 。

Time for action – accessing GSettings programmatically
### 实践环节 - 通过程序访问 GSettings
Imagine that we create a tool to set the background image of our GNOME desktop. Here is
how to do it:
设想一下我们来创建一个改变桌面背景的工具，按下面来做：
1. Create a new Vala project called core-settings , and modify core_settings.vala with the following:
1. 创建一个新的 Vala 项目，起名为 `core-settings` ，按下面来编辑 `core_settings.vala` 文件：

````JavaScript
using GLib;

public class Main : Object
{
  Settings settings = null;

  public Main ()
  {
    settings = new Settings("org.gnome.desktop.background");
  }

  public string get_bg()
  {
    if (settings == null) {
      return null;
    }
    return settings.get_string("picture-uri");
  }

  public void set_bg(string new_file)
  {
    if (settings == null) {
      return;
    }

    if (settings.set_string ("picture-uri", new_file)) {
      Settings.sync ();
    }
  }

  static int main (string[] args)
  {
    var app = new Main ();
    stdout.printf("%s\n", app.get_bg());
    app.set_bg ("file:///usr/share/backgrounds/gnome/Wood.jpg");
    return 0;
  }
}
````

2. The JavaScript code is quite straightforward; here we have a snippet of it just to see
the adaptation needed from the Vala code:
2. JavaScript 代码更简单明了些，我们只摘出一个片段来看看从 Vala 代码中所作的改变：

````JavaScript
init: function(self) {
  this.settings = null;
  this.get_bg = function() {
    if (this.settings == null)
      return null;
    return this.settings.get_string("picture-uri");
  }

  this.set_bg = function(new_file) {
    if (this.settings == null)
      return;
    if (this.settings.set_string("picture-uri", new_file)) {
      Gio.Settings.sync();
    }
  }

  this.settings = new Gio.Settings({schema: 'org.gnome.desktop.background'});
}
````
3.	Run it and see the change in your current desktop background image. Your current
desktop background will change to the file specified in the code.
3. 运行一下看看是否更改了当前的桌面背景，应该变成我们所设置的图片。

What just happened?
### 刚刚发生了什么？
In this exercise, we use the already installed schema owned by the desktop, which is
org.gnome.desktop.background , so we can just use the API to access the settings.
在这个练习中，我们使用已经被桌面安装的 schema ，也就是 org.gnome.desktop.background ，
因此我们只是使用 API 来访问这个设置。

Let's take a look at the details.
让我们看看一下细节。

First, we initiate the connection to GSettings by specifying the schema name, which is
org.gnome.desktop.background , and it returns a GSettings object.
首先，我们初始化一个 GSettings 连接，并以 schema 名字为参数，也就是 org.gnome.desktop.background ，
它会返回一个 GSettings 对象。

```JavaScript
settings = new Settings("org.gnome.desktop.background");
````

Then we put a simple safety net just in case the initialization fails. In the real world, we can
perform reinitialization rather than just a simple return.
然后，我们做了一个简单的安全性处理以防初始化失败。
实际上，我们可以重新初始化而不是简单的返回。

```JavaScript
if (settings == null) {
  return null;
}
````

After that, we obtain a value of type string under the key picture-uri , and we can
consume it in any way we want.
在这之后，我们获得 picutre-uri 的字符串，以方便我们后续的使用。

```JavaScript
return settings.get_string("picture-uri");
````

Finally, we set the value using the same key. If it is successful, we ask GSettings to save it to
the disk by calling the sync function. Easy, right?
最后，我们使用同一个键来设置值。如果成功，我们通过调用 `sync` 函数来让 GSettings 来保存到硬盘上。
简单不？

```JavaScript
if (settings.set_string ("picture-uri", new_file)) {
Settings.sync ();
}
````

Summary
## 总结
In this chapter, we learned a lot about the GNOME core libraries. Even though we did not
touch everything in the libraries, we managed to tackle all the basics and essentials needed
to build our GNOME application.
在本章节，我们学习到了许多 GNOME 核心库。即使如此，我们仍没有讲述所有的库，只是先介绍了一些
基本和必要的库以方便编写 GNOME 程序。

We know now that GLib provides a main loop that handles all the events from various
sources. We discussed the GObject property and the signaling system. We also tried to look
into the events processed by the main loop by posting with the timeouts, and signals when
a value of a property has changed. Regarding the programming languages, we found out
that Vala is more integrated with GNOME, and JavaScript requires more code to use GObject
properties or signals.
我们现在知道 GLib 提供了主循环，可以处理来自各种各样源的所有事件。
我们讨论了 GObject 属性和信号系统。我们也尝试了在主循环中 timeout 发出事件的处理和当属性发生变化时信号的处理。
关于编程语言，我们发现 Vala 的代码许多都集成在 GNOME 中，JavaScript 需要更多的代码来使用 GObject 属性或信号。

We had an exercise of accessing files both locally and remotely, and we found out that the
API provided by GIO is very easy to use because it abstracts the way we access those files
wherever they are.
我们也练习了本地和远程访问文件，我们发现 GIO 提供的 API 很容易使用，因为有一个统一接口来
访问这些文件而不用关心它们在哪。

With GIO, we also did an experiment of building a simple client and server chat program and
we found out that to create such an interesting program requires quite a minimal amount
of code, both in JavaScript and Vala.
通过 GIO 我们也编译了一个简单的客户端和服务端聊天程序，我们发现通过 JavaScript 和 Vala 中小量的代码就可以实现如此有趣的事件。

Finally, we had a discussion about GSettings and tried to read and write the GNOME
desktop's background image with it.
最后，我们讨论了 GSettings ，并尝试通过它来读取和更改 GNOME 桌面背景图片。

After we master the foundation of the GNOME application, the next step is to learn the
basics of a graphical program in the next chapter.
在我们掌握了 GNOME 应用程序的基础后，下一步我们将在下一章节中学习图形程序的基础。
