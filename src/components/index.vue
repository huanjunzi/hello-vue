<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h1>{{ name ? name + "欢迎你": "请登录"}}</h1>
    <div>
      <a @click='routeTo("index/login",1)'>点击跳转到登录</a>
      <a @click='routeTo("index/register",2)'>点击跳转到注册</a>
    </div>
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
      msg: '用户主界面'
    }
  },
  components: {},
  async created(){
    // await $.ajax({
    //   url:'https://api.weibo.com/2/users/show.json',
    //   type:'GET',
    //   dataType:'JSONP',
    //   data:{
    //     access_token:'2.00KGq6vBzqDGyD66e11edad5WZe1RB',
    //     uid:'1864429072'
    //   },
    //   success:function(result) {//返回数据根据结果进行相应的处理 
    //     if (result) { 
    //     console.log('resultsuucess=', result)
    //     }
    //   } 
    // })
  },
  methods: {
    routeTo(path,id) {
            this.$router.push({ path, query: { id } })
    }  
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
