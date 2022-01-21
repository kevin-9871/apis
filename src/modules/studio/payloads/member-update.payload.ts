import { ApiProperty } from '@nestjs/swagger';
import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min
} from 'class-validator';
import { STUDIO_STATUES } from '../constants';

export class MemberSetActivePayload {
  @ApiProperty()
  @IsNotEmpty()
  @IsIn([STUDIO_STATUES.ACTIVE, STUDIO_STATUES.INACTIVE])
  @IsString()
  status: string;
}

export class UpdateCommissionPayload {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(100)
  commission: number;
}
