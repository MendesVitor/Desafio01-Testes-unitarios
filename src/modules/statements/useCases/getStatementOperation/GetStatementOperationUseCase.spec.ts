import { OperationType, Statement } from "@modules/statements/entities/Statement"
import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository"
import { User } from "@modules/users/entities/User"
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase"
import { ICreateUserDTO } from "@modules/users/useCases/createUser/ICreateUserDTO"
import { AppError } from "@shared/errors/AppError"
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase"
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO"
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase"


describe("Get Statement", () => {

  let createUsersRepositoryInMemory: InMemoryUsersRepository
  let createUserUseCase: CreateUserUseCase
  let createStatementRepositoryInMemory: InMemoryStatementsRepository
  let getStatementOperationUseCase: GetStatementOperationUseCase
  let createStatementUseCase: CreateStatementUseCase


  beforeEach(() => {
    createUsersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(
      createUsersRepositoryInMemory
    )
    createStatementRepositoryInMemory = new InMemoryStatementsRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      createUsersRepositoryInMemory,
      createStatementRepositoryInMemory
    )
    createStatementUseCase = new CreateStatementUseCase(
      createUsersRepositoryInMemory,
      createStatementRepositoryInMemory
    )
  })


  it("should be able to get a statement", async () => {

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

    const statement = await getStatementOperationUseCase.execute({ user_id: createdUser.id, statement_id: deposit.id })

    expect(statement).toBeInstanceOf(Statement);
    expect(deposit).toHaveProperty("amount")
    expect(deposit).toHaveProperty("type")

  })


  it("should not be able to get statement of a non existent user", async () => {

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

    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: "test",
        statement_id: deposit.id
      })
    }).rejects.toEqual(new AppError('User not found', 404))


  })

  it("should not be able to get statement a non existent statement", async () => {

    const user: ICreateUserDTO = {
      name: "Kyle Griffin",
      email: "lit@ritmener.wf",
      password: "1234"
    }

    const createdUser = await createUserUseCase.execute(user);


    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: createdUser.id,
        statement_id: "test"
      })
    }).rejects.toEqual(new AppError('Statement not found', 404))


  })


})

