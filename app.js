const express = require('express');
var morgan = require('morgan');
const mysql = require("mysql");

// criar uma app express
const app = express()

// registar o template engine (view engine)
app.set('view engine', 'ejs')

//Middleware
app.use(express.static('views'))
app.use(morgan('dev'))


//mysql
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Fc.porto.20',
    database: 'marketplace_b2b'
})

//connect to database
connection.connect(function(error){
    if(error){
        throw error
    } else{
        console.log("Connected to database")
    }
})





// routes
//************ Index routes *********
app.get('/', async (req, res) => {
    try {
        // Primeira Query
        const query1 = 'SELECT * FROM departments';
        const results1 = await executeQuery(query1);

        // Segunda Query
        const query2 = 'SELECT company_name FROM companies ORDER BY RAND() LIMIT 9';
        const results2 = await executeQuery(query2);

        // Terceira Query
        const query3 = 'SELECT COUNT(*) AS total_products FROM products';
        const results3 = await executeQuery(query3);

        // Quarta query
        const query4 = 'SELECT p.*, c.company_name AS company_name FROM products p JOIN companies c ON p.company_id = c.id ORDER BY RAND() LIMIT 16';
        const products = await executeQuery(query4);

        // Quinta query
        const query5 = 'SELECT p.* FROM products p JOIN sub_departments sd ON p.sub_department_id = sd.id JOIN departments d ON sd.department_id = d.id WHERE d.id = 2 ORDER BY RAND() LIMIT 5';
        const results5 = await executeQuery(query5);

        // Sexta query
        const query6 = 'SELECT p.* FROM products p JOIN sub_departments sd ON p.sub_department_id = sd.id JOIN departments d ON sd.department_id = d.id WHERE d.id = 3 ORDER BY RAND() LIMIT 5';
        const results6 = await executeQuery(query6);

        // Setima query
        const query7 = 'SELECT p.* FROM products p JOIN sub_departments sd ON p.sub_department_id = sd.id JOIN departments d ON sd.department_id = d.id WHERE d.id = 6 ORDER BY RAND() LIMIT 5';
        const results7 = await executeQuery(query7);

        // Dividir os produtos em dois grupos de 4 produtos cada (Quarta query)
        const productsGroup1 = products.slice(0, 6);
        const productsGroup2 = products.slice(6, 12);
        const productsGroup3 = products.slice(8, 16);

        // Formatar os preços com duas casas decimais
        products.forEach(product => {
            product.formatted_price = product.price.toFixed(2);
            if (product.is_promotion) {
                product.formatted_promotion_price = product.promotion_price.toFixed(2);
            }
        });

        // Renderizar a página EJS com os resultados
        res.render('index', { results1, results2, totalProducts: results3[0].total_products, productsGroup1, productsGroup2, productsGroup3, results5, results6, results7 });
        
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao processar as queries.');
    }

});

function executeQuery(query) {
    return new Promise((resolve, reject) => {
        connection.query(query, (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}


app.get('/', (req, res) => {
    res.render('index')
});

//************ page-global routes *********
app.get('/page-global', async (req, res) => {
    try {
        // Primeira Query
        const query1 = 'SELECT * FROM departments';
        const results1 = await executeQuery(query1);

        // Segunda Query
        const query2 = 'SELECT company_name FROM companies ORDER BY RAND() LIMIT 9';
        const results2 = await executeQuery(query2);

        // Terceira Query
        const query3 = 'SELECT COUNT(*) AS total_products FROM products';
        const results3 = await executeQuery(query3);

        // Quarta query
        const query4 = 'SELECT p.*, c.company_name AS company_name FROM products p JOIN companies c ON p.company_id = c.id ORDER BY RAND() LIMIT 26';
        const products = await executeQuery(query4);

        // Quinta query
        const query5 = 'SELECT p.* FROM products p JOIN sub_departments sd ON p.sub_department_id = sd.id JOIN departments d ON sd.department_id = d.id WHERE d.id = 2 ORDER BY RAND() LIMIT 5';
        const results5 = await executeQuery(query5);

        // Sexta query
        const query6 = 'SELECT p.* FROM products p JOIN sub_departments sd ON p.sub_department_id = sd.id JOIN departments d ON sd.department_id = d.id WHERE d.id = 3 ORDER BY RAND() LIMIT 5';
        const results6 = await executeQuery(query6);

        // Setima query
        const query7 = 'SELECT p.* FROM products p JOIN sub_departments sd ON p.sub_department_id = sd.id JOIN departments d ON sd.department_id = d.id WHERE d.id = 6 ORDER BY RAND() LIMIT 5';
        const results7 = await executeQuery(query7);

        // Dividir os produtos em dois grupos de 4 produtos cada (Quarta query)
        const productsGroup1 = products.slice(0, 6);
        const productsGroup2 = products.slice(6, 12);
        const productsGroup3 = products.slice(12, 18);
        const productsGroup4 = products.slice(18, 26);

        // Formatar os preços com duas casas decimais
        products.forEach(product => {
            product.formatted_price = product.price.toFixed(2);
            if (product.is_promotion) {
                product.formatted_promotion_price = product.promotion_price.toFixed(2);
            }
        });

        // Renderizar a página EJS com os resultados
        res.render('page-global', { results1, results2, totalProducts: results3[0].total_products, productsGroup1, productsGroup2, productsGroup3, productsGroup4, results5, results6, results7 });
        
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao processar as queries.');
    }

});

function executeQuery(query) {
    return new Promise((resolve, reject) => {
        connection.query(query, (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}



//************ page-category routes *********
app.get('/page-category', (req, res) => {
    try {
        res.render('page-category')
        
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao processar as queries.');
    }
})

function executeQuery(query) {
    return new Promise((resolve, reject) => {
        connection.query(query, (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

//************ page-offer routes *********
app.get('/page-offer', (req, res) => {
    res.render('page-offer')
})

//************ page-single routes *********
app.get('/page-single', (req, res) => {
    res.render('page-single')
})

//************ cart routes *********
app.get('/cart', (req, res) => {
    res.render('cart')
})

//************ checkout routes *********
app.get('/checkout', (req, res) => {
    res.render('checkout')
})


//escutar os request
app.listen(3000);