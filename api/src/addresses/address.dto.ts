import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
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
  // Último punto marcado en el mapa para esta dirección. El checkout lo usa
  // como posición inicial del pin en la siguiente compra.
  @IsOptional() @IsNumber() @Min(-90) @Max(90) lat?: number;
  @IsOptional() @IsNumber() @Min(-180) @Max(180) lng?: number;
}
