import { User } from "@modules/users/entities/User"
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository"
import { AppError } from "@shared/errors/AppError"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { ICreateUserDTO } from "../createUser/ICreateUserDTO"
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"


describe("Authenticate user", () => {

  let createUsersRepositoryInMemory: InMemoryUsersRepository
  let authenticateUserUseCase: AuthenticateUserUseCase
  let createUserUseCase: CreateUserUseCase

  beforeEach(() => {
    createUsersRepositoryInMemory = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      createUsersRepositoryInMemory
    )
    createUserUseCase = new CreateUserUseCase(
      createUsersRepositoryInMemory
    )
  })


  it("should be able to authenticate a  user", async () => {

    const user: ICreateUserDTO = {
      name: "Kyle Griffin",
      email: "lit@ritmener.wf",
      password: "1234"
    }

    await createUserUseCase.execute(user);

    const session = await authenticateUserUseCase.execute({ email: user.email, password: user.password })

    expect(session).toHaveProperty("token")


  })

  it("should not be able to authenticate with wrong email", async () => {

    const user: ICreateUserDTO = {
      name: "Kyle Griffin",
      email: "lit@ritmener.wf",
      password: "1234"
    }

    expect(async () => {
      await authenticateUserUseCase.execute({ email: user.email, password: user.password });
    }).rejects.toEqual(new AppError("Incorrect email or password", 401));

  })

  it("should not be able to authenticate with wrong password", async () => {

    const user: ICreateUserDTO = {
      name: "Kyle Griffin",
      email: "lit@ritmener.wf",
      password: "1234"
    }

    await createUserUseCase.execute(user);

    expect(async () => {
      await authenticateUserUseCase.execute({ email: user.email, password: "4321" });
    }).rejects.toEqual(new AppError("Incorrect email or password", 401));
  })

})
