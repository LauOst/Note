<template>
  <div>
    Home
    <el-button @click="handleClick">按钮</el-button>
    <div class="box">
      <img src="../../assets/images/liuwhiteLogo.png" class="img" />
    </div>
  </div>
</template>

<script lang="ts" setup name="home">
import { getInfoApi } from '@/api/modules/login'

const handleClick = () => {
  getInfoApi().then((r) => console.log(r))
}
</script>

<style lang="scss" scoped>
.box {
  width: 200px;
  height: 200px;
  background: #1a1a1a;
  .img {
    width: 100%;
    //height: 100px;
  }
}
</style>
