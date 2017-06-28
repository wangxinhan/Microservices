/**
 * Created by zengyx on 17/1/5.
 * 七牛上传工具封装
 */
import * as qiniu from './qiniu-sdk'
export const qiniu7moorDomain = 'https://fs-test.7moor.com/'
export const qiniu7moorImDomain = 'https://fs-im-kefu.7moor.com/'
export const qiniu7moorEmailDomain = 'https://fs-mail-resource.7moor.com/'
export const qiniu7moorKmDomain = 'https://fs-km.7moor.com/'
export const qiniuUploadUrl = 'https://up.qbox.me'
const Qiniu = new qiniu.QiniuJsSDK()
const QiniuKm = new qiniu.QiniuJsSDK()
const QiniuKmImg = new qiniu.QiniuJsSDK()
const QiniuWebchat = new qiniu.QiniuJsSDK()
const QiniuEmail = new qiniu.QiniuJsSDK()

export const uploadTo7moorDomain = (sessionId, buttonId, filters, fileAdded, beforeUpload, uploadProgress, uploadComplete, fileUploader, error, key) => {
  Qiniu.uploader({
    runtimes: 'html5',
    browse_button: buttonId,
    multi_selection: false,
    max_file_size: '10mb',
    flash_swf_url: '/javascripts/qiniu/plupload/Moxie.swf',
    dragdrop: true,
    chunk_size: '4mb',
    uptoken_url: '/action?action=app.weixin.getUptoken&data={}&sessionId=' + sessionId,
    domain: qiniu7moorDomain,
    unique_names: false,
    save_key: false,
    get_new_uptoken: true,
    auto_start: true,
    filters: filters,
    init: {
      'FilesAdded': fileAdded,
      'BeforeUpload': beforeUpload,
      'UploadProgress': uploadProgress,
      'UploadComplete': uploadComplete,
      'FileUploaded': fileUploader,
      'Error': error,
      'Key': key
    }
  })
}

export const uploadTo7moorImDomain = (sessionId, button, filters, fileAdded, beforeUpload, uploadProgress, uploadComplete, fileUploader, error, key) => {
  QiniuWebchat.uploader({
    runtimes: 'html5',
    browse_button: button,
    multi_selection: false,
    max_file_size: '10mb',
    flash_swf_url: '/javascripts/qiniu/plupload/Moxie.swf',
    dragdrop: true,
    chunk_size: '4mb',
    uptoken_url: '/action?action=app.webchat.getImUptoken&data={}&sessionId=' + sessionId,
    domain: qiniu7moorImDomain,
    unique_names: false,
    save_key: false,
    get_new_uptoken: true,
    auto_start: true,
    filters: filters,
    init: {
      'FilesAdded': fileAdded,
      'BeforeUpload': beforeUpload,
      'UploadProgress': uploadProgress,
      'UploadComplete': uploadComplete,
      'FileUploaded': fileUploader,
      'Error': error,
      'Key': key
    }
  })
}

export function PasteImguploadTo7moorImDomain (sessionId, file, filename, uploadProgress, uploadComplete, key) {
  let config = {
    uptoken_url: '/action?action=app.webchat.getImUptoken&data={}&sessionId=' + sessionId,
    domain: qiniu7moorImDomain,
    token: ''
  }
  let qiniuUploadUrl
  if (window.location.protocol === 'https:') {
    qiniuUploadUrl = 'https://up.qbox.me'
  } else {
    qiniuUploadUrl = 'http://upload.qiniu.com'
  }
  let xhr = QiniuWebchat.createAjax()
  let getUpToken = function () {
    let ajax = QiniuWebchat.createAjax()
    ajax.open('GET', config.uptoken_url, true)
    ajax.setRequestHeader('If-Modified-Since', '0')
    ajax.onreadystatechange = function () {
      if (ajax.readyState === 4 && ajax.status === 200) {
        let res = JSON.parse(ajax.responseText)
        config.token = res.uptoken
        fd.append('token', config.token)
        xhr.setRequestHeader('Authorization', 'UpToken ' + config.token)
        xhr.send(fd)
      }
    }
    ajax.send()
  }
  getUpToken()
  let fd = new window.FormData()
  fd.append('chunk', '0')
  fd.append('chunks', '1')
  fd.append('name', filename)
  fd.append('file', file)
  fd.append('key', key)
  xhr.open('POST', qiniuUploadUrl, true)
  xhr.upload.addEventListener('progress', uploadProgress)
  xhr.addEventListener('load', uploadComplete)
}

export const uploadTo7moorEmailDomain = (sessionId, button, filters, fileAdded, beforeUpload, uploadProgress, uploadComplete, fileUploader, error, key) => {
  let queryData = JSON.stringify({scope: 'm7-mail-resource'})
  QiniuEmail.uploader({
    runtimes: 'html5',
    browse_button: button,
    multi_selection: true,
    max_file_size: '10mb',
    flash_swf_url: '/javascripts/qiniu/plupload/Moxie.swf',
    dragdrop: true,
    chunk_size: '4mb',
    uptoken_url: '/action?action=app.webchat.getImUptoken&data=' + queryData + '&sessionId=' + sessionId,
    domain: qiniu7moorEmailDomain,
    unique_names: false,
    save_key: false,
    get_new_uptoken: true,
    auto_start: true,
    filters: filters,
    init: {
      'FilesAdded': fileAdded,
      'BeforeUpload': beforeUpload,
      'UploadProgress': uploadProgress,
      'UploadComplete': uploadComplete,
      'FileUploaded': fileUploader,
      'Error': error,
      'Key': key
    }
  })
}
export const uploadTo7moorKmDomain = (sessionId, button, filters, fileAdded, beforeUpload, uploadProgress, uploadComplete, fileUploader, error, key) => {
  QiniuKm.uploader({
    runtimes: 'html5',
    browse_button: button,
    multi_selection: false,
    max_file_size: '10mb',
    flash_swf_url: '/javascripts/qiniu/plupload/Moxie.swf',
    dragdrop: true,
    chunk_size: '4mb',
    uptoken_url: '/action?action=app.km.getKmUptoken&data={}&sessionId=' + sessionId,
    domain: qiniu7moorKmDomain,
    unique_names: false,
    save_key: false,
    get_new_uptoken: true,
    auto_start: true,
    filters: filters,
    init: {
      'FilesAdded': fileAdded,
      'BeforeUpload': beforeUpload,
      'UploadProgress': uploadProgress,
      'UploadComplete': uploadComplete,
      'FileUploaded': fileUploader,
      'Error': error,
      'Key': key
    }
  })
}
export const uploadTo7moorKmImgDomain = (sessionId, button, filters, fileAdded, beforeUpload, uploadProgress, uploadComplete, fileUploader, error, key) => {
  QiniuKmImg.uploader({
    runtimes: 'html5',
    browse_button: button,
    multi_selection: false,
    max_file_size: '10mb',
    flash_swf_url: '/javascripts/qiniu/plupload/Moxie.swf',
    dragdrop: true,
    chunk_size: '4mb',
    uptoken_url: '/action?action=app.km.getKmUptoken&data={}&sessionId=' + sessionId,
    domain: qiniu7moorKmDomain,
    unique_names: false,
    save_key: false,
    get_new_uptoken: true,
    auto_start: true,
    filters: filters,
    init: {
      'FilesAdded': fileAdded,
      'BeforeUpload': beforeUpload,
      'UploadProgress': uploadProgress,
      'UploadComplete': uploadComplete,
      'FileUploaded': fileUploader,
      'Error': error,
      'Key': key
    }
  })
}
