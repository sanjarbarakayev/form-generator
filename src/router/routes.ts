export default [
  {
    path: "/auth",
    name: "Auth",
    component: () => import("@/pages/PAuth.vue"),
  },
  {
    path: "/",
    name: "Home",
    component: () => import("@/pages/PIndex.vue"),
  },

  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@/pages/PError.vue"),
  },
]
