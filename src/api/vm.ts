import request from '../utils/request'

export default {
    listVm(ns: string){
        return request({
            url: "/apis/kubevirt.io/v1/namespaces/" + ns + "/virtualmachineinstances",
            method: 'get'
        })
    }
}