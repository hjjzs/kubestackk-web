import useUserStore from './modules/user'
import useVmStore from './modules/vm'
import useMenuStore from './modules/menu'


const useStore = () => ({
    user: useUserStore(),
    vm: useVmStore(),
    menu: useMenuStore()
})

export default useStore