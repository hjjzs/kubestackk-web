import {defineStore} from 'pinia'
import request from '../../api/vm'

const mountDisk = defineStore('mount',{
    state: () => {
        return {
            vmlist: []
        }
    },
    actions: {
        listVM(ns: string) {
            // console.log("dddsss", ns)
            request.listVm(ns).then((res: any)=>{
                // console.log(res.items)
                this.vmlist = res.items
            })
        }
    }
})

export default mountDisk