<script>
import Sidebar from 'components/sidebar';
import Box from 'components/box';

export default {
    components: { Sidebar, Box},
    directives: {
        drag: {
            bind: function (el, binding) {
                var itemA = binding.value.itemA;
                var itemB = binding.value.itemB;
                var scale = binding.value.scale;
                var originalPosition = {};

                $(el).draggable({
                    helper: false,  //remove jquery auto add relative;
                    axis: "x",
                    start: function (event, ui) {
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
                        var parentWidth = $(itemA).parent().width();
                        
                        $(el).css("left", (ui.position.left/parentWidth)*100 + "%");
                        $(itemA).width(($(itemA).width()/parentWidth)*100 + "%");
                        $(itemB).width(($(itemB).width()/parentWidth)*100 + "%");
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
        <Sidebar class="L" v-drag="{ itemA: '.BoxA', itemB: '.BoxB'}"></Sidebar>
        <Box class="BoxB"></Box>
        <Sidebar class="R" v-drag="{ itemA: '.BoxB', itemB: '.BoxC'}"></Sidebar>
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