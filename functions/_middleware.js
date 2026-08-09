export async function onRequest({ request, env }) {
  const authHeader = request.headers.get('authorization')
  const user = env.BASIC_USER
  const pass = env.BASIC_PASS

  if (!user || !pass) return new Response("未配置访问账号", { status: 500 })

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return new Response('需要登录', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="站点访问"' }
    })
  }

  const base64 = authHeader.split(' ')[1]
  const [reqUser, reqPass] = atob(base64).split(':')

  if (reqUser !== user || reqPass !== pass) {
    return new Response('账号密码错误', { status: 401 })
  }

  return await env.next(request)
}
