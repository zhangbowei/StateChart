<script>
import { mapState } from 'vuex';

export default {
    computed: mapState({
        signName: state => state.tool.sign.name
    })
};
</script>

<template>
    <g>
        <circle class="sign" :name="signName"></circle>
    </g>
</template>

<style scoped lang="less">
    .sign {
        fill-opacity: 0.8;
        r: 5;
        fill: #6ED44E;
        stroke:#319A8B;
        stroke-width: 3;
        stroke-opacity: 0.4;
    }
</style>