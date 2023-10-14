import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  @ApiProperty()
  refreshToken: string;
  @ApiProperty()
  email: string;
}
