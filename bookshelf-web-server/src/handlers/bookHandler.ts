import chalk from "chalk"
import { IncomingMessage, ServerResponse } from "http"
import { nanoid } from "nanoid";
import path from "path"
import { fileURLToPath } from 'url';
import fs from "fs"


const __filename = fileURLToPath(import.meta.url);
console.log("import.meta.url=",import.meta.url);
console.log("__filename=",__filename);

const pathWithoutBuild = __filename.replace(/\/build.*$/, '');
console.log("pathWithoutBuild=",pathWithoutBuild)

const booksPath = path.resolve(pathWithoutBuild, 'books.json');
console.log("booksPath=",booksPath)


const readBooks = () => {
  try {
    const data = fs.readFileSync(booksPath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Failed to read ooks.json:', err);
    return { books: [] };
  }
};

const writeBooks = (books) => {
  try {
    fs.writeFileSync(booksPath, JSON.stringify(books, null, 2));
    console.log(chalk.green.bgBlack('Successfully wrote to books.json'));
  } catch (err) {
    console.error(chalk.red.bgBlack('Failed to write books.json:'), err);
    throw err;
  }
};


interface PostBookReqBody{
  "name": string
  "year": number
  "author": string
  "summary": string
  "publisher": string
  "pageCount": number
  "readPage": number
  "reading": boolean
}
interface BookSchema extends PostBookReqBody{
  "id": string
  "finished": boolean
  "insertedAt": string
  "updatedAt": string
}

const postBook = (req: IncomingMessage, res: ServerResponse) => {
  console.log(chalk.yellow.bgBlack(`${req.method} ${req.myCustomUrl.href}`))

  const {body}:{body: BookSchema} = req
  console.log("body=",body)

  // IF: "Client tidak melampirkan properti name pada request body"
  if(body.name===undefined){
    res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
    return res.end(JSON.stringify({
      status:"fail",
      message:"Gagal menambahkan buku. Mohon isi nama buku"
    }));
  }

  // IF: Client melampirkan nilai properti readPage yang lebih besar dari nilai properti pageCount
  if(body.readPage>body.pageCount){
    res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
    return res.end(JSON.stringify({
      status:"fail",
      message:"Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount"
    }));
  }

  // add extra properties
  body.id =  nanoid(16);
  body.insertedAt = new Date().toISOString();
  body.updatedAt = body.insertedAt;

  // actual logic for inserting data to JSON
  const books = readBooks()
  console.log("books=",books)

  books.books.push(body)
  writeBooks(books)


  // return response
  res.writeHead(201, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify({
    status:"success",
    message:"Buku berhasil ditambahkan",
    data:{
      bookId: body.id
    }
  }));
}



const getBooks = (req: IncomingMessage, res: ServerResponse) => {
  console.log(chalk.yellow.bgBlack(`${req.method} ${req.myCustomUrl.href}`))

  const booksJson = readBooks()
  console.log("booksJson=",booksJson)

  const {books}: {books: Array<BookSchema>} = booksJson

  // IF: "Jika belum terdapat buku yang dimasukkan, server bisa merespons dengan array books kosong."
  if(books.length<1){
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    return res.end(JSON.stringify({
      status: "success",
      data: books
    }));
  }

  // return response
  const selectedBookProperties = books.map(({ name, publisher, id }) => ({ name, publisher, id }));
  res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
  
  res.end(JSON.stringify({
    status:"success",
    data:{
      books:selectedBookProperties
    }
    
  }));
}


const getBook = (req: IncomingMessage, res: ServerResponse) => {
  console.log(chalk.yellow.bgBlack(`${req.method} ${req.myCustomUrl.href}`))

}


const putBook = (req: IncomingMessage, res: ServerResponse) => {

}


const deleteBook = (req: IncomingMessage, res: ServerResponse) => {

}

const deleteBooks = (req: IncomingMessage, res: ServerResponse) => {

}

export {postBook,getBooks,getBook,putBook,deleteBook,deleteBooks}
