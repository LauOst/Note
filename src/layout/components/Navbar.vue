<template>
  <div class="navbar">
    <Hamburger class="hamburger-container" :is-active="sidebar?.opened" @toggle-click="toggleSideBar" />
    <Breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
    <div class="right-menu right-menu-row">
      <el-dropdown class="right-menu-item site-container">
        <el-button type="primary">
          当前站点: 大正
          <!--          <el-icon class="el-icon&#45;&#45;right"><CaretBottom /></el-icon>-->
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>Action 1</el-dropdown-item>
            <el-dropdown-item>Action 2</el-dropdown-item>
            <el-dropdown-item>Action 3</el-dropdown-item>
            <el-dropdown-item>Action 4</el-dropdown-item>
            <el-dropdown-item>Action 5</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <ElDropdown class="avatar-container right-menu-item hover-effect" trigger="click" @command="handleClick">
        <div class="profile-container">
          <div class="avatar-wrapper">
            <img src="../../assets/images/10.jpg" class="user-avatar" alt="" />
          </div>
          <div class="user-wrapper">
            <span style="font-size: 16px; font-weight: 600; color: #413c3c">Admin</span>
            <span style="font-size: 13px; color: #a9a8a8">超级管理员</span>
          </div>
        </div>

        <template #dropdown>
          <ElDropdownMenu>
            <!--            <router-link to="/profile/index" >-->
            <!--              <ElDropdownItem>个人中心</ElDropdownItem>-->
            <!--            </router-link>-->
            <ElDropdownItem>狮子头</ElDropdownItem>
            <ElDropdownItem>螺蛳粉</ElDropdownItem>
            <ElDropdownItem disabled> 双皮奶 </ElDropdownItem>
            <ElDropdownItem divided command="logout">
              <span style="display: block">退出登录</span>
            </ElDropdownItem>
          </ElDropdownMenu>
        </template>
      </ElDropdown>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { UserStore } from '@/store/modules/user'
import { AppStore } from '@/store/modules/app'

const userStore = UserStore()
const appStore = AppStore()
const route = useRoute()
const router = useRouter()

const sidebar = computed(() => appStore.sidebar)
// 侧边栏显示隐藏
const toggleSideBar = () => {
  appStore.toggleSidebar()
}
// 用户信息下拉框
const handleClick = (command: string) => {
  if (command !== 'logout') return
  logout()
}
const logout = () => {
  userStore.logout().then(() => {
    router.push(`/login?redirect=${route.fullPath}`).catch((err) => console.warn(err))
  })
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    padding: 0 15px;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
    margin-right: 25px;
    cursor: pointer;
    &:focus {
      outline: none;
    }
    .site-container {
      display: flex !important;
      align-items: center;
    }
    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      .profile-container {
        height: 50px;
        padding: 0 15px;
        //background: #ccc;
        display: flex;
        flex-direction: row;
        border-left: 1px solid #f0f0f0;
        .avatar-wrapper {
          margin-top: 5px;
          position: relative;
          .user-avatar {
            cursor: pointer;
            width: 40px;
            height: 40px;
            border-radius: 10px;
          }

          .el-icon-caret-bottom {
            cursor: pointer;
            position: absolute;
            right: -20px;
            top: 25px;
            font-size: 12px;
          }
        }
        .user-wrapper {
          display: flex;
          margin-left: 15px;
          padding: 4px 0;
          //font-size: 12px;
          flex-direction: column;
          justify-content: space-around;
        }
      }
    }
  }
  .right-menu-row {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }
}
</style>
