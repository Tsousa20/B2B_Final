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
        const query4 = 'SELECT p.*, c.company_name AS company_name FROM products p JOIN companies c ON p.company_id = c.id ORDER BY RAND() LIMIT 20';
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




//************ page-category routes *********
app.get('/page-category', async (req, res) => {
    try {
        // Primeira Query -> Vai buscar todos os deartamentos para a navbar superior
        const query1 = 'SELECT * FROM departments';
        const results1 = await executeQuery(query1);
 
        // Segunda Query -> Vai buscar empresas para a navbar superior
        const query2 = 'SELECT company_name FROM companies ORDER BY RAND() LIMIT 9';
        const results2 = await executeQuery(query2);
 
        // Terceira Query -> Conta o numero de produtos para o menu lateral
        const query3 = 'SELECT COUNT(*) AS total_products FROM products';
        const results3 = await executeQuery(query3);

        // Quarta query -> Vai buscar produtos para os banners
        const query4 = 'SELECT p.* FROM products p JOIN sub_departments sd ON p.sub_department_id = sd.id JOIN departments d ON sd.department_id = d.id WHERE d.id = 2 ORDER BY RAND() LIMIT 5';
        const results4 = await executeQuery(query4);

        // Quinta query -> Vai buscar produtos para os banners
        const query5 = 'SELECT p.* FROM products p JOIN sub_departments sd ON p.sub_department_id = sd.id JOIN departments d ON sd.department_id = d.id WHERE d.id = 3 ORDER BY RAND() LIMIT 5';
        const results5 = await executeQuery(query5);

        // Sexta query -> Vai buscar produtos para os banners
        const query6 = 'SELECT p.* FROM products p JOIN sub_departments sd ON p.sub_department_id = sd.id JOIN departments d ON sd.department_id = d.id WHERE d.id = 6 ORDER BY RAND() LIMIT 5';
        const results6 = await executeQuery(query6);

        //Setima Query -> Vai buscar os sub-departamentos para a secção de produtos e respetivas quantidades
        const query7 = 'SELECT sd.id, sd.name_sub_depart AS sub_departamento_nome, COUNT(p.id) AS total_produtos FROM sub_departments sd LEFT JOIN products p ON sd.id = p.sub_department_id JOIN departments d ON sd.department_id = d.id WHERE d.id = 4 GROUP BY sd.id, sd.name_sub_depart';
        const results7 = await executeQuery(query7);

        //Oitava Query -> Vai buscar as empresas para a secção de brands e respetivas quantidades
        const query8 = 'SELECT c.company_name, COUNT(p.id) AS total_produtos FROM products p JOIN sub_departments sd ON p.sub_department_id = sd.id JOIN departments d ON sd.department_id = d.id JOIN companies c ON p.company_id = c.id WHERE d.id = 4 GROUP BY c.company_name';
        const results8 = await executeQuery(query8);

        //Nona Query -> Conta o numero de produtos que estão neste intervalo de preço
        const query9 = 'SELECT COUNT(p.id) AS total_produtos FROM products p JOIN sub_departments sd ON p.sub_department_id = sd.id JOIN departments d ON sd.department_id = d.id WHERE d.id = 4 AND p.price BETWEEN 0 AND 49';
        const results9 = await executeQuery(query9);

        //Decima Query -> Conta o numero de produtos que estão neste intervalo de preço
        const query10 = 'SELECT COUNT(p.id) AS total_produtos FROM products p JOIN sub_departments sd ON p.sub_department_id = sd.id JOIN departments d ON sd.department_id = d.id WHERE d.id = 4 AND p.price BETWEEN 50 AND 99';
        const results10 = await executeQuery(query10);

        //Decima Primeira Query -> Conta o numero de produtos que estão neste intervalo de preço
        const query11 = 'SELECT COUNT(p.id) AS total_produtos FROM products p JOIN sub_departments sd ON p.sub_department_id = sd.id JOIN departments d ON sd.department_id = d.id WHERE d.id = 4 AND p.price BETWEEN 100 AND 149';
        const results11 = await executeQuery(query11);

        //Decima Segunda Query -> Conta o numero de produtos que estão neste intervalo de preço
        const query12 = 'SELECT COUNT(p.id) AS total_produtos FROM products p JOIN sub_departments sd ON p.sub_department_id = sd.id JOIN departments d ON sd.department_id = d.id WHERE d.id = 4 AND p.price >= 150';
        const results12 = await executeQuery(query12);

        // Renderizar a página EJS com os resultados
        res.render('page-category', { results1, results2, totalProducts: results3[0].total_products, results4, results5, results6, results7, results8, results9, results10, results11, results12 });
        
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao processar as queries.');
    }
});


app.get('/load-more-products', async (req, res) => {
    const departmentId = 23; // ID do departamento específico
    const page = parseInt(req.query.page) || 1; // Página atual, default é 1
    const limit = 2; // Número de produtos por página
    const offset = (page - 1) * limit; // Calcula o OFFSET

    try {
        const result = await executeQuery(
            `SELECT p.*
             FROM products p
             JOIN sub_departments sd ON p.sub_department_id = sd.id
             JOIN departments d ON sd.department_id = d.id
             WHERE d.id = $1
             LIMIT $2 OFFSET $3`,
            [departmentId, limit, offset]
        );

        res.json(result); // Envia os produtos como resposta JSON
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao processar a query.');
    }
});

function executeQuery(query, params = []) {
    return new Promise((resolve, reject) => {
        connection.query(query, params, (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

app.get('/load-more-products', async (req, res) => {
    try {
        const offset = parseInt(req.query.offset, 18) || 0; // Pegar o offset da query string

        // Query para carregar mais produtos com base no offset
        const query = `SELECT p.*, c.company_name AS company_name 
        FROM products p 
        JOIN companies c ON p.company_id = c.id 
        ORDER BY RAND() 
        LIMIT 18 OFFSET ${offset}`;

        const products = await executeQuery(query, [offset]);

        // Formatar os preços com duas casas decimais
        products.forEach(product => {
            product.formatted_price = product.price.toFixed(2);
            if (product.is_promotion) {
                product.formatted_promotion_price = product.promotion_price.toFixed(2);
            }
        });

        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao carregar mais produtos.');
    }
});
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