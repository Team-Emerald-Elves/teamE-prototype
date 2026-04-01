import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

const app = express();
const PORT = parseInt(process.env.PORT!) || 3000;
let filename = "";

const __dirname = path.dirname(fileURLToPath(import.meta.url + "/../"));
console.log(__dirname);

//app.use("/public", express.static('public'));

app.get('/', (req, res) => {
    res.send("Hello World!");
})

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}!`);
})
