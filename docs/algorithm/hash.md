
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