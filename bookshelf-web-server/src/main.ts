import * as http from 'http'; //ES 6
import 'dotenv/config';
import chalk from "chalk";
import { bookRoute } from './routes/bookRoute.js';
import { ListenOptions } from 'net';

const port = Number(process.env.PORT);
const host = 'localhost';

export const app = http.createServer();


const listenOptions: ListenOptions = {
  port,
  host
}
app.listen(listenOptions, () => {
  console.log(chalk.green.bgBlack(`Server berjalan pada: http://${host}:${port}`));

  bookRoute()
});

// ax