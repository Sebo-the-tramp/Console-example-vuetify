import Login from './components/login/Login.vue';
import Console from './components/console/Console.vue';

//subpages
import Home from './components/console/pages/supplier/Home.vue';
import Settings from './components/console/pages/supplier/Settings.vue';
import Orders from './components/console/pages/supplier/Orders.vue';
import Products from './components/console/pages/supplier/Products.vue';
import AddSupplier from './components/console/pages/admin/AddSupplier.vue';
import AllSuppliers from './components/console/pages/admin/AllSuppliers.vue';
import AllProducts from './components/console/pages/admin/AllProducts.vue';
import Docs from './components/console/pages/admin/Docs.vue';

export const routes = [
    {
        path: '/', component: Console, name: 'console', children: [
            { path: '', component: Home },
            { path: '/products', component: Products },
            { path: '/settings', component: Settings },
            { path: '/orders', component: Orders }, 
            { path: '/add', component: AddSupplier, name: 'addSupplier'},
            { path: '/all_suppliers', component: AllSuppliers},
            { path: '/all_products', component: AllProducts},
            { path: '/docs', component: Docs}
        ]
    },
    { path: '/login', component: Login, name: 'login' },
    { path: '*', redirect: { name: 'console' } }
]