<script>
import Sidebar from 'components/sidebar';
import Search from 'components/Search';
import List from 'components/List';
import Palette from 'components/palette';
import CodeEditor from 'components/CodeEditor';
import MenuBar from 'components/MenuBar';

export default {
    components: { Sidebar, Search, List, Palette, CodeEditor, MenuBar},
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
        <Sidebar class="L order" itemX=".menu" itemY=".workspace" limit="15%"></Sidebar>
        <Palette class="Box workspace"></Palette>
        <Sidebar class="R order" itemX=".workspace" itemY=".code" limit="8%"></Sidebar>
        <div class="Box code">
            <MenuBar></MenuBar>
            <CodeEditor></CodeEditor>
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
            position: relative;
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
        .order {
            z-index: 1;
        }
    }
</style>