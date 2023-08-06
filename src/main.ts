import { createApp } from "vue";
import App from "./App.vue";
import Lazy from "./plugins/loadImg";
import Loading from "./plugins/loading";

const app = createApp(App);

app.use(Lazy, {
  preload: 1.1,
  loadImg:
    "https://ts1.cn.mm.bing.net/th/id/R-C.289c5bdbdd838d59245fc60620532fe5?rik=pQZoPRPeXTjCHg&riu=http%3a%2f%2fimg.zcool.cn%2fcommunity%2f01c30c571a507e32f875a3997c03db.gif&ehk=8%2bGl4aOtyDN7LK26jneUOroHcjOxuIqPysGAv0ZZUg4%3d&risl=&pid=ImgRaw&r=0",
});

app.use(Loading, {
  text: "loading",
  fullscreen: false,
  background: "red",
  customClass: "abcd",
  duration:400
});

app.mount("#app");
