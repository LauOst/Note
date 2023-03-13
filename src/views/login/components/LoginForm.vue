<template>
  <div>
    <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" size="large" autocomplete="on">
      <el-form-item prop="username">
        <el-input v-model="loginForm.username" placeholder="用户名：admin / user">
          <template #prefix>
            <el-icon class="el-input__icon"><user /></el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          type="password"
          placeholder="密码：123456"
          show-password
          autocomplete="new-password"
        >
          <template #prefix>
            <el-icon class="el-input__icon"><lock /></el-icon>
          </template>
        </el-input>
      </el-form-item>
    </el-form>
    <div class="login-btn">
      <el-button round size="large">重置</el-button>
      <el-button round size="large" type="primary" @click="handleLogin(loginFormRef)"> 登录 </el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ElNotification, FormInstance } from 'element-plus'
import { LocationQuery } from 'vue-router'
import md5 from 'js-md5'
import { UserStore } from '@/store/modules/user'
import { Login } from '@/typings/api/modules/login'
import { getTimeState } from '@/utils/util'

const userStore = UserStore()

/* 表单数据源 */
const loginForm = reactive<Login.ReqLoginForm>({ username: 'admin', password: '123456' })

// 定义 formRef（校验规则）
// type FormInstance = InstanceType<typeof ElForm>
const loginFormRef = ref<FormInstance>()
const loginRules = reactive({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
})

/* 用户登录按钮方法 */
const loading = ref(false)
const otherQuery = ref({})
const redirect = ref('')
const router = useRouter()
const handleLogin = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid: boolean) => {
    if (!valid) return
    loading.value = true
    try {
      // 1.执行登录接口
      userStore
        .login({ ...loginForm, password: md5(loginForm.password) })
        .then(() => {
          router.push({ path: redirect.value || '/', query: otherQuery.value })
        })
        .catch((error) => {
          console.log('error', error)
        })
      ElNotification({
        title: getTimeState(),
        message: '欢迎登录 Vite-Admin',
        type: 'success',
        duration: 3000,
      })
    } finally {
      loading.value = false
    }
  })
}

/* 处理otherQuery */
const route = useRoute()

const getOtherQuery = (query: LocationQuery) => {
  return Object.keys(query).reduce((acc, cur) => {
    if (cur !== 'redirect') {
      acc[cur] = query[cur]
    }
    return acc
  }, {} as LocationQuery)
}

watch(
  () => route.query,
  (query) => {
    if (query) {
      redirect.value = query.redirect?.toString() ?? ''
      otherQuery.value = getOtherQuery(query)
    }
  },
)
</script>

<style lang="scss" scoped>
@import '../index.scss';
</style>
