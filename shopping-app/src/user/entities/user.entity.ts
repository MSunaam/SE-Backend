import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../dto/userRoles.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({
    required: false,
    select: false,
  })
  @ApiProperty({
    description: 'The id of the User',
  })
  id: string;

  @Prop({
    required: true,
  })
  @ApiProperty({
    description: 'The first name of the User',
  })
  fistName: string;

  @Prop({
    required: true,
  })
  @ApiProperty({
    description: 'The last name of the User',
  })
  lastName: string;

  @Prop({
    required: true,
  })
  @ApiProperty({
    description: 'The email of the User',
    required: true,
  })
  email: string;

  @Prop({
    required: false,
    select: false,
  })
  @ApiProperty({
    description: 'The password of the User',
    required: true,
  })
  password: string;

  @Prop({
    required: false,
  })
  @ApiProperty({
    description: 'The address of the User',
  })
  address: string;

  @Prop({
    required: false,
  })
  @ApiProperty({
    description: 'The phone of the User',
  })
  phone: string;

  @Prop({
    required: true,
    enum: ['admin', 'customer'],
  })
  @ApiProperty({
    description: 'The role of the User',
    enum: ['admin', 'customer'],
  })
  role: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);
