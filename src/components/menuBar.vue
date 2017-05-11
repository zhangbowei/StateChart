<script>
export default {
  data() {
    return {
      isActive: false
    }
  }
};
</script>

<template>
  <article class='sketch' v-bind:class="{sketchExpend: isActive}">
    <ul>
      <li class='entypo-tools' @click="isActive = isActive ? false : true">
        <a href="javascript:void(0)" v-bind:class="[isActive ? 'entypo-up-circled' : 'entypo-down-circled']">
          {{isActive ? '收起' : '展开'}}菜单
        </a>
      </li>
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
}

li {
  margin-bottom: .5rem;
  color: #000;
}

li:hover {
  font-size: 20px;
}

li:hover:active {
  margin-top: 2px;
  margin-left: 2px;
}

li:before {
  color: #597572;
  margin-right: 2px;
}

a {
  background: rgba(0, 0, 0, .1);
  color: yellow;
  text-decoration: none;
  text-transform: uppercase;
  border-radius: 5px;
  letter-spacing: 1px;
  display: inline-block;
  padding: 0 2px;
  padding-top: 1px;
}
</style>