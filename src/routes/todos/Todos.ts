import {Context, Next} from "koa";
import {Db} from "mongodb";

const KoaRouter = require('koa-router');
const {ObjectId} = require("mongodb");
const {verifyJsonWebToken} = require("../../utils/verifyJsonWebToken");
const {withDB} = require("../../database/MongoConnection");

const todos = new KoaRouter();

todos.get('/todos', verifyJsonWebToken, async (context:Context, next:Next) => {
    await withDB(async (db:Db) => {
        context.body = await db.collection('todos').find().toArray()
        await next();
    }, context)
})

todos.post('/todos', verifyJsonWebToken, async (context:Context, next:Next) => {
    await withDB(async (db:Db) => {

        const todo = {
            name: context.request.body.name,
        };

        const createdTodo = await db.collection('todos').insertOne(todo);
        context.body = {
            createdTodo
        }
        await next()
    }, context)
})

todos.delete('/todos', verifyJsonWebToken, async (context:Context, next:Next)=> {
    await withDB(async (db:Db) => {
        context.body = await db.collection('todos').deleteOne({"_id": ObjectId(context.request.body.id)})
        await next();
    }, context)
})

export default todos;
