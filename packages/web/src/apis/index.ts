import type { WebApis } from 'core'
import type { controllers } from '../../../server/src/api'

/**
 * 不能直接传递 controllers 参数，会将后端源码暴露在前端中，所以这里使用后端生成反射数据后，再进行传递解析
 */
// @ts-ignore
export const apis: WebApis<typeof controllers> = {} as any
