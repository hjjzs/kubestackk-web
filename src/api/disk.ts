import request from '../utils/request'

export default {
    listdisk(ns: string){
        return request({
            url: "/api/v1/namespaces/" + ns + "/persistentvolumeclaims?labelSelector=mount_vm",
            method: 'get'
        })
    },
    deleteDick(diskname: string, namespaces: string){
        return request({
            url: "/api/v1/namespaces/" + namespaces + "/persistentvolumeclaims/" +  diskname,
            method: 'delete',
        })
    },
    createDisk(data: any, diskname: string, namespaces: string){
        return request({
            url: "/api/v1/namespaces/" + namespaces + "/persistentvolumeclaims",
            method: 'post',
            data: data,
        })
    },
    editDickLabels(namespaces: string, vmname: string,  pvcname: string){
        return request({
            url: "/api/v1/namespaces/"+ namespaces +"/persistentvolumeclaims/" + pvcname,
            method: "patch",
            data: {"metadata":{"labels": {"mount_vm": vmname}}}
        })
    },
    addVolume(namespaces: string, vmname: string, volumename: string){
        return request({
            url: "/apis/subresources.kubevirt.io/v1/namespaces/" + namespaces + "/virtualmachines/" + vmname + "/addvolume",
            method: "put",
            data: {
                "name": volumename,
                "disk": {
                    "disk": {
                        "bus": "scsi"
                    },
                    "serial": volumename
                },
                "volumeSource": {
                    "persistentVolumeClaim": {
                        "claimName": volumename,
                        "hotpluggable": true
                    }
                }
            }
        })
    },
    removeVolume(namespaces: string, vmname: string, volumename: string){
        return request({
            url: "/apis/subresources.kubevirt.io/v1/namespaces/" + namespaces + "/virtualmachines/" + vmname + "/removevolume",
            method: "put",
            data: {"name": volumename}
        })
    }
}