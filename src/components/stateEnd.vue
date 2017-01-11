<script>
import {wrapNameSelector} from "../utils";
import Toolbox from "./toolbox";
import Tag from "./tag";
import { mapState } from 'vuex';


export default {
    components: { Toolbox, Tag},
    computed: mapState({
        rootName: state => state.tool.root.name,
        scaleName: state => state.tool.scale.name,
        linkName: state => state.tool.link.name,
        boxName: state => state.tool.box.name,
        signName: state => state.tool.sign.name
    }),
    mounted: function() {
       const position = [{x: 10, y:30}, {x: 30, y:10}, {x: 30, y:50}, {x: 50, y:30}];
       
       this.$el.querySelectorAll(wrapNameSelector(this.linkName)).forEach(function(el, index) {
           V(el).translate(position[index].x, position[index].y);
       });
       V(this.$el.querySelector(wrapNameSelector(this.scaleName))).translate(50, 50);
       V(this.$el.querySelector(wrapNameSelector(this.signName))).translate(10, 10);
       this.$el.querySelector(wrapNameSelector(this.boxName)).setAttribute('display', 'none'); 
    } 
};
</script>

<template>
    <svg class="sketch">
        <g class="configure" :name="rootName">
            <rect class="background"></rect>
            <circle class="pictureOut"></circle>
            <circle class="pictureIn"></circle>
            <Toolbox></Toolbox>
            <Tag data="FinalState"></Tag>
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
            width: 40px;
            height: 40px;
            x: 10;
            y: 10;
            opacity: 0.0;
        }
        .pictureOut {
            cx: 30;
            cy: 30;
            r: 20;
            fill: #FFFFFF;
            stroke: #333;
            stroke-width: 1;
        }
        .pictureIn {
            cx: 30;
            cy: 30;
            r: 15;
            fill: #93A1A1;
        }
    }
</style>