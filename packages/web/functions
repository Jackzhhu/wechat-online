export async function onRequest(context) {
  const USER = context.env.BASIC_USER;
  const PASS = context.env.BASIC_PASS;

  const authHeader = context.request.headers.get("authorization");
  if (!authHeader) {
    return new Response("需要登录验证", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="访问验证"' },
    });
  }

  const [_, base64] = authHeader.split(" ");
  const [username, password] = atob(base64).split(":");

  if (username !== USER || password !== PASS) {
    return new Response("账号密码错误", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="访问验证"' },
    });
  }

  return await context.next();
}
