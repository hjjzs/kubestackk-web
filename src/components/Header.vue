<template>
  <header>
    <div class="l-content">
      <el-button size="small" @click="openMenu" v-if="isCollapse" type="primary" :icon="Expand" />
      <el-button size="small" @click="openMenu" v-else type="primary" :icon="Fold" />

    </div>
    <div class="r-content">
      <el-dropdown>
          <span class="el-dropdown-link">
              <img class="user" src="../assets/non.png" alt="log">
          </span>
          <template #dropdown>
          <el-dropdown-menu>
              <el-dropdown-item @click="gotoPersent">个人中心</el-dropdown-item>
              <!-- <el-dropdown-item @click="updateadminPkgFunc"> 修改密码</el-dropdown-item> -->

              <el-dropdown-item @click="logout"> 退出</el-dropdown-item>
          </el-dropdown-menu>
          </template>
      </el-dropdown>
      </div>
    </header>
</template>
  
<script lang="ts" setup>
  import { Expand, Fold } from '@element-plus/icons-vue'
  import useStore from '../stores/index'
  

  import { storeToRefs } from 'pinia';
  const {menu, user} = useStore()
  const {isCollapse} = storeToRefs(menu)


  const openMenu = ()=> {
    isCollapse.value = !isCollapse.value
  }

  const gotoPersent = () => {

  }
  const logout = () => {
    user.logout()
  }
</script>

<style>
header{
    line-height: 40px;
    height: 100%;
    vertical-align: middle;
    
}
.l-content{
    float: left;
}

.r-content{
    float: right;
}

.r-content .user{
        width: 45px;
        height: 45px;
        border-radius: 50%;
        margin: 0px;
        padding: 0px;
        /* background-color: rgb(53, 51, 51); */
    }

</style>