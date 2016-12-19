<script>
import Sidebar from 'components/sidebar';
import Box from 'components/box';

export default {
    components: { Sidebar, Box},
    directives: {

    }
}
</script>

<template>
    <div class="sketch">
        <Box class="BoxA"></Box>
        <Sidebar class="L" itemX=".BoxA" itemY=".BoxB" limit="10%"></Sidebar>
        <Box class="BoxB"></Box>
        <Sidebar class="R" itemX=".BoxB" itemY=".BoxC" limit="10%"></Sidebar>
        <Box class="BoxC"></Box>
    </div>
</template>

<style lang="less" scoped>
    .sketch {
        position: absolute;
        height: 100%;
        width: 100%;
        .BoxB {
            width: 60%;
            background-color: teal;
        }
        .L {
            left: 20%;
        }
        .R {
            left: 80%;
        }
    }
</style>