import { Index } from './index.js'
import { Register } from './Register.js'
import { Login } from './Login.js'
import { AdminReg } from './AdminReg.js'
import { AdminLog } from './Adminlog.js'
import { UserHome } from './Home.js'
import { addTheater } from './AddTheater.js'
import { AdminHome } from './AdminHome.js'
import { Theater } from './Theater.js'
import { AdminTheater } from './AdminTheater.js'
import { AddShow } from './AddShow.js'
import { EditTheater } from './EditTheater.js'
import { EditShow } from './EditShow.js'
import { BookShow } from './BookShow.js'
import { Invoice } from './Invoice.js'
import { MyShows } from './MyShows.js'
import { Search } from './Search.js'
import { AdminSearch } from './AdminSearch.js'
import { About } from './about.js'





const routes = [
    {
        path: '/',
        name:'index',
        component: Index
    },
    {
        path: '/home',
        name:'user_home',
        component: UserHome
    },
    {
        path: '/admin/home',
        name:'admin_home',
        component: AdminHome
    },
    {
        path: '/register',
        name:'register',
        component: Register
    },
    {
        path: '/login',
        name:'Login',
        component: Login
    },
    {
        path: '/admin/register',
        name:'aminreg',
        component: AdminReg
    },
    {
        path: '/admin/login',
        name:'adminlog',
        component: AdminLog
    },
    {
        path: '/add/theater',
        name:'add_theater',
        component: addTheater
    },
    {
        path: '/add/show',
        name:'add_show',
        component: AddShow
    },
    {
        path: '/theater/:id',
        name:'theater',
        component: Theater
    },
    {
        path: '/admin/theater/:theater_id',
        name:'admin_theater',
        component: AdminTheater
    },
    {
        path: '/edit/theater/:theater_id',
        name:'edit_theater',
        component: EditTheater
    },
    {
        path: '/edit/show/:show_id',
        name:'edit_show',
        component: EditShow
    },
    {
        path: '/book/show/:show_id',
        name:'book_show',
        component: BookShow
    },
    {
        path: '/my_shows',
        name:'my_shows',
        component: MyShows
    },
    {
        path: '/invoice/:booking_id',
        name:'invoice',
        component: Invoice
    },
    {
        path: '/search',
        name:'search',
        component: Search
    },
    {
        path: '/admin/search',
        name:'admin_search',
        component: AdminSearch
    },
    {
        path: '/about',
        name:'about',
        component: About
    },
]

const router = new VueRouter({
    // mode : 'history',
    routes,
})

const app = new Vue({
    router,
}).$mount('#app')

