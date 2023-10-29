# 技巧 - js
## 强制传参
```js
// 如果不传参数的话，会直接报错
function throwIfMissing() {
 throw new Error('Missing parameter');
}
 
function foo(mustBeProvided = throwIfMissing()) { 
   return mustBeProvided;
}
```
## 对象设置正反值
```js
obj[obj.up = 0] = "up" // obj[0] = 'up'
// 由于obj 外面的值是等于号右边的值，所以造成 obj[0] = "up"
// 这也是enum 类型的来源
```

## 设置字符串形参
```js
  // 如果传 slow 字符串的话，其实就是传 600 默认值，也可以传固定时间
  let speeds = {
  slow:600,
  fast:500
}

function delay(time){
  time = speeds[time] || time
}
```

## js 中的枚举成员
使用 freeze 保证不会被修改
```js
const userType = Object.freeze({
  child:1,
  adult:2,
  elder"3"
})

if(xx == usertType.child) { }
```

## 变量默认值
```js
num = ++ num || 1
// 因为num 是 undefined 的话，会走后面的 1
// ++undefined s是 NaN，属于 falsy 值
```

## 统一导出
```js
 // 在 home.js 中使用到的 export default
export { default as Home} from "./Home.js"
// 本质是是下面的简写
import { default as Home } from "./Home.js"
export Home
// 在使用是
import {Home} fromr "../xxx"
```
## do-while 优化
 有大量的 if 条件语句,可以使用 do while
```js
let flag =false
if(a == 3){
	if(b == 4){
		if(c == 5){
			flag = true
		}
	}
}
// 使用 do while 优化
do {
	if(a !== 3){
		break;
	}
	if(b!== 4){
		break;
	}
	//更加的清楚，如果是在函数中，没有后续条件判断了，可以直接 return 
	// 使用 switch case 就不管用了，Switch 对于单一变量可用
	flag = true
}while(false)
```
## filter 过滤下标
```js
 fucntion DEL_LEFT_VIEWS (state, view) {
    const index = 5
   
    state.visitedViews = state.visitedViews.filter((item, idx) => {
      if (idx >= index) {
        return true
      }

      return false
    })
  }
```
## break 中断
对于 for 循环,要及时的中断
```js
for (let v of state.visitedViews) {
	if (v.path === view.path) {
		v = Object.assign(v, view)
		break
	}
}

let array = [1,2,3]
for (let index = 0; index < array.length; index++) {
	const element = array[index];
	if(element == 2) break;
}
```
## 判断元素是否已经触底

scrollHeight = 等于该元素在不使用滚动条的情况下为了适应视口中所用内容所需的最小高度  
可视高度 + 滚动条在 Y 轴上的滚动距离 = 总高度    
clientHeight + scrollTop === scrollHeight;
```js
const dom = document.getElementById('scrollElement');

dom.addEventListener('scroll', () => {
	const clientHeight = dom.clientHeight;
	const scrollTop = dom.scrollTop;
	const scrollHeight = dom.scrollHeight;
	if (clientHeight + scrollTop === scrollHeight) {
		console.log('竖向滚动条已经滚动到底部')
	}
})
```

```vue
<template>
  <div v-if="!has_more">暂无更多数据</div>
  <div class="load_more" v-else>加载中</div>
</template>

<script lang="ts">
  import { defineComponent, ref, watch } from 'vue';
  export default defineComponent({
    props: {
      has_more: {
        type: Boolean,
        require: true
      }
    },
    mounted() {
      const io = new IntersectionObserver(entries => {
        if (entries[0].intersectionRatio > 0) {
          this.$emit('loadMore');
        }
      });
      io.observe(document.querySelector('.load_more'));
    },
  })
</script>
```
主要利用了 `IntersectionObserver`

## 按位与 判断奇偶
按位与（&）运算符在两个操作数对应的二进位都为 1 时，该位的结果值才为 1(**必须同时为 1 才为 1**)  

可以利用 1 的二进制是 `00001`来进行最后一位的判断
因为偶数的最后一位一定是 0,奇数的末尾一定是 1
`(2).toString(2)`
```js
	2 & 1 // 0
	4 & 1 // 0
	6 & 1  //0

	3 & 1 // 1
	5 & 1 //1
```

## switch/case使用区间
```js
const age = 26;
switch (true) {
	case isNaN(age):
		console.log("not a number");
		break;
	case (age < 18):
		console.log("under age");
		break;
	case (age >= 18):
		console.log("adult");
		break;
	default:
		console.log("please set your age");
		break;
}
```

## 强制重排
使用 `el.offsetHeight` 触发重排,获取最新的 dom 结构    
或者使用 `requestAnimationFrame` 获取下一帧动画  


<script setup lang="ts">
	import { onMounted, ref, computed, reactive, watch } from "vue";
	const c = ref<HTMLElement | null>(null)
	const isShow = ref(false);
	watch(isShow, (val) => {
		if (val) {
			openPanel()
		} else {
			closePanel()
		}
	})
	const openPanel = () => {
		const el = c.value as HTMLElement;
		el.style.height = 'auto';
		let h = el.offsetHeight;
		el.style.height = '0px';
		el.offsetHeight // [!code ++]
		requestAnimationFrame(() => {  // [!code ++]
			el.style.height = h + 'px'
		})
	}
	const closePanel = () => {
		const el = c.value as HTMLElement;
		el.style.height = '0px'
	}
	const toggleHeight = () => {
		isShow.value = !isShow.value;
	}
</script>
<ClientOnly>
	<div>
			<el-button type="primary" @click="toggleHeight">切换高度</el-button>
			<div class="rounded-md overflow-hidden transition-all duration-1000 h-0" ref="c">
				<div class="bg-red-100 h-[60px] py-2 border border-solid" v-for="item in 10" :key="item">
				</div>
			</div>
	</div>
</ClientOnly>

```vue
<template>
  <div>
    <el-button @click="toggleHeight">切换高度{{ isShow }}</el-button>
    <div class="rounded-md overflow-hidden transition-all duration-1000 h-0" ref="c">
      <div class="bg-red-100 h-[60px] py-2 border border-solid" v-for="item in 10" :key="item">
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref, computed, reactive, watch } from "vue";
const c = ref<HTMLElement | null>(null)
const isShow = ref(false);
watch(isShow, (val) => {
  if (val) {
    openPanel()
  } else {
    closePanel()
  }
})
const openPanel = () => {
  const el = c.value as HTMLElement;
  el.style.height = 'auto';
  let h = el.offsetHeight;
  el.style.height = '0px';
	// el.offsetHeight // [!code ++]
  requestAnimationFrame(() => {  // [!code ++]
    el.style.height = h + 'px'
  })
}
const closePanel = () => {
  const el = c.value as HTMLElement;
  el.style.height = '0px'
}
const toggleHeight = () => {
  isShow.value = !isShow.value;
}
</script>
```
## 控制设置值的范围
:::tip
 `Object.defineProperty` 可以被 `Reflect.defineProperty` 替代,参数是一样的,不同的是 `Reflect.defineProperty` 返回的是 `boolean`

 `Object.defineProperty(target, prop, descriptor)`   
 `Reflect.defineProperty(target, prop, descriptor)`
:::

```js
Object.defineProperty(config, x, {
	get(){
		return this._x;
	},
	set(val){
		if(val < 0){
			val = 0
		}else if(val > 100){
			val = 100
		}
		this._x = val;
	}
})
```

## groupBy

**使用函数可以更加方便的对数组进行分组,更加的灵活**

```js
function groupBy(array, generateKey) {

	if(typeof generateKey !== 'function'){ //[!code hl]
		const propName = generateKey;   //[!code hl]
		generateKey = (obj) => obj[propName]; //[!code hl]
	} //[!code hl]

	const groups = {};
	for(const item of array){
		const key = generateKey(item);
		if(!groups[key]){
			groups[key] = [];
		}
		groups[key].push(item);
	}
	return groups;
}	
```
使用
```js
const groups = groupBy(arr, (item) => item.id + item.age);
```
```js
const groups = groupBy(arr, "age");
```
## 浏览器打印异常
```js
let obj = [{ n: 1 }, { n: 2 }]
console.log(obj)
obj[0].n++;
console.log(obj)
```

<img src="@other/paintError.png"/>

会发现两个对象是一样的，其实这是浏览器做的一个优化，因为对象是引用类型，所以浏览器会认为两个对象是同一个，所以不会重新创建，而是指向同一个对象，所以修改其中一个对象的属性，另一个也会跟着改变。    

**当你点击的时候，才会真正计算这个对象**
