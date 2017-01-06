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
            gStates: undefined,
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
                utils.setToolDisplay([el, el.parentNode], this.boxName, 'none');
                utils.autoTransformTheRoot(el, this.rootName, true); 

                V(this.gStates).append(vel);
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

               utils.setToolDisplay(el, this.boxName, 'block');
            }
        },
        linkRoot(el, e) {
            const dataSet = this.linkData;
            const endIndex = dataSet.length-1;
            const start = {}, end = {};
            
            if (e.type === "mousedown") {
                _.extend(start, _.pick(V(el).bbox(), 'x', 'y'), {id: el.id});
                _.extend(end, utils.makeMouseFirst({x: e.offsetX, y: e.offsetY}), {id: undefined});
                dataSet.push({start, end}); 
            } 

            if (e.type === "mousemove") {
                _.extend(end, utils.makeMouseFirst({x: e.offsetX, y: e.offsetY}, 5));
                _.extend(dataSet[endIndex].end, end);
            }

            if (e.type === "mouseup") {
                let endEl = utils.findParentByName(e.target, this.linkName);

                if(!!endEl && dataSet[endIndex].start.id != endEl.id) {
                    _.extend(end, _.pick(V(endEl).bbox(), 'x', 'y'), {id: endEl.id});
                    _.extend(dataSet[endIndex], {end, el, endEl})
                    
                    this.watchLink(endIndex);
                } else {
                    dataSet.pop();
                }
            }
        },

        //watch&follow related pointed  changed 
        triggerWatchLink: function(el) {
            this.eventTurn; 
            return {x: V(this.findRoot(el)).bbox().x, y: V(this.findRoot(el)).bbox().y};
        },
        watchLink: function(index) {
            const data = this.linkData[index];
            const watchPointStart = utils.curryIt(this.triggerWatchLink)(data.el);
            const watchPointEnd = utils.curryIt(this.triggerWatchLink)(data.endEl);

            this.$watch(watchPointStart, function() {
                const box = _.pick(V(data.el).bbox(), 'x', 'y');
                _.extend(data.start, box);
            });

            this.$watch(watchPointEnd, function() {
                const box = _.pick(V(data.endEl).bbox(), 'x', 'y');
                _.extend(data.end, box);
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
                utils.setToolDisplay(root, this.boxName, "block");
            } 
        },
        hideTool: function(e) {
            const root = this.findRoot(e.target);
            if (!!root) {
                utils.setToolDisplay(root, this.boxName, "none");
            }
        }
    },
    created: function() {
        this[SET_ROOT_METHOD](this.changeRoot);        
        this[SET_LINK_METHOD](this.linkRoot);
    },
    mounted() {
        this.svg = this.$el.querySelector('svg');
        this.gStates = this.svg.querySelector('g');

        $(this.$el).droppable({
            accept: 'svg',
            drop: (e, ui) => {
                const point = V(this.svg).toLocalPoint(ui.position.left, ui.position.top);
                const vel = V(ui.helper[0].querySelector(utils.wrapNameSelector(this.rootName)));

                vel.translate(~~point.x, ~~point.y);
                vel.node.querySelector(utils.wrapNameSelector(this.boxName)).setAttribute('display', 'block');
                this.gStates.appendChild(vel.node);
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
            <g></g>
            <g>
                <PointLink v-for="item in linkData" :data="item"></PointLink>
            </g>
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