# lazyLoad

由于需要传递默认参数,所以我们使用 [`插件`](https://cn.vuejs.org/guide/reusability/plugins.html#writing-a-plugin) 形式  

在插件内部,使用函数编程中的 ***函数颗粒化***， 通过执行一个函数,返回一个类,这样提供更加灵活的代码结构和功能,提高代码的模块化程度,增强类的扩展性

`ReactiveListener` 主要保存单个元素的状态  
`LazyClass` 执行的是收集 `ReactiveListener` 实例和执行滚动,在合适的时机执行 `ReactiveListener 中的 load` 方法

```ts
  app.use(Lazy,{
    preload:1.1,
    loadImg:"https://ts1.cn.mm.bing.net/th/id/R-C.289c5bdbdd838d59245fc60620532fe5?rik=pQZoPRPeXTjCHg&riu=http%3a%2f%2fimg.zcool.cn%2fcommunity%2f01c30c571a507e32f875a3997c03db.gif&ehk=8%2bGl4aOtyDN7LK26jneUOroHcjOxuIqPysGAv0ZZUg4%3d&risl=&pid=ImgRaw&r=0"
});
```

```ts:line-numbers {61-80,117-122,131-135}
// plugins/loadImg
import {
  App,
  DirectiveBinding,
  nextTick,
  ObjectDirective,
} from "vue";

interface Option {
  preload?: number;
  loadImg?: string;
  errorImg?: string;
}
type State = "pending" | "error" | "success";
interface Listener extends Required<Option> {
  el: HTMLImageElement;
  value: string;
  state: State,
}
function assets(e: Element | null): asserts e is Element {
  if (e == null) {
    throw TypeError("找不到可以滚动的元素");
  }
}
function findScrollEl(el: Element): Element | null {
  let parent = el.parentElement;

  while (parent) {
    // 不能使用style,因为 style 是只能存在于 内联属性上
    if (/\b(auto|scroll)\b/.test(getComputedStyle(parent).overflow)) {
      return parent;
    }
    parent = parent.parentElement;
  }
  return null;
}

function Lazy(app: App) {
  // 内部类
  class ReactiveListener {
    state: State = "pending"
    constructor(private option: Listener) { }
    load() {
      this.state = "pending"
      this.option.el.setAttribute("src", this.option.loadImg);
      let img = new Image();
      img.src = this.option.value;
      img.onload = () => {
        // 模拟loading
        setTimeout(() => {
          this.state = "success"
          this.option.el.setAttribute("src", this.option.value);
        }, 2000)
      };
      img.onerror = () => {
        this.state = "error"
        this.option.el.setAttribute("src", this.option.errorImg);
      };
    }

    // 检测当前元素是否在可视范围内
    checkView() {
      return new Promise((resolve) => {
        const obsever = new IntersectionObserver(
          (e) => {
            if (e[0].intersectionRatio > 0) {
              resolve(true);
              obsever.unobserve(this.option.el);
            } else {
              resolve(false);
            }
          },
          {
            root: findScrollEl(this.option.el),
            rootMargin: String((this.option.preload - 1 || 0.3) * 100) + "%",
          }
        );
        obsever.observe(this.option.el);
      });
    }
  }
  // 返回一个新类
  return class LazyClass {
    listenerQueue: ReactiveListener[];
    constructor(private option: Option) {
      this.listenerQueue = [];
    }
    // 执行懒加载 
    async handleLazyLoad() {
      this.listenerQueue.forEach(async (listener) => {
        if (listener.state == "pending") {
          let canIn = await listener.checkView();
          canIn && listener.load();
        }
      });
    }

    formatParams(el: HTMLImageElement, bingings: DirectiveBinding) {
      const listener = new ReactiveListener({
        el,
        state: "pending",
        preload: this.option.preload || 1.1,
        loadImg:
          this.option.loadImg ||
          "https://ts1.cn.mm.bing.net/th/id/R-C.289c5bdbdd838d59245fc60620532fe5?rik=pQZoPRPeXTjCHg&riu=http%3a%2f%2fimg.zcool.cn%2fcommunity%2f01c30c571a507e32f875a3997c03db.gif&ehk=8%2bGl4aOtyDN7LK26jneUOroHcjOxuIqPysGAv0ZZUg4%3d&risl=&pid=ImgRaw&r=0",
        errorImg:
          "https://gw.alipayobjects.com/mdn/prod_resource/afts/img/A*eDsBTKcm1IcAAAAAAAAAAAAAARQnAQ",
        value: bingings.value, //真实的 dom 节点
      });
      return listener
    }

    add(el: HTMLImageElement, bingings: DirectiveBinding) {
      const listener = this.formatParams(el, bingings)
      this.listenerQueue.push(listener);
      
      // dom 完成之后再执行
      nextTick(() => {
        const hasScrollEl = findScrollEl(el);
        assets(hasScrollEl);
        // 默认执行一次
        this.handleLazyLoad();
        hasScrollEl.addEventListener("scroll", this.handleLazyLoad.bind(this));
      });
    }
  };
}

const loadImg = {
  install(app: App, options: Option) {
    // 颗粒化
    let LazyClass = Lazy(app);
    const lazy = new LazyClass(options);
    app.directive("Lazy", {
      created: lazy.add.bind(lazy),
    });
  },
};

```