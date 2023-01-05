import {createRouter, createWebHistory, RouteRecordRaw}  from 'vue-router'

export const constantRoutes: Array<RouteRecordRaw> =  [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/login.vue'),
        meta: { title: 'login'}

    },
    {
        path: '/layout',
        name: 'homePage',
        component: () => import('../views/homePage.vue'),
        // meta: { title: '首页', icon: 'HomeFilled'}
        children: [
            {
                path: '/dashboard',
                name: 'dashboard',
                component: () => import('../views/dashboard.vue'),
                meta: { title: '首页'}
            },
            {
                path: '/vm',
                name: 'vm',
                component: () => import('../views/vm.vue'),
                meta: {title: '虚拟机管理'}
            },
            {
                path: '/network',
                name: 'network',
                component: () => import('../views/network.vue'),
                meta: {title: '网络管理'}
            },
            {
                path: '/disk',
                name: 'disk',
                component: () => import('../views/disk.vue'),
                meta: {title: '磁盘管理'}
            },
            {
                path: '/user',
                name: 'name',
                component: () => import('../views/admin/user.vue'),
                meta: {title: '用户管理', role: "admin"}

            },
            {
                path: '/images',
                name: 'images',
                component: () => import('../views/admin/images.vue'),
                meta: {title: '镜像管理', role: 'admin'}
            }
        ]
    },
    {
        path: '/vnc',
        name: 'vnc',
        component: () => import('../views/vnc.vue'),
        meta: {title: 'vnc'}
    },
    {
        path: '/console',
        name: 'console',
        component: () => import('../views/console.vue'),
        meta: {title: 'console'}
    }
    
]

const router = createRouter({
    history: createWebHistory(),
    routes: constantRoutes as RouteRecordRaw[]
})

router.beforeEach((to) => {
    const token = sessionStorage.getItem('token')
    if (token) {
        if ( to.path === '/login'){
            return '/dashboard'
        }
    } else {
        if (to.path !== '/login'){
            return '/login'
        }
    }
})

export default router