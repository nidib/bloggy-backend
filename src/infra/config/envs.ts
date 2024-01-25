function getEnv(env: string) {
	const value = process.env[env];

	return value;
}

function getEnvOrThrow(env: string) {
	const value = getEnv(env);

	if (!value) {
		throw new Error(`Required environment variable "${env}" not found`);
	}

	return value;
}

export const envs = {
	databaseUrl: getEnvOrThrow('DATABASE_URL'),
	databaseName: getEnv('DATABASE_NAME') ?? 'bloggy',
	serverPort: Number(getEnv('SERVER_PORT') ?? '8080'),
	commitHash: getEnv('COMMIT_HASH') ?? '',
	jwtKey: getEnvOrThrow('JWT_KEY'),
} as const;
