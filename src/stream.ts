import { createStream } from '@ghadautopia/express-profiler';
import { RequestHandler } from 'express';
import { Mongoose } from 'mongoose';
import onFinished from 'on-finished';

export const STR_MONGOOSE = 'mongoose';

const mongooseStream = createStream(STR_MONGOOSE);

export const mongooseStreamMiddleware: (mongoose: Mongoose) => RequestHandler = (mongoose: Mongoose) => {
    return (req, res, next) => {
        mongoose.set('debug', (coll, method, queryOrDoc, ...options) => {
            mongooseStream.presist(res, {coll, method, queryOrDoc, ...options});
        });

        onFinished(res, () => mongoose.set('debug', false));

        next();
    }
}
