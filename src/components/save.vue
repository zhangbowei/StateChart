<script>
import Collapse from './collapse';

export default {
  props: ['data'],
  data() {
    return {
      isExpand: true
    }
  },
  components: { Collapse},
  methods: {
    activeChange(value) {
      this.isExpand = value;
    }
  }

};
</script>

<template>
    <li class='container' v-bind:class="{containerExpand: isExpand}">
        <Collapse :data="{isExpand: true, name: this.data.name}" v-on:activeSwitch="activeChange"></Collapse>
        <a class='entypo-upload' href="javascript:void(0)">保存</a>
        <section class="content">
            <label class='entypo-doc-text-inv'>名称</label>
            <textarea name="name"></textarea>
            <label class='entypo-doc-text'>说明</label>
            <textarea name="introduction"></textarea>
        </section>
    </li>
</template>

<style scoped lang="less">
.container {
    background: rgba(0, 0, 0, .1);
    height: 38px;
    color: RGBA(147, 161, 161, 1.00);
    border-radius: 5px;
    padding: 2px;
    overflow-y: scroll;
    transition: all .1s ease-in;
}

.containerExpand {
    height: 35%;
}

.content {
    height: 80%;
    display: flex;
    flex-direction: column;
}

textarea {
    border: 1px solid;
    border-radius: 5px;
    padding: 5px;
    background: transparent;
    white-space: pre-wrap;
    word-wrap: break-word;
    color: RGBA(89, 117, 114, 1.00);
    resize: none;
}

textarea:first-child {
    flex: 1;
}

textarea:last-child {
    flex: 3;
}

a {
    height: 38px;
    color: RGBA(89, 117, 114, 1.00);
    text-decoration: none;
    text-transform: uppercase;
    border-radius: 5px;
    letter-spacing: 1px;
    display: block;
    padding: 0 2px;
    padding-top: 1px;
    margin-top: 2px;
}

a:hover {
    font-size: 20px;
}

a:hover:active {
    padding-top: 2px;
    padding-left: 4px;
}
</style>