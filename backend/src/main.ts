import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const theme = new SwaggerTheme();

  const config = new DocumentBuilder()
    .setTitle('Backoffice Athor')
    .setDescription('API del backoffice de Athor')
    .setVersion('1.0')
    // .addTag('cats')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory, {
    customCss: theme.getBuffer(SwaggerThemeNameEnum.DARK),
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
