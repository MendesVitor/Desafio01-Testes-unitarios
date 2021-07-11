import { OperationType, Statement } from "@modules/statements/entities/Statement"
import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository"
import { User } from "@modules/users/entities/User"
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase"
import { ICreateUserDTO } from "@modules/users/useCases/createUser/ICreateUserDTO"
import { AppError } from "@shared/errors/AppError"
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase"
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO"
import { GetBalanceUseCase } from "./GetBalanceUseCase"


describe("Get balance", () => {

  let createUsersRepositoryInMemory: InMemoryUsersRepository
  let createUserUseCase: CreateUserUseCase
  let statementRepositoryInMemory: InMemoryStatementsRepository
  let getBalanceUseCase: GetBalanceUseCase

  beforeEach(() => {
    createUsersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(
      createUsersRepositoryInMemory
    )
    statementRepositoryInMemory = new InMemoryStatementsRepository();
    getBalanceUseCase = new GetBalanceUseCase(
      statementRepositoryInMemory,
      createUsersRepositoryInMemory
    )
  })


  it("should be able to get balance", async () => {

    const user: ICreateUserDTO = {
      name: "Kyle Griffin",
      email: "lit@ritmener.wf",
      password: "1234"
    }

    const createdUser = await createUserUseCase.execute(user);

    const balance = await getBalanceUseCase.execute({ user_id: createdUser.id })

    expect(balance).toHaveProperty("statement")
    expect(balance).toHaveProperty("balance")

  })

  it("should not be able to get balance to a non existent user", async () => {

    const id = "test"

    expect(async () => {
      await getBalanceUseCase.execute({ user_id: id });
    }).rejects.toEqual(new AppError("User not found", 404));

  })


})

