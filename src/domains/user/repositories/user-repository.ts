import { InsertUserModel, SelectUserModel } from 'src/infra/databases/postgres/models/user-model';

export interface UserRepository {
	getOneByUsername(username: string): Promise<null | SelectUserModel>;

	createOne(candidate: InsertUserModel): Promise<SelectUserModel>;

	getOneById(id: string): Promise<null | SelectUserModel>;
}
