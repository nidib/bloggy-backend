import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { char, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

import { schema } from 'src/infra/databases/postgres/models/_schema';

export const userModel = schema.table('user', {
	id: uuid('id').primaryKey().defaultRandom(),
	username: varchar('username', { length: 30 }).notNull(),
	password: char('password', { length: 255 }).notNull(),
	fullName: char('full_name', { length: 255 }).notNull(),
	createdAt: timestamp('created_at', { withTimezone: false }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: false }).defaultNow().notNull(),
});

export type InsertUserModel = InferInsertModel<typeof userModel>;
export type SelectUserModel = InferSelectModel<typeof userModel>;
