import {
  IsBoolean,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";

export class AddressDto {
  @IsOptional() @IsString() @MaxLength(255) fullName?: string;
  @IsOptional() @IsString() @MaxLength(255) phone?: string;
  @IsOptional() @IsString() @MaxLength(255) line1?: string;
  @IsOptional() @IsString() @MaxLength(255) line2?: string;
  @IsOptional() @IsString() @MaxLength(255) city?: string;
  @IsOptional() @IsString() @MaxLength(255) department?: string;
  @IsOptional() @IsString() @MaxLength(30) ci?: string;
  @IsOptional() @IsString() notes?: string;
  @IsOptional() @IsBoolean() isDefault?: boolean;
}
