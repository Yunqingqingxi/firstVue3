// src/router.js
import { createRouter, createWebHistory } from 'vue-router';
import Home from "../page/Home.vue";
import notFound from "../page/NotFound.vue";
import SearchForm from "../components/SearchForm.vue";
import StudentList from '../components/StudentList.vue';
import ManageForm from "../components/ManageForm.vue";
import Loading from "../page/loading.vue";

const routes = [
    {
        path: '/',
        component: Home,
        meta: {
            title: '宿舍信息管理系统',
            icon: '',
        },
    },
    {
        path: '/Search',
        component: SearchForm,
        meta: {
            title: '查询学生信息',
            icon: '',
        },
    },
    {
        path:'/StudentList',
        component: StudentList,
        meta: {
            title: '添加学生信息',
            icon: 'D:\\Codefile\\second\\public\\vite.svg',
        },
    },
    {
        path: '/ManageForm',
        component: ManageForm,
        meta: {
            title: '修改学生信息',
            icon: '',
        },
    },
    {
        path: '/addFile',
        component: () => import('../components/addFile.vue'),
    },
    {
        path: '/loading',
        component: Loading,
        meta: {
            title: 'Loading',
            icon: '',
        },
    },
    {
        path: '/:path(.*)',
        component: notFound,
        meta: {
            title: 'Not Found',
            icon: '',
        },
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// 设置页面标题和图标的导航守卫
router.beforeEach((to, from, next) => {
    document.title = to.meta.title || 'Default Title';
    // 设置图标的逻辑，可以根据需要自行处理
    const iconPath = to.meta.icon;
    if (iconPath) {
        const link = document.querySelector("link[rel~='icon']") || document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'icon';
        link.href = iconPath;
        document.getElementsByTagName('head')[0].appendChild(link);
    }
    next();
});

export default router;
