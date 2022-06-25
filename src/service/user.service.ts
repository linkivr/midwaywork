import { Provide } from '@midwayjs/decorator';
//import { IUserOptions } from '../interface';
import { UserEntity } from '../entity/user.entity';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository } from 'typeorm';

@Provide()
export class UserService {
  @InjectEntityModel(UserEntity)
  userRepo: Repository<UserEntity>;

  /*
    通过用户名和密码获取用户
  */
  async getUserByUsernameAndPassword(username:string, password:string): Promise<UserEntity> {
    return await this.userRepo.findOne({ where : { username, password }})
  }
 
  /*
    获取所有用户
  */
  async getUsers(): Promise<UserEntity[]> {
    return await this.userRepo.find({});
  }
  
  /*
    通过ID获取用户
  */
  async getUser(id:number): Promise<UserEntity> {
    return await this.userRepo.findOne({where: { id }});
  }

  /*
    判断用户是否存在,用户名不允许重复
  */
  async checkUserIsExisted(username:string) :Promise<boolean> {
    const userTemp = await this.userRepo.findOne({where:{username}})
    if(userTemp)
    {
      return true;
    }
    return false;
  }

   /*
    新增用户，返回新增后用户对象
  */
  async addUser(user:UserEntity) {
   
    const userResult = await this.userRepo.save(user);
    return userResult;
  }
}
