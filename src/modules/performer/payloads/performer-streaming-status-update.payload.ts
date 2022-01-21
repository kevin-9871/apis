import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PerformerStreamingStatusUpdatePayload {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  status: string;
}
