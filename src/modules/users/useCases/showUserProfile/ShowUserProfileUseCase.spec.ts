import { User } from "@modules/users/entities/User"
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository"
import { AppError } from "@shared/errors/AppError"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { ICreateUserDTO } from "../createUser/ICreateUserDTO"
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase"

describe("show user profile", () => {

  let createUsersRepositoryInMemory: InMemoryUsersRepository
  let createUserUseCase: CreateUserUseCase
  let showUserProfileUseCase: ShowUserProfileUseCase

  beforeEach(() => {
    createUsersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(
      createUsersRepositoryInMemory
    )
    showUserProfileUseCase = new ShowUserProfileUseCase(
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

    const profile = await showUserProfileUseCase.execute(createdUser.id);

    expect(profile).toBeInstanceOf(User);
    expect(createdUser).toHaveProperty("id")
    expect(createdUser).toHaveProperty("name")
    expect(createdUser).toHaveProperty("email")
    expect(createdUser).toHaveProperty("password")

  })

  it("should not be able to authenticate with wrong email", async () => {

    const id = "test"

    expect(async () => {
      await showUserProfileUseCase.execute(id);
    }).rejects.toEqual(new AppError("User not found", 404));

  })


})

