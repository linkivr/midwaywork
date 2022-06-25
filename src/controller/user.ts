import { Inject, Controller ,Post,Body,Config,Get,Query} from '@midwayjs/decorator';
import { Context } from '@midwayjs/koa';
import { UserEntity } from '../entity/user.entity';
import { UserService } from '../service/user.service';
import { JwtService } from '@midwayjs/jwt';
let utils = require('../utils/utils')

@Controller('/api/user')
export class APIController {

  @Inject()
  jwtService: JwtService;

  @Config('jwt')
  jwtConfig;

  @Inject()
  ctx: Context;

  @Inject()
  userService: UserService;

 
   /*
  * 用户登录接口
  */
  @Post('/login')
  async login(@Body() user: UserEntity) {
    console.log('login',user);
    
    //1、通用用户名和密码验证
    const result = await this.userService.getUserByUsernameAndPassword(user.username,user.password);
    if(result)
    {
      //1.1登录成功
      //jest设置超时1000毫秒，测试超时失败，设置2000
      await utils.sleep(100)
      //result 不加{} 会报错 Expected "payload" to be a plain object.
      //1.2生成token
      let token = await this.jwtService.sign({result},
      this.jwtConfig.secret, {
          expiresIn: this.jwtConfig.expiresIn
      });
      //1.3 返回前端
      return { code: 200, result: 'success', message: '登录成功',data: { token}}; 
    }
    else
    {
      //1.4、登录失败，返回前端
      return { code: 400, result: 'error', message: '账号或密码不正确', data: null}; 
    }
   
  }

  
   /*
  * 查询用户接口，通过用户id查询用户
  */
   @Get('/getUser')
   async getUser(@Query('id') id: number) {
     console.log('getUser id='+id);
     //1、通用service查询用户
     const userResult = await this.userService.getUser(id);
     console.log('getUser userResult=',userResult);
     if(userResult)
     {
        //1.1 安全起见，密码删除
        delete userResult.password
        //1.2 查询成功 返回前端
        return { code: 200, result: 'success', message: '操作成功',user:userResult}; 
     }
     else
     {
        //1.3、查询失败，返回前端
        return { code: 400, result: 'error', message: '查询失败', user: null}; 
     }
    
   }

  /*
  * 添加用户接口
  */
  @Post('/addUser')
  async addUser(@Body() user: UserEntity) {
    console.log('addUser',user);
    
    //1、首先判断用户是否存在
    let checkResult = await this.userService.checkUserIsExisted(user.username);
    if(checkResult)
    {
      //1.1 用户已存在
      return { code:400, result: 'error', message: '用户已存在' };
    }
    else
    {
      //1.2 用户不存在，执行保存
      const result = await this.userService.addUser(user);
      return { code:200, result:'success', message: '操作成功',user:result };
    }
  }
}
