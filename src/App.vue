<script>
import Sidebar from 'components/sidebar';
import Search from 'components/Search';
import List from 'components/List';
import Palette from 'components/palette';

export default {
    components: { Sidebar, Search, List, Palette},
    directives: {

    }
}
</script>

<template>
    <div class="sketch">
        <div class="Box menu">
            <Search></Search>
            <List></List>
        </div>
        <Sidebar class="L" itemX=".menu" itemY=".workspace" limit="15%"></Sidebar>
        <Palette class="Box workspace"></Palette>
        <Sidebar class="R" itemX=".workspace" itemY=".BoxC" limit="15%"></Sidebar>
        <div class="Box code">

        </div>
    </div>
</template>

<style lang="less" scoped>
    .sketch {
        position: absolute;
        height: 100%;
        width: 100%;
        background-color: #21444D;
        .Box {
            float: left;
            width: 20%;
            height: 100%;
        }
        .workspace {
            width: 60%;
        }
        .L {
            left: 20%;
        }
        .R {
            left: 80%;
        }
    }
</style>