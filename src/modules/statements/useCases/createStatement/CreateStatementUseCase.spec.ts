import { OperationType, Statement } from "@modules/statements/entities/Statement"
import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository"
import { User } from "@modules/users/entities/User"
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase"
import { ICreateUserDTO } from "@modules/users/useCases/createUser/ICreateUserDTO"
import { AppError } from "@shared/errors/AppError"
import { CreateStatementUseCase } from "./CreateStatementUseCase"
import { ICreateStatementDTO } from "./ICreateStatementDTO"

describe("Create Statement", () => {

  let createUsersRepositoryInMemory: InMemoryUsersRepository
  let createUserUseCase: CreateUserUseCase
  let createStatementRepositoryInMemory: InMemoryStatementsRepository
  let createStatementUseCase: CreateStatementUseCase

  beforeEach(() => {
    createUsersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(
      createUsersRepositoryInMemory
    )
    createStatementRepositoryInMemory = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      createUsersRepositoryInMemory,
      createStatementRepositoryInMemory
    )
  })


  it("should be able to create a deposit", async () => {

    const user: ICreateUserDTO = {
      name: "Kyle Griffin",
      email: "lit@ritmener.wf",
      password: "1234"
    }

    const createdUser = await createUserUseCase.execute(user);

    const operation: ICreateStatementDTO = {
      user_id: createdUser.id,
      type: "deposit" as OperationType,
      amount: 100,
      description: "Test"

    }

    const deposit = await createStatementUseCase.execute(operation)

    expect(deposit).toBeInstanceOf(Statement);
    expect(deposit).toHaveProperty("amount")

  })

  it("should be able to create a withdraw", async () => {

    const user: ICreateUserDTO = {
      name: "Kyle Griffin",
      email: "lit@ritmener.wf",
      password: "1234"
    }

    const createdUser = await createUserUseCase.execute(user);



    await createStatementUseCase.execute({
      user_id: createdUser.id,
      type: "deposit" as OperationType,
      amount: 100,
      description: "Test"

    })

    const operation: ICreateStatementDTO = {
      user_id: createdUser.id,
      type: "withdraw" as OperationType,
      amount: 50,
      description: "Test"

    }

    const withdraw = await createStatementUseCase.execute(operation)

    expect(withdraw).toBeInstanceOf(Statement);
    expect(withdraw).toHaveProperty("amount")

  })

  it("should not be able to create a withdraw with insufficient funds", async () => {

    const user: ICreateUserDTO = {
      name: "Kyle Griffin",
      email: "lit@ritmener.wf",
      password: "1234"
    }

    const createdUser = await createUserUseCase.execute(user);


    expect(async () => {
      await createStatementUseCase.execute({
        user_id: createdUser.id,
        type: "withdraw" as OperationType,
        amount: 150,
        description: "Test"

      })
    }).rejects.toEqual(new AppError('Insufficient funds', 400))


  })

  it("should not be able to create statement to a non existent user", async () => {
    expect(async () => {
      await createStatementUseCase.execute({
        user_id: "test",
        type: "deposit" as OperationType,
        amount: 150,
        description: "Test"

      })
    }).rejects.toEqual(new AppError('User not found', 404))


  })


})

