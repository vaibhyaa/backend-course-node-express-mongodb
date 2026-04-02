import express, { request } from "express";
import router from "./Routes/routes.js";
import connectDB from "./db/ConnectDB.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());
// app.use(cookieParser("mysecretkey"));

// i have moved all the routes to separate one file and import it here to keep the code clean and organized
app.use(router);

// // routers for user  :-
// app.use("/api/v1/user", userGetRouter);
// app.use("/api/v1/user", userPostRouter);
// app.use("/api/v1/user", userPatchRouter);
// app.use("/api/v1/user", userPutRouter);
// app.use("/api/v1/user", userDeleteRouter);

// // routers for products :-
// app.use("/api/v1/product", getProductRouter);

// start the server:-
// app.listen() method starts the server and listen on port for incoming requests

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB connection failed, server not started:", error);
  });
