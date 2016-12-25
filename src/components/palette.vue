<script>

export default {
    data() {
        return {
            className: 'parent',
            component: undefined,
            svg: undefined
        }
    },
    methods: {
        chooseComponent: function(e) {
            if (!!e.target.ownerSVGElement) {
                this.component = V(e.target).findParentByClass(this.className);
                this.svg.append(this.component);
            }
        },
        moveComponent: function(e) {
            if(!!this.component) {
                this.component.translate(e.movementX, e.movementY);
            } else {
                event.preventDefault(); 
            }
        },
        removeComponent: function(e) {
            this.component = undefined;
        }
    },
    mounted() {
        $(this.$el).droppable({
            accept: 'svg',
            drop: (e, ui) => {
                const vel = V(ui.helper[0].children[0]);
                this.svg = V(this.$el.children[0]);

                const point = this.svg.toLocalPoint(ui.position.left, ui.position.top);
                vel.translate(~~point.x, ~~point.y).addClass(this.className);

                this.svg.append(vel);
            }
        });
    } 
};
</script>

<template>
    <div>
        <svg class="sketch" @mousemove="moveComponent" @mouseup="removeComponent" @mousedown="chooseComponent"></svg>
    </div>
</template>

<style scoped lang="less">
    .sketch {
        width: 100%;
        height: 100%;
    }
</style>