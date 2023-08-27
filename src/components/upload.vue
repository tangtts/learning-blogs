<template>
  <div>
    <el-switch v-model="isDrag" class="mb-4" active-text="拖拽" inactive-text="点击"></el-switch>
    <div class="
    drag
   
    " v-if="isDrag" @drop.prevent="dragFile" @dragleave.prevent @dragover.prevent>
      <span>+</span>
    </div>
    <!-- label -->
    <div for="input" v-else>
      <!-- <span>选择文件 </span> -->
      <el-button @click="handleClick">选择文件</el-button>
      <input id="input" type="file" @change="changeFileInput" hidden :multiple="multiple" ref="inputRef">
    </div>

    <transition-group class="list" tag="div">
      <div v-for="file in filesRef" :key="file.uid" class="item">
        <img :src="file.url" class="img">
        <p class="name">{{ file.name }} </p>
        <div class="close" @click="deleteFile(file)">
          <p>❌</p>
        </div>
      </div>
    </transition-group>
  </div>
</template>
<script lang="ts" setup>
import { ref, shallowRef, watch } from 'vue';

export interface IUploadRawFile extends File {
  uid: number
}

export interface UploadFile {
  name: string
  size?: number
  uid: number
  url: string
  raw?: IUploadRawFile
}
const isDrag = ref(false);
const multiple = ref(false);
const limit = ref(Infinity);

const filesRef = ref<UploadFile[]>([])

// 限制 limit 数量
const onExceed = (file: File[], filesRef: UploadFile[]) => {
  console.log(file, filesRef)
}
// 上传之前
const onBeforeLoad = (file: IUploadRawFile) => {
  console.log(file)
  return true
}
// 上传成功
const onSuccess = (file: IUploadRawFile, filesRef: UploadFile[]) => {
  console.log(file, filesRef)
}

const dragFile = (e: DragEvent) => {
  if (!e.dataTransfer?.files) return;
  uploadFiles(Array.from(e.dataTransfer.files))
}

/**
 * 
 * @param e input 选择的 file
 */
const changeFileInput = (e: any) => {
  const files = (e.target as HTMLInputElement).files
  // 构建自己的对象
  if (!files) return
  uploadFiles(Array.from(files))
}

/**
 * @description 删除操作
 * @param delfile 要删除的文件
 */

const deleteFile = (delfile: UploadFile) => {
  filesRef.value = filesRef.value.filter(file => delfile.uid !== file.uid)
  URL.revokeObjectURL(delfile.url)
}


const uploadFiles = (files: File[]) => {
  if (files.length === 0) return;

  if (limit && filesRef.value.length + files.length > limit.value) {
    return onExceed(files, filesRef.value)
  }
  if (!multiple) {
    files = files.slice(0, 1)
  }

  for (const file of files) {
    const rawFile = file as IUploadRawFile;
    // 对原生 file 添加 uid
    rawFile.uid = genFileId();
    handleStart(rawFile)
    // 准备上传
    upload(rawFile);
  }
}

// 组装 file
const handleStart = (file: IUploadRawFile) => {
  let uploadFile: UploadFile = {
    size: file.size,
    url: URL.createObjectURL(file),
    raw: file,
    uid: file.uid,
    name: file.name
  }
  filesRef.value = [...filesRef.value, uploadFile]
}

const upload = (rawFile: IUploadRawFile) => {
  if (!onBeforeLoad) {
    return doUpload(rawFile)
  };

  let r = true;
  if (onBeforeLoad) {
    r = onBeforeLoad(rawFile)
    if (r) {
      doUpload(rawFile)
    }
  }
}

const doUpload = (file: IUploadRawFile) => {
  // 如果是 成功态的话不用 上传
  console.log("执行上传")
  onSuccess(file, filesRef.value)
}

const inputRef = shallowRef<HTMLInputElement>();

const handleClick = () => {
  // 清空 input 的value 值
  inputRef.value!.value = ''
  inputRef.value!.click()
}

/**
 * @return 生成唯一 uid
 */
function genFileId() {
  return Date.now()
}


</script>

<style lang="scss" scoped>
.drag {
  @apply h-[200px] aspect-square flex rounded border-2 border-dashed border-red-500 items-center justify-center cursor-pointer p-2 text-3xl
}

.list {
  @apply flex gap-7 mt-4;

  .item {
    @apply h-[200px] flex flex-col p-2 relative aspect-square rounded-sm border-dashed border-blue-400;

    .img {
      @apply object-contain h-full
    }

    .name {
      @apply truncate m-0 text-center text-green-600 mt-auto;
    }

    .close {
      @apply absolute inset-0 z-10 opacity-0 flex items-center justify-center text-4xl transition-opacity duration-300;

      p {
        @apply hidden cursor-pointer
      }
    }

    &:hover {
      @apply bg-white bg-opacity-80 border-red-300;

      .img,
      .name {
        @apply opacity-40;
      }

      .close {
        @apply opacity-100;

        p {
          @apply block
        }
      }
    }
  }
}
</style>