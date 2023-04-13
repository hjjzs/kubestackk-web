import request from '../utils/request'

export default {
   listNetAttach(ns: string){
    return request({
        url: "/apis/k8s.cni.cncf.io/v1/namespaces/" + ns + "/network-attachment-definitions",
        method: "get",
    })
   },
   listSubnet(subName: string){
    return request({
        url: "/apis/kubeovn.io/v1/subnets/" + subName,
        method: "get",
    })
   },
   deleteNetSub(subName: string){
    return request({
        url: "/apis/kubeovn.io/v1/subnets/" + subName,
        method: "delete"
    })
   },
   deleteNetAttach(netName: string, ns: string) {
    return request({
        url: "/apis/k8s.cni.cncf.io/v1/namespaces/" + ns + "/network-attachment-definitions/" + netName,
        method: "delete"
    })
   },
   createNetAttach(netdata: any, ns: string) {
    return request({
        url: "/apis/k8s.cni.cncf.io/v1/namespaces/" + ns + "/network-attachment-definitions",
        method: "post",
        data: netdata
    })
   },
   createSubnet(subData: any, ns: string) {
    return request({
        url: "/apis/kubeovn.io/v1/subnets",
        method: "post",
        data: subData
    })
   }

}