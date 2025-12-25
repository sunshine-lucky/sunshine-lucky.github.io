import {createRouter,createWebHashHistory} from 'vue-router'
import Index from '../pages/index.vue'
import Admin from '../layouts/admin.vue'
import Calculator from '../pages/compute/calculator.vue'
import Weight from '../pages/convert/Weight.vue'
import Length from '../pages/convert/Length.vue'
import Area from '../pages/convert/Area.vue'
import Volumn from '../pages/convert/Volumn.vue'
import Jinzhi from '../pages/convert/jinzhi.vue'
import Wendu from '../pages/convert/wendu.vue'

const routes=[{
    path:"/",
    component:Admin,
    children:[
    {
        path: '', 
        redirect: '/compute'
      },
    {
        path:'compute',
        component:Calculator
    },
    {
        path:'/convert/jinzhi',
        component:Jinzhi
    },
    {
        path:'/convert/wendu',
        component:Wendu
    },
    {
        path:'/convert/weight',
        component:Weight
    },
    {
        path:'/convert/length',
        component:Length
    },
    {
        path:'/convert/area',
        component:Area
    },
    {
        path:'/convert/volumn',
        component:Volumn
    }
]
}]

const router=createRouter({
    history:createWebHashHistory(),
    routes,
})
export default router