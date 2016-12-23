<script>
import { mapActions } from 'vuex';
import { SET_FILTER_KEY } from 'store/card';

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
    <div class="search">
        <input type="search" placeholder="search state..." @keyup="onKeyup">
    </div>
</template>

<style lang="less" scoped>
    .search {
        margin: 5px 0px;
    }
    input {
        outline: none;
    }
    
    input[type=search] {
        font-family: inherit;
        font-size: 100%;
    }
    
    input[type=search] {
        background-color: #4F6C75;
        border: solid 1px #ccc;
        padding: 9px 10px 9px 32px;
        width: 80%;
        border-radius: 10em;
        transition: all .5s;
    }
    
    input[type=search]:focus {
        width: 100%;
        background-color: #fff;
        border-color: #319A8B;
        box-shadow: 0 0 5px rgba(109, 207, 246, .5);
    }
</style>