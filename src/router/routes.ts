export default [
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
