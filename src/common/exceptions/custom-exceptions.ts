import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

export class EntityNotFoundException extends NotFoundException {
  constructor(entityName: string) {
    super(`${entityName}`);
  }
}

export class EntityAlreadyExistsException extends ConflictException {
  constructor(message: string) {
    super(message);
  }
}

export class ValidationFailedException extends BadRequestException {
  constructor(message: string) {
    super(message);
  }
}
