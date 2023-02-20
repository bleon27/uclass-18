//lo que requiero
const express = require('express');
//const bodyParser = require("body-parser");
//const { json } = require('express');
const dontenv = require("dotenv");

//valores iniciales o por defecto
dontenv.config();
const app = express();
const port = process.env.SERVER_PORT;

//proceso o estructura
//app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

//app.get("/health-check", (req, res) => {
app.get("/status", (req, res) => {
    res.status(200).json({
        "done": true,
        "api": {
            "name": "ucamp-express",
            "version": "0.1.0",
            "owner": "UCamp",
            "developer": "Bryan Leon",
        },
        "services": {
            "database": "alive"
        }
    })
});

const listaPlatillos = [
    {
        id: 1,
        nombre: "spaguetti",
        precio: 50,
        descripcion: "pasta con crema",
        categoria: "pastas",
    },
    {
        id: 2,
        nombre: "hamburguesa",
        precio: 70,
        descripcion: "hamburguesa de res con papas",
        categoria: "snacks",
    }
];
var lastId = 2;

function findById(id) {
    var found = null;
    for (const platillo of listaPlatillos) {
        if (platillo["id"] == id) {
            found = platillo;
            break;
        }
    }
    return found;
}

function findPositionById(id) {
    var index = 0;
    var found = null;
    for (const platillo of listaPlatillos) {
        if (platillo["id"] == id) {
            found = index;
            break;
        }
        index++;
    }
    if (found != null) {
        return found;
    }
    return -1;
}
/*
que recurso?                        platillo
que metodo?                         GET
que datos de entrada requiere?      N/A
que debe responder                  Lista con todos los platillos del menu
*/

app.get("/platillos", (request, response) => {
    response.json({
        quantity: listaPlatillos.length,
        items: listaPlatillos
    });
})

/*
que recurso?                        platillo
que metodo?                         GET
que datos de entrada requiere?      id (path)
que debe responder                  obtener un platillo por id
*/

app.get("/platillos/:identificador", (request, response) => {
    //request.query     GET /platillo?categoria=snack   -> query param
    //request.params    GET /platillo/2                 -> path param
    //request.body      POST /platillo/                 -> data param
    var id = request.params.identificador;
    var found = findById(id);
    response.json({
        done: !(found == null),
        item: found
    });
})

app.post("/platillos", (request, response) => {
    var info = request.body;
    lastId++;
    var nuevoPlatillo = {
        id: lastId,
        nombre: info.nombre,
        precio: info.precio,
        descripcion: info.descipcion,
        categoria: info.categoria,
    }
    listaPlatillos.push(nuevoPlatillo);
    response.json({
        done: true,
        item: nuevoPlatillo
    })
})

app.put("/platillos/:id", (request, response) => {
    var platillo = findById(request.params.id);
    if (platillo) {
        platillo["precio"] = req.body.precio
    }
    response.json({
        done: !(platillo == null),
        id: req.params.id,
        data: req.body
    });
});

app.delete("/platillos/:id", (request, response) => {
    var position = findPositionById(request.params.id);
    var position = listaPlatillos.findIndex(platillo => platillo.id == request.params.id);
    var deleted = false;
    if (position != -1) {
        //slice => rebanar
        listaPlatillos.splice(position, 1);
        deleted = true;
    }
    response.json({
        done: deleted,
        data: request.params.id
    });
});
//consumo
app.listen(port, () => {
    console.log(`running server on http://localhost:${port}`)
})