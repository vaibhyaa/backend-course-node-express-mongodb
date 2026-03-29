import express, { request } from "express";
import users from "./data/users.js";
import products from "./data/products.js";
// the express is imported using ('express') and app instance is created with express()
// a route is defined using app.get() method , which responds with message
const PORT = process.env.PORT || 3000;
const app = express();



// start the server
// app.listen() method starts the server and listen on port for incoming requests
app.listen(PORT, (error) => {
  if (!error) {
    console.log(`server is running on http://localhost:${PORT}`);
  } else {
    console.log("error occured , server cant start ", error);
  }
});









// middleware :-
// middleware is a function that runs between the request and response cycle. It can modify the request and response objects, end the request-response cycle, or call the next middleware in the stack.
// middleware is used for various purposes like authentication, logging, error handling, parsing request bodies, etc.
// In Express, you can use app.use() to apply middleware globally to all routes, or you can apply it to specific routes by passing it as an argument to the route handler.
app.use(express.json());
const loggerMiddleware = (req, res, next) => {
  console.log(`${req.method} and ${req.url}`);
  console.log(`Response: ${res.statusCode}`);
  // console.log(`Response: ${res.statusMessage}`);
  next();
};
// instead of writing this loggerMiddleware for every route we can use app.use() to apply it globally to all routes
// app.use(loggerMiddleware);
// if i want to apply this loggerMiddleware only for specific route then i can pass it as an argument to the route handler like this
// app.get("/api/v1/some-route", loggerMiddleware, (req, res) => {}








// define a route
// get request :-
app.get("/", loggerMiddleware, (request, response) => {
  // the request object :-
  // request object it is related to everything incomming
  // http request if you passed header from client side to server side that wold be inside headers property of request object
  // if wante to send data in request body that would be assessed by grabbing from request body property
  // wanted to access cookies, ipaddress,all the stuff comes from request object

  // the responce object :-
  // it is used to modify the response and send it back to user.
  // you can send back data, text, html file, json object

  // response.send("welcome to the express.js tutorial ");
  // response.status(200).send("<h1>Hello from server </h1>");
  response.status(200).send({ message: "Hello from server" });

  // In Express, if you pass an object or array to res.send(), Express automatically converts it to JSON.
  // Only when you pass an object or array to res.send() does Express convert it to JSON.
});



















// industry standard to start with /api/v1/..
// v1 is optionl (just info about first version of apis )
app.get(
  "/api/v1/allusers",
  // this is the request handler
  (req, res) => {
    res.status(201).send(users);
  },
);

app.get("/api/v1/allproducts", (req, res) => {
  res.status(201).send(products);
});



























// QUERY PARAMS:-
// http://localhost:3000/api/v1/user/sorted?key=values&key2=values2
// i want to get all users from database but in sorted alphabetic order

app.get("/api/v1/user/sorted", (req, res) => {
  // console.log(req.query);

  const { filter, value, surname } = req.query;
  if (!filter || !value || !surname) {
    return res.status(200).send(users);
  }

  if (filter && value && surname) {
    const findUser = users.filter((eachUser) => {
      // console.log(String(eachUser[filter]).toLowerCase().split(" ")[0]);
      const name = String(eachUser[filter]).toLowerCase().split(" ")[0];
      const surName = String(eachUser[filter]).toLowerCase().split(" ")[1];

      return name === value.toLowerCase() && surName === surname.toLowerCase();
      // return name === value.toLowerCase();
    });

    return res.status(200).send(findUser);
  }

  return res.status(400).json({
    message: "All query params (filter, value, surname) are required",
  });
});
// app.get("/api/v1/user/sorted", (req, res) => {
//   console.log(req.query);
//   // const {
//   //   query: { filter, value },
//   // } = req;
//   const { filter, value } = req.query;

//   // when filter and value is undefined the send all users
//   if (!filter && !value) {
//     return res.status(200).send(users);
//   }

//   if (filter && value) {
//     const findUser = users.filter((eachUser) => {
//       // first eachUser[filter] is like each["name"]/each["id"]
//       // second is their are some num,boolean properties so needed to convert everything to sting and lowercaes
//       return String(eachUser[filter]).toLowerCase() === value.toLowerCase();
//     });
//     // console.log(findUser);

//     // if (findUser.length === 0) {
//     //   return res.status(200).json({
//     //     message: "No users found",
//     //     data: [],
//     //   });
//     // }

//     // search was valid, but nothing matched
//     // if no match found -> returns []
//     return res.status(200).send(findUser);
//   }

//   // fallback if filter is invalid
//   return res.status(400).json({
//     message: "Invalid filter. Use filter=name&value=someName",
//   });
// });

































// route parameters :-
app.get("/api/v1/user/:userId", (req, res) => {
  // In Express, route params are always strings.
  // console.log(req.params);
  // console.log(req.params.userId);
  // console.log(typeof req.params.userId);

  // the route param which user passed converted to number and it is needed sometomes because in databse the id is saved as number
  const parsedId = parseInt(req.params.userId);
  // console.log(parseId, typeof parseId);
  // console.log(parsedId);
  if (isNaN(parsedId)) {
    // is user put anything wrond or like "sdbsd" instead of id then isNan(parseId)===Nan because parseId will be Nan
    // the responce will be bad request
    res.status(400).send({ message: "bad request. Invalis Id." });
  }
  const findUser = users.find((eachuser) => eachuser.id === parsedId);
  if (!findUser) {
    // res.status(404).send({ message: "user not found " });
    res.sendStatus(404);
  }
  res.status(200).send(findUser);
});















































// post request :-
// req.body :- whenever we make post/patch/put request the data that we want to send it to backed server you send via a payload or req.body.
// the backed will take that data and perform necessary operations it need validation / parsing / proper fields
// it does all this process before it proceeds wither saving it to database or saving in external api source
// it will return responce / and message / response

app.post("/api/v1/user", (req, res) => {
  // console.log(req.body);
  // it shows undefined because express not parsing those request bodies are comming in (use express.json() middleware for that )
  const newUser = req.body;
  // validation
  if (!newUser.id || !newUser.name) {
    // For REST APIs:
    // use res.json() for objects/arrays
    // use res.send() for plain text / HTML / simple messages
    return res.status(400).json({
      message: "Please provide id and name",
    });
  }
  users.push(newUser);
  //   // need to use the inbuild middleware for this express.json()
  return res.status(201).json({
    message: "User successfully created",
    data: newUser,
  });
});















































// patch request :-
// want to update some data on backend
// updates the data partially (not updating the entore data but some part/portion of it )
app.patch("/api/v1/user/:userId", (req, res) => {
  const {
    body,
    params: { userId },
  } = req;
  // console.log(userId, body);
  const parsedId = parseInt(userId);
  if (isNaN(parsedId)) {
    return res.sendStatus(400);
  }

  const findUserIndex = users.findIndex((eachUser) => eachUser.id === parsedId);
  if (findUserIndex === -1) {
    return res.sendStatus(404);
  }
  console.log(users[findUserIndex]);

  users[findUserIndex] = {
    ...users[findUserIndex], // keep old fields
    ...body, // overwrite only sent fields
    id: parsedId, // protect id
  };

  return res.status(200).json({
    message: "User updated successfully",
    data: users[findUserIndex],
  });
});





















































// put request :-
// not updating the small portion of request but updating the entire request
// updating the entire record

app.put("/api/v1/user/:userId", (req, res) => {
  const {
    body,
    params: { userId },
  } = req;

  const parsedId = parseInt(userId);
  if (isNaN(parsedId)) {
    return res.sendStatus(400);
  }

  const findUserIndex = users.findIndex((eachUser) => eachUser.id === parsedId);
  if (findUserIndex === -1) {
    return res.sendStatus(404);
  }
  console.log(users[findUserIndex]);

  users[findUserIndex] = {
    id: parsedId,
    ...body, // replace full user
  };

  return res.status(200).json({
    message: "User updated successfully",
    data: users[findUserIndex],
  });
});















































// delete request :-
// delete the data from backend
app.delete("/api/v1/user/:userId", (req, res) => {
  const { userId } = req.params;
  const parsedId = parseInt(userId);
  if (isNaN(parsedId)) {
    return res.sendStatus(400);
  }

  const findUserIndex = users.findIndex((eachUser) => eachUser.id === parsedId);
  if (findUserIndex === -1) {
    return res.sendStatus(404);
  }
  users.splice(findUserIndex, 1);
  return res.status(200).json({
    message: "User deleted successfully",
  });
});
