CREATE SCHEMA IF NOT EXISTS "main";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS "main"."user" (
	"id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	"username" VARCHAR(30) UNIQUE NOT NULL,
	"password" VARCHAR(255) NOT NULL,
	"full_name" VARCHAR(255) NOT NULL,
	"created_at" TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'utc'),
	"updated_at" TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'utc'),
	"deleted_at" TIMESTAMP DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS "main"."article" (
	"id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	"title" VARCHAR(50) NOT NULL,
	"content" TEXT NOT NULL,
	"user_id" UUID NOT NULL,
	"created_at" TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'utc'),
	"updated_at" TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'utc'),
	"deleted_at" TIMESTAMP DEFAULT NULL,

	FOREIGN KEY ("user_id") REFERENCES "main"."user"
);

CREATE TABLE IF NOT EXISTS "main"."bookmark" (
	"user_id" UUID NOT NULL,
	"article_id" UUID NOT NULL,

	PRIMARY KEY("user_id", "article_id"),
	FOREIGN KEY ("user_id") REFERENCES "main"."user",
	FOREIGN KEY ("article_id") REFERENCES "main"."article"
);
