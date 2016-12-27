<script>
import {wrapNameSelector} from "../utils";
import Toolbox from "./toolbox";
import { mapState } from 'vuex';


export default {
    components: { Toolbox},
    computed: mapState({
        rootName: state => state.tool.root.name,
        scaleName: state => state.tool.scale.name,
        boxName: state => state.tool.box.name
    }),
    mounted: function() {
       //tanslate scale item. 
       V(this.$el.querySelector(wrapNameSelector(this.scaleName))).translate(60, 60);
       this.$el.querySelector(wrapNameSelector(this.boxName)).setAttribute('display', 'none'); 
    } 
};
</script>

<template>
    <svg class="sketch">
        <g class="configure" :name="rootName">
            <rect class="background"></rect>
            <path class="separator" d="M0,15 L60,15"></path>
            <text class="name">
                <tspan>State</tspan>
            </text>
            <text class="event">
                <tspan dy="0em">test</tspan>
                <tspan dy="1em" x="0">test</tspan>
                <tspan dy="1em" x="0">test</tspan>
            </text>
            <Toolbox></Toolbox>
        </g>
    </svg>
</template>

<style scoped lang="less">
    .sketch {
        width: 60px;
        height: 60px;
        cursor: move;
        .configure {
            cursor: move;
        }
        .background {
            width: 60px;
            height: 60px;
            rx: 10;
            ry: 10;
            fill: #fff9ca;
            stroke: #333;
            stroke-width: 1;
        }
        .separator {
            stroke: #333;
            stroke-width: 1px;
        }
        .name {
            text-anchor: middle;
            font-size: 12px;
            font-weight: bold;
            transform: translate(30px, 10px);
        }
        .event {
            font-size: 8px;
            font-weight: bold;
            transform: translate(8px, 25px);
        }
    }
</style>