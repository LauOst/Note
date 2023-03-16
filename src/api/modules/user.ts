import http from '@/api'
import { User } from '@/typings/api/modules/user'

export const userListApi = (params?: User.ReqUserParams) => {
  return http.get<User.ResUserList>(`/user/list`, params)
}
