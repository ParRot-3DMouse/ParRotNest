import router from "next/router";

export const redirectTo404 = () => {
  router.push("/404");
};
