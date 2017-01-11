<script>
import { mapState } from 'vuex';
import {getAngle, makeMouseFirst} from "../utils";

export default {
    props: ['data'], 
    data() {
        return {
            arrow: undefined
        }
    },
    computed: mapState({
        pathD: function() {
            const start = this.data.start;
            const end = makeMouseFirst(this.data);
            return ['M', start.x, start.y, 'L', end.x, end.y].join(' ');
        },
        arrowD: function() {
            const data = this.data.end;
            const x = data.x;
            const y = data.y;
            return ['M', x, y, 'L', x-14, y-6, 'L', x-14, y+6, 'z'].join(' ');
        },
        id: function() {
            return [this.data.start.id, this.data.end.id].join('_');
        },
        pathName: state => state.tool.path.name
    }),
    watch: {
        pathD: function() {
            V(this.arrow).rotate(getAngle(this.data), this.data.end.x, this.data.end.y, {absolute: true});
        }
    },
    mounted() {
        this.arrow = this.$el.querySelector('.arrow');
    }
};
</script>

<template>
    <g :name="pathName" :id="id">
        <path class="link" :d="pathD"></path>
        <path class="arrow" :d="arrowD"></path>
    </g>
</template>

<style scoped lang="less">
    .link {
        cursor: pointer;
        opacity: 0.8;
        stroke: #333333;
        stroke-width: 3;
    }
    .arrow{
        fill: #333333;
    }
</style>