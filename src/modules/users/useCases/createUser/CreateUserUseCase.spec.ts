import { User } from "@modules/users/entities/User"
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository"
import { AppError } from "@shared/errors/AppError"
import { CreateUserError } from "./CreateUserError"
import { CreateUserUseCase } from "./CreateUserUseCase"
import { ICreateUserDTO } from "./ICreateUserDTO"

describe("Create user", () => {

  let createUsersRepositoryInMemory: InMemoryUsersRepository
  let createUserUseCase: CreateUserUseCase

  beforeEach(() => {
    createUsersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(
      createUsersRepositoryInMemory
    )
  })


  it("should be able to create a new user", async () => {

    const user: ICreateUserDTO = {
      name: "Kyle Griffin",
      email: "lit@ritmener.wf",
      password: "1234"
    }

    const createdUser = await createUserUseCase.execute(user);

    expect(createdUser).toBeInstanceOf(User);
    expect(createdUser).toHaveProperty("name")
    expect(createdUser).toHaveProperty("email")
    expect(createdUser).toHaveProperty("password")

  })

  it("should not be able to create a new user with same email", async () => {

    const user: ICreateUserDTO = {
      name: "Kyle Griffin",
      email: "lit@ritmener.wf",
      password: "1234"
    }

    await createUserUseCase.execute(user);

    expect(async () => {
      await createUserUseCase.execute(user);
    }).rejects.toEqual(new AppError("User already exists"));


  })

})
