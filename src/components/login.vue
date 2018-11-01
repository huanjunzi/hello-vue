<template>
  <div>
    <h1>{{ msg }}</h1>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate">
      <FormItem prop="name" style="margin-left: 40%; margin-right: auto;">
        <Input type="text" v-model="formValidate.name" placeholder="Username" style="width:300px">
        <Icon type="ios-person-outline" slot="prepend"></Icon>
        </Input>
      </FormItem>
      <FormItem prop="pwd" style="margin-left: 40%; margin-right: auto;">
        <Input type="text" v-model="formValidate.pwd" placeholder="Password" style="width:300px">
        <Icon type="ios-locked-outline" slot="prepend"></Icon>
        </Input>
      </FormItem>
      <FormItem>
        <Button type="success" @click="handleSubmit()">登录</Button>
        <Button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
        <Button type="ghost" @click="toWhere('index')" style="margin-left: 8px">返回</Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>
export default {
  
  data() {
    const ids = this.$route.query.id
    return{
      formValidate: {
        name: '',
        pwd: '',
      },
      ids,
      msg: '登录页面',
      result: {},
      ruleValidate: {
          name: [
            { required: true, whitespace: true, message: '名字不能为空', trigger: 'blur' }
          ],
          pwd: [
            { required: true, whitespace: true, message: '密码不能为空', trigger: 'blur' }
          ],
      }
    }
  },
  component: {},
    async created(){
    // let r = await this.$axios({
    //     methods: 'get',
    //     url: '/api2/goods/lens/getLensListNew',
    //     headers: {

    //     },
    //     params: {
    //       order:'-goods_center_id',
    //       deleted:0,
    //       type:0,
    //       center_id:59,
    //       category:'len',
    //       offset:0,
    //       limit:10,
    //     }
    //   }).then(res => console.log('res=', res))

  },
  methods: {
  // 跳转页面
  async toWhere(path,name) {
    this.$router.push({ path, query: { name } })
  },
  // 提交表单
  // async handleSubmit (name) {
  //     let valid = await this.$utils.validForm(this.$refs.formValidate)
  //     if (!valid) {
  //       return this.$Message.error("表单验证失败")
  //     }
  //     this.result = await this.$axios.get('/static/data.json').then(res => res.data.data)
  //     for(let r in this.result){
  //         if(this.result[r].name === this.formValidate.name && this.result[r].pwd === this.formValidate.pwd) {
  //           return this.$Message.success("登录成功!")
  //         }
  //       }
  //     return this.$Message.error("登录失败!用户名或密码不正确!")
  //   },
    async handleSubmit (name){
      let valid = await this.$validForm(this.$refs.formValidate)
      if (!valid) {
        return this.$Message.error("表单验证失败")
      }
      let r = await this.$axios({
        methods: 'get',
        url: '/api/users/loginUser',
        params: {
          name: this.formValidate.name,
          description: this.formValidate.pwd
        }
      }).then(res => res.data)
      console.log("r===",r)
      if(r.message === 'success') {
        this.$Message.success("登录成功")
        this.toWhere('/menu/welcome',r.rows[0].name)
      }
      if(r.message === 'failed') {
        this.$Message.error("登录失败")
      }
    },
    // 清空表单
    handleReset (name) {
        this.$refs[name].resetFields()
    },
  }
}
</script>
<style scoped>

</style>
