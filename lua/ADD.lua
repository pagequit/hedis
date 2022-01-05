local val = redis.pcall('GET', KEYS[1]);
return val + ARGV[1];
