import { createApp, close, createHttpRequest } from '@midwayjs/mock';
import { Framework,Application } from '@midwayjs/koa';

describe('test/controller/user.test.ts', () => {

  let app: Application;
  let token :string;
  //只创建一次 app，可以复用
  beforeAll(async () => {
    // create app
    app = await createApp<Framework>();
  });

  //所有测试用例执行完成后，关闭app
  afterAll(async () => {
    await close(app);
  });

  //1、添加用户测试用例
  it('1、should POST /api/user/addUser', async () => {
    //1.1、发起添加用户请求
    const result =await createHttpRequest(app).post('/api/user/addUser').send({ username: 'jack',password:'redballoon' });

    //1.2、使用断言测试
    expect(result.status).toBe(200);
    expect(result.body.code).toBe(200);
    expect(result.body.result).toBe('success');

  });

  //2、登录成功测试用例
  it('2、should POST /api/user/login succ', async () => {
    //2.1、发起登录请求
    const result =await createHttpRequest(app).post('/api/user/login').send({ username: 'jack',password:'redballoon' });

    //2.2、使用断言测试
    expect(result.status).toBe(200);
    expect(result.body.code).toBe(200);
    expect(result.body.result).toBe('success');
    expect(result.body.data.token.length).toBeGreaterThan(10);
    token = result.body.data.token;
  });

   //3、登录失败测试用例
   it('3、should POST /api/user/login fail', async () => {
    //3.1、发起登录请求
    const result =await createHttpRequest(app).post('/api/user/login').send({ username: 'rose',password:'whiteballoon' });

    //3.2、使用断言测试
    expect(result.status).toBe(200);
    expect(result.body.code).toBe(400);
    expect(result.body.result).toBe('error');
   
  });

  //4、查询用户测试用例
  it('4、should Get /api/user/getUser fail', async () => {
    //4.1、发起查询请求
    console.log('token=',token)                                              
    const result =await createHttpRequest(app).get('/api/user/getUser').set('Authorization', 'Bearer '+token).query({ id: 1});

    //4.2、使用断言测试
    expect(result.status).toBe(200);
    expect(result.body.code).toBe(200);
    expect(result.body.result).toBe('success');
   
  });
});
