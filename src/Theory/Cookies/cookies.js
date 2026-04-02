
// // simple get request for testing cookies and session :-
// // since the route that set the cookie a this the route that you must visit first in order for you to authenticate have the cookie set the cookie on sever and then send back to client/browser
// // then you can access some protected route that require cookie for authentication and authorization and you can access the cookie in that route handler and check if the cookie is present and valid or not and then send response accordingly
// // then when you will make request to the from any route that
























































// app.get("/", (req, res) => {
//   // session:-
//   console.log(req.session);
//   console.log(req.sessionID);
//   // modify the session object by adding some data:-
//   req.session.visited = true;
//   // when we set the session data in the req.session object then it will be stored in the session store and it will be associated with the session ID and when the client send the session ID back to the server in the cookie then the server can retrieve the session data from the session store using the session ID and it will be available in the req.session object in the route handler and we can access it and use it for authentication and authorization and other purposes

//   // cookie:-
//   res.cookie("mycookieName", "thisisCookieValue", {
//     maxAge: 10000, // 10 sec
//     // httpOnly: true,
//     signed: true, // this will sign the cookie with a secret key and it will be stored in the cookie as well and when the client send the cookie back to the server then the server can verify the cookie using the secret key and if the cookie is valid then it will be accepted otherwise it will be rejected
//     // app.use(cookieParser("mysecretkey"))
//   });
//   res.status(200).send({ message: "Hello from server" });
// });
// // Server will:
// // Send a cookie to browser:
// // Name → mycookieName
// // Value → thisisCookieValue
// // Cookie settings:
// // maxAge: 60000 * 60 → cookie expires after 1 hour
// // httpOnly: true → JavaScript cannot access it (document.cookie cannot read it)












// // first url user hit url
// // session middleware runs
// // Express-session creates a temporary session object
// app.post("/api/auth", (req, res) => {
//   // Session middleware runs first
//   // Again it checks:
//   // Is there existing connect.sid cookie?
//   // If first login:
//   // no cookie yet
//   // So it creates a new temporary session object for this request.
//   const {
// 	body: { username, password },
//   } = req;
//   const findEmployee = employee.find((eachEmployee) => {
// 	return eachEmployee.username === username;
//   });
//   if (!findEmployee || findEmployee.password !== password) {
// 	return res.status(401).json({ message: "Invalid credentials" });
//   }

//   // When login succeeds:
//   // Server creates a session object
//   // Server stores it in session store (default MemoryStore unless you configure another)
//   // Server sends cookie to client:
//   // Browser / Thunder Client stores cookie
//   // On next request, browser sends cookie automatically
//   // Server uses connect.sid to find matching session in session store

//   // You are storing employee data inside the server-side session.
//   req.session.employee = {
// 	id: findEmployee.id,
// 	username: findEmployee.username,
//   };

//   // Response contains a cookie automatically set by express-session middleware with the session ID (connect.sid) that is associated with the session data stored on the server. The cookie is sent to the client, and on subsequent requests, the client sends this cookie back to the server, allowing the server to identify the session and access the associated data (like req.session.employee) for authentication and authorization purposes.
//   console.log(req.session);
//   console.log("LOGIN SESSION ID:", req.sessionID);

//   res
// 	.status(200)
// 	.json({ message: "Login successful", data: req.session.employee });
//   // or
//   // res.status(200).json({ message: "Login successful", data:findEmployee });
// });













// app.get("/api/auth/status", (req, res) => {
//   console.log(req.session);
//   console.log("session:", req.sessionID);
//   // When request comes:
//   // session middleware checks cookie
//   // finds session
//   // attaches session to req.session

//   return req.session.employee
// 	? res
// 		.status(200)
// 		.json({ message: "User is authenticated", data: req.session.employee })
// 	: res.status(401).json({ message: "User is not authenticated" });
// });


















// app.post("/api/cart", (req, res) => {
//   const { cartitems } = req.body;

//   console.log(req.sessionID);
//   console.log(req.session);

//   if (!req.session.employee) {
// 	return res.status(401).json({ message: "User is not authenticated" });
//   }
//   // if (!Array.isArray(cartitems)) {
//   //   return res.status(400).json({ message: "Cart items should be an array" });
//   // }
//   if (req.session.cart) {
// 	for (const item in cartitems) {
// 	  req.session.cart[item] = (req.session.cart[item] || 0) + cartitems[item];
// 	}
//   } else {
// 	req.session.cart = { ...cartitems };
//   }
//   console.log(req.session.cart);
  
//   res.status(200).json({
// 	message: "Cart updated successfully",
// 	cart: req.session.cart,
// 	employee: req.session.employee,
//   });
// });




