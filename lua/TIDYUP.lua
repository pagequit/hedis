local limit = 128; -- could also be set as ARGV[1] e.g., but I'm lazy
local count = redis.call('ZCOUNT', KEYS[1], '-inf', '+inf');

if (count > limit)
then
	local result = redis.call('ZRANGE', KEYS[1], '0', '0');

	local oldest_message_id = tostring(result[1]);
	redis.call('ZREM', KEYS[1], oldest_message_id);

	local oldest_message_hash = KEYS[1]..':'..oldest_message_id;
	redis.call('DEL', oldest_message_hash);

	return 1;
end

return 0;
