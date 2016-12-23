<script>
export default {
    props: ['content'], 
};
</script>

<template>
  <article class='sketch'>
    <ul>
      <li class='entypo-vcard'><a href="javascript:void(0)">名称: </a>{{content.name}}</li>
      <li class='entypo-credit-card'>{{content.introduction}}</li>
    </ul>
  </article>
</template>

<style scoped lang="less">
  .sketch {
    float: right;
    background-color: #FFFFFF;
    margin: auto 5px;
    width: 70%;
    height: 60px;
    overflow-y: scroll;
    border-radius: 5px;
    border: 4px solid rgba(255, 255, 255, .15);
    box-shadow: 1px 1px 4px rgba(0, 0, 0, .3);
    font-family: 'entypo', sans-serif;
    font-size: 12px;
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