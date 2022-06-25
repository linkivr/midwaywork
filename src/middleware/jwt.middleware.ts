import { Inject, Middleware } from '@midwayjs/decorator';
import { Context, NextFunction } from '@midwayjs/koa';
import { httpError } from '@midwayjs/core';
import { JwtService } from '@midwayjs/jwt';


@Middleware()
export class JwtMiddleware {
  @Inject()
  jwtService: JwtService;

  public static getName(): string {
    return 'jwt';
  }

  resolve() {
    console.log('jwtmiddleware...');
    return async (ctx: Context, next: NextFunction) => {
      // 判断下有没有校验信息
      if (!ctx.headers['authorization']) {
        throw new httpError.UnauthorizedError();
      }
      // 从 header 上获取校验信息
      const parts = ctx.get('authorization').trim().split(' ');
      console.log('authorization',parts);

      if (parts.length !== 2) {
        throw new httpError.UnauthorizedError();
      }

      const [scheme, token] = parts;
      
      if (/^Bearer$/i.test(scheme)) {
        try {
          //jwt.verify方法验证token是否有效
          // let userToken =  await this.jwtService.verify(token, {
          //                       complete: true,
          //                       });

          await this.jwtService.verify(token, {
            complete: true,
            });

          //console.log('verify success userToken',userToken);            
          const result = await next();
          // 返回给上一个中间件的结果
          return result;
          //return userToken;
        } 
        catch (error) {
          console.log('verify error ',error);          
          /*
          //token过期 生成新的token
          const newToken = getToken(user);
          //将新token放入Authorization中返回给前端
          ctx.set('Authorization', newToken);
          */
        }
      }
    };
  }

  // 配置忽略鉴权的路由地址
  public match(ctx: Context): boolean {
    console.log('path=',ctx.path);
    //因采用内存数据库，故将添加用户也作为非鉴权地址
    const ignore = ctx.path.indexOf('/api/user/login') !== -1 
    ||  ctx.path.indexOf('/api/user/addUser') !== -1 
    // ||  ctx.path.indexOf('/api/user/getUser') !== -1;
    return !ignore;
  }
}