import express, { request } from "express";
import users from "./data/users.js";
import session from "express-session";
import employee from "./data/employee.js";
import { validationResult } from "express-validator";
// import cookieParser from "cookie-parser";

const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());
// app.use(cookieParser("mysecretkey"));

// This line adds session middleware globally to your Express app.
// For every incoming request, check if this user already has a session.
// If yes, attach it to req.session.
// If no, create one when needed.”
app.use(
  session({
    // secret: process.env.SESSION_SECRET
    // keep it in .env file
    secret: process.env.SESSION_SECRET || "vaibhav the developer",
    // Used to sign the session ID cookie
    // Prevents cookie tampering
    // Browser gets something like connect.sid
    // This cookie is signed using the secret
    resave: false,
    // If a session already exists
    // and you did not change anything in req.session during this request
    // then do not save it again to the session store
    // resave: false -> this option is used to prevent the session from being saved to the store if it is not modified during the request. This can help to reduce the number of sessions stored in the session store and improve performance. When resave is set to false, a session will only be saved to the store if it is modified (e.g., by adding data to req.session) during the request. If a session is not modified, it will not be saved to the store, which can help to reduce unnecessary sessions and improve performance, especially in cases where many requests do not require session data.
    saveUninitialized: false,
    // saveUninitialized: false -> this option is used to prevent the session from being saved to the store if it is not modified during the request. This can help to reduce the number of sessions stored in the session store and improve performance. When saveUninitialized is set to false, a session will only be created and saved if it is modified (e.g., by adding data to req.session) during the request. If a session is not modified, it will not be saved to the store, and no session cookie will be sent to the client. This can be useful for reducing unnecessary sessions and improving performance, especially in cases where many requests do not require session data.
    // If a new session is created but nothing is stored in it, don’t save it
    // Also don’t send session cookie for empty session

    cookie: {
      maxAge: 1000 * 60 * 10, // 10 min
      // httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      // sameSite: "lax",
    },
  }),
);

app.get("/auth/login/:employeeId", (req, res) => {
  const { employeeId } = req.params;
  if (isNaN(Number(employeeId))) {
    return res.status(400).json({ message: "Employee ID is required" });
  }

  const findEmployee = employee.find(
    (eachEmployee) => eachEmployee.id === Number(employeeId),
  );

  if (!findEmployee) {
    return res.status(404).json({ message: "Employee not found" });
  }
  // create one field in session liek visisted=true and then we can check this field in next request to see if the user has visited the site before or not

  // app.use(session(...)) means:
  // For every request:
  // req.session becomes available
  // req.sessionID also becomes available
  // BUT...
  // With saveUninitialized: false
  // A real persistent session is created only when you modify session data
  req.session.employee = findEmployee;
  console.log(req.session);
  console.log(req.sessionID);

  res.status(200).json({
    message: "Employee fetched successfully",
    employee: findEmployee,
  });
});

app.get("/auth/me", (req, res) => {
  console.log(req.session);
  console.log(req.sessionID);
  if (req.session.employee) {
    return res.status(200).json({
      message: "Authenticated user",
      employee: req.session.employee,
    });
  }
  return res.status(401).json({
    message: "Unauthorized user",
  });
});

app.post("/auth/cart", (req, res) => {
  console.log(req.session);
  console.log(req.sessionID);
  // This extracts cartItems from the request body.
  // This is the data coming from the client request body.
  //  It exists only for this request
  // It comes from frontend / Thunder Client / Postman
  // Server does not automatically remember it
  // If you don’t save it somewhere, it is gone after request finishes
  // when i hit the post request with body the cart items goes into session object
  const { cartItems } = req.body;

  // Checks whether the user is authenticated like with help of sessionId from previous route .
  if (!req.session.employee) {
    return res.status(401).json({ message: "Unauthorized user" });
  }

  if (!cartItems) {
    return res.status(400).json({ message: "Cart items are required" });
  }

  // Extracts cart from session
  // This is cart data stored in the session object on the server for that specific user.
  // It is saved on server side
  // It stays available across multiple requests
  // It belongs to that user's session
  // It can be read later in another route like:
  const { cart } = req.session.employee;
  if (cart) {
    cart.push(...cartItems);
  } else {
    req.session.employee.cart = [...cartItems];
  }

  res
    .status(200)
    .json({ message: "Cart items added to session", data: req.session.employee.cart });
});



app.get("/auth/details/:employeeId", (req, res) => {
  const { employeeId } = req.params;
  console.log(req.session);
  console.log(req.sessionID);

  if (req.session.employee &&  req.session.employee.id === Number(employeeId)) {
    return res.status(200).json({
      message: "Employee details fetched successfully",
      employee: req.session.employee,
    });
  } else {
    res.status(401).json({
      message: "Unauthorized user",
    });
  }

});









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
import employees from "./data/employee.js";
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
