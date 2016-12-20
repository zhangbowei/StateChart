<script>
import utils from '../utils';

var dataset = {
    getinitDS(that) {
           var $el = $(that.$el);
           var itemX = that.itemX;
           var itemY = that.itemY;
           var limit = parseInt(that.limit);

           var lRatio = utils.divisionTofixed($el.position().left, $el.parent().width());
           var lRule = lRatio - limit;
           var rRule = lRatio + limit;

           return {
               lRatio: lRatio,
               lRule: lRule,
               rRule: rRule,
               $el: $el,
               limit: limit,
               itemX: itemX,
               itemY: itemY
           };
    },
    getstartDS(el, itemX, itemY) {
        var $el = $(el);
        var parentW = $el.parent().width();
        var startL = $el.position().left; 
        var widthX = $(itemX).width();
        var widthY = $(itemY).width();

        return {
            parentW: parentW,
            startL: startL,
            widthX: widthX,
            widthY: widthY,
            itemX: itemX,
            itemY: itemY
        };
    },
    getMoveDataset(nowL, parentW, startL) {
        var lRatio = utils.divisionTofixed(nowL, parentW);
        var offset = nowL - startL;
        return {
            lRatio: lRatio,
            offset: offset
        }
    }
}

export default {
   props: ['itemX', 'itemY', 'limit'], 

   mounted : function() {
           //数据分离
           var initDS = dataset.getinitDS(this);           
           var startDS;           

           initDS.$el.draggable({
                    helper: false,  //remove jquery auto add relative;
                    axis: "x",
                    start: (event) => {
                        //数据交互
                        startDS = dataset.getstartDS(initDS.$el, initDS.itemX, initDS.itemY);
                    },
                    drag: (event, ui) => {
                        var dragDS = dataset.getMoveDataset(ui.position.left, startDS.parentW, startDS.startL);

                        if (Math.abs(dragDS.lRatio - initDS.lRatio) > initDS.limit) {
                            ui.position.left = ((dragDS.lRatio > initDS.lRatio ? initDS.rRule : initDS.lRule) * startDS.parentW / 100);
                            event.preventDefault();
                        } else {
                            $(startDS.itemX).width(startDS.widthX + dragDS.offset);
                            $(startDS.itemY).width(startDS.widthY - dragDS.offset);
                        } 
                    },
                    stop:function(event, ui) {
                        var stopDS = dataset.getMoveDataset(ui.position.left, startDS.parentW, startDS.startL);

                        $(startDS.itemX).width(utils.divisionTofixed(startDS.widthX + stopDS.offset, startDS.parentW) + "%");
                        $(startDS.itemY).width(utils.divisionTofixed(startDS.widthY - stopDS.offset, startDS.parentW) + "%");
                        initDS.$el.css("left", stopDS.lRatio + "%");
                    }
           });
       }
    }
</script>

<template>
    <div class="sidebar"></div>
</template>

<style lang="less" scoped>
    .sidebar {
        position: absolute;
        top: 5px;
        bottom: 10px;
        width: 7px;
        background: url(../images/grip.png) no-repeat 50% 50%;
        border: 1px solid gray;
        background-color: white;
        cursor: col-resize;
    }
</style>