import http from "http";
import path from "path";
import { promises as fs } from 'fs';

global["__dirname"] = path.dirname(new URL(import.meta.url).pathname);

const server = http.createServer(async (req, res) => {
  // Desestructurando de "req"
  let { url, method } = req;

  console.log(`📣 CLIENT-REQUEST: ${req.url} ${req.method}`);

  // Enrutando peticiones
  switch (url) {
    case '/':
      // Peticion raiz
      // Estableciendo cabeceras
      res.setHeader('Content-Type', 'text/html');
      // Escribiendo la respuesta
      res.write(`
      <html>
        <head>
          <link rel="icon" type="image/x-icon" sizes="32x32" href="/favicon.ico">
          <title>My App</title>
        </head>
        <body> 
          <h1 style="color: #333">Hello from my server</h1>
          <p style="color: #34495E">Estas en el recurso raiz.</p>
        </body>
      </html>
      `);
      console.log(`📣 Respondiendo: 200 ${req.url} ${req.method}`);
      // Estableciendo codigo de respuesta
      res.statusCode = 200;
      // Cerrando la comunicacion
      res.end();
      break;
    case '/author':
      // se crea el nuevo case para poder entrar a author
      // Estableciendo cabeceras
      res.setHeader('Content-Type', 'text/html');
      // Escribiendo la respuesta
      res.write(`
      <html>
        <head>
          <link rel="icon" type="image/png" sizes="32x32" href="https://img.icons8.com/fluency/256/domain.png">
          <title>My App-Auhtor</title>
        </head>
        <body> 
          <h1 style="color: #00fd13">Bienvenido a Author</h1>
          <p style="color: #7a009b">Estas en el recurso del author.</p>
          <p style="color: #7a009b">Ramos de la Torre Juan Manuel.</p>
          <p style="color: #7a009b">&#129312; Puedes tocar la siguinte enlace para github</p>
          <p><a href="https://github.com/JuanRamos15/first">Github</a></p>
        </body>
      </html>
      `);
      console.log(`📣 Respondiendo: Author ${req.url} ${req.method}`);
      // Estableciendo codigo de respuesta
      res.statusCode = 215;
      // Cerrando la comunicacion
      res.end();
      break;
    case "/favicon.ico":
      // Especificar la ubicación del archivo de icono
      const faviconPath = path.join(__dirname, 'favicon.ico');
      try{
        const data = await fs.readFile(faviconPath);
        res.writeHead(200, {'Content-Type': 'image/x-icon'});
        res.end(data);
      }catch (err) {
        console.error(err);
        // Peticion raiz
        // Estableciendo cabeceras
        res.setHeader('Content-Type', 'text/html');
        // Escribiendo la respuesta
        res.write(`
        <html>
          <head>
            <link rel="icon" type="image/x-icon" sizes="32x32" href="/favicon.ico">
            <title>My App</title>
          </head>
          <body> 
            <h1>&#128534; 500 El server esta fuera de servicio</h1>
            <p>Lo sentimos pero hubo un error en nuestro server...</p>
            <p> ${err.message}</p>
          </body>
        </html>
        `);
        console.log(`📣 Respondiendo: 500 ${req.url} ${req.method}`);
        // Estableciendo codigo de respuesta
        res.statusCode = 500;
        // Cerrando la comunicacion
        res.end();
      }
      break;
    case "/message":
          // Verificando si es post
      if (method === "POST") {
     // Se crea una variable para almacenar los
     // Datos entrantes del cliente
     let body = "";

     // Se registra un manejador de eventos
     // Para la recepción de datos
     req.on("data", (data => {
       body += data;
       if (body.length > 1e6) return req.socket.destroy();
     }));

     // Se registra una manejador de eventos
     // para el termino de recepción de datos
     req.on("end", () => {
      // Procesa el formulario
      res.statusCode = 200;
       res.setHeader("Content-Type", "text/html");
        // Mediante URLSearchParams se extraen
        // los campos del formulario
      const params = new URLSearchParams(body);
        // Se construye un objeto a partir de los datos
        // en la variable params
      const parsedParams = Object.fromEntries(params);
       res.write(`
      <html>
      <head>
      <link rel="icon" type="image/x-icon" sizes="32x32" href="/favicon.ico">
      <title>My App</title>
      </head>
      <body>
      <h1 style="color: #333">SERVER MESSAGE RECIEVED &#128172</h1>
      <p>${parsedParams.message}</p>
      </body>
      </html>
      `);
        // Se termina la conexion
      return res.end();
     })
  } else {
   res.statusCode = 404;
   res.write("404: Endpoint no encontrado")
   res.end();
  }
    break;
    default:
      // Peticion raiz
      // Estableciendo cabeceras
      res.setHeader('Content-Type', 'text/html');
      // Escribiendo la respuesta
      res.write(`
      <html>
        <head>
          <link rel="icon" type="image/x-icon" sizes="32x32" href="/favicon.ico">
          <title>My App</title>
        </head>
        <body> 
          <h1>&#128534; 404 Recurso no encontrado</h1>
          <p>Lo sentimos pero no tenemos lo que buscas...</p>
        </body>
      </html>
      `);
      console.log(`📣 Respondiendo: 404 ${req.url} ${req.method}`);
      // Estableciendo codigo de respuesta
      res.statusCode = 404;
      // Cerrando la comunicacion
      res.end();
      break;
  }
}); 

server.listen(3000, "0.0.0.0", () => {
  console.log("👩‍🍳 Servidor escuchando en http://localhost:3000"); 
});