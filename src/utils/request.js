import axios from 'axios'
import md5 from 'md5'
import loading from './loading'
import { ElMessage } from 'element-plus'

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000
})

service.interceptors.request.use((config) => {
  loading.open()
  const { icode, time } = getTestICode()
  config.headers.icode = icode
  config.headers.codeType = time
  return config
}, (error) => {
  loading.close()
  return Promise.reject(error)
})

service.interceptors.response.use((response) => {
  loading.close()

  const { success, data, message } = response.data

  if (success) {
    return data
  } else {
    _showError(message)
    return Promise.reject(new Error(message))
  }
}, (error) => {
  loading.close()
  _showError(error.message)
  return Promise.reject(error)
})

const _showError = (message) => {
  const info = message || '发生未知错误'
  ElMessage.error(info)
}

const request = (options) => {
  if (options.method.toLowerCase() === 'get') {
    options.params = options.data || {}
  }
  return service(options)
}

function getTestICode() {
  const now = parseInt(Date.now() / 1000)
  const code = now + 'LGD_Sunday-1991'
  return {
    icode: md5(code),
    time: now
  }
}

export default request
