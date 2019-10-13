import manage from '../index'

export default {
  register(form) {
    return new Promise((resolve, reject) => {
      manage.$requests.cyszUserRegister(form).then(res => {
        manage.$store.commit('setCurrentUser', res)
        resolve(res)
      }).catch(res => reject(res))
    })
  },
  login(form) {
    return new Promise((resolve, reject) => {
      manage.$requests.cyszUserLogin(form).then(res => {
        localStorage.setItem("token", res)
        resolve(res)
      }).catch(res => reject(res))
    })
  }
}
