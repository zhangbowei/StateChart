<script>

export default {
    beforeMount: function() {
        console.log('beforMount-sidebar');
    },
    mounted: function() {
        console.log($('boby'));
        console.log('mounted-sidebar');
    }
}
</script>

<template>
    <div class="sidebar"></div>
</template>

<style lang="less" scoped>
    .sidebar {
        position: absolute;
        top: 5px;
        bottom: 10px;
        width: 7px;
        background: url(../images/grip.png) no-repeat 50% 50%;
        border: 1px solid gray;
        background-color: white;
        cursor: col-resize;
    }
</style>