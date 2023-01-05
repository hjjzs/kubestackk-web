import {defineStore} from 'pinia'

const menuStore = defineStore('menu',{
    state: () => {
        return {
            isCollapse: true
        }
    }
})
export default menuStore