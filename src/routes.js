import Login from './components/login/Login.vue';

// subpages
import SendResetMail from './components/login/SendResetMail.vue';
import ResetPassword from './components/login/ResetPassword.vue';

import Console from './components/console/Console.vue';

//subpages
    //supplier
import Home from './components/console/pages/supplier/Home.vue';
import Settings from './components/console/pages/supplier/Settings.vue';
import Orders from './components/console/pages/supplier/Orders.vue';
import Products from './components/console/pages/supplier/Products.vue';

    //admin
import AddSupplier from './components/console/pages/admin/AddSupplier.vue';
import AllSuppliers from './components/console/pages/admin/AllSuppliers.vue';
import AllProducts from './components/console/pages/admin/AllProducts.vue';
import Statistics from './components/console/pages/admin/Statistics.vue';
import Docs from './components/console/pages/admin/Docs.vue';


    //user
import CreateList from './components/console/pages/user/CreateList.vue';
import AllProductsView from './components/console/pages/user/AllProductsView.vue';

export const routes = [
    {
        path: '/', component: Console, name: 'console', children: [
            { path: '', component: Home },
            { path: '/products', component: Products },
            { path: '/settings', component: Settings },
            { path: '/orders', component: Orders },
            { path: '/add', component: AddSupplier, name: 'addSupplier' },
            { path: '/all_suppliers', component: AllSuppliers },
            { path: '/all_products', component: AllProducts },
            { path: '/docs', component: Docs },
            { path: '/createList', component: CreateList },
            { path: '/all_products_view', component: AllProductsView },
            { path: '/statistics', component: Statistics }
        ]
    },
    { path: '/login', component: Login, name: 'login' },
    { path: '/send_reset_mail', component: SendResetMail, name: 'sendResetMail' },
    { path: '/reset_password', component: ResetPassword, name: 'resetPassword' },
    { path: '*', redirect: { name: 'console' } }
]