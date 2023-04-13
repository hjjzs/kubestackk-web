import request from '../utils/request'

export default {
    listImage(){
        return request({
            url: "/apis/imgapp.hjjzs.xyz/v1/namespaces/default/containerimages",
            method: 'get'
        })
    },
    deleteImage(imagename: string){
        return request({
            url: "/apis/imgapp.hjjzs.xyz/v1/namespaces/default/containerimages/" + imagename,
            method: "delete",
        })
    },
    createImage(data: any, imagename: string){
        return request({
            url: '/apis/imgapp.hjjzs.xyz/v1/namespaces/default/containerimages/' + imagename,
            method: 'post',
            data: data
        })
    },
    listPvcImage(){
        return request({
            url: "/apis/imgapp.hjjzs.xyz/v1/namespaces/default/pvcimages",
            method: "get",
        })
    },
    deletePvcImage(imagename: string){
        return request({
            url: "/apis/imgapp.hjjzs.xyz/v1/namespaces/default/pvcimages/" + imagename,
            method: "delete",
        })
    },
    createPvcImage(data: any, imagename: string){
        return request({
            url: '/apis/imgapp.hjjzs.xyz/v1/namespaces/default/pvcimages/' + imagename,
            method: 'post',
            data: data
        })
    },
}