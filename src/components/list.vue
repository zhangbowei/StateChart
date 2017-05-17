<script>
import Vue from 'vue';
import { mapActions } from 'vuex';
import { mapState } from 'vuex';
import { INIT_CARD_DATASET } from 'store/card';
import { parseSVGBBox, formatSVGStrToHtml } from "../utils/reuse";
import Region from './region';
import StateStart from './stateStart';
import StateEnd from './stateEnd';
import PointLink from './pointLink';
import Introduction from './introduction';

export default {
	data() {
		return {
			convert: true,
			path: undefined
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
				const dom = el.querySelector(['[name=', rawObj.root, ']'].join(''));

				dom.getAttribute(rawObj.tag) ? null : dom.setAttribute(rawObj.tag, rawObj.name);
			}
		}
	},
	components: { Region, StateStart, StateEnd, Introduction },
	methods: {
		...mapActions([INIT_CARD_DATASET]),
		productModuleConf(name) {
			return {
				root: this.rootName,
				tag: this.moduleTag,
				name: name
			};
		},
		productCombComponent(contentStr, productLink) {
			const svg = formatSVGStrToHtml(contentStr, {
				moduleTag: this.moduleTag,
				lineTag: this.lineTag,
				list: this.$el,
				productLink
			});
			const bbox = parseSVGBBox(this.paletteId, svg);

			svg.setAttribute('style', ['width:', '60', 'px;', ' height:', '60', 'px;'].join(''));
			svg.setAttribute('viewBox', [bbox.x, bbox.y, bbox.width, bbox.height].join());
			svg.setAttribute('preserveAspectRatio', 'none');

			return svg.outerHTML.replace(/<!--(.*?)-->/, (all, item) => item);
		}
	},
	computed: mapState({
		datasets: state => state.card.datasets.filter(data => data.name.includes(state.card.filterKey)),
		convertModuleToComp: state => state.card.convertModuleToComp,
		rootName: state => state.tool.root.name,
		paletteId: state => state.market.paletteId,
		listId: state => state.market.listId,
		storageKey: state => state.market.storageKey,
		moduleTag: state => state.market.moduleTag,
		lineTag: state => state.market.lineTag,
		module: state => state.card.keyObj.module,
		content: state => state.card.keyObj.content
	}),
	watch: {
		datasets: function (newArr, oldArr) {
			function productLink(data) { return ["<PointLink :data='", data, "'></PointLink>"].join(''); }

			const len = newArr.length - oldArr.length;
			const diffArr = newArr.slice(-len);
			diffArr.forEach((item) => {
				Vue.component(this.convertModuleToComp(item[this.module]), {
					template: this.productCombComponent(item[this.content], productLink),
					components: { PointLink }
				});
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
				<div class="move" :is="convertModuleToComp(item.module)" v-drag v-tag="productModuleConf(item.module)"></div>
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

.move {
	cursor: move;
}
</style>