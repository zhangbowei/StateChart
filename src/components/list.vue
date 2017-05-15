<script>
import Vue from 'vue';
import { mapActions } from 'vuex';
import { mapState } from 'vuex';
import { INIT_CARD_DATASET } from 'store/card';
import { wrapIdSelector, wrapNameSelector } from "../utils";
import { convertStrToDom, calculateSizeRatio, parseSVGBBox, formatSVGStrToHTML } from "../utils/reuse";
import Region from './region';
import StateStart from './stateStart';
import StateEnd from './stateEnd';
import PointLink from './pointLink';
import Introduction from './introduction';

export default {
	data() {
		return {
			convert: true
		};
	},
	directives: {
		drag: {
			bind(el) {
				$(el).draggable({
					helper: 'clone'
				});
			}
		},
		tag: {
			bind(el, binding) {
				const rawObj = binding.value;

				$(el).find(rawObj.selector).first().attr(rawObj.tag, rawObj.name);
			}
		}
	},
	components: { Region, StateStart, StateEnd, PointLink, Introduction },
	methods: {
		...mapActions([INIT_CARD_DATASET]),
		formatRawComponent(contentStr) {
			const svgStr = formatSVGStrToHTML(JSON.parse(contentStr), { tag: this.componentTag, el: this.$el });
			const palette = document.querySelector(wrapIdSelector(this.paletteId));
			const vel = V(convertStrToDom(svgStr).querySelector('svg'));
			const bbox = parseSVGBBox(palette, vel.node);
			const view = [bbox.x, bbox.y, bbox.width, bbox.height].join();

			vel.attr('style', ['width:', '60', 'px;', ' height:', '60', 'px;'].join(''));
			vel.attr('viewBox', view);
			vel.attr('preserveAspectRatio', 'none');

			return vel.node.outerHTML;
		},
		productComponentConf(name) {
			return {
				selector: wrapNameSelector(this.rootName),
				tag: this.componentTag,
				name: name
			};
		}
	},
	computed: mapState({
		datasets: state => state.card.datasets.filter(data => data.name.includes(state.card.filterKey)),
		rootName: state => state.tool.root.name,
		paletteId: state => state.market.paletteId,
		listId: state => state.market.listId,
		storageKey: state => state.market.storageKey,
		componentTag: state => state.market.componentTag,
		component: state => state.card.keyObj.component,
		content: state => state.card.keyObj.content
	}),
	watch: {
		datasets: function (newArr, oldArr) {
			const len = newArr.length - oldArr.length;
			const diffArr = newArr.slice(-len);
			diffArr.forEach((item) => {
				Vue.component(item[this.component], { template: this.formatRawComponent(item[this.content]) });
			});
		}
	},
	mounted: function () {
		this[INIT_CARD_DATASET](this.storageKey);
	}
};
</script>

<template>
	<div :id="listId" class="wrapper" :class="{'list-mode': convert}">
		<header>
			<a href="javascript:void(0)" class="hide-list" @click="convert=false">
				<i class="fa fa-th"></i>
			</a>
			<a href="javascript:void(0)" class="show-list" @click="convert=true">
				<i class="fa fa-th-list"></i>
			</a>
		</header>
		<div class="container">
			<div class="box" v-for="item in datasets">
				<div :is="item.component" v-drag v-tag="productComponentConf(item.component)"></div>
				<Introduction v-if="convert" :content="item"></Introduction>
			</div>
		</div>
	</div>
</template>

<style scoped lang="less">
a {
	transition: all 0.3s ease;
}

.wrapper {
	margin: 5px 0px;
	border-radius: 10em;
	box-sizing: border-box;
	flex: 1;
	display: flex;
	flex-direction: column;
}

header {
	text-align: right;
	padding: 1px;
	margin-bottom: 5px;
	background-color: #4F6C75;
}

header a {
	font-size: 20px;
	color: #93A1A1;
	width: 32px;
	height: 32px;
	line-height: 35px;
	margin-left: 10px;
	text-align: center;
	display: inline-block;
}

header a:hover,
.list-mode header a.hide-list:hover {
	background-color: #7E9496;
}

header a.hide-list {
	background-color: #7E9496;
}

.list-mode header a.hide-list {
	background-color: #4F6C75;
}

.list-mode header a.show-list {
	background-color: #7E9496;
}

.container:after {
	content: "";
	clear: both;
	display: table;
}

.container {
	margin: 10px 0px;
	overflow-y: scroll;
	flex: 1;
}
.wrapper .mat {
	width: 0px;
	height: 0px;
	visibility: hidden;
}
.wrapper .box {
	float: left;
	overflow: hidden;
	width: 60px;
	height: 60px;
	margin: 0px 5px 5px 0px;
	transition: all 1.0s ease;
	border-bottom: solid 1px #4F6C75;
}

.wrapper.list-mode .container {
	padding-right: 0px;
}

.wrapper.list-mode .box {
	width: 100%;
}
</style>