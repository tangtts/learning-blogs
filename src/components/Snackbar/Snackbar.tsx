import { mountInstance } from "utils/components"
import { reactive, Teleport, Transition, TransitionGroup } from "vue"
import "./index.scss";
import { isVitepress } from "@/utils/elements";

type SnackbarOptions = {
  show?: boolean,
  content: string | number,
  onclose?: () => void
}
type UniqSnackbarOptions = {
  id: number
  reactiveSnackOptions: Required<SnackbarOptions>
}


let uniqSnackbarOptions: Array<UniqSnackbarOptions> = reactive<UniqSnackbarOptions[]>([])

const removeUniqOption = (element: Element) => {
  const id = element.getAttribute('data-id')
  const option = uniqSnackbarOptions.find((option) => option.id === Number(id))
  if (!option) return;
  option.reactiveSnackOptions.onclose?.()
}
let isMount = false
let sid = 0
const TransitionGroupHost: Component = {
  setup() {
    return () => {
      const snackbarList = uniqSnackbarOptions.map(({ id, reactiveSnackOptions }) => {
        const style = {
          marginTop: '15px',
        } as any;

        setTimeout(() => {
          reactiveSnackOptions.show = false
        }, 2000)

        return (
          <Transition name="fade" key={id}
            onAfterLeave={removeUniqOption}>
            {
              reactiveSnackOptions.show ? <div key={id} data-id={id} style={style} class="w-2/5 py-3 mx-auto bg-blue-500 text-white text-center">
                {id}
              </div> : <div></div>
            }
          </Transition>
        )
      })
      return (
        <Teleport to={isVitepress() ? '.VPNav':  'body' }>
          <TransitionGroup>
            {snackbarList}
          </TransitionGroup>
        </Teleport>
      )
    }
  }
}

export default function Snackbar(options: SnackbarOptions) {

  let reactiveSnackOptions = reactive<UniqSnackbarOptions['reactiveSnackOptions']>({
    show: false,
    onclose: () => { },
    ...options
  });

  reactiveSnackOptions.show = true;

  if (!isMount) {
    isMount = true
    mountInstance(TransitionGroupHost)
  }
  const uniqSnackbarOptionItem: UniqSnackbarOptions = {
    id: sid++,
    reactiveSnackOptions,
  }

  uniqSnackbarOptions.push(uniqSnackbarOptionItem)
}
