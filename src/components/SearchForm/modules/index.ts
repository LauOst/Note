/**
 * @Description:
 * @Date: 2022/9/13 1:47 PM
 */
import { Component } from 'vue'

interface FileType {
  [key: string]: Component
}

const files: Record<string, FileType> = import.meta.glob('./*.vue', { eager: true })
const modules: any = {}
Object.keys(files).forEach((c: string) => {
  const fileName = c.replace(/(.*\/)*([^.]+).*/gi, '$2')
  modules[fileName] = files[c]?.default
})
export default modules
