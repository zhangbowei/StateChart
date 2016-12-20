<script>
import Sidebar from 'components/sidebar';
import Search from 'components/Search';
import List from 'components/List';

export default {
    components: { Sidebar, Search, List},
    directives: {

    }
}
</script>

<template>
    <div class="sketch">
        <div class="Box BoxA">
            <Search></Search>
            <List></List>
        </div>
        <Sidebar class="L" itemX=".BoxA" itemY=".BoxB" limit="15%"></Sidebar>
        <div class="Box BoxB">

        </div>
        <Sidebar class="R" itemX=".BoxB" itemY=".BoxC" limit="15%"></Sidebar>
        <div class="Box BoxC">

        </div>
    </div>
</template>

<style lang="less" scoped>
    .sketch {
        position: absolute;
        height: 100%;
        width: 100%;
        .Box {
            float: left;
            background-color: cadetblue;
            width: 20%;
            height: 100%;
        }
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