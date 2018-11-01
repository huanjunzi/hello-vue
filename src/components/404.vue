<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
  </div>
</template>
<script>
import $ from 'jquery'
export default {
  data () {
    let name = this.$route.query.name
    return {
      theme1: 'dark',
      name,
      msg: '404页面'
    }
  },
  components: {},
  created(){
  },
  methods: {
    // routeTo(path,id) {
    //         this.$router.push({ path, query: { id } })
    // }  
  }
}
</script>

<style lang="less">
.layout-logo-left {
    width: 90%;
    margin: 15px auto;
    .text{
      color: #fff;
      font-weight: 300
    }
    text-align: center;
}
.ivu-menu.ivu-menu-dark.ivu-menu-vertical {
  height:100%; 
  position:absolute;
  left:0; top:0;
}
</style>
