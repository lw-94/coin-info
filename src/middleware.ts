// middleware.js
import { NextResponse } from 'next/server'

export async function middleware() {
  console.log('Middleware is running!')

  // 你可以在这里编写自定义的中间件逻辑
  // 例如:检查请求头、重定向、返回响应等

  return NextResponse.next()
}

// 可选: 指定中间件适用的路径
export const config = {
  matcher: ['/'],
}
