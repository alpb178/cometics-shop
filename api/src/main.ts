import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  // Mismo prefijo que Strapi: los clientes llaman /api/...
  app.setGlobalPrefix("api");

  app.useGlobalPipes(
    new ValidationPipe({
      // whitelist sin forbid: los campos no declarados se descartan en
      // silencio, como hacían las whitelists de los controllers de Strapi
      whitelist: true,
      transform: true,
    }),
  );

  const corsOrigins = config
    .get<string>("CORS_ORIGINS", "http://localhost:3000,http://localhost:3001")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
  app.enableCors({ origin: corsOrigins, credentials: true });

  const swaggerConfig = new DocumentBuilder()
    .setTitle("Iris Natural API")
    .setDescription("API de la tienda Iris Natural")
    .setVersion("0.1.0")
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("docs", app, document);

  const port = config.get<number>("API_PORT", 4000);
  await app.listen(port);
  console.log(`API escuchando en http://localhost:${port} (docs en /docs)`);
}

bootstrap();
