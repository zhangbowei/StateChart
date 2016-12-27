<script>
import {wrapNameSelector, findParentByName} from "../utils";
import { mapActions } from 'vuex';
import { mapState } from 'vuex';
import { SET_ROOT_METHOD } from 'store/tool';

export default {
    data() {
        return {
            component: undefined,
            svg: undefined
        }
    },
    computed: mapState({
        nameSet: state => {
            const result = [];
            for(let item in state.tool) {
                result.push(state.tool[item].name);
            } 
            return result;
        },
        method: function(state) {
            for(let item in state.tool) {
                if (state.tool[item].name === this.component.getAttribute('name')) {
                    return state.tool[item].method;
                } 
            } 
            return null;
        },
        root: function() {
            return findParentByName(this.component, this.rootName);
        },
        boxName: state => state.tool.box.name,
        rootName: state => state.tool.root.name
    }),
    methods: {
        ...mapActions([SET_ROOT_METHOD]),
        changeRoot(el, e) {
            V(el).translate(~~e.movementX, ~~e.movementY); 
        },
        chooseComponent: function(e) {
            if (!!e.target.ownerSVGElement) {
                this.component = findParentByName(e.target, this.nameSet);
                //make choosed component on the top.
                this.svg.appendChild(this.root);
            }
        },
        moveComponent: function(e) {
            if(!!this.component) {
                this.method ? this.method(this.root, e) : null;
            } 
        },
        removeComponent: function(e) {
            this.component = undefined;
        },
    },
    created: function() {
        this[SET_ROOT_METHOD](this.changeRoot);        
    },
    mounted() {
        this.svg = this.$el.querySelector('svg');

        $(this.$el).droppable({
            accept: 'svg',
            drop: (e, ui) => {
                const point = V(this.svg).toLocalPoint(ui.position.left, ui.position.top);
                const vel = V(ui.helper[0].querySelector(wrapNameSelector(this.rootName)));

                vel.translate(~~point.x, ~~point.y);
                vel.node.querySelector(wrapNameSelector(this.boxName)).setAttribute('display', 'block'); 

                this.svg.appendChild(vel.node);
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