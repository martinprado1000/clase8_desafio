const express = require("express");
const app = express();
const port = 8080;
const productsRoutes = require ("./routes/productsRoutes.js")
const cartsRoutes = require ("./routes/cartsRoutes.js")


//---- Middleware ----
app.use(express.json()); // Para que espress entienda las extensiones json.
app.use(express.urlencoded({extended: false})) 

app.use("/api/",productsRoutes);
app.use("/api/",cartsRoutes);

//Ruta incorrecta
app.use((req, res) => {
  res.status(404).send({ "Error" : "La ruta deseada no existe" });
});

app.listen(port, () => {
  console.log("servidor de Express escuchando en el puerto", port);
});
