import Login from './components/login/Login.vue';

// subpages
import SendResetMail from './components/login/SendResetMail.vue';
import ResetPassword from './components/login/ResetPassword.vue';

import Console from './components/console/Console.vue';

//subpages

    //admin
import Statistics from './components/console/pages/admin/Statistics.vue';
import Docs from './components/console/pages/admin/Docs.vue';


    //user
import Welcome from './components/console/pages/user/Welcome.vue';

export const routes = [
    {
        path: '/', component: Console, name: 'console', children: [
            { path: '', component: Welcome },            
            { path: '/docs', component: Docs },            
            { path: '/statistics', component: Statistics }
        ]
    },
    { path: '/login', component: Login, name: 'login' },
    { path: '/send_reset_mail', component: SendResetMail, name: 'sendResetMail' },
    { path: '/reset_password', component: ResetPassword, name: 'resetPassword' },
    { path: '*', redirect: { name: 'console' } }
]