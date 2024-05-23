import { postBook,getBooks, putBook, deleteBook, getBook, deleteBooks } from "../handlers/bookHandler.js";
import jsonParser from "../utils/jsonParser.js";
import Router from "./Router.js";

export const bookRoute = () => {
  const router = new Router()
  console.log("router=",router)

  // middleware
  router.use(jsonParser)

  
  router
    .route("/books/:bookId")
      .get(getBook)
      // .delete(deleteBook)
  ;
  
  router
    .route("/books")
      .post(postBook)
      .get(getBooks)
      // .put(putBook)
      // .delete(deleteBooks)
  ;
}
