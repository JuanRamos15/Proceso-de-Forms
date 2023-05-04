import path from "path";
import { promises as fs } from 'fs';

global["__dirname"] = path.dirname(new URL(import.meta.url).pathname);
//se crea la constante de error 500
const  error500 = path.join(__dirname, "./views/500.html");

export default async (req, res) => {
    // Desestructurando de "req"
    let { url, method } = req;
    
    console.log(`📣 CLIENT-REQUEST: ${req.url} ${req.method}`);

    // Enrutando peticiones
    switch (url) {
        case '/':
            const readIndex = path.join(__dirname, 'index.html');
            try {
                const data = await fs.readFile("./views/index.html");
                res.writeHead(200, { "Content-Type": "text/html"  });
                res.statusCode = 200;
                res.end(data);
            } catch (err) {
                console.error(err);
                const data = await fs.readFile("./views/500.html");
                res.writeHead(200, { "Content-Type": "text/html"  });
                res.end();
                console.log(`📣 Respondiendo: 500 ${req.url} ${req.method}`);
                // Estableciendo codigo de respuesta
                res.statusCode = 500;
                // Cerrando la comunicacion
                res.end();
            }
            break;
        case '/author':
            const readAuthor = path.join(__dirname, 'author.html');
            try {
                const data = await fs.readFile("./views/author.html");
                res.writeHead(200, { "Content-Type": "text/html"  });
                res.statusCode = 200;
                res.end(data);
            } catch (err) {
                console.error(err);
                const data = await fs.readFile("./views/500.html");
                res.writeHead(200, { "Content-Type": "text/html"  });
                res.end();
                console.log(`📣 Respondiendo: 500 ${req.url} ${req.method}`);
                // Estableciendo codigo de respuesta
                res.statusCode = 500;
                // Cerrando la comunicacion
                res.end();
            }
            break;
        case "/favicon.ico":
            // Especificar la ubicación del archivo de icono
            const faviconPath = path.join(__dirname, 'favicon.ico');
            try {
                const data = await fs.readFile(faviconPath);
                res.writeHead(200, { "Content-Type": "image/x-icon" });
                res.end(data);
            } catch (err) {
                console.error(err);
                // Peticion raiz
                // Estableciendo cabeceras
                res.setHeader('Content-Type', 'text/html');
                // Escribiendo la respuesta
                res.write(``);
                console.log(`📣 Respondiendo: 500 ${req.url} ${req.method}`);
                console.log(`error 500 ${err.message}`)
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
                // Se registra un manejador de eventos
                // Para la recepción de datos
                let body = "";
                req.on("data", (data => {
                    body += data;
                    if (body.length > 1e6) return req.socket.destroy();
                }));
                // Se registra una manejador de eventos
                // para el termino de recepción de datos
                req.on("end", async () => {
                    // Procesa el formulario

                    // Mediante URLSearchParams se extraen
                    // los campos del formulario
                    const params = new URLSearchParams(body);
                    // Se construye un objeto a partir de los datos
                    // en la variable params
                    const parsedParams = Object.fromEntries(params);
                    // Se finaliza la conexion
                    fs.writeFile('message.txt', 'parsedParams.message');
                })
                res.statusCode = 302;
                res.setHeader('Location', '/')
                return res.end();
            } else {
                res.statusCode = 404;
                res.write("404: Endpoint no encontrado")
                res.end();
            }
            break;
        // Continua con el defautl
        default:
            const read404 = path.join(__dirname, 'author.html');
            try {
                const data = await fs.readFile("./views/404.html");
                res.writeHead(200, { "Content-Type": "text/html"  });
                res.statusCode = 404;
                res.end(data);
            } catch (err) {
                console.error(err);
                const data = await fs.readFile("./views/500.html");
                res.writeHead(200, { "Content-Type": "text/html"  });
                res.end();
                console.log(`📣 Respondiendo: 500 ${req.url} ${req.method}`);
                // Estableciendo codigo de respuesta
                res.statusCode = 500;
                // Cerrando la comunicacion
                res.end();
            }
        break;
    }
}