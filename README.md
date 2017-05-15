

[TOC]

# 项目概览:happy:

## [样本案例](https://state.software/#model-panel)

<img src="https://ww2.sinaimg.cn/large/006tNbRwly1fdlcna76vfj31jc0nwgp3.jpg" width = "400" height = "300" alt="图片名称" align=center />

## 绘制过程

<img src="https://ww4.sinaimg.cn/large/006tNbRwly1fdlcoiu8epg30g60cfk4q.gif" width = "400" height = "300" alt="图片名称" align=center />

## 绘制结果

<img src="https://ww1.sinaimg.cn/large/006tNbRwly1fdlcneju9lj314q0ow77a.jpg" width = "400" height = "300" alt="图片名称" align=center />
<img src="https://ww3.sinaimg.cn/large/006tNbRwly1fdlcn8ft20j318s0oq0we.jpg" width = "500" height = "300" alt="图片名称" align=center />

## Build Setup

```bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```

# 要点归纳 :cool:



1. getBbox(true)/getBbox() 区别： 没有文档，就阅读源码.
2. sideBar：小数取整导致值缺失(越积累越多)，极快速拖动条框，导致条框跟随(越界时无法初始化)(preventDefault解决)，jQuery的draggable使用(stop状态一定要重置).
3. 路径跟踪(vue.watch的属性直接赋值才会引起改变，如果是对象，对对象属性赋值无法触发)
4. 箭头角度(Math.atan2，四个象限想不清除，后来实操解决)
5. 鼠标带动 路径180转动时，在第四/三象限需要 负偏移些， 其他两个象限需要正偏移，**否则**鼠标下面是路径元素，松开时无法捕捉到 状态图.(这里offset即偏移是path(带角度)偏移，然后计算得到相应的X，Y轴偏移量，直接定死X，Y偏移量太Low了.)
6. SVG内部的SVG图，嵌套放缩.

```
function calculateNowScale(originalScale, containsScale, returnPalette) {
    let nowScale = _.clone(originalScale);

    if (returnPalette) {
    containsScale.forEach(function(item) {
    nowScale.x *= item.x;
    nowScale.y *= item.y;
    })
    } else {
    containsScale.forEach(function(item) {
    nowScale.x /= item.x;
    nowScale.y /= item.y;
    })
    }

    return nowScale;
    }
```

1. SVG 中嵌套的SVG图来回移动. (先发现所有的root元素，)("mousedown"在platte中移动；"mouseup"发现其父元素，根据迭代计算的放缩值计算位移值)

```
function translateTheRoot(el, contains, returnPalette) {
    const vel = V(el);
    let scale;
    let relativeTranslate;
    let absoluteTranslate;

    if (contains.length) {
        scale = contains.map(function(el) {
            return parseScaleString(el);
        }).reduce(function(a, b) {
            return { x: a.x * b.x, y: a.y * b.y };
        });
        relativeTranslate = vel.bbox(false, contains[0]);
        absoluteTranslate = V(contains[0]).bbox();
    } else {
        scale = { x: 1, y: 1 };
        relativeTranslate = vel.bbox();
        absoluteTranslate = V(el.ownerSVGElement).bbox();
    }

    const nowTranslate = {};
    if (returnPalette) {
        nowTranslate.x = (relativeTranslate.x * scale.x) + absoluteTranslate.x;
        nowTranslate.y = (relativeTranslate.y * scale.y) + absoluteTranslate.y;
    } else {
        nowTranslate.x = (relativeTranslate.x - absoluteTranslate.x) / scale.x;
        nowTranslate.y = (relativeTranslate.y - absoluteTranslate.y) / scale.y;
    }

    vel.translate(nowTranslate.x, nowTranslate.y, { absolute: true });
}
```

1. 解耦(每个组件内部有自己的Method，画板platte值负责触发)(通过MapAction函数注册)(findParentByName先确定元素类型)

```
 //event choose function
        chooseComponent: function(e) {
            this.component = utils.findParentByName(e.target, this.nameSet);
            this.component ? this.method(this.component, e) : null;
        },
        moveComponent: function(e) {
            this.component ? this.method(this.component, e) : null;
        },
        removeComponent: function(e) {
            this.component ? this.method(this.component, e) : null;
            this.component = undefined;

            //send data to codeEditor, when 'mouseUp' to promise latest component position.
            const item = utils.findParentByName(e.target, [this.pathName, this.rootName]);
            this[SET_CODE_KEY](item ? item.id : null);
        },
```

```
<svg class="sketch" @mousemove="moveComponent" @mouseup="removeComponent" @mousedown="chooseComponent" @mouseover="displayTool"  @mouseout="hideTool">
```

1. 柯里化函数(不同需求只是变量不同，逻辑相同) (取代重载利器)

```
export function curryIt(fn) {
    const len = fn.length;
    const args = [];

    const func = function(num) {
        args.push(num);
        if (args.length === len) {
            return () => fn.apply(null, args);
        } else {
            return func;
        }
    }

    return func;
}
```

1. $watch与compute

$watch相比compute更灵活，也就是说$watch位置随意，可访问的变量灵活了.

1. 路径/箭头实现

v-for循环出linkData中的元素数量，:data绑定pointLink.vue的`props: ['data'], `. computed中的pathD，arrowD即长和箭头都跟着联动了.

=> 主面板只要watch事件并更改linkData值即可.

```
<PointLink v-for="item in linkData" :data="item"></PointLink>
```

1. 编辑代码面板

mapState的store中数据变更也能带动更新computed相应的变量.(相当于引用了data)

```
 computed: mapState({
        datasets: state => state.card.datasets.filter(data => data.name.includes(state.card.filterKey))
    })
```

利用@input="updataCode($event.target.value)"更新.



# 开发随笔 :note:

## 总结

### SideBar

在具有变动DOM大小的需求中，应该使用absolute,因为正常文档流中如果取整数，很容易多／少1px,将元素挤下去。(这里仍旧使用static,float,但采用小数（最好别这样），唉）

absolute元素若果没有非static元素的限制，起点会以body为基准，但**height：100%会以视口window为基准。除非给body加上非static的属性声明.

### Search

### List

margin，width 是同级的，也就是说margin会在width=100%上给元素叠加，超出的部分默认overflow

父元素width就会对子元素约束，并且子元素不会撑开父元素。
否则，父元素大小由子元素确定.

overflow:hidden 常配合 父元素的 固定宽高使用。

### SVG

SVG 适合于直接 px 布局，结合 scalable;
它本身不是面向width=*%的，而且也只会去第一次转化的px为其大小.

普通元素自适应百分比布局倒挺好的。

svg 默认 类似于 inline-block; 但是若想和他一行，应该使用float(如果使用inline-block, 会有高度差)

![](https://ww3.sinaimg.cn/large/006tNbRwly1fdlcn93dswj30e204swej.jpg)

SVG的g/内部标签不支持

droppable，SVG不支持拖入SVG的事件触发，例如drop不会被触发.

### Vue class

父组件中暴露的字组件的class=sketch, 如果父组件也对sketch进行了定义，那么它的亲儿子元素sketch会叠加。
而亲儿子元素内部的sketch不会受到影响。(子组件不受它爷爷，老爷影响，但受他爸)

组件间 彼此通讯的数据 越少越精剪越好。

### modules.exports export export default

ES6 会将export export default 一起包装为{ **:**, default:**},
然后赋给modules.export, 再通过require导入.

也就是说ES6只用export，而webpack new webpack.ProvidePlugin() 是import * as "what?", 所以default是在一个“what？”对象中。

因此，要么用module.exports导，要么手动import {default} as ?. 而上面那个插件只能用module.exports格式了。

### transform

css3 transform 与 svg transform 不同。

g标签可以设置css3 transform, 但会使svg  transform失效。

### z-index

SVG内部元素不识别z-index, 谁（e.g g标签)挂载在最后，谁就显示在最上面.

## 总结

综上SVG包含css2基本属性／css3, 但与css3属性重名者，svg属性实效。所以svg尽量不要使用css设置（那是css3),直接食用库来操作SVG内部元素。

SVG 内部标签 不支持 事件。（click, mousedown等）

通信不只是传递信息，也应该将约定的信息提取出来解耦，以免被不知情的更改。

> !!{}
> true
> if ({}) {console.log('ok')}
> ok}

## toolBox

### scale

// const originaldata = el.getBBox(); //getBBox()值初始化后，永远不会变（要不scale怎么能用)

## pointLink

### vue watch

vue watch 一个 this.test.a.b.c, 如果this.test本身没有增删，是不会触发相关watch回调函数的

换句话说，$watch不会单独监控this.test中的各个对象，只有当this.test/this.test.a/.b.c等被直接赋值时才会启动。

```
                    vm.$watch(function() {
                        this.eventHappenedNum;
                        return this.linkData[endIndex].startRoot.attributes.transform.value;
                    }, function() {
                        let box = V(el).bbox();
                        dataSet[endIndex].start.x = box.x;
                        dataSet[endIndex].start.y = box.y;
                    })
```

> 上述代码加入了this.eventHappenedNum以捕捉事件，启动watch,watch启动后，会检测this.eventHappenedNum(肯定变了），再检测this.linkData[..].....(this.linkData中绑定的DOM对象变更虽然改变了transoform.value值，但如上面说过的，没有直接操作this.linkData或其属性，所以watch不会启动。)

```
            this.$watch(() => {
                this.eventHappenedNum;
                return this.root(data.startEl).attributes.transform.value;
            }, function() {
                const box = V(data.startEl).bbox();
                data.start.x = box.x;
                data.start.y = box.y;
            })
```

** this.eventHappenedNum与this.root(da...)...值变更 决定了 watch 检测是否开启，

return 返回值是否改变，决定了回调函数是否执行（const box.....)

所以 return this.eventHappenedNum + this.root.... 会一直触发回调函数
**

## translateTheRoot实现嵌套

el.children 就是nodelist结构（伪数组），可以直接Array.prototype.slice.call(el.children)转化过来。（不转化，遍历时自然length等用不到的属性也会出来）

## prism 三方库使用 出现的问题

使用`<style scoped>`，必须在当前文件内将 dom树（`<template></template>`）写好。

`<style scoped>`形成的'css规则树'只在 当前元素生成 渲染树时有用，即便之后创建元素后挂载在`<template></template>`根元素中，`<style scoped>`的css也不起作用。

**字符对不上原因出在，我用prism官网的css替换了 codepen 上人家本身的配色方案。

<img src="https://ww2.sinaimg.cn/large/006tNbRwly1fdlcnb3ofzj30n20j8gnc.jpg" width = "200" height = "200" alt="图片名称" align=center />
<img src="https://ww2.sinaimg.cn/large/006tNbRwly1fdlcnh7e8qj30is0e6ab4.jpg" width = "200" height = "200" alt="图片名称" align=center />

> 最后，通过注释掉了官网css中的一句话，避免了字符错位。（没有用codepen原本的less文件)

<img src="https://ww2.sinaimg.cn/large/006tNbRwly1fdlcnirojsj30js0w6jvx.jpg" width = "200" height = "300" alt="图片名称" align=center />
<img src="https://ww2.sinaimg.cn/large/006tNbRwly1fdlcnhtmknj30js0tkae5.jpg" width = "200" height = "300" alt="图片名称" align=center />

## 选择器

'#v-26&v-27' is not a valid selector.
'#v-26>v-27' is not a valid selector.
'#v-26-v-27' is a valid selector.

## mapState

```
mapState({
        data: function(state) {
```

vue的mapState是和 state.code.filterKey绑定的

```
for(let i in state.code.datasets) {
                if (state.code.datasets[i].id === state.code.filterKey) {
                    result = state.code.datasets[i];
                }
            }
```

state.code.filterKey改变才会引起data()函数触发

```
for(let i in state.code.datasets) {
                if (state.code.datasets[i].id === '') {
                    result = state.code.datasets[i];
                }
            }
```

这样data()函数将只调用一次,相应的initCode()才会触发

```
<textarea class="code-input" :value="initCode()"
```

## prism.js

最终全部使用了codepen本身的配套js, css. (即prism.js 0.0.4)

使用prism.js 最新的（2017-1-8 没找到官网的版本号) TAB可能产生错位。

## 动态注册组件(watch computed created mounted先后顺序)

> 问题：需要使用watch的newVal和oldVal，但多次在watch中动态注册组件无效

描述：根据周期图，created前computed和watch都已注册，那为什么mounted执行时，watch组件还没注册？我们来看看顺序：

代码：

```
    created: function () {
        this[INIT_CARD_DATASET](this.storageKey);
        console.log('created');
    },
    mounted: function() {
        console.log('mounted');
    }
```

输出：

```
computed
List.vue:52 created
List.vue:32 computed

vue.js:564 [Vue warn]: Unknown custom element: <QRlxHZshUB1494591394186> - did you register the component correctly? For recursive components, make sure to provide the "name" option. //各种组件未注册错误

List.vue:55 mounted
List.vue:43 watch
```

分析：可见created中更改监测变量的值后，watch在mounted之后才运行，computed顺序正常。

> 方案：改在mounted内更改监测变量的值。

代码：

```
    mounted: function() {
        console.log('mounted');
        this[INIT_CARD_DATASET](this.storageKey);
    },
    beforeUpdate: function() {
        console.log('beforUpdate');
    }
```

输出：(这次没有报错)

```
computed
List.vue:51 mounted
List.vue:32 computed
List.vue:43 watch
List.vue:55 beforUpdate
```

分析：watch在beforeUpdate之前运行，OK了。
### viewBBox捕捉缩放

**最初实现时，不知道有viewBBox，自己辛辛苦苦手动根据getBBox的返回值算比例，唉~**

> 使用原生存在的问题：

红框框的位移，费解。。。(`不知道杂计算这个值`)(**可能也是由于这个问题才出现viewBox,preserveAspectRatio接口的**)

![img](https://segmentfault.com/image?src=https://ww2.sinaimg.cn/large/006tNc79ly1ffjvx7spgnj30nq05o74s.jpg&objectId=1330000006906507&token=81c5b1a669d1cd3abb1445676b8ab715)

![img](https://segmentfault.com/image?src=https://ww3.sinaimg.cn/large/006tNc79ly1ffjvypo8ukj30za0h079o.jpg&objectId=1330000006906507&token=1d65dc2619b7fbaaa6c61f148ecf576e)

![img](https://segmentfault.com/image?src=https://ww2.sinaimg.cn/large/006tNc79ly1ffjw23emp5j30z00qejxw.jpg&objectId=1330000006906507&token=fa4053de767f9dfd0d22134042b8d294)

> 使用原生(**没成**)

```
const ratio = calculateSizeRatio(bbox, {height: 60, width: 60});
const width = bbox.x + bbox.width;
const height = bbox.y + bbox.height;

vel.attr('style', ['width:', width, 'px;', ' height:', height, 'px;'].join(''));
vel.scale(ratio.width, ratio.height);
vel.translate(-(bbox.x*ratio.width+vel.node.offsetX), -(bbox.y*ratio.height+vel.node.offsetY));
```

> 使用viewBBox

```
 vel.attr('style', ['width:', '60', 'px;', ' height:', '60', 'px;'].join(''));
 vel.attr('viewBox', view)
```
## [vue组件标签页中 data-v-6542a5cf值是如何生成的 ？](https://segmentfault.com/q/1010000009421651?_ea=1923585)

生成过程和 `文件路径文件名`有关，所以不能拿来直接用。(具体看源码)

ps: [process.cwd()](https://segmentfault.com/q/1010000004951523/a-1020000004953950)

> 因此，为了始终适配项目变更，data-v的值不能直接使用。
