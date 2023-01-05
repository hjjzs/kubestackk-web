<template>
    <el-table 
      v-loading="loading" 
      :data="filterTableData" 
      style="width: 100%"
      element-loading-text="创建中..."
    >
      <el-table-column label="用户名" prop="metadata.name" />
      <el-table-column label="命名空间" width="auto">
        <template #default="scope">
            <span>{{ scope.row.metadata.name + "-demo" }}</span>      
        </template>
      </el-table-column>

      <el-table-column label="角色" prop="spec.role" />

      <el-table-column label="状态" width="auto">
        <template #default="scope">
            <el-tag>{{ scope.row.status.status }}</el-tag>      
        </template>
      </el-table-column>

      <el-table-column align="right">
        <template #header>
            <el-input class="search-input" v-model="search" size="small" placeholder="搜索" />
            <el-button class="button-create" @click="dialogFormVisible = true" size="small" type="primary" >创建用户</el-button>
        </template>
        <template #default="scope">
          <div class="disuser" v-show="scope.row.spec.role != 'admin'">
            <el-button v-if="scope.row.status.status == 'active'" size="small" @click="handleEdit(0, scope.row.metadata.name, scope.$index)"
            >禁用</el-button
            >
            <el-button v-else size="small" @click="handleEdit(1,scope.row.metadata.name,scope.$index)"
              >启用</el-button
            >
          </div>

          <el-popconfirm @confirm="handleDelete(scope.row.metadata.name)" title="是否确认删除此用户？">
            <template #reference>
              <el-button
                size="small"
                type="danger"
                >Delete</el-button
              >
            </template>
          </el-popconfirm>
          
        </template>
      </el-table-column>
    </el-table>

    <!-- //创建用户弹窗 -->
    <el-dialog v-model="dialogFormVisible"
      width="27%"
      title="创建用户"
    >

      <el-form ref="ruleFormRef" :model="form" :rules="rules">
        <el-form-item label="用户名" prop="name" :label-width="formLabelWidth">
          <el-input v-model="form.name" style="width: 244px;"  autocomplete="off" />
        </el-form-item>
        <el-form-item label="密码" prop="password" :label-width="formLabelWidth">
          <el-input v-model="form.password" style="width: 244px;"  type="password" placeholder="请输入密码" show-password/>
        </el-form-item>
        <el-form-item label="Roles" prop="role" :label-width="formLabelWidth">
          <el-select v-model="form.role" style="width: 244px;" placeholder="请选择用户角色">
            <el-option label="管理员" value="admin" />
            <el-option label="普通用户" value="user" />
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="createUser(ruleFormRef)">创建</el-button>
          <el-button  @click="dialogFormVisible = false">
            取消
          </el-button>
        </span>
      </template>
    </el-dialog>

</template>
<script setup lang="ts">
    import {onMounted, computed, ref,reactive} from 'vue'
    import userApi from '../../api/user'
    import { ElMessage } from 'element-plus'
    import type {FormInstance, FormRules } from 'element-plus'
    import useStore from '../../stores/index'

    const {user} = useStore()
    const ruleFormRef = ref<FormInstance>()
    const userData = ref<any>([])
    const search = ref('')
    const loading = ref(false)

    const dialogFormVisible = ref(false)
    const formLabelWidth = '140px'

    const rules = reactive<FormRules>({
      name: [
        {required: true, message: "请输入用户名", trigger: 'blur'},
        {min: 3, max: 5, message: "长度应为3到5个字符", trigger: 'blur'},
      ],
      role: [
        { required: true,
          message: '请选择用户角色',
          trigger: 'change',
        }
      ],
      password: [
        {required: true, message: "请输入用户密码", trigger: 'blur'},
        {min: 8, max: 15, message: "长度应为8到15个字符", trigger: 'blur'},
      ],

    })
    const form = reactive({
      name: '',
      role: '',
      password: ''
    })

    

    // 获取用户列表
    onMounted(() => {
        listUser()
    })

    const listUser = () => {
      userApi.listUser().then( res => {
        userData.value = res.data.items
      })
    }

    // 用于过滤用户
    const filterTableData = computed(() =>
    userData.value.filter(
        (data: any) =>
        !search.value ||
        data.metadata.name.toLowerCase().includes(search.value.toLowerCase())
    )
    )

    // 禁用/启用用户
    const handleEdit = (satus: number, username: string, index: any) => {
        // console.log(index, row)
        userApi.editUser({userstatus: satus}, username).then((res: any) => {
            if (res.code != 200){
                ElMessage.error(res.msg)
            }else{
                //当修改成功时，更加返回的状态更新前端的状态  res.data 返回 1|0
                userData.value[index].status.status = res.data ? "active" : "Disabled" 
            }
        })
    }

  
    const handleDelete = (username: string) => {
        // console.log(username)
        if (user.name == username){
          ElMessage.warning("不允许删除当前登录的用户")
        }else{
          userApi.deleteUser(username).then(()=>{
            listUser()
          })
          // console.log("deleted")
        }
       
    }

    
    const createUser = async (formEl: FormInstance | undefined) => {
      if (!formEl) return
      await formEl.validate((valid, fields) => {
        if (valid) {
          const data = {
              "apiVersion": "userapp.hjjzs.xyz/v1",
              "kind": "User",
              "metadata": {
                  "annotations":{"kubectl.kubernetes.io/last-applied-configuration": "" },
                  "name": form.name
              },
              "spec": {
                  "password": form.password,
                  "role": form.role
              }
          }
          userApi.createUser(data, form.name).then((res: any)=>{
            // if res.
            // console.log(res)
            dialogFormVisible.value = false
            loading.value = true
            setTimeout(()=>{
              listUser()
              loading.value = false
            }, 3000)
            
          }).catch((res)=>{
            ElMessage.error(res.response?.data.reason)
            // console.log()
          })
        }
      })
      
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
  top: 3px;
  right: 0px;
}

.disuser{
  display: inline-block;
  margin: 0px;
  padding: 0px;
  margin-right: 10px;
}

</style>