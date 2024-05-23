import { app } from "../main.js";
import chalk from "chalk";
import { IncomingMessage, ServerResponse } from "http";

// Extend the IncomingMessage interface
declare module 'http' {
  interface IncomingMessage {
    myCustomUrl: URL;
    body: any;
  }
}

export default class Router {
  #routersMap: {[url: string]: {[method:string]: Function}} = {};
  #middlewares: Array<Function> = [];
  #tempUrl = "";

  constructor(){
    app.on('request', async (req: IncomingMessage, res: ServerResponse) => {
      console.log(chalk.yellow.bgBlack("[*] incoming req"))


      const {url,method,headers} = req
      console.log("headers=",headers)

      const myCustomUrl = new URL(url, `http://${headers.host}`)
      console.log("myCustomUrl=",myCustomUrl)

      req.myCustomUrl = myCustomUrl


      const routeExist = this.#routersMap[myCustomUrl.pathname]
      console.log("routeExist=",routeExist)

      if(routeExist!==undefined){
        
        // pre-request execution will be the middleware first to be executed
        for (const middleware of this.#middlewares) {
          console.log(chalk.yellow.bgBlack("[*] middleware:", middleware.name));
          try {
            await middleware(req, res);
          } catch (error) {
            console.error(chalk.red.bgBlack(error))            
          }
        }

        const handler = this.#routersMap[myCustomUrl.pathname][method]
        handler(req,res)
      }
    });
  }
  
  public route(determinedUrl: string): Router {
    this.#routersMap[determinedUrl] = {};
    this.#tempUrl = determinedUrl;
    console.log("determinedUrl=",determinedUrl);
    return this;
  }

  public get(handler): Router {
    console.log("get()")
    console.log("handler=",handler)
    console.log("this.#tempUrl=",this.#tempUrl)
    
    this.#routersMap[this.#tempUrl]["GET"] = handler
    console.log("this.#routersMap=",this.#routersMap)
    return this

  }

  public post(handler): Router {
    console.log("post()")
    console.log("handler=",handler)
    console.log("this.#tempUrl=",this.#tempUrl)
    
    this.#routersMap[this.#tempUrl]["POST"] = handler

    console.log("this.#routersMap=",this.#routersMap)
    return this

  }

  public put(handler): Router {
    console.log("put()")
    console.log("handler=",handler)
    console.log("this.#tempUrl=",this.#tempUrl)
    
    this.#routersMap[this.#tempUrl]["PUT"] = handler

    console.log("this.#routersMap=",this.#routersMap)
    return this

  }

  public delete(handler): Router {
    console.log("delete()")
    console.log("handler=",handler)
    console.log("this.#tempUrl=",this.#tempUrl)
    
    this.#routersMap[this.#tempUrl]["DELETE"] = handler
    console.log("this.#routersMap=",this.#routersMap)
    return this

  }

  public use(handler: Function) {
    this.#middlewares.push(handler)
  }
}