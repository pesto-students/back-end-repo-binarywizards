import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsString } from 'class-validator';

export class CreateTemplateDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Name should not be empty' })
  name: string;

  @ApiProperty()
  @IsObject()
  @IsNotEmpty({ message: 'Meta Data should not be empty' })
  metaData: object;

  @ApiProperty()
  @IsObject()
  @IsNotEmpty({ message: 'Form Schema should not be empty' })
  formSchema: object;

  @ApiProperty()
  @IsObject()
  @IsNotEmpty({ message: 'Template should not be empty' })
  template: object;
}
