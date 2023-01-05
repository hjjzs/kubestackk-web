<template>
  <div class="common-layout" style="overflow:hidden">
    <el-container>
      <el-aside class="aside">
        <MyMenu />
      </el-aside>
      <el-container>
        <el-header class="header"><MyHeader /></el-header>
        <el-main class="main" style="overflow:hidden">
          <el-card class="card" shadow="always" > 
              <el-scrollbar height="88vh">
                <RouterView />
              </el-scrollbar> 
            </el-card>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import MyMenu from '../components/Menu.vue'
import MyHeader from '../components/Header.vue'

</script>

<style scoped lang="scss">
  .card{
    height: 83vh;
    --el-card-padding: 0px;
  }
.el-header{
  background-color: #FFFFFF;
  // background: linear-gradient(135deg, rgb(45, 51, 51), rgb(90, 114, 107));

  width: auto;
  /* margin: left; */
  height: 45px;
  border-bottom: 2px;
  border-bottom: #304156;
}
.el-aside{
  height: 100%;
  padding: 0px;
  margin: 0px;
  width: auto;
  background-color: #304156;
  min-width: 64px;
}
.main{
  background-color: #f0f2f5;
  padding: 20px;
}
.common-layout{
  height: 100%;
  width: 100%;
}
.el-container{
  height: 100%;
  padding: 0px;
  margin: 0px;
}

</style>
