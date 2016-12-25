<script>

export default {
    methods: {
        render(e) {
            console.log(e);
        }
    }
};
</script>

<template>
    <svg class="sketch" >
        <g class="configure">
            <rect class="background"></rect>
            <path class="separator" d="M0,15 L60,15"></path>
            <text class="name">
                <tspan>State</tspan>
            </text>
            <text class="event">
                <tspan dy="0em">test</tspan>
                <tspan dy="1em" x="0">test</tspan>
                <tspan dy="1em" x="0">test</tspan>
            </text>
        </g>
    </svg>
</template>

<style scoped lang="less">
    .sketch {
        width: 60px;
        height: 60px;
        cursor: move;
        .configure {
            cursor: move;
        }
        .background {
            width: 60px;
            height: 60px;
            rx: 10;
            ry: 10;
            fill: #fff9ca;
            stroke: #333;
            stroke-width: 1;
        }
        .separator {
            stroke: #333;
            stroke-width: 1px;
        }
        .name {
            text-anchor: middle;
            font-size: 12px;
            font-weight: bold;
            transform: translate(30px, 10px);
        }
        .event {
            font-size: 8px;
            font-weight: bold;
            transform: translate(8px, 25px);
        }
    }
</style>