<script>
import {findParentByName, findContainsByName, scaleTheRoot} from "../utils";
import { mapActions } from 'vuex';
import { mapState } from 'vuex';
import { SET_SCALE_METHOD} from 'store/tool';

export default {
    computed: mapState({
        scaleName: state => state.tool.scale.name,
        linkName: state => state.tool.link.name,
        boxName: state => state.tool.box.name,
        rootName: state => state.tool.root.name,
        signName: state => state.tool.sign.name
    }),
    methods: {
        ...mapActions([SET_SCALE_METHOD]),
        scaleRoot(el, e) {
            const vel = V(findParentByName(el, this.rootName));
            const originaldata = vel.bbox(true);
            const newdata = vel.bbox();
            const originalScale = {x: (newdata.width + e.movementX)/originaldata.width, y: (newdata.height + e.movementY)/originaldata.height};
            vel.scale(originalScale.x, originalScale.y);

            const contains = findContainsByName(el, this.rootName);
            scaleTheRoot(vel.node, contains, false);
        }
    },
    created: function() {
        this[SET_SCALE_METHOD](this.scaleRoot);
    }
};
</script>

<template>
    <g :name="boxName">
        <circle class="sign" :name="signName"></circle>
        <circle class="scale" :name="scaleName"></circle>
        <circle class="link" :name="linkName"></circle>
        <circle class="link" :name="linkName"></circle>
        <circle class="link" :name="linkName"></circle>
        <circle class="link" :name="linkName"></circle>
    </g>
</template>

<style scoped lang="less">
    .sign {
        cursor: se-resize;
        opacity: 0.8;
        fill: #6ED44E;
        r: 5;
        stroke:#319A8B;
        stroke-width: 3;
        stroke-opacity: 0.4;
    }
    .scale {
        cursor: se-resize;
        opacity:0.0;
        r: 6;
    }
    .link {
        cursor: crosshair;
        fill-opacity: 0.8;
        r: 2;
        fill: #333333;
        stroke:#333333;
        stroke-width: 10;
        stroke-opacity: 0.4;
    }
</style>