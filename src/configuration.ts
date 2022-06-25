import { Configuration, App } from '@midwayjs/decorator';
import * as koa from '@midwayjs/koa';
import * as validate from '@midwayjs/validate';
import * as info from '@midwayjs/info';
import * as orm from '@midwayjs/orm';
import { join } from 'path';
import { JwtMiddleware } from './middleware/jwt.middleware'
import { IMidwayContainer } from '@midwayjs/core';
import * as jwt from '@midwayjs/jwt';
@Configuration({
  imports: [
    koa,
    validate,
    orm,
    jwt,
    {
      component: info,
      enabledEnvironment: ['local'],
    },
  ],
  importConfigs: [join(__dirname, './config')],
})
export class ContainerLifeCycle {
  @App()
  app: koa.Application;

  async onReady(applicationContext: IMidwayContainer) {
    // add middleware
    console.log('onReady....');
    this.app.useMiddleware([JwtMiddleware]);

    // add filter
    // this.app.useFilter([NotFoundFilter, DefaultErrorFilter]);
  }
}
