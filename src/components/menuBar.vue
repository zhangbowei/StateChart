<script>
import { mapState } from 'vuex';
import Save from './save';
import Collapse from './collapse';

export default {
  data() {
    return {
      isExpand: false
    }
  },
  computed: mapState({
    datasets: state => state.setting.datasets
  }),
  components: { Collapse, Save },
  methods: {
    activeChange(value) {
      this.isExpand = value;
    }
  }

};
</script>

<template>
  <article class='sketch' v-bind:class="{sketchExpend: isExpand}">
    <ul>
      <li :is="item.component" :data="item" v-for="item in datasets" v-on:activeSwitch="activeChange"></li>
    </ul>
  </article>
</template>

<style scoped lang="less">
.sketch {
  position: absolute;
  z-index: 9;
  left: 0;
  right: 0;
  top: 0;
  margin: 5px auto;
  width: 90%;
  height: 100%;
  max-height: 38px;
  background-color: rgba(255, 255, 255, .9);
  overflow: hidden;
  border-radius: 5px;
  border: 4px solid rgba(255, 255, 255, .15);
  box-shadow: 1px 1px 4px rgba(0, 0, 0, .3);
  font-family: 'entypo', sans-serif;
  font-size: 16px;
  transition: all .6s ease-in;
}

.sketchExpend {
  bottom: 0px;
  height: auto;
  max-height: 100%;
  transition-timing-function: ease-out;
}

article:before {
  content: '';
  background: inherit;
  filter: blur(5px);
}

ul {
  list-style-type: none;
  height: 100%;
}

li {
  margin-bottom: .5rem;
  color: #000;
}

li:before {
  color: #597572;
  margin-right: 2px;
}
</style>