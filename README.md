## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```
##总结
###SideBar
在具有变动DOM大小的需求中，应该使用absolute,因为正常文档流中如果取整数，很容易多／少1px,将元素挤下去。(这里仍旧使用static,float,但采用小数（最好别这样），唉）

absolute元素若果没有非static元素的限制，起点会以body为基准，但**height：100%会以视口window为基准。除非给body加上非static的属性声明.

###Search


###List

margin，width 是同级的，也就是说margin会在width=100%上给元素叠加，超出的部分默认overflow

父元素width就会对子元素约束，并且子元素不会撑开父元素。
否则，父元素大小由子元素确定.

overflow:hidden 常配合 父元素的 固定宽高使用。

###SVG

svg 默认 类似于 inline-block; 但是若想和他一行，应该使用float(如果使用inline-block, 会有高度差)

![](./photos/svg1.png)
