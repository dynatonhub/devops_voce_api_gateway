import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerModule } from '@nestjs/swagger/dist';
import { NestExpressApplication } from '@nestjs/platform-express';
import { resolve } from 'path';
import { LogInterceptor } from './interceptors/log.interceptor';
import * as basicAuth from 'express-basic-auth';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setBaseViewsDir(resolve('./src/views'));
  app.useStaticAssets(resolve('./src/public'));
  app.setViewEngine('hbs');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  //init swagger
  app.use(
    ['/api/v1/doc', '/api/v1/doc/*'],
    basicAuth({ challenge: true, users: { [process.env.SWAGGER_USERNAME]: process.env.SWAGGER_PASSWORD } }),
  );
  const options = new DocumentBuilder()
    .setTitle('API Gateway')
    .setDescription(
      `A API Gateway do Swagger é uma ferramenta que atua como ponto de entrada para as APIs de uma aplicação,
     facilitando a sua gestão e integração. Ela oferece recursos como autenticação, autorização, monitoramento e controle de tráfego.
     Através do Swagger, é possível documentar e expor as APIs de forma padronizada e interativa.
     A API Gateway também permite o roteamento e redirecionamento de solicitações para os serviços apropriados.
     Com essa solução, é possível simplificar o acesso e o gerenciamento das APIs, garantindo uma melhor experiência para os desenvolvedores e usuários finais.
     <section>
     <center><h3>Modelo</h3></center>
     <center><img src="/swagger/diagrama.svg"></center>
     </section>
     <hr></hr>
     <section>
     <center style="margin-top:'40px'"><h3>ERD - (Diagrama de entidade relacionamento)</h3></center>
     <center><img src="/swagger/erd.svg"></center>
     </section>
     `,
    )
    .setVersion('1.0')
    .setBasePath('api/v1')
    // .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    // .setExternalDoc('Documentação', 'https://voce.com.br')
    // .setContact('Voce', 'https://voce.com.br', 'contato@voce.com.br')
    // .addTag('API Gateway')
    .addBearerAuth(
      {
        name: 'JWT',
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
        description: 'JWT token',
      },
      'JWT',
    )
    .build();
  const document = SwaggerModule.createDocument(app, options);
  const custom = {
    customSiteTitle: 'Voce API - Swagger',
    customCssUrl: '/swagger/theme-feeling-blue.css',
    customCss: `
    .topbar-wrapper a img {content: url("/voce_logo.svg");} 
    .swagger-ui .topbar {  background-color: #040404}
    .swagger-ui button.btn, .opblock-summary-method, .opblock, .content-type, .microlight, .modal-ux, input{ border-radius: 8px !important;}
    .scheme-container {background-color: #fafafa !important;}`,
    customfavIcon: '/swagger/favicon.ico',
    swaggerOptions: {
      docExpansion: 'none',
      showRequestDuration: true,
    },
  };
  SwaggerModule.setup('api/v1/doc', app, document, custom);
  app.enableCors();
  app.useGlobalInterceptors(new LogInterceptor());
  await app.listen(process.env.PORT || 3000);
  // console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
