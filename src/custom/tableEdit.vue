<template>
  <div>
    <Form ref="form" :model="form" :rules="ruleValidate">
      <FormItem prop="name" style="">
        <Input type="text" v-model="form.name" placeholder="请输入名称" style="width:450px">
        <!-- <Icon type="ios-person-outline" slot="prepend"></Icon> -->
        </Input>
      </FormItem>
      <FormItem prop="description" style="">
        <Input type="text" v-model="form.description" placeholder="请输入描述信息" style="width:450px">
        <!-- <Icon type="ios-locked-outline" slot="prepend"></Icon> -->
        </Input>
      </FormItem>
      <FormItem prop="img_url" style="">
          <UploadOss :url.sync="imgUrl" type="image"></UploadOss>
      </FormItem>
    </Form>
  </div>
</template>
<script>
import _ from 'underscore'
export default {
  props: ['data', 'type'],
  data() {
    let form = JSON.parse(JSON.stringify(this.data))
    return {
      form,
      imgUrl: '',
      ruleValidate: {
          name: [
            { required: true, whitespace: true, message: '名字不能为空', trigger: 'blur' }
          ],
          description: [
            { required: true, whitespace: true, message: '描述不能为空', trigger: 'blur' }
          ],
      }
    }
  },
  created() {
  },
  methods: {
    // 确定事件
    async onOk(close) {
      let valid = await this.$utils.validForm(this.$refs.form)
      if (!valid) {
        return this.$Message.error("表单验证失败")
      }
      // 如果要传json数组 需要先将JS对象转成JSON字符串
      let dataFomart =JSON.stringify(await this.dataEdit())
      // console.log('dataForm===', JSON.stringify(dataForm))
      let r = await this.$axios({
          method: "post",
          url: '/api/users/updateUser',
          params: {
              data: dataFomart,
              name: this.form.name,
              description: this.form.description
          }
      })
      return close(r)
    },
    // 取消事件
    onCancel(close) {
      return close()
    },
    // 单个编辑和多个编辑的数据 统一成数组格式 到后台循环处理
    dataEdit() {
      let dataList = []
      if(this.type === 'single') {
        dataList = [this.form]
      }
      if(this.type === 'multi') {
        for(let element of this.form.data){
          dataList.push({ id: element.id })
        }
      }
      return dataList
    },
    handleFormatError (file) {
      this.$Notice.warning({
          title: 'The file format is incorrect',
          desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
      })
    },
    handleMaxSize (file) {
      this.$Notice.warning({
          title: 'Exceeding file size limit',
          desc: 'File  ' + file.name + ' is too large, no more than 2M.'
      })
    },
    handleBeforeUpload () {
      const check = this.uploadList.length < 5;
      if (!check) {
          this.$Notice.warning({
              title: 'Up to five pictures can be uploaded.'
          })
      }
      return check;
    }
  }
}
</script>
