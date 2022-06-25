import { MidwayConfig } from '@midwayjs/core';
//import path = require('path');
export default {
  // use for cookie sign key, should change to your own and keep security
  keys: '1656141423829_8626',
  koa: {
    port: 7001,
  },
  jwt: {
    secret: 'jwtdemostr', // 秘钥
    expiresIn: '2d', // 有效期
  },
  orm:{
      type: "sqlite",
      database: ":memory:",
      dropSchema: true,//每次启动，drop表结构
      //database: path.join(__dirname, '../../test.sqlite'),
      synchronize: true,
      logging: false

  }
} as MidwayConfig;
