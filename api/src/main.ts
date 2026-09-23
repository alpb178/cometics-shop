import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  // Same prefix as Strapi: clients call /api/...
  app.setGlobalPrefix("api");

  app.useGlobalPipes(
    new ValidationPipe({
      // whitelist without forbid: undeclared fields are silently dropped,
      // like the Strapi controllers' whitelists did
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
    .setDescription("Iris Natural store API")
    .setVersion("0.1.0")
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("docs", app, document);

  const port = config.get<number>("API_PORT", 4000);
  await app.listen(port);
  console.log(`API listening on http://localhost:${port} (docs at /docs)`);
}

bootstrap();
