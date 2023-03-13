/**
 * @Description:
 * @Author: Lau
 * @Date: 2022/3/15 2:26 PM
 */
import * as components from '@element-plus/icons-vue'

export default {
  install: (app: any) => {
    Object.keys(components).forEach((key) => {
      app.component(key, components[key as keyof typeof components])
    })
  },
}
