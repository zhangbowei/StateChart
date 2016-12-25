<script>

export default {
    methods: {
        moveComponent: function(e) {
        },
        chooseComponent: function(e) {
        }
    },
    mounted() {
        $(this.$el).droppable({
            accept: 'svg',
            drop: function(e, ui) {
                const el = ui.helper[0].children[0];
                const svg = this.children[0];
                const point = V(svg).toLocalPoint(ui.position.left, ui.position.top);

                V(el).translate(Math.round(point.x), Math.round(point.y));
                svg.append(el);
            }
        });
    } 
};
</script>

<template>
    <div>
        <svg class="sketch" @mousemove="moveComponent" @mouseup.prevent @mousedown="chooseComponent"></svg>
    </div>
</template>

<style scoped lang="less">
    .sketch {
        width: 100%;
        height: 100%;
    }
</style>