<template>
    <div class="icon-h1">
      <img class="img" src="../assets/vue.svg" alt="vue">
      <span v-show="!isCollapse" class="h1">kubeStack管理系统</span>
    </div>
    <div class="menu">
      <el-menu
        default-active="2"
        class="el-menu-vertical-demo"
        :collapse="isCollapse"
        background-color="#304156"
        text-color="#bfcbd9"
      >
        <el-sub-menu index="1">
          <template #title>
            <el-icon><Menu /></el-icon>
            <span>项目管理</span>
          </template>
            <el-menu-item @click="goTo('/vm')" index="1-1">虚拟机管理</el-menu-item>
            <el-menu-item @click="goTo('/network')" index="1-2">网络管理</el-menu-item>
            <el-menu-item @click="goTo('/disk')" index="1-3">磁盘管理</el-menu-item>
          
        </el-sub-menu>
   
        <el-sub-menu index="2" v-show="user.role == 'admin'">
          <template #title>
            <el-icon><Avatar /></el-icon>
            <span>管理员</span>
          </template>
            <el-menu-item @click="goTo('/user')" index="2-1">用户管理</el-menu-item>
            <el-menu-item @click="goTo('/images')" index="2-2">镜像管理</el-menu-item>
            <!-- <el-menu-item @click="goTo('/disk')" index="2-3">磁盘管理</el-menu-item> -->
        </el-sub-menu>
       
      </el-menu>
    </div>
  </template>
  
  <script lang="ts" setup>
  import {
    Document,
    Menu as IconMenu,
    Location,
    Setting,
  } from '@element-plus/icons-vue'
  import { storeToRefs } from 'pinia';
  import useStore from '../stores'
  import router from '../router/index'
  const {user, menu} = useStore()
  const {isCollapse} = storeToRefs(menu)
  
  const goTo = (to: string) => {
    router.push(to)
  }

 
  </script>
  
  <style scoped lang="scss">
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
    border-color: #304156;
  }
 
  .icon-h1{
    width: 100%;
    background-color: #2b2f3a;
    // float: left;
    // justify-content: space-between;
    height: 45px;
    .img{
      width: 20px;
      float: left;
      padding-left: 27px;
      padding-top: 10px;
    }
    .h1{
      font-size: 13px;    
      color: white; 
      float: right;
      padding-top: 10px;
      padding-right: 20px;
      line-height: 20px;
    }
  }
  </style>
  