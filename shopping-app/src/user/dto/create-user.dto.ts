import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from './userRoles.enum';

export class CreateUserDto {
  @ApiProperty({
    description: 'The first name of the User',
  })
  fistName: string;
  @ApiProperty({
    description: 'The last name of the User',
  })
  lastName: string;
  @ApiProperty({
    description: 'The email of the User',
    required: true,
  })
  email: string;
  @ApiProperty({
    description: 'The password of the User',
    required: true,
  })
  password: string;
  @ApiProperty({
    description: 'The address of the User',
  })
  address: string;
  @ApiProperty({
    description: 'The phone of the User',
  })
  phone: string;
  @ApiProperty({
    description: 'The role of the User',
    enum: ['admin', 'customer'],
  })
  role: UserRole;
}

export class TestPassword {
  @ApiProperty()
  password: string;
}
