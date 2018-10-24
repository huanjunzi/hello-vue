<template>
  <Modal v-model="visible" v-bind="modalProps" :loading="loading" @on-ok="onOk" @on-cancel="onCancel">
    <!-- <div @keydown.enter="onOk"> -->
      <div>
      <div v-if="visible" ref="comp" :is="component" v-bind="compProps"></div>
    </div>
    <div slot="footer">
      <Button size="large" @click="onCancel">取消</Button>
      <Button type="primary" size="large" :loading="loading" @click="onOk">{{modalProps.okText || '确定'}}</Button>
    </div>
  </Modal>
</template>

<script>
import _ from 'underscore'

export default {
  data() {
    return {
      visible: false,
      loading: false,
      component: 'div',
      compProps: {},
      modalProps: {},
      defer: {},
    }
  },
  methods: {
    updateLoading(promise, update) {
      if (!promise.then) return
      update(true)
      promise.then(r => {
        update(false)
        return r
      }, err => {
        update(false)
        return Promise.reject(err)
      })
    },
    show(Component, compProps, modalProps, width) {
      this.component = Component
      this.compProps = compProps
      this.modalProps = modalProps
      this.visible = true
      return new Promise((resolve, reject) => {
        this.defer = {resolve, reject}
      })
    },
    onCancel() {
      if (!this.$refs.comp.onCancel) {
        this.visible = false
        this.defer.resolve(true)
        return
      }
      let close = res => {
        this.visible = false
        this.defer.resolve(res)
      }
      let doing = this.$refs.comp.onCancel(close)
      this.updateLoading(doing, loading => this.loading = loading)
    },
    onOk() {
      if (!this.$refs.comp.onOk) {
        this.visible = false
        this.defer.resolve(true)
        return
      }

      let close = res => {
        this.visible = false
        this.defer.resolve(res)
      }
      let doing = this.$refs.comp.onOk(close)
      this.updateLoading(doing, loading => this.loading = loading)
    },
  }
}
</script>
