<script>
import { mapActions } from 'vuex';
import { SET_FILTER_KEY } from 'store/core';

export default {
    methods: {
        ...mapActions([SET_FILTER_KEY]),
        onKeyup(e) {
            this[SET_FILTER_KEY](e.target.value);
        }
    }
}
</script>

<template>
    <div>
        <input class="search" type="text" placeholder="search user..." @keyup="onKeyup">
    </div>
</template>

<style lang="less" scoped>
    .search {
        padding: 0 10px;
        width: 100%;
        font-size: 12px;
        color: #fff;
        height: 30px;
        line-height: 30px;
        border: solid 1px #3a3a3a;
        border-radius: 4px;
        outline: none;
        background-color: #26292E;
    }
</style>