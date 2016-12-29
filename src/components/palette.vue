<script>
import {wrapNameSelector, findParentByName, makeMouseFirst} from "../utils";
import { mapActions } from 'vuex';
import { mapState } from 'vuex';
import { SET_ROOT_METHOD, SET_LINK_METHOD} from 'store/tool';
import PointLink from './pointLink';

export default {
    components: { PointLink},
    data() {
        return {
            //this component: choosed component to do its logic function by "click and move"
            component: undefined,
            svg: undefined,
            //link
            linkData: [],
            eventHappenedNum: null
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
        boxName: state => state.tool.box.name,
        linkName: state => state.tool.link.name,
        rootName: state => state.tool.root.name
    }),
    methods: {
        ...mapActions([SET_ROOT_METHOD, SET_LINK_METHOD]),
        //get Variables
        root: function(el) {
            return findParentByName(el, this.rootName);
        },
        //logic function
        changeRoot(el, e) {
            V(el).translate(~~e.movementX, ~~e.movementY); 
        },
        linkRoot(el, e) {
            const dataSet = this.linkData;
            
            if (e.type === "mousedown") {
                let box = V(el).bbox();
                let start = {x: box.x, y: box.y, id: el.id};
                let end = makeMouseFirst({x: e.offsetX, y: e.offsetY});

                dataSet.push({start, end}); 
            } 

            if (e.type === "mousemove") {
                let end = makeMouseFirst({x: e.offsetX, y: e.offsetY}, 5);

                dataSet[dataSet.length-1].end = end;
            }

            if (e.type === "mouseup") {
                let data =  dataSet[dataSet.length-1];
                let endEl = findParentByName(e.target, this.linkName);

                if(!!endEl && data.start.id != endEl.id) {
                    let box = V(endEl).bbox();
                    let end = {x: box.x, y: box.y, id: endEl.id};
                    dataSet[dataSet.length-1].end = end;
                    dataSet[dataSet.length-1].startRoot = this.root(el);
                    dataSet[dataSet.length-1].endRoot = this.root(endEl);


                    var vm = this;
                    let endIndex = dataSet.length-1;
                    vm.$watch(function() {
                        this.eventHappenedNum;
                        return this.linkData[endIndex].startRoot.attributes.transform.value;
                    }, function() {
                        let box = V(el).bbox();
                        dataSet[endIndex].start.x = box.x; 
                        dataSet[endIndex].start.y = box.y; 
                    });
                    vm.$watch(function() {
                        this.eventHappenedNum;
                        return this.linkData[endIndex].endRoot.attributes.transform.value;
                    }, function() {
                        let box = V(endEl).bbox();
                        dataSet[endIndex].end.x = box.x; 
                        dataSet[endIndex].end.y = box.y; 
                    });
                } else {
                    dataSet.pop();
                }
            }
        },
        //event choose function
        chooseComponent: function(e) {
            if (!!e.target.ownerSVGElement) {
                this.component = findParentByName(e.target, this.nameSet);
                this.component ? this.method(this.component, e) : null;

                //make choosed component on the top.
                this.svg.appendChild(this.root(this.component));
                this.eventHappenedNum ++;
            }
        },
        moveComponent: function(e) {
            this.component ? this.method(this.component, e) : null;
            this.eventHappenedNum ++;
        },
        removeComponent: function(e) {
            this.component ? this.method(this.component, e) : null;
            this.component = undefined;
            this.eventHappenedNum ++;
        },
        //UX function 
        displayTool: function(e) {
            const root = this.root(e.target);
            if (!!root) {
                root.querySelector(wrapNameSelector(this.boxName)).setAttribute('display', 'block'); 
            } 
        },
        hideTool: function(e) {
            const root = this.root(e.target);
            if (!!root) {
                root.querySelector(wrapNameSelector(this.boxName)).setAttribute('display', 'none');
            }
        }
    },
    created: function() {
        this[SET_ROOT_METHOD](this.changeRoot);        
        this[SET_LINK_METHOD](this.linkRoot);
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
        <svg class="sketch" @mousemove="moveComponent" @mouseup="removeComponent" @mousedown="chooseComponent" @mouseover="displayTool"
            @mouseout="hideTool">
            <PointLink v-for="item in linkData" :data="item"></PointLink>
        </svg>
    </div>
</template>

<style scoped lang="less">
    .sketch {
        width: 100%;
        height: 100%;
        user-select: none;
        cursor: default;
    }
</style>