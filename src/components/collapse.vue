<script>
export default {
    props: ['data'],
    data() {
        return {
            isExpand: this.data.isExpand !== void 0 ? this.data.isExpand : false
        }
    },
    methods: {
        activeSwitch() {
            this.isExpand = this.isExpand ? false : true;
            this.$emit('activeSwitch', this.isExpand);
        }
    }
};
</script>

<template>
    <li class='collapse' @click="activeSwitch">
        <a href="javascript:void(0)" v-bind:class="[isExpand ? 'entypo-up-circled' : 'entypo-down-circled']">
            {{isExpand ? '收起' : '展开'}}
            <a class="expand">
                <slot>{{this.data.name}}</slot>
            </a>
        </a>
        </slot>
    </li>
</template>

<style scoped lang="less">
.collapse {
    height: 38px;
}

.collapse:hover {
    font-size: 20px;
}

.collapse:hover:active {
    margin-top: 2px;
    margin-left: 2px;
}

a {
    background: rgba(0, 0, 0, .1);
    color: RGBA(89, 117, 114, 1.00);
    text-decoration: none;
    text-transform: uppercase;
    border-radius: 5px;
    letter-spacing: 1px;
    display: inline-block;
    padding: 0 2px;
    padding-top: 1px;
}

.expand {
    color: RGBA(255, 255, 0, 1.00);
}
</style>