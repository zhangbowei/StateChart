<script>
import { mapState } from 'vuex';

export default {
    props: ['data'], 
    computed: mapState({
        pathD: function() {
            const start = this.data.start;
            const end = this.data.end;
            return ['M', start.x, start.y, 'L', end.x, end.y].join(' ');
        },
        id: function() {
            return [this.data.start.id, this.data.end.id].join('_');
        },
        transitionName: state => state.tool.transition.name
    })
};
</script>

<template>
    <path :name="transitionName" :id="id" class="link" :d="pathD"></path>
</template>

<style scoped lang="less">
    .link {
        cursor: crosshair;
        opacity: 0.8;
        stroke: #333333;
        stroke-width: 3;
    }
</style>