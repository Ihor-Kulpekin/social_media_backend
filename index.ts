import 'reflect-metadata';
import Koa from 'koa';
import koaBodyParser from 'koa-bodyparser';
import cors from '@koa/cors'

import authRouter from "./src/routes/authentication/Authentication";
import todosRouter from './src/routes/todos/Todos';

const app = new Koa();
const PORT: number | string = process.env.PORT || 8000;

app.use(cors())
app.use(koaBodyParser())
app.use(authRouter.routes())
app.use(todosRouter.routes()).use(todosRouter.allowedMethods())

app.listen(PORT, async () => {
    console.log('Server running at http://localhost:' + PORT);
})
