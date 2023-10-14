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
import { getApp, initializeApp } from 'firebase/app';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from 'firebase/storage';
import { log } from 'console';

const firebaseConfig = {
  apiKey: 'AIzaSyD8d2zIFK2N3BMt7u8PsS00q_6rUBznQGQ',
  authDomain: 'shopping-app-eff81.firebaseapp.com',
  projectId: 'shopping-app-eff81',
  storageBucket: 'shopping-app-eff81.appspot.com',
  messagingSenderId: '1030756147479',
  appId: '1:1030756147479:web:c0b6b6bf74189bc08c5752',
  measurementId: 'G-57VRRGDNXF',
};

const app = initializeApp(firebaseConfig);

@Injectable()
export class UserService {
  saltOrRounds: number = 10;
  password: string = `1234abcd`;

  bucket: string = 'gs://shopping-app-eff81.appspot.com';

  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async saveProfilePic(file: Express.Multer.File) {
    file.originalname = `${Date.now()}_${file.originalname}`;

    const firebaseApp = getApp();
    const storage = getStorage(firebaseApp, this.bucket);
    const storageRef = ref(storage);

    const metadata = {
      contentType: `image/${file.mimetype.split('/')[1]}`,
    };

    const imageRef = ref(storageRef, `images/${file.originalname}`);

    const task = await uploadBytesResumable(imageRef, file.buffer, metadata);

    const url = await getDownloadURL(task.ref);
    return url;
  }

  removeUsers(password: string) {
    if (this.password !== password)
      throw new ForbiddenException('Invalid Password');
    return this.userModel.deleteMany({});
  }
  async create(createUserDto: CreateUserDto) {
    const user = await this.userModel.findOne({
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
