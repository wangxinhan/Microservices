import send from './http'
export default {
  getCurrentUser (data) {
    let req = {
      data,
      action: 'config.user.getCurrentUser'
    }
    return send.fetch(req, 'post')
  },
  updateCurrentUser (data) {
    let req = {
      data,
      action: 'config.user.updataCurrentUser'
    }
    return send.fetch(req, 'post')
  }
}
