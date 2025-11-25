import { redis } from "infra/redis";

//* in order to start working with queue you need a redis connection
export const queueConnection = {
    connection: redis
}
