import { Router } from "express";
import products from "../../data/products.js";

const router = Router();

// router.get("/allproducts", (req, res) => {
//   // cookie :-
//   // UNSIGNED COOKIES :-
//   // console.log(req.headers.cookie);
//   // console.log(req.cookies);
//   // SIGNED COOKIES :-
//   // console.log(req.signedCookies);

//   // when  we have signed cookies
//   if (
//     req.signedCookies.mycookieName &&
//     req.signedCookies.mycookieName === "thisisCookieValue"
//   ) {
//     res.status(200).send(products);
//   } else {
//     res.status(403).send({ message: "Unauthorized : cookie needed" });
//   }

//   // when we have unsigned cookies
//   // if (
//   //   req.cookies.mycookieName &&
//   //   req.cookies.mycookieName === "thisisCookieValue"
//   // ) {
//   //   res.status(200).send(products);
//   // } else {
//   //   res.status(403).send({ message: "Unauthorized : cookie needed" });
//   // }
// });

router.get("/allproducts", (req, res) => {
  // console.log(req.sessionID);
  // console.log(req.session);

  res.status(200).json({
    message: "All products fetched successfully",
    products,
  });
});
export default router;
