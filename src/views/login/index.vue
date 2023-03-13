<template>
  <div class="login-container flex-box flex_j_c-center flex_a_i-center">
    <div class="login-box">
      <div class="login-left"></div>
      <div class="login-form">
        <div class="login-logo">
          <h2 class="logo-text">Note-Book</h2>
        </div>
        <LoginForm />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import LoginForm from './components/LoginForm.vue'
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
