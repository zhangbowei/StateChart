<script>
import Sidebar from 'components/sidebar';
import Box from 'components/box';

export default {
    components: { Sidebar, Box},
    beforeMount: function() {
        console.log($('.BoxA'));
        console.log($('#app'));
        console.log($('body'));
    },
    mounted: function() {
        console.log($('.BoxA'));
        console.log($('#app'));
        console.log($('body'));
    },

    directives: {
        drag: {
            inserted: function(el) {
                el.dataset.initLRatio = $(el).position().left/$(el).parent().width();
                console.log($('.BoxA'));
                console.log($('#app'));
                console.log($('body'));
            },
            bind: function (el, binding) {
                var $el = $(el);
                var itemA = binding.value.itemA;
                var itemB = binding.value.itemB;
                var limit = binding.value.limit;

                $el.draggable({
                    helper: false,  //remove jquery auto add relative;
                    axis: "x",
                    start: function (event) {
                        el.dataset.parentW = $el.parent().width();
                        el.dataset.startL = $el.position().left;
                        el.dataset.widthA = $(itemA).width();
                        el.dataset.widthB = $(itemB).width();
                    },
                    drag: function(event) {
                        if (+Math.abs($el.position().left/el.dataset.parentW - el.dataset.initLRatio).toFixed(2) > limit) {
                            event.preventDefault();

                            var unlawLRatio = $el.position().left/el.dataset.parentW;
                            var newLRatio = unlawLRatio > el.dataset.initLRatio ? +el.dataset.initLRatio + +limit : +el.dataset.initLRatio - +limit;
                            
                            $el.css("left", newLRatio*100 + "%");
                        }

                        var d = $el.position().left - el.dataset.startL;
                        var newWidthA = +el.dataset.widthA + d;
                        var newWidthB = +el.dataset.widthB - d;
                        
                        $(itemA).width(newWidthA);
                        $(itemB).width(newWidthB);
                    },
                    stop:function(event) {
                        var d = $el.position().left - el.dataset.startL;
                        var newWidthA = +el.dataset.widthA + d;
                        var newWidthB = +el.dataset.widthB - d;
                        $el.css("left", ($el.position().left/el.dataset.parentW)*100 + "%");
                        $(itemA).width((newWidthA/el.dataset.parentW)*100 + "%");
                        $(itemB).width((newWidthB/el.dataset.parentW)*100 + "%");
                    }
                });

            }
        }
    }
}
</script>

<template>
    <div class="sketch">
        <Box class="BoxA"></Box>
        <Sidebar class="L" v-drag="{ itemA: '.BoxA', itemB: '.BoxB', limit: '0.1'}"></Sidebar>
        <Box class="BoxB"></Box>
        <Sidebar class="R" v-drag="{ itemA: '.BoxB', itemB: '.BoxC', limit: '0.1'}"></Sidebar>
        <Box class="BoxC"></Box>
    </div>
</template>

<style lang="less" scoped>
    .sketch {
        position: absolute;
        height: 100%;
        width: 100%;
        .BoxB {
            width: 60%;
            background-color: teal;
        }
        .L {
            left: 20%;
        }
        .R {
            left: 80%;
        }
    }
</style>