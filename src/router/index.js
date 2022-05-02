import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Login from '../components/LoginComponent.vue';
import Register from "../components/RegisterComponent.vue";
import ForbiddenView from '../views/ForbiddenView.vue'

import CreateBookComponent from '../components/CreateBookComponent.vue'
const BookDetailComponent = () => import('../components/BookDetailComponent.vue');
const EditBookComponent = () => import('../components/EditBookComponent.vue');
const AssignView  = () => import('../views/AssignView.vue');
const Profile = () => import("../components/ProfileComponent.vue")
const AdminView = () => import("../views/AdminView.vue")
const UserBookView = () => import("../views/UserBookView.vue")


const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/home",
    component: HomeView,
  },
  {
    path: "/login",
    component: Login,
  },
  {
    path: "/register",
    component: Register,
  },
  {
    path: "/profile",
    name: "profile",
    // lazy-loaded
    component: Profile,
  },
  {
    path: "/admin",
    name: "admin",
    // lazy-loaded
    component: AdminView,
  },
  {
    path: "/books",
    name: "books",
    // lazy-loaded
    component: UserBookView,
  }, 
  {
    path: '/books/:bookId',
    name: "book by id",
    component: BookDetailComponent,
  },
  {
    path: '/create-book',
    name: "create book",
    component: CreateBookComponent
  },
  {
    path: '/assign-book-to-user/:userId',
    component: AssignView
  },
  {
    path: '/edit-book/:id',
    component: EditBookComponent
  },
  {
    path: "/forbidden",
    component: ForbiddenView
  },
];



const router = createRouter({
  history: createWebHashHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const publicPages = ['/login', '/register', '/home', '/forbidden'];
  const adminPages = ['/admin'];
  const authRequired = !publicPages.includes(to.path);

  const loggedIn = JSON.parse(localStorage.getItem('user.profile'));
  const isAdminRequired = adminPages.includes(to.path);

  let isAdmin = false;

  if (loggedIn) {
    isAdmin = loggedIn.role.name == 'admin';
  }

  if (authRequired && !loggedIn) {
    next('/login');
  } else if (isAdminRequired && !isAdmin) {
    next('/forbidden');
  } else {
    next();
  }
});

export default router
