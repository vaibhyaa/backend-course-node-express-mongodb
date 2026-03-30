import express, { request } from "express";
import users from "./data/users.js";

import { validationResult } from "express-validator";

import cookieParser from "cookie-parser";

// the express is imported using ('express') and app instance is created with express()
// a route is defined using app.get() method , which responds with message
const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());
app.use(cookieParser("mysecretkey"));





// simple get request for testing :-
// since the route that set the cookie a this the route that you must visit first in order for you to authenticate have the cookie set the cookie on sever and then send back to client/browser
// then you can access some protected route that require cookie for authentication and authorization and you can access the cookie in that route handler and check if the cookie is present and valid or not and then send response accordingly
// then when you will make request to the from any route that
app.get("/", (req, res) => {
  // cookie:-
  res.cookie("mycookieName", "thisisCookieValue", {
    maxAge: 10000, // 10 sec
    // httpOnly: true,
    signed: true, // this will sign the cookie with a secret key and it will be stored in the cookie as well and when the client send the cookie back to the server then the server can verify the cookie using the secret key and if the cookie is valid then it will be accepted otherwise it will be rejected
    // app.use(cookieParser("mysecretkey"))
  });
  res.status(200).send({ message: "Hello from server" });
});
// Server will:
// Send a cookie to browser:
// Name → mycookieName
// Value → thisisCookieValue
// Cookie settings:
// maxAge: 60000 * 60 → cookie expires after 1 hour
// httpOnly: true → JavaScript cannot access it (document.cookie cannot read it)

















app.get(
  "/justgetrequestt",
  (req, res, next) => {
    console.log(`here we will get the request method: ${req.method}`);
    next();
    // here in first middleware we are logging the request method and then calling next() to pass the control to the next middleware in the stack (↓)
  },
  (req, res, next) => {
    console.log(`here we will get the request url: ${req.url}`);
    // here in second middleware we are logging the request url and not calling next()  so the request will be stuck in this middleware and it will never reach the route handler/ or next middleware and the server will not send any response to the client
    // instead of next()  if we send response here from sever then also the request will be end here and it will never reach the route handler/ or next middleware and the server will send response to the clien
    // because we want to end the request-response cycle here and send the response back to the client
    // so basically if we want to end the request-response cycle in any middleware then we can send response from that middleware and we dont need to call next() because next() is used to pass the control
    // if we want to pass the control to the next middleware in the stack then we need to call next() and if we want to end the request-response cycle in any middleware then we can send response from that middleware and we dont need to call next() because next() is used to pass the control
    res.status(200).send({ message: "Hello from server" });
  },
  // (req, res, next) => {
  //   res.status(200).send({ message: "Hello from server" });
  // },
);

// here is the perfect example of midleware :-
// as many route handler we have we need to write common code for validation , parsing , filtering , sorting etc. in every route handler
// for put,patch,delete,get
// export const validateUserIdMiddleware = (req, res, next) => {
export function validateUserIdMiddleware(req, res, next) {
  // const {body,params:{Id}} =req;
  const { userId } = req.params;
  const parsedId = parseInt(userId);
  if (isNaN(parsedId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }
  const findUserIndex = users.findIndex((eachUser) => eachUser.id === parsedId);
  if (findUserIndex === -1) {
    return res.status(404).json({ message: "User not found" });
  }
  // console.log(findUserIndex);
  req.findUserIndex = findUserIndex;
  // next() does not automatically pass any data to the next middleware or route handler, but we can attach data to the req object (like req.findUserByid) and it will be accessible in the next middleware or route handler as well because they all share the same req object in the request-response cycle.
  // next() does take any argument, but it except an error object /null. If you pass an error object to next(), it will skip all remaining non-error handling middleware and route handlers and go directly to the error handling middleware. If you pass null or nothing to next(), it will simply pass control to the next middleware or route handler in the stack.
  // next (new Error("Something went wrong") ) -> this will skip all remaining non-error handling middleware and route handlers and go directly to the error handling middleware
  next();
}
// const validateRequest = (req, res, next) => {
export function validateRequest(req, res, next) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({
      errors: result.array().map((eachError) => ({
        message: eachError.msg,
      })),
    });
  }
  next();
}

// // routers for user  :-
// app.use("/api/v1/user", userGetRouter);
// app.use("/api/v1/user", userPostRouter);
// app.use("/api/v1/user", userPatchRouter);
// app.use("/api/v1/user", userPutRouter);
// app.use("/api/v1/user", userDeleteRouter);

// // routers for products :-
// app.use("/api/v1/product", getProductRouter);

// i have moved all the routes to separate one file and import it here to keep the code clean and organized
import router from "./Routes/routes.js";
app.use(router);

// start the server:-
// app.listen() method starts the server and listen on port for incoming requests
app.listen(PORT, (error) => {
  if (!error) {
    console.log(`server is running on http://localhost:${PORT}`);
  } else {
    console.log("error occured , server cant start ", error);
  }
});
