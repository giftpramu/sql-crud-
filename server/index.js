import express from "express" 
import mysql from "mysql"

const app = express()

app.use(express.json());

//database connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'DATABASE PASSWORD',
    database: 'DATABASE NAME'
});


connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL database as id ' + connection.threadId);
});

//Insert data

app.post("/products", (req,res) => {
    const q = "INSERT INTO products (productName,price,size) VALUES (?,?,?)";     
    const values = ['box','45.00','10g'];

connection.query(q, values, (err, data) => {
if(err) return res.json(err)
return res.json("product created successfully") 
});
});

//Get data

app.get("/", (req,res)=>{
    res.json("Hello this is the backend !!!")
})

app.get("/products",(req,res)=>{
    const q = "SELECT * From products"
    connection.query(q, (err, data) => {
        if(err) return res.json(err)
        return res.json(data)
    })
})

//Delete data

app.delete("/products/:id", (req, res) => {
    const idProducts = req.params.id;
    const q = "DELETE FROM products WHERE idProducts = 2";

    connection.query(q, [idProducts], (err, data) => {
        if(err) return res.json(err);
        return res.json("Product has been deleted successfully");
    })
})


// Update data
const updateQuery = 'UPDATE products SET productName = ?, price = ?, size = ? WHERE idProducts = ?';

const newData = {
    productName: 'Scan',
  price: '2000.00',
  size: '10g',
  idProducts: 1 
};

connection.query(updateQuery, [newData.productName, newData.price, newData.size, newData.idProducts], (err, results) => {
  if (err) {
    console.error('Error updating data:', err);
    throw err;
  }

  console.log(`Rows affected: ${results.affectedRows}`);
});


app.listen(201 , ()=> {
     console.log("Connected to Backend!!")
 })


// Close the connection 
process.on('SIGINT', () => {
    connection.end((err) => {
        if (err) {
            console.error('Error closing MySQL database connection: ' + err.stack);
            process.exit(1);
        }
        console.log('Connection closed.');
        process.exit(0);
    });
});



