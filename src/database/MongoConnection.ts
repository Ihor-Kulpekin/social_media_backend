import {Db, MongoClient} from "mongodb";
import {Context} from "koa";

type OperationsFunction = (db: Db) => Promise<void>;

export const withDB = async (operations: OperationsFunction, context: Context) => {
    try {

        const client = await MongoClient.connect('mongodb://localhost:777')

        const db: Db = client.db('social_media');

        await operations(db)

        await client.close();
    } catch (e) {
        if(context){
             context.body = {message: `Error:${e}`}
        }
    }
}
