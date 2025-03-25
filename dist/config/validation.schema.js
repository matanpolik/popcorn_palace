"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationSchema = void 0;
const Joi = require("joi");
exports.validationSchema = Joi.object({
    PORT: Joi.number().default(3000),
    NODE_ENV: Joi.string()
        .valid('development', 'production', 'test')
        .default('development'),
    DB_HOST: Joi.string().default('localhost'),
    DB_PORT: Joi.number().default(5432),
    DB_USERNAME: Joi.string().default('popcorn-palace'),
    DB_PASSWORD: Joi.string().default('popcorn-palace'),
    DB_NAME: Joi.string().default('popcorn-palace'),
    SWAGGER_ENABLED: Joi.boolean().default(true),
});
//# sourceMappingURL=validation.schema.js.map