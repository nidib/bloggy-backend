import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

import { schema } from 'src/infra/databases/postgres/models/_schema';
import { SelectUserModel } from 'src/infra/databases/postgres/models/user-model';

export const articleModel = schema.table('article', {
	id: uuid('id').primaryKey().defaultRandom(),
	title: varchar('title', { length: 50 }).notNull(),
	content: text('content').notNull(),
	userId: uuid('user_id').notNull(),
	createdAt: timestamp('created_at', { withTimezone: false }).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: false }).notNull().defaultNow(),
	deletedAt: timestamp('deleted_at', { withTimezone: false }),
});

export type InsertArticleModel = InferInsertModel<typeof articleModel>;
export type SelectArticleModel = InferSelectModel<typeof articleModel>;
export type SelectArticleWithUser = InsertArticleModel & { user: SelectUserModel & { didBookmark: boolean } };
