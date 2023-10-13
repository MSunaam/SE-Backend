import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  saltOrRounds = 10;
  password = `1234abcd`;

  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  removeUsers(password: string) {
    if (this.password !== password)
      throw new ForbiddenException('Invalid Password');
    return this.userModel.deleteMany({});
  }
  async create(createUserDto: CreateUserDto) {
    const user = await this.userModel.find({
      email: createUserDto.email,
    });

    if (user) throw new ConflictException('User Already Exists');

    const newUser = new this.userModel(createUserDto);

    let pass: string = newUser.password;
    pass = await bcrypt.hash(pass, this.saltOrRounds);

    newUser.password = pass;

    await newUser.save();

    newUser.password = undefined;

    return newUser;
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
