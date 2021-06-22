import {
  Application,
  Router,
  send,
} from "https://deno.land/x/oak@v7.6.3/mod.ts";
import { verify, create } from "https://deno.land/x/djwt@v2.2/mod.ts";
import * as s from "https://deno.land/x/scrypt@v2.0.0/mod.ts";
import { UserDB, LoginForm, RegisterForm } from "./types.ts";

const secret = "nsatoienarstunsarietnseitnarsientesrntoin";
//using in memory db
const userDB: UserDB = {};

//example user
(async () => {
  userDB.upwork = {
    name: "test",
    email: "test@test.com",
    pos: "Developer",
    password: await s.hash("upwork"),
    devices: [],
  };
})();

const authRouter = new Router({ prefix: "/api" })
  .post("/token_refresh", async (ctx) => {
    const refreshToken = ctx.cookies.get("rt")!;
    const { iss } = await verify(refreshToken, secret, "HS512");

    //check if refresh token is in the device list
    if (
      !userDB[iss!].devices.some(async (e) => await s.verify(refreshToken, e))
    )
      throw "Invalid Refresh Token";

    const acessToken = await newJwt(iss!, 5);
    ctx.response.body = `Bearer ${acessToken}`;
  })
  .post("/login", async (ctx) => {
    const { name, password }: LoginForm = await ctx.request.body().value;
    if (!(await s.verify(password, userDB[name].password)))
      throw "bad password";

    const refreshToken = await newJwt(name, 60 * 24);
    const acessToken = await newJwt(name, 5);

    ctx.cookies.set("rt", refreshToken, { sameSite: "lax" });
    userDB[name].devices.push(await s.hash(refreshToken));
    ctx.response.body = `Bearer ${acessToken}`;
  })
  .post("/logout", async (ctx) => {
    const refreshToken = ctx.cookies.get("rt")!;
    const { iss } = await verify(refreshToken, secret, "HS512");

    //remove refresh token from devices
    userDB[iss!].devices = userDB[iss!].devices.filter(
      async (e) => !(await s.verify(refreshToken, e))
    );

    ctx.cookies.delete("rt");
    ctx.response.body = "OK";
  })
  .post("/register", async (ctx) => {
    const user: RegisterForm = await ctx.request.body().value;
    if (userDB[user.name]) throw `${user.name} already exists`;

    userDB[user.name] = {
      ...user,
      password: await s.hash(user.password),
      devices: [],
    };
    ctx.response.body = "OK";
  });

const privRouter = new Router({ prefix: "/api" }).get(
  "/hashedPass",
  async (ctx) => {
    const acessToken = ctx.request.headers
      .get("Authorization")!
      .replace("Bearer ", "");
    const { iss } = await verify(acessToken, secret, "HS512");

    ctx.response.body = JSON.stringify(userDB[iss!]);
  }
);

//middle ware (non associative)
const app = new Application()
  //error handling
  .use(async (ctx, next) => {
    try {
      console.log(ctx.request.headers);
      await next();
    } catch (e) {
      console.error(e);
      ctx.response.status = 401;
      ctx.response.body = JSON.stringify(e);
    }
  })
  //routes
  .use(privRouter.routes())
  .use(authRouter.routes())
  //static files
  .use(async (ctx) => {
    if (
      [".js", ".css", ".json", ".ico"].some((extension) =>
        ctx.request.url.pathname.endsWith(extension)
      )
    ) {
      await ctx.send({ root: `${Deno.cwd()}/client/build` });
    } else {
      await ctx.send({
        root: `${Deno.cwd()}/client/build`,
        path: "index.html",
      });
    }
  });

await app.listen({ port: 8000 });

function newJwt(name: string, minutes: number) {
  return create(
    { alg: "HS512", typ: "JWT" },
    { iss: name, exp: Date.now() + minutes * 60000 },
    secret
  );
}
