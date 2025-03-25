"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationFailedException = exports.EntityAlreadyExistsException = exports.EntityNotFoundException = void 0;
const common_1 = require("@nestjs/common");
class EntityNotFoundException extends common_1.NotFoundException {
    constructor(entityName) {
        super(`${entityName}`);
    }
}
exports.EntityNotFoundException = EntityNotFoundException;
class EntityAlreadyExistsException extends common_1.ConflictException {
    constructor(message) {
        super(message);
    }
}
exports.EntityAlreadyExistsException = EntityAlreadyExistsException;
class ValidationFailedException extends common_1.BadRequestException {
    constructor(message) {
        super(message);
    }
}
exports.ValidationFailedException = ValidationFailedException;
//# sourceMappingURL=custom-exceptions.js.map