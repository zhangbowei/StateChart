<script>
import { mapActions } from 'vuex';
import { mapState } from 'vuex';
import { SET_SCALE_METHOD } from 'store/tool';

export default {
    computed: mapState({
        scaleName: state => state.tool.scale.name,
        linkName: state => state.tool.link.name,
        boxName: state => state.tool.box.name
    }),
    methods: {
        ...mapActions([SET_SCALE_METHOD]),
        scaleRoot(el, e) {
            const vel = V(el);
            const originaldata = vel.bbox(true); 
            const newdata = vel.bbox();

            vel.scale((newdata.width + e.movementX)/originaldata.width, (newdata.height + e.movementY)/originaldata.height);
        }
    },
    created: function() {
        this[SET_SCALE_METHOD](this.scaleRoot);        
    }
};
</script>

<template>
    <g :name="boxName">
        <circle class="scale" :name="scaleName"></circle>
        <circle class="link" :name="linkName"></circle>
        <circle class="link" :name="linkName"></circle>
        <circle class="link" :name="linkName"></circle>
        <circle class="link" :name="linkName"></circle>
    </g>
</template>

<style scoped lang="less">
    .scale {
        cursor: se-resize;
        opacity:0.0;
        r: 6;
    }
    .link {
        opacity:0.5;
        r: 3;
    }
</style>