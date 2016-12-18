<script>
import Sidebar from 'components/sidebar';
import Box from 'components/box';

export default {
    components: { Sidebar, Box},
    beforeMount: function() {
        console.log('beforMount-app');
    },
    mounted: function() {
        
        console.log('mounted-app');
    },

    directives: {
        drag: {
            inserted: function(el) {
                el.dataset.initLeft = $(el).css("left")/$(el).parent().width();
            },
            bind: function (el, binding) {
                var itemA = binding.value.itemA;
                var itemB = binding.value.itemB;
                var scale = binding.value.scale;
                var originalPosition = {};

                $(el).draggable({
                    helper: false,  //remove jquery auto add relative;
                    axis: "x",
                    start: function (event, ui) {
                        originalPosition.parentWidth = $(ui).parent().width();
                        originalPosition.start = ui.position.left;
                        originalPosition.widthA = $(itemA).width();
                        originalPosition.widthB = $(itemB).width();
                    },
                    drag: function(event,ui) {
                        var d = ui.position.left - originalPosition.start;
                        var newWidthA = originalPosition.widthA + d;
                        var newWidthB = originalPosition.widthB - d;
                        
                        $(itemA).width(newWidthA);
                        $(itemB).width(newWidthB);
                    },
                    stop:function(event,ui) {
                        $(el).css("left", (ui.position.left/originalPosition.parentWidth)*100 + "%");
                        $(itemA).width(($(itemA).width()/originalPosition.parentWidth)*100 + "%");
                        $(itemB).width(($(itemB).width()/originalPosition.parentWidth)*100 + "%");
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
        <Sidebar class="L" v-drag="{ itemA: '.BoxA', itemB: '.BoxB', scale: '0.1'}"></Sidebar>
        <Box class="BoxB"></Box>
        <Sidebar class="R" v-drag="{ itemA: '.BoxB', itemB: '.BoxC', scale: '0.1'}"></Sidebar>
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
            right: 20%;
        }
    }
</style>