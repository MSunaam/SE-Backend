import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, TestPassword } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBody, ApiTags, ApiConsumes } from '@nestjs/swagger';
import { log } from 'console';
import { FileInterceptor } from '@nestjs/platform-express';
import { initializeApp } from 'firebase/app';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('upload-dp')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',

      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
    required: true,
  })
  @UseInterceptors(FileInterceptor('file'))
  saveProfilePic(@UploadedFile() file: Express.Multer.File) {
    return this.userService.saveProfilePic(file);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete('db-test')
  @ApiBody({ type: TestPassword })
  removeUsers(@Body('password') password: string) {
    return this.userService.removeUsers(password);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
