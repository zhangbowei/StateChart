<script>
import { mapState } from 'vuex';

export default {
    props: ['data'], 
    computed: mapState({
        tagName: state => state.tool.tag.name
    })
};
</script>

<template>
    <text class="tag" :name="tagName" :value="data">
    </text>
</template>

<style scoped lang="less">
    .tag {
        display: none;
    }
</style>