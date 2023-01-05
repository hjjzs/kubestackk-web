import {defineStore} from 'pinia'
import user from '../../api/user'
import router from '../../router/index'
import { ElMessage } from 'element-plus'

// const store = useUserStore()

const useUserStore = defineStore('user',{
    persist: {enabled: true},
    state: () => {
        return {
            name: '',
            namespace: '',
            passwd: '',
            role: '',
            token: 'admin'
        }
    },
    actions: {

        login() {
            var n = this.name
            var p = this.passwd
            return user.login({username: n, password: p}).then((res: any) => {
                const {data, code} = res
                if (code === 200) {
                    if (data != ""){
                        this.token = data.token
                        this.name = data.username
                        this.namespace = data.ns 
                        this.role = data.role
                        this.passwd = ""
                        sessionStorage.setItem('token', data.token)
                        // router.push('/dashboard')
                    }
                }else{
                    ElMessage.error(res.error)
                }
            })
        },
        logout() {
            this.token = 'admin'
            sessionStorage.removeItem('token')
            router.push('/login')
            
        }
    }
})

export default useUserStore