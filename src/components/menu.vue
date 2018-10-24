<template>
  <div>
    <Menu mode="vertical" :theme="theme1" active-name="1" @on-select="routeTo">
      <div class="layout-logo-left">
          <img src="https://epj-images.oss-cn-shanghai.aliyuncs.com/assets/eglass-logo.png" alt="EGlass"
               width="150" height="42"
          />
          <div class="text">左侧菜单栏</div>
        </div>
        <Submenu name="1">
            <template slot="title">
                <Icon type="stats-bars"></Icon>
                测试用啦
            </template>
                <MenuItem name="/menu/custom/index">私人定制</MenuItem>
                <MenuItem name="/menu/welcome">活跃分析</MenuItem>
                <MenuItem name="1-3">时段分析</MenuItem>
            <MenuGroup title="留存">
                <MenuItem name="1-4">用户留存</MenuItem>
                <MenuItem name="1-5">流失用户</MenuItem>
            </MenuGroup>
        </Submenu>
        <MenuItem name="2">
            <Icon type="settings"></Icon>
            综合设置
        </MenuItem>
    </Menu>
    <router-view></router-view>
  </div>

</template>
<script>
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
