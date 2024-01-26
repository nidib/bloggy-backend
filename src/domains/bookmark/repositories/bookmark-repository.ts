import { SelectBookmarkModel } from 'src/infra/databases/postgres/models/bookmark-model';

export interface BookmarkRepository {
	createOne(articleId: string, userId: string): Promise<void>;

	getOne(articleId: string, userId: string): Promise<null | SelectBookmarkModel>;

	deleteOne(articleId: string, userId: string): Promise<void>;
}
