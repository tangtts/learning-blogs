import { styled } from '@styils/vue';

const modalDiv = styled("div",
  {
    color:'red',
  },
) 

const MessageBox = {
  props: {
    msg: {
      type: String,
      required: true
    },
  },
  render(ctx: { $props: any; $emit: any; }) {
    const { $props, $emit } = ctx;
    return (
      <modalDiv variants={{size:"small"}}>
        <div class="box">
          <div class="text" > {$props.msg} </div>
          <button onClick={$emit('onClick')} > 确定 </button>
        </div>
      </modalDiv>
    )
  }
}

function showMsg(msg: string, callback: (close:Function)=>void) {
  const div = document.createElement('div');
  const app = createApp(MessageBox, {
    msg,
    onClick: () => {
      callback(() => {
        app.unmount() // 卸载组件,防止内存泄漏
        div.remove() // 删除dom
      }) // 关闭弹窗
    }
  })
  document.body.appendChild(div)
  app.mount(div)
}
export default showMsg