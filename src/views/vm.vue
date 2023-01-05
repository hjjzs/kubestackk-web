<template>
    <el-table :data="filterTableData" style="width: 100%">
      <el-table-column label="Kind" prop="kind" />
      <el-table-column label="Name" prop="metadata.name" />
      <el-table-column label="Ip" prop="status.interfaces[0].ipAddresses" />
      <el-table-column label="Status" >
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <el-tag v-show="scope.row.status.phase == 'Running'" class="ml-2" type="success">{{ scope.row.status.phase }}</el-tag>
            <el-tag v-show="scope.row.status.phase != 'Running'" class="ml-2" type="danger">{{ scope.row.status.phase }}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="flavor" >
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <span style="margin-left: 10px">c{{ scope.row.spec.domain.cpu.cores}}_r{{ scope.row.spec.domain.resources.requests.memory}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="right">
        <template #header>
          <div>
            <el-input class="search-input" v-model="search" size="small" placeholder="搜索" />
            <el-button class="button-create" type="primary" round>创建虚拟机</el-button>
          </div>
         
        </template>
        <template #default="scope">
          <el-button size="small" @click="handleVNC(scope.row.metadata.name, scope.row.metadata.namespace)"
            >VNC</el-button
          >
          <el-button size="small" @click="handleConsole(scope.row.metadata.name, scope.row.metadata.namespace)"
            >console</el-button
          >
          <el-button
            size="small"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            >Delete</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </template>
  
  <script lang="ts" setup>
  import { computed, ref, onMounted } from 'vue'
  import useStore from '../stores';
  import {useRouter} from 'vue-router'
  const router = useRouter()
  const {user, vm} = useStore()
  const search = ref('')

  const filterTableData = computed(() =>
    vm.vmlist.filter(
      (data: any) =>
        !search.value ||
        data.metadata.name.toLowerCase().includes(search.value.toLowerCase())
        // console.log(data)
    )
  )

  onMounted(() => {
    vm.listVM(user.namespace)
  })

  const handleVNC = (name: string, namespace: string) => {
    const href = router.resolve({ //使用resolve
      path:'/vnc/',    //这里是跳转页面的name
      query: {
        name: name,
        namespace: namespace,
      }
   })
   window.open(href.href, 'novnc_window','resizable=yes,toolbar=no,location=no,status=no,scrollbars=no,menubar=no,width=1030,height=800')
    // console.log(index, row)
  }
  const handleConsole = (name: string, namespace: string) => {
    const href = router.resolve({ //使用resolve
      path:'/console',    //这里是跳转页面的name
      query: {
        name: name,
        namespace: namespace,
      }
   })
   window.open(href.href, 'console_window','resizable=yes,toolbar=no,location=no,status=no,scrollbars=no,menubar=no,width=1030,height=800')
    // console.log(index, row)
  }
  const handleDelete = (index: number, row: any) => {
    console.log(index, row)
  }
  
  </script>
  
<style>
.search-input{
  position: absolute;
  padding-right: 110px;
  top: 3px;
  left: 0px;
}
.button-create{
  position: absolute;
  top: 0px;
  right: 0px;
}
</style>