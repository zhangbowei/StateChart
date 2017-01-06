<script>

export default {
    props: ['data'], 
    computed: {
        pathD: function() {
            const start = this.data.start;
            const end = this.data.end;
            return ['M', start.x, start.y, 'L', end.x, end.y].join(' ');
        }
    }
};
</script>

<template>
    <path class="link" :d="pathD"></path>
</template>

<style scoped lang="less">
    .link {
        cursor: crosshair;
        opacity: 0.8;
        stroke: #333333;
        stroke-width: 3;
    }
</style>