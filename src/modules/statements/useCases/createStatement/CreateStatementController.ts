import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateStatementUseCase } from './CreateStatementUseCase';

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer'
}

export class CreateStatementController {
  async execute(request: Request, response: Response) {

    const { id: user_id } = request.user;
    const { amount, description } = request.body;
    const { dest_id } = request.query

    const splittedPath = request.originalUrl.split('/')

    let type = splittedPath[splittedPath.length - 1] as OperationType;

    if (type.includes("?")) {
      type = type.split("?")[0] as OperationType
    }

    const createStatement = container.resolve(CreateStatementUseCase);

    const statement = await createStatement.execute({
      user_id,
      type,
      amount,
      description,
      dest_id: String(dest_id)
    });

    return response.status(201).json(statement);
  }
}
