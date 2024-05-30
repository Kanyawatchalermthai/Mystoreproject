import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mysql from 'mysql2/promise';
import multer from 'multer';
import jwt from 'jsonwebtoken';

//upload image
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const type = file.originalname;
    const fourlastchar = type.slice(type.length - 4);
    const lastnameFile = fourlastchar === ".jpg" || fourlastchar === ".png" ? fourlastchar : fourlastchar === "jpeg" ? "." + fourlastchar : "";
    cb(null, Date.now() + '_' + (Math.floor(Math.random() * 90000) + 10000).toString() + lastnameFile);
  },
});

const upload = multer({ storage: storage });

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
const port = 3000;

const config = {
  host: 'database.cjm80agmmdpx.us-east-1.rds.amazonaws.com',
  user: 'admin',
  password: 'password',
  database: 'myDatabase'
};

//get account
app.post('/auth',(req,res) => {
  console.log("hello");
  const user = req.body;
  sql.connect(config)
    .then(pool => {
      return pool.request()
      .input('userName', sql.NVarChar, user.username)
      .query('SELECT * FROM "account" WHERE userName = @userName');
    })
    .then(result => {
      if (result.recordset.length > 0) {
        var userfromquery = result.recordset[0];
        console.log(userfromquery);
        if (user.password === userfromquery.userPassword){
          const jwtToken = jwt.sign(
            {
              id: userfromquery.id,
              username: userfromquery.userName,
            },"1234",
            {expiresIn:'12h'}
          )
          res.json({message: 'Authenticate', token: jwtToken})
        } else {
          res.json({message: 'invalid...'})
        }
      } else {
        res.json({message: 'invalid...'})
      }
    }) 
    .catch(error => {
      res.status(500).json({error: 'Internal Server Error'})
    })
})

  //upload image
  app.post("/upload", upload.single("file"), function (req, res) {
    console.log("hello");
    console.log(req.file);
  const file = req.file;
  res.status(200).json(file.filename);
});



//get product from database
app.get('/product', (req, res) => {
    sql.connect(config)
      .then(pool => {
        return pool.request().query('SELECT * FROM product');
      })
      .then(result => {
        res.json(result.recordset);
      })
      .catch(err => {
        console.error('Error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      });
  });

//get product detail for each id
  app.get('/product/:id', (req, res) => {
    const { id } = req.params;
    sql.connect(config)
      .then(pool => {
        return pool.request()
                   .input('productId', sql.Int, id)
                   .query('SELECT * FROM product WHERE id = @productId');
      })
      .then(result => {
        if (result.recordset.length > 0) {
            res.json(result.recordset[0]);
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
      })
      .catch(err => {
        console.error('Error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      });
});

//upload addProduct to database
app.post('/products', async (req, res) => {
  console.log("hello");
  const newProduct = { // สร้าง Object newProduct
    name: req.body.name,
    image: req.body.image,
    price: req.body.price,
    description: req.body.description,
    type: req.body.type
  };

  try {
  const pool = await sql.connect(config);
  const result = await pool
    .request()
    .input('name', sql.NVarChar, newProduct.name)
    .input('image', sql.NVarChar, newProduct.image)
    .input('price', sql.Decimal(10, 2), newProduct.price)
    .input('description', sql.NVarChar, newProduct.description)
    .input('type', sql.NVarChar, newProduct.type)
    .query('INSERT INTO product (productName, productPrice, productDescription, PathToPicture, type) VALUES (@name, @price, @description,@image,@type)');
await pool.close();
res.send('Form data received and inserted into the database successfully!');
  }
  catch (error) {
  console.error('Error inserting data into the database:', error.message);
}
});

//run server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
