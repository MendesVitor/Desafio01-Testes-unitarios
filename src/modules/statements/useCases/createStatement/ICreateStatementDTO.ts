import { OperationType, Statement } from "../../entities/Statement";

interface ICreateStatementDTO {
  user_id?: string
  dest_id?: string
  sender_id?: string
  description: string
  amount: number
  type: OperationType
}

export { ICreateStatementDTO }
