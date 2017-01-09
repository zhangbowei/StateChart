<script>
import {wrapNameSelector} from "../utils";
import Toolbox from "./toolbox";
import { mapState } from 'vuex';


export default {
    components: { Toolbox},
    computed: mapState({
        rootName: state => state.tool.root.name,
        scaleName: state => state.tool.scale.name,
        linkName: state => state.tool.link.name,
        boxName: state => state.tool.box.name
    }),
    mounted: function() {
       const position = [{x: 0, y:30}, {x: 30, y:0}, {x: 30, y:60}, {x: 60, y:30}];
       
       this.$el.querySelectorAll(wrapNameSelector(this.linkName)).forEach(function(el, index) {
           V(el).translate(position[index].x, position[index].y);
       });
       V(this.$el.querySelector(wrapNameSelector(this.scaleName))).translate(60, 60);
       this.$el.querySelector(wrapNameSelector(this.boxName)).setAttribute('display', 'none'); 
    } 
};
</script>

<template>
    <svg class="sketch">
        <g class="configure" :name="rootName">
            <rect class="background"></rect>
            <rect class="picture"></rect>
            <path class="separator" d="M0,15 L60,15"></path>
            <text class="name">
                <tspan>Region</tspan>
            </text>
            <Toolbox></Toolbox>
        </g>
    </svg>
</template>

<style scoped lang="less">
    .sketch {
        width: 60px;
        height: 60px;
        .configure {
            cursor: move;
        }
        .background {
           width: 60px;
           height: 60px;
           opacity: 0.0; 
        }
        .picture {
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
    }
</style>