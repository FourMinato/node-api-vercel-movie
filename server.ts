import http from "http";
import { app } from "./app";

const port = process.env.port || 3000;
const server = http.createServer(app);

server.listen(port, () => {
  console.log("Server is started");
});

app.get('/about',(req,res)=>{
  res.send('This is my about route')
})