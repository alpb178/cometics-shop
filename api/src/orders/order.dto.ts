import { Type } from "class-transformer";
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from "class-validator";

export const ALLOWED_STATUSES = [
  "pending_verification",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
] as const;

export class OrderItemInputDto {
  @IsInt() @Min(1) productId!: number;
  @IsInt() @Min(1) quantity!: number;
  @IsOptional() @IsString() imageUrl?: string;
  // name/slug/price los manda el front pero se recalculan server-side
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() slug?: string;
  @IsOptional() @IsNumber() price?: number;
}

export class CreateOrderDto {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => OrderItemInputDto)
  items!: OrderItemInputDto[];

  @IsOptional() @IsInt() shippingAddress?: number | null;

  @IsIn(["delivery", "pickup"]) deliveryMethod!: string;

  @IsIn(["cash", "qr"]) paymentMethod!: string;

  @IsOptional() @IsInt() paymentProof?: number | null;

  @IsOptional() @IsString() customerNotes?: string;

  @IsOptional() @IsString() @MaxLength(120) paymentReference?: string;

  // Entradas del cálculo de envío; se verifican, no se confía en ellas
  @IsOptional() @IsNumber() destLat?: number | null;
  @IsOptional() @IsNumber() destLng?: number | null;
  @IsOptional() @IsBoolean() isProvince?: boolean;

  // El front los envía pero siempre se recalculan server-side
  @IsOptional() @IsNumber() subtotal?: number;
  @IsOptional() @IsNumber() total?: number;
}

export class UpdateOrderDto {
  @IsOptional() @IsIn([...ALLOWED_STATUSES]) status?: string;
  @IsOptional() @IsString() customerNotes?: string;
  @IsOptional() @IsString() cancellationReason?: string;
}
