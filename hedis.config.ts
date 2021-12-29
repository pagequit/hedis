export const config = {
	/** @type string */
	prefix: 'hedis',
	/** @type RedisClientOptions */
	clientOptions: null,
};

export type HedisConfig = typeof config;
