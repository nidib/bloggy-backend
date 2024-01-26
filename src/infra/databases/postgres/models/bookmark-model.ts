import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { uuid } from 'drizzle-orm/pg-core';

import { schema } from 'src/infra/databases/postgres/models/_schema';

export const bookmarkModel = schema.table('bookmark', {
	userId: uuid('user_id').primaryKey(),
	articleId: uuid('article_id').primaryKey(),
});

export type InsertBookmarkModel = InferInsertModel<typeof bookmarkModel>;
export type SelectBookmarkModel = InferSelectModel<typeof bookmarkModel>;
