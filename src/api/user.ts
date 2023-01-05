import { dataType } from 'element-plus/es/components/table-v2/src/common'
import request from '../utils/request'

interface UserStatus {
    userstatus: number
}

export default {
    login(data: {username: string, password: string}){
        return request({
            url: '/apis/sub.userapp.hjjzs.xyz/v1/checkpass',
            method: 'post',
            data
        })
    },
    listUser(){
        return request({
            url: '/apis/sub.userapp.hjjzs.xyz/v1/users',
            method: 'get'
        })
    },
    editUser(data: UserStatus, user: string){
        return request({
            url: '/apis/sub.userapp.hjjzs.xyz/v1/users/'+ user + '/disUser',
            method: 'post',
            data: data
        })
    },
    createUser(data: any, username: string){
        return request({
            url: '/apis/userapp.hjjzs.xyz/v1/users/' + username,
            method: 'post',
            data: data
        })
    },
    deleteUser(username: string){
        return request({
            url: '/apis/userapp.hjjzs.xyz/v1/users/' + username,
            method: 'delete',
        })
    }
}