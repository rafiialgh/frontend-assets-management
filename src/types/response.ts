export type BaseResponse<T> = {
  data: T
  message: string
  status: string
}

export type UsersResponse<T> = {
  data: T
  summary: string,
  pagination: string,
  message: string
  status: string
}