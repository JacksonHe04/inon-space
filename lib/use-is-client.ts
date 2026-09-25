import { useSyncExternalStore } from 'react';

/* 没有外部状态要订阅，只是借这个 API 拿到「现在跑在客户端吗」这个事实。
   三个函数都提到模块顶层：每次渲染新建引用会让 React 反复重订阅。 */
const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * 是不是已经跑在客户端。
 *
 * 替代 `const [mounted, setMounted] = useState(false); useEffect(() => setMounted(true), [])` ——
 * 那种写法在 effect 里同步 setState，会触发一次多余的级联渲染，React Compiler 会直接报错。
 *
 * 用途是「只有客户端才算得准的东西」：比如按访客本地时区格式化的时间戳 ——
 * 服务端算出来的是服务器时区，直接渲染必然水合不上。
 */
export function useIsClient(): boolean {
  return useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
}
