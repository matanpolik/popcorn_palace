import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
export declare class EntityNotFoundException extends NotFoundException {
    constructor(entityName: string);
}
export declare class EntityAlreadyExistsException extends ConflictException {
    constructor(message: string);
}
export declare class ValidationFailedException extends BadRequestException {
    constructor(message: string);
}
