<template>
    <el-table 
      v-loading="loading" 
      :data="filterTableData" 
      style="width: 100%"
      element-loading-text="创建中..."
    >
      <el-table-column label="用户名" prop="metadata.name" />
      <el-table-column label="磁盘大小" width="auto">
        <template #default="scope">
            <span>{{ scope.row.status.ImageSize}}</span>      
        </template>
      </el-table-column>

      <el-table-column label="状态" width="auto">
        <template #default="scope">
            <el-tag v-if="scope.row.status.status == 'acctive'">{{ scope.row.status.status }}</el-tag>  
            <el-tag v-else-if="scope.row.status.status == '创建中'">{{ scope.row.status.status}}/{{ scope.row.status.statusMessge }}</el-tag>  
            <el-tooltip
              v-else 
              class="box-item"
              effect="dark"
              :content=scope.row.status.status
              placement="top-end"
            >
              <el-tag type="danger">error</el-tag>
            </el-tooltip>    
        </template>
      </el-table-column>

      <el-table-column align="right">
        <template #header>
            <el-input class="search-input" v-model="search" size="small" placeholder="搜索" />
            <el-button class="button-create" @click="dialogFormVisible = true" size="small" type="primary" >创建镜像</el-button>
        </template>
        <template #default="scope">
         
          <el-popconfirm @confirm="handleDelete(scope.row.metadata.name)" title="是否确认删除此用户镜像？">
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
      title="创建镜像"
    >

      <el-form ref="ruleFormRef" :model="form" :rules="rules">
        <el-form-item label="镜像名" prop="name" :label-width="formLabelWidth">
          <el-input v-model="form.name" style="width: 244px;"  autocomplete="off" />
        </el-form-item>
        <el-form-item label="镜像地址" prop="Path" :label-width="formLabelWidth">
          <el-input v-model="form.Path" style="width: 244px;"  placeholder="" />
        </el-form-item>

        <el-form-item label="镜像大小" prop="size" :label-width="formLabelWidth">
            <el-input-number v-model="form.Size" :min="10" :max="50"/>
        </el-form-item>

      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="createimage(ruleFormRef)">创建</el-button>
          <el-button  @click="dialogFormVisible = false">
            取消
          </el-button>
        </span>
      </template>
    </el-dialog>

</template>
<script setup lang="ts">
    import {onMounted, onUnmounted, computed, ref,reactive} from 'vue'
    import imageApi from '../../api/image'
    import { ElMessage } from 'element-plus'
    import type {FormInstance, FormRules } from 'element-plus'
    // import useStore from '../../stores/index'

    // const {user} = useStore()
    const ruleFormRef = ref<FormInstance>()
    const imageData2 = ref<any>([])
    const search = ref('')
    const loading = ref(false)

    const dialogFormVisible = ref(false)
    const formLabelWidth = '140px'
    const timer = ref()

    const rules = reactive<FormRules>({
      name: [
        {required: true, message: "请输入镜像名称", trigger: 'blur'},
        {min: 3, max: 15, message: "长度应为3到15个字符", trigger: 'blur'},
      ],
      Path: [
        {required: true, message: "请输入镜像地址", trigger: 'change'},
        // {min: 3, max: 15, message: "长度应为3到15个字符", trigger: 'blur'},
      ],
    })
    const form = reactive({
      name: '',
      Path: '',
      Size: 10
    })

    const  listImage = async () => {
      await imageApi.listPvcImage().then( (res: any) => {
        // console.log("pvc", res)
        imageData2.value = res.items
        // console.log("pvc2", imageData2.value)
      })
    }

    // 获取用户列表
    onMounted(() => {
        listImage()
        // console.log(filterTableData.value)
    })
    onUnmounted(()=>{
      clearInterval(timer.value)
    })

    // 用于过滤用户
    const filterTableData = computed(() =>
    imageData2.value.filter(
        (data: any) =>
        !search.value ||
        data.metadata.name.toLowerCase().includes(search.value.toLowerCase())
    )
    )

    const handleDelete = (imagename: string) => {
        // console.log(username)
          imageApi.deletePvcImage(imagename).then(()=>{
            listImage()
          })
    }

    
    const createimage = async (formEl: FormInstance | undefined) => {
      if (!formEl) return
      await formEl.validate((valid, fields) => {
        if (valid) {
          const data = {
              "apiVersion": "imgapp.hjjzs.xyz/v1",
              "kind": "PvcImage",
              "metadata": {
                  "annotations":{"kubectl.kubernetes.io/last-applied-configuration": "" },
                  "name": form.name
              },
              "spec": {
                  // "imageFormat": form.format,
                  "imagePath": form.Path,
                  "imageSize": form.Size,
                  "storageClassName": "rook-ceph-block"
              },
              "status": {
                  "ImageSize": "",
                  "id": "",
                  "status": "",
                  "statusMessge": ""
              }
          }
          imageApi.createPvcImage(data, form.name).then( (res: any)=>{
            
            dialogFormVisible.value = false
            loading.value = true
            
            timer.value = setInterval(()=>{
              // checkImageStatus()
              // console.log("check")
              listImage()
              loading.value = false
              var imglist = imageData2.value.filter((data: any)=>{
                  // console.log("tt",data,form.name)
                  return data.metadata.name == form.name
              })
              // console.log("ddd",imglist)
              if (imglist[0].status.status == "acctive"){
                clearInterval(timer.value)
              }
            }, 10000)

          }).catch((res)=>{
            ElMessage.error(res.response?.data.reason)
            
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