<script>
</script>

<template>
  <article class='sketch'>
    <ul>
      <li class='entypo-tools'><a href="javascript:void(0)" class="entypo-down-circled">菜单</a></li>
    </ul>
  </article>
</template>

<style scoped lang="less">
  .sketch {
    position: absolute;
    z-index: 1;
    left: 0;
    right: 0;
    top: 0;
    margin: 5px auto;
    width: 90%;
    height: 38px;
    background-color: #FFFFFF;
    overflow-y: scroll;
    border-radius: 5px;
    border: 4px solid rgba(255, 255, 255, .15);
    box-shadow: 1px 1px 4px rgba(0, 0, 0, .3);
    font-family: 'entypo', sans-serif;
    font-size: 16px;
    transition: .4s all;
  }

  article:before {
    content: '';
    background: inherit;
    filter: blur(5px);
  }

  ul {
    list-style-type: none;
  }

  li {
    margin-bottom: .5rem;
    color: #000;
  }

  li:hover {
      font-size: 20px;
  }

  li:hover:active {
      margin-top: 2px;
      margin-left: 2px;
  }

  li:before {
    color: #597572;
    margin-right: 2px;
  }

  a {
    background: rgba(0, 0, 0, .1);
    color: yellow;
    text-decoration: none;
    text-transform: uppercase;
    border-radius: 5px;
    letter-spacing: 1px;
    display: inline-block;
    padding: 0 2px;
    padding-top: 1px;
  }
</style>