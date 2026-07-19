import {
  Controller,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { UploadService } from "./upload.service";

@ApiTags("upload")
@ApiBearerAuth()
@Controller("upload")
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FilesInterceptor("files", 10, { limits: { fileSize: 10 * 1024 * 1024 } }),
  )
  @ApiOperation({ summary: "Subir ficheros a Cloudinary (multipart, campo files)" })
  upload(@UploadedFiles() files: Express.Multer.File[]) {
    // Respuesta = array plano, como el plugin upload de Strapi
    return this.uploadService.uploadFiles(files ?? []);
  }
}
