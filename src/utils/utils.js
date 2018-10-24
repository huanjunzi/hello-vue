export default {
  async validForm(form) {
    return new Promise(res => {
      form.validate(valid => res(valid))
    })
  }
}