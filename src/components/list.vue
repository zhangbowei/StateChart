<script>
import { mapState } from 'vuex';
import Region from './region';
import State from './state';
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
	  }
	},
    components: { Region, State, Introduction},
    computed: mapState({
        datasets: state => state.card.datasets.filter(data => data.name.includes(state.card.filterKey))
    }) 
};
</script>

<template>
	<div class="wrapper" :class="{'list-mode': convert}">
		<header>
			<a href="javascript:void(0)" class="hide-list" @click="convert=false"><i class="fa fa-th"></i></a>
			<a href="javascript:void(0)" class="show-list" @click="convert=true"><i class="fa fa-th-list"></i></a>
		</header>
		<div class="container">
			<div class="box" v-for="item in datasets">
				<div :is="item.component" v-drag></div>
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