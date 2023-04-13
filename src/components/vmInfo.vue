<template>
    <el-card class="box-card" style="margin: 0px; padding: 9px;">
        <el-scrollbar height="40vh">
            <div class="demo-collapse">
                <el-collapse>
                    <el-collapse-item title="磁盘" name="1">
                        <div v-for="i, o in vmiM.status.volumeStatus" :key="o">
                            <el-divider style="margin: 0px; margin-bottom: 7px;" />
                            <div style="border: 3px, black; text-align: left;">
                                <div>Disk{{ o }}</div>
                                <div>磁盘名：{{ i.name }}</div>
                                <div>盘符：{{ i.target }}</div>
                                <div v-if="i.size != undefined">大小： {{ i.size / 1024 / 1024 }} MB</div>
                                <div v-if="i.persistentVolumeClaimInfo != undefined">大小：{{
                                    i.persistentVolumeClaimInfo.capacity.storage }} </div>
                            </div>
                        </div>
                    </el-collapse-item>
                    <el-collapse-item title="网络" name="2">
                        <div v-for="i, o in vmiM.status.interfaces" :key="o">
                            <el-divider style="margin: 0px; margin-bottom: 7px;" />
                            <div style="border: 3px, black; text-align: left;">
                                <div>网卡{{ o }}</div>
                                <div>磁盘名：{{ i.name }}</div>
                                <div>接口：{{ i.interfaceName }}</div>
                                <div v-if="i.ipAddress != undefined">IPV4： {{ i.ipAddress }}</div>
                            </div>
                        </div>
                    </el-collapse-item>
                    
                    <el-collapse-item  title="虚拟机信息" name="4">
                        <div>
                            <div style="border: 3px, black; text-align: left;">
                                <div>系统名: {{ vmiM.status.guestOSInfo.name }}</div>
                                <div>内核:   {{   vmiM.status.guestOSInfo.kernelRelease }}</div>
                                <div>内核版本:   {{   vmiM.status.guestOSInfo.kernelVersion }}</div>

                            </div>
                        </div>
                    </el-collapse-item>
                    <el-collapse-item title="事件" name="3">
                        <div v-for="i, o in vmiM.status.phaseTransitionTimestamps" :key="o">
                            <el-divider style="margin: 0px; margin-bottom: 7px;" />
                            <div style="border: 3px, black; text-align: left;">
                                <div>时间: {{ i.phaseTransitionTimestamp }}</div>
                                <div>事件: {{ i.phase }}</div>
                            </div>
                        </div>
                    </el-collapse-item>
                </el-collapse>
            </div>
        </el-scrollbar>

    </el-card>
</template>

<script lang="ts" setup>
import { toRefs, defineProps } from 'vue'
const props = defineProps({
    vmiM: Object,
})
const { vmiM } = <any>toRefs(props)
</script>

<style>
.el-card__body{
    padding: 1px;
}
</style>