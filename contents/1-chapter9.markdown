TODO: 语句写完后再润色，markdown再调整

# 用GNOME部署HTML5 #

> 在移动领域，对于开发**HTML5**应用程序还是本地应用程序一直都存在争议。**HTML5**的拥护者倾向于开发一个**HTML5**的应用程序，然后嵌入到本地应用程序里面，截然不同的做法就是直接写一个本地应用程序。那桌面领域呢？读者尽可以坚持自己的意见，但在这一章节里，我们会介绍**HTML5**的开发方式。

所谓的运行**HTML5**应用程序提供一个精简的浏览器作为外壳，让**HTML5**应用程序跑着这个浏览器里。我们的**HTML5**应用程序界面使用Vala语言，采用**WebKitGTK+**,也就是WebKit引擎在GTK+里的实现技术。在这一章节里面，我们不仅仅会学习如何在本地界面里跑**HTML5**应用程序，而且还会学习如何集成进**GNOME**平台。特别要说明的是，我们这一章的话题集中在如下三个方面
 * 如何把WebKit嵌入到GTK+应用程序里
 * 介绍JaveScriptCore
 * 如何与JavaScriptCore交互
好，我们现在就开始本章的学习。


## 在学习之前
本章的讨论需要对**HTML5**，**JSON**以及常见的客户端Javascript编程有一定的了解。一个特殊的训练是通过JQuery以及JQuery移动技术来说明如何实现一个真实的**HTML5**应用程序。

## 嵌入WebKit
What we need to learn first is how to embed a WebKit layout engine inside our GTK+
application. Embedding WebKit means we can use HTML and CSS as our user interface
instead of GTK+ or Clutter.
我们首先要学习的是如何嵌入一个WebKit的布局引擎到我们的GTK+应用程序里。嵌入的WebKit意味着我们可以使用HTML和CSS而不是GTK+或Clutter作为我们的用户界面。


---- markdown example ----

- 系统要求

## 系统需求
### GNOME Shell


* **核心库**：这是 GNOME 架构中最底层的接口，主要包括了：
	* **GObject**：这是 GNOME 的对象系统。主要是 GNOME 中用 C 语言实现了一些面向对象的方法。
	* **GLib**：此通用库主要包括了 GNOME 架构都会用到的一些内容。
	* **GIO**：这是一个虚拟文件系统库，提供了文件访问、存储卷以及抽象化的驱动程序。
