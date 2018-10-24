<template>
  <div class="register">
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
        <Button type="success" @click="handleSubmit()">注册</Button>
        <Button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
        <Button type="ghost" @click="toWhere('index')" style="margin-left: 8px">返回</Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>
import * as moment from 'moment'
export default {
  data() {
    let ids = this.$route.query.id
    return {
      formValidate: {
        name: '',
        pwd: '',
      },
      result: {},
      ids,
      msg: '注册页面',
      ruleValidate: {
          name: [
            { required: true, whitespace: true, message: '名字不能为空', trigger: 'blur' }, { validator: this.validateuser, trigger: 'blur' }
          ],
          pwd: [
            { required: true, whitespace: true, message: '密码不能为空', trigger: 'blur' }, { type: 'string', min: 6, max: 6, message: '请输入6位数密码', trigger: 'blur' }
          ],
      }
    }
  },
  component: {},
  created() {

  },
  methods: {
    // 跳转页面
    async toWhere(path) {
      this.$router.push({ path: path, query: { } })
    },
    // 校验账户是否重复
    async validateuser(rule, value, callback) {
      if (value) {
        let r = await this.$axios('/api/users/checkUser', {
          method: "get",
          params: {
            name: value
          }
        }).then(res => res.data)

        if (r.message === 'failed') {
          return callback(new Error("姓名已存在"))
        }
      }
      return callback()
    },
    async handleSubmit() {
      let valid = await this.$utils.validForm(this.$refs.formValidate)
      if (!valid) {
        return this.$Message.error("表单验证失败")
      }
        this.result = await this.$axios({
          method: "post",
          url: '/api/users/registerUser',
          params: {
              name: this.formValidate.name,
              description: this.formValidate.pwd,
              create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
              update_time: moment().format('YYYY-MM-DD HH:mm:ss'),
          },
      }).then(res => {
        if(res.data.message === 'success'){
          this.$Message.success("新增成功")
          this.$router.push({ path: '/menu/welcome', query: { name: this.formValidate.name } })
          return
        }
        if(res.data.message === 'failed'){
        this.$Message.error("用户已存在")
        }
      })
      .catch(err => {console.log("err=", err)})
    },
    async getData() {
      // this.result = await this.$axios.get('/static/data.json').then(res => res.data.data)
      // this.result = await this.$axios.get('/api2/setting/store/findCenterStore').then(res => res.data.data)
      // console.log("this.result", this.result)
      // 或者使用以下代码也可
      // this.result = await this.$axios({
      //     // method: "get",
      //     // url: '/api2/setting/store/findCenterStore',
      //     // params: {
      //     //     order: '-create_time',
      //     //     center_id: 1,
      //     // }
      //     method: "get",
      //     url: '/api/findDataById',
      //     params: {
      //         id: 7,
      //     },
      // }).then(res => console.log(res.data))
    
      // for (let r in this.result) {
      //   console.log("address=", this.result[r].name)
      // }
      
    },
    // 清空表单
    handleReset (name) {
        this.$refs[name].resetFields()
    },
  }
}
</script>
<style>

</style>
