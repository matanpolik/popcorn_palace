"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const config_1 = require("@nestjs/config");
const app_module_1 = require("./app.module");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    if (configService.get('app.swagger.enabled')) {
        const swaggerConfig = new swagger_1.DocumentBuilder()
            .setTitle(configService.get('app.swagger.title'))
            .setDescription(configService.get('app.swagger.description'))
            .setVersion(configService.get('app.swagger.version'))
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
        swagger_1.SwaggerModule.setup(configService.get('app.swagger.path'), app, document);
    }
    const port = configService.get('app.port');
    await app.listen(port);
    console.log(`Application running on port ${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map