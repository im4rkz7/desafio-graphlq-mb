import express from "express";
import { createServer } from "http";
import session from "express-session";
import { engine } from "express-handlebars";
import productTestRouter from "./routes/productos-test.js";
import MongoStore from "connect-mongo";
import { secretSession, sessionConnection } from "./config/enviroment.js";
import { configMinimist } from "./config/minimist.js";
import infoRouter from "./routes/info.js";
import randomNumbersRouter from "./routes/randomNumbers.js";
import cluster from "cluster";
import { cpus } from "os";
import { timeCookie } from "./config/constans.js";
import chatRouter from "./routes/chat.js";
import { createIo } from "./controllers/socket/socket.js";
import notImplementedRouter from "./routes/notImplemented.js";
import { expressMiddleware } from "@apollo/server/express4";
import { serverGQL } from "./graphql/server.js";

const app = express();
const server = createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./public"));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

app.use(
  session({
    store: MongoStore.create({
      mongoUrl: sessionConnection,
      collectionName: "sessions",
    }),
    secret: secretSession,
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: timeCookie,
    },
  })
);

if (cluster.isPrimary && configMinimist.modo === "cluster") {
  for (let i = 0; i < cpus().length; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`Process ${worker.pid} died`);

    cluster.fork();
  });
} else {
  createIo(server);

  app.use("/api/productos-test", productTestRouter);
  app.use("/info", infoRouter);
  app.use("/api/randoms", randomNumbersRouter);
  app.use("/", chatRouter);

  serverGQL.start().then(() => {
    app.use("/graphql", expressMiddleware(serverGQL));
    app.listen(configMinimist.puerto);
  });

  // app.use("*", notImplementedRouter);

  // server.listen(configMinimist.puerto);
}
