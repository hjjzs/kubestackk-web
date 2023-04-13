<template>
  <div>
    <el-tabs v-model="activeName" @tab-change="changeHander">
      <el-tab-pane label="详细信息" name="first">
        <!-- info -->
        <div class="info-vm">
          <!-- table -->
          <el-table :data="vmiMList" class="table-vm">
            <el-table-column label="节点" prop="status.nodeName" />
            <el-table-column label="名称" prop="metadata.name" />
            <!-- <el-table-column label="ip地址" prop="status.interfaces[0].ipAddresses" /> -->
            <el-table-column label="状态">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  <el-tag v-show="scope.row.status.phase == 'Running'" class="ml-2" type="success">{{
                    scope.row.status.phase }}</el-tag>
                  <el-tag v-show="scope.row.status.phase != 'Running'" class="ml-2" type="danger">{{
                    scope.row.status.phase }}</el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="flavor">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  <span style="margin-left: 10px">c{{ scope.row.spec.domain.cpu.cores }}_r{{
                    scope.row.spec.domain.resources.requests.memory }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="right">
              <template #header>
                <div style="text-align: center; margin-left: 94px;">操控</div>
              </template>
              <template #default="scope">
                <el-dropdown trigger="click">
                  <el-button class="el-dropdown-link">
                    操作<el-icon class="el-icon--right"><arrow-down /></el-icon>
                  </el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <!-- <el-dropdown-item :icon="DeleteFilled" @click="handleDelete(scope.row.metadata.name)">
                    删除
                  </el-dropdown-item> -->
                      <el-dropdown-item :icon="Platform"
                        @click="handleVNC(scope.row.metadata.name, scope.row.metadata.namespace)">
                        VNC
                      </el-dropdown-item>
                      <el-dropdown-item :icon="Postcard"
                        @click="handleConsole(scope.row.metadata.name, scope.row.metadata.namespace)">
                        Console
                      </el-dropdown-item>

                      <el-dropdown-item :icon="Position" @click="hotMigrate()">
                        热迁移
                      </el-dropdown-item>
                      <el-dropdown-item :icon="Position" @click="stopVm()">
                        关机
                      </el-dropdown-item>

                      <el-dropdown-item :icon="Position" @click="restartVm()">
                        重启
                      </el-dropdown-item>

                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </template>
            </el-table-column>
          </el-table>

          <VMInfo v-if="isInfoExit" :vmiM="vmiM"></VMInfo>

        </div>
      </el-tab-pane>
      <!-- vnc -->
      <el-tab-pane label="VNC" name="second">
        <div v-if="isVncEXit" @click="handleVNC(vm.vmName, user.namespace)" id="sendbox">弹窗</div>
        <VNC v-if="isVncEXit"></VNC>
      </el-tab-pane>
      <!-- console -->
      <el-tab-pane label="console" name="third">
        <Console v-if="isConsoleEXit"></Console>
      </el-tab-pane>

    </el-tabs>
  </div>
</template>
<script lang="ts" setup>
import VNC from './vnc.vue'
import Console from './console.vue'
import { ref, onMounted, onBeforeMount, } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import useStore from '../stores'
import vmrequest from '../api/vm'
import { Position, Postcard, Platform, DeleteFilled } from '@element-plus/icons-vue'

import VMInfo from '../components/vmInfo.vue'
import { ElMessage } from 'element-plus';


const activeName = ref('first')
const route = useRoute()
const router = useRouter()
const { vm, user } = useStore()
const isVncEXit = ref(false)
const isConsoleEXit = ref(false)
const isInfoExit = ref(false)
const vmiMList = ref<any>([])
const vmiM = ref<any>('')



onMounted(async () => {
  vm.vmName = <any>route.query.vmName
  await listVmi()
  console.log("###", vmiM.value)
})



const listVmi = async() => {
  await vmrequest.listVmi(user.namespace, vm.vmName).then((res: any) => {
    vmiM.value = res
    vmiMList.value.push(res)
    console.log(vmiM)
    isInfoExit.value = true
  })
}

const changeHander = (name: string) => {
  console.log(name)
  if (name == "second") {
    isVncEXit.value = true
  } else {
    isVncEXit.value = false
  }

  if (name == "third") {
    isConsoleEXit.value = true
  } else {
    isConsoleEXit.value = false
  }
}

const hotMigrate = () => {
  vm.hotMigrate(user.namespace, vm.vmName)
}

const handleVNC = (name: string, namespace: string) => {
  const href = router.resolve({ //使用resolve
    path: '/vnc/',    //这里是跳转页面的name
    query: {
      name: name,
      namespace: namespace,
    }
  })
  window.open(href.href, 'novnc_window', 'resizable=yes,toolbar=no,location=no,status=no,scrollbars=no,menubar=no,width=1030,height=800')
  // console.log(index, row)
}
const handleConsole = (name: string, namespace: string) => {
  const href = router.resolve({ //使用resolve
    path: '/console',    //这里是跳转页面的name
    query: {
      name: name,
      namespace: namespace,
    }
  })
  window.open(href.href, 'console_window', 'resizable=yes,toolbar=no,location=no,status=no,scrollbars=no,menubar=no,width=1030,height=800')
  // console.log(index, row)
}

const stopVm = () => {
  vmrequest.stopVm(user.namespace, vm.vmName).catch((res)=>{
    ElMessage.error(res)
  })
}

const restartVm = () => {
  vmrequest.restartVm(user.namespace, vm.vmName).catch((res)=>{
    ElMessage.error(res)
  })
}
</script>

<style>


.box-card {
  width: 20vw;
  height: 40vh;
  float: left;
}

.table-vm {
  width: 70%;
  float: right;
}

.info {
  margin-right: 20px;
  border: black;
}

#sendbox {
  position: fixed;
  top: 152px;
  right: 160px;
  border: 1px outset;
  padding: 5px 5px 4px 5px;
  cursor: pointer;
  background-color: #6e84a3;
  color: white;
  font: bold 12px Helvetica;
  padding: 6px 5px 4px 5px;
  border-bottom: 1px outset;
  line-height: 13px;
}
</style>