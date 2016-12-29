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
    <g class="link">
        <path :d="pathD" stroke="#888"></path>
    </g>
</template>

<style scoped lang="less">
    .link {
        cursor: crosshair;
        opacity:0.5;
    }
</style>