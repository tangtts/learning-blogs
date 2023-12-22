
# hash

**当我们需要查询一个元素是否出现过,或者在一个集合里的时候,可以使用 hash 表**

`set / map / 数组` 都可以算作 hash 表

## 有效的字母异位词

> 给定两个字符串 s 和 t ，编写一个函数来判断 t 是否是 s 的字母异位词

- 输入: s = "anagram", t = "nagaram" 输出: true
- 输入: s = "rat", t = "car" 输出: false

<img src="@img/242.有效的字母异位词.gif"/>

:::info 思路 
因为是字母,所以是 ASCII 码是连续的,所以可以把 字符 `a` 映射为下标
0, 字符 `z` 映射为下标 25

通过数组对应的下标所对应的元素做 +1 操作，如果在另一个字符串中出现了,可以执行 -1
操作

最后如果 record 数组中的所有元素都为 0,可以说明字符串 s 和 t 是字母异构词 
:::

```js
  var isAnagram = function(s, t) {
  if(s.length !== t.length) return false;
  const resSet = new Array(26).fill(0);
  const base = "a".charCodeAt(0);  // code码

  for(const i of s) {
    resSet[i.charCodeAt() - base]++;
  }

  for(const i of t) {
    // 说明不存在
    if(!resSet[i.charCodeAt(0) - base]) return false;
    resSet[i.charCodeAt(0) - base]--;
  }
  return true;
}
```

## 赎金信

> 给定一个赎金信 (ransom) 字符串和一个杂志(magazine)字符串，判断第一个字符串
> ransom 能不能由第二个字符串 magazines 里面的字符构成。如果可以构成，返回 true
> ；否则返回 false。
>
> (题目说明：为了不暴露赎金信字迹，要从杂志上搜索各个需要的字母，组成单词来表达
> 意思。杂志字符串中的每个字符只能在赎金信字符串中使用一次。)

- canConstruct("a", "b") -> false
- canConstruct("aa", "ab") -> false
- canConstruct("aa", "aab") -> true

:::info 
  同样的思路, 使用 map 记录, a-z 作为下标, 下标对应的值为出现的次数 
:::

```ts
  function canConstruct(ransomNote: string, magazine: string): boolean {
    let map = Array(26).fill(0);
    let base = 'a'.charCodeAt(0);

    if(magazine.length < ransomNote.length) return false;

    for(let i = 0;i < magazine.length;i++){
        map[ magazine[i].charCodeAt(0) - base ] +=1
    }

    for(let i = 0;i<ransomNote.length;i++ ){
        if(!map[ ransomNote[i].charCodeAt(0) - base ])return false;
        map[ ransomNote[i].charCodeAt(0) - base] --
    }

    return true
};
```

## 四数之和

> 给你四个整数数组 nums1、nums2、nums3 和 nums4 ，数组长度都是 n ，请你计算有多
> 少个元组 (i, j, k, l) 能满足

```ts
  function fourSumCount(nums1: number[], nums2: number[], nums3: number[], nums4: number[]): number {
  let sumMap = new Map,count = 0;
  for(let n of nums1){
    for(let m of nums2){
      let sum = n + m
      sumMap.set(sum,(sumMap.get(sum) || 0) + 1 )
    }
  }

  for(let n of nums3){
    for(let m of nums4){
      let sum = n + m;
      count+= (sumMap.get(0- sum) || 0)
    }
  }
  return count;
};
```

## 三数之和

> 给你一个包含 n 个整数的数组 nums，判断 nums 中是否存在三个元素 a，b，c ，使得
> a + b + c = 0 ？请你找出所有满足条件且不重复的三元组

- 给定数组 nums = [-1, 0, 1, 2, -1, -4]，输出： [ [-1, 0, 1], [-1, -1, 2] ]

<img src="@img/15.三数之和.gif"/>

由于是需要不重复,所以需要排序,而且对于这种多个数的组成的结果,一定要固定几位,然后
只去移动两位

### 去重逻辑

其实主要考虑三个数的去重。 a, b ,c, 对应的就是 nums[i]，nums[left]，nums[right]
a 如果重复了怎么办，a 是 nums 里遍历的元素，那么应该直接跳过去。但这里有一个问题
，是判断 nums[i] 与 nums[i + 1]是否相同，还是判断 nums[i] 与 nums[i-1] 是否相同
。  


::: tip  🔥 其实可以这样思考：
  当 left 前进的时候,如果遍历到了 `left` 的时候，那么 `left - 1` 必然已经取过了，所以只需要判断 `num[left] == num[left - 1]`,就可以跳过重复  

  同理的，当 right 前进的时候，如果遍历到了 `right` 的时候，那么 `right + 1` 必然已经取过了，所以只需要判断 `num[right] == num[right + 1]`,就可以跳过重复
:::


```js
/**
* @param {number[]} nums
* @return {number[][]}
*/
const threeSum = function(nums) {
  // 用于存放结果数组
  let res = [] 
    // 给 nums 排序
  nums = nums.sort((a,b)=>{
      return a-b
  })
  // 缓存数组长度
  const len = nums.length
  // 注意我们遍历到倒数第三个数就足够了，因为左右指针会遍历后面两个数
  for(let i=0;i<len-2;i++) {
      // 左指针 j
      let j=i+1 
      // 右指针k
      let k=len-1   
      // 如果遇到重复的数字，则跳过
      if(i>0&&nums[i]===nums[i-1]) {
          continue
      }

      while(j<k) {
          // 三数之和小于0，左指针前进
          if(nums[i]+nums[j]+nums[k]<0){
              j++
             // 处理左指针元素重复的情况
             while(j<k&&nums[j]===nums[j-1]) {
                  j++
              }
          } else if(nums[i]+nums[j]+nums[k]>0){
              // 三数之和大于0，右指针后退
              k--
             // 处理右指针元素重复的情况
             while(j<k&&nums[k]===nums[k+1]) {
                  k--
              }
          } else {
              // 得到目标数字组合，推入结果数组
              res.push([nums[i],nums[j],nums[k]])
              
              // 左右指针一起前进
              j++  
              k--
             
              // 若左指针元素重复，跳过
              while(j<k&&nums[j]===nums[j-1]) {
                  j++
              }  
             
             // 若右指针元素重复，跳过
             while(j<k&&nums[k]===nums[k+1]) {
                  k--
              }
          }
      }
  }
  
  // 返回结果数组
  return res
};
```