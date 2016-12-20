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
