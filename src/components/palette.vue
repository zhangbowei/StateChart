<script>
import utils from "../utils";
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
            eventTurn: true
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
        findRoot: function(el) {
            return utils.findParentByName(el, this.rootName);
        },
        updateEventTurn: function() {
            this.eventTurn = this.eventTurn ? false : true;
        },

        //logic function
        changeRoot(el, e) {
            const vel = V(el);

            if (e.type === "mousedown") {
                //protect .bbox() is pure x,y,width,height (toolbox should be hidden)
                el.querySelector(utils.wrapNameSelector(this.boxName)).setAttribute('display', 'none');
                el.parentNode.querySelector(utils.wrapNameSelector(this.boxName)).setAttribute('display', 'none');

                utils.autoTransformTheRoot(el, this.rootName, true); 
                V(this.svg).append(vel);
            }

            if (e.type === "mousemove") {
               vel.translate(~~e.movementX, ~~e.movementY); 
            }

            if (e.type === "mouseup") {
               let allRoots = V(this.svg).find(utils.wrapNameSelector(this.rootName));
               let nearContain = utils.findNearContain(el, allRoots);

               if (nearContain) {
                    V(nearContain).append(vel);
                    utils.autoTransformTheRoot(el, this.rootName, false); 
               } 
            }
        },
        linkRoot(el, e) {
            const dataSet = this.linkData;
            const endIndex = dataSet.length-1;
            
            if (e.type === "mousedown") {
                let box = V(el).bbox();
                let start = {x: box.x, y: box.y, id: el.id};
                let end = utils.makeMouseFirst({x: e.offsetX, y: e.offsetY});

                dataSet.push({start, end}); 
            } 

            if (e.type === "mousemove") {
                let end = utils.makeMouseFirst({x: e.offsetX, y: e.offsetY}, 5);
                dataSet[endIndex].end = end;
            }

            if (e.type === "mouseup") {
                let endEl = utils.findParentByName(e.target, this.linkName);

                if(!!endEl && dataSet[endIndex].start.id != endEl.id) {
                    let box = V(endEl).bbox();
                    let end = {x: box.x, y: box.y, id: endEl.id};
                    dataSet[endIndex].end = end;
                    dataSet[endIndex].startEl = el;
                    dataSet[endIndex].endEl = endEl;
                    
                    this.watchLink(endIndex);
                } else {
                    dataSet.pop();
                }
            }
        },

        //watch&follow related pointed  changed 
        triggerWatchLink: function(el) {
            this.eventTurn; 
            return this.findRoot(el).attributes.transform.value;
        },
        watchLink: function(index) {
            const data = this.linkData[index];
            const watchPointStart = utils.curryIt(this.triggerWatchLink)(data.startEl);
            const watchPointEnd = utils.curryIt(this.triggerWatchLink)(data.endEl);

            this.$watch(watchPointStart, function() {
                const box = V(data.startEl).bbox();
                data.start.x = box.x;
                data.start.y = box.y;
            });

            this.$watch(watchPointEnd, function() {
                const box = V(data.endEl).bbox();
                data.end.x = box.x;
                data.end.y = box.y;
            });
        },

        //event choose function
        chooseComponent: function(e) {
            this.component = utils.findParentByName(e.target, this.nameSet);
            this.component ? this.method(this.component, e) : null;
        },
        moveComponent: function(e) {
            this.component ? this.method(this.component, e) : null;
        },
        removeComponent: function(e) {
            this.component ? this.method(this.component, e) : null;
            this.component = undefined;
        },

        //UX function 
        displayTool: function(e) {
            const root = this.findRoot(e.target);
            if (!!root) {
                root.querySelector(utils.wrapNameSelector(this.boxName)).setAttribute('display', 'block'); 
            } 
        },
        hideTool: function(e) {
            const root = this.findRoot(e.target);
            if (!!root) {
                root.querySelector(utils.wrapNameSelector(this.boxName)).setAttribute('display', 'none');
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
                const vel = V(ui.helper[0].querySelector(utils.wrapNameSelector(this.rootName)));

                vel.translate(~~point.x, ~~point.y);
                vel.node.querySelector(utils.wrapNameSelector(this.boxName)).setAttribute('display', 'block');
                this.svg.appendChild(vel.node);
            }
        });

        utils.addEventListener(['mousemove', 'mouseup', 'mousedown'], this.$el, this.updateEventTurn);
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