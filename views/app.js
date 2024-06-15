const express = require('express');
var morgan = require('morgan');
const mysql = require("mysql");
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const session = require('express-session');

// criar uma app express
const app = express()

// registar o template engine (view engine)
app.set('view engine', 'ejs')

//Middleware
app.use(express.static('views'))
app.use(morgan('dev'))

// Configuração do body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuração do express-session
app.use(session({
    secret: '$anjos9487$martins9274$lanca9479$sousa8548$',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));


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

        // Oitava query -> Vai buscar 1 produto random para a promoção
        const query8 = 'SELECT p.*, c.company_name AS company_name FROM products p JOIN companies c ON p.company_id = c.id WHERE p.is_promotion = 1 ORDER BY RAND() LIMIT 1';
        const results8 = await executeQuery(query8);
        const productBig = results8[0];

        // Formatar os preços com duas casas decimais
        productBig.formatted_price = productBig.price.toFixed(2);
        productBig.formatted_promotion_price = productBig.promotion_price.toFixed(2);   

        // Nona query -> vai buscar os departamentos e sub-departamentos para o menu lateral
        const query9 = 'SELECT d.id AS department_id, d.name_depart AS department_name, d.icon_depart AS icon_depart, sd.id AS sub_department_id, sd.name_sub_depart AS sub_department_name FROM departments d LEFT JOIN sub_departments sd ON d.id = sd.department_id';
        const results9 = await executeQuery(query9);

        // Agrupar os resultados por departamento
        const departments = results9.reduce((acc, row) => {
            const { department_id, department_name, icon_depart, sub_department_id, sub_department_name } = row;
            if (!acc[department_id]) {
                acc[department_id] = {
                    id: department_id,
                    name: department_name,
                    icon: icon_depart,
                    subDepartments: []
                };
            }
            if (sub_department_id) {
                acc[department_id].subDepartments.push({
                    id: sub_department_id,
                    name: sub_department_name
                });
            }
            return acc;
        }, {});

        const departmentList = Object.values(departments);

        // Decima Query -> vai buscar os sub-departamentos para o nav superior
        const query10 = 'SELECT * FROM sub_departments ORDER BY RAND() LIMIT 9';
        const results10 = await executeQuery(query10);

        // Cart Query -> Vai buscar os itens do carrinho do cliente
        if (req.session.user) {
            const userId = req.session.user.id;
    
            const cartQuery = 'SELECT c.product_id, c.quantity, p.product_name, p.price, p.main_img FROM carts c JOIN products p ON c.product_id = p.id WHERE c.company_id = ?';
            const cartItems = await executeQuery(cartQuery, [userId]);
    
            res.render('index', { isAuthenticated:true, results1, results2, totalProducts: results3[0].total_products, productsGroup1, productsGroup2, productsGroup3, results5, results6, results7, productBig, departments: departmentList, results10, cartItems });
        } else {
            res.render('index', { isAuthenticated:false, results1, results2, totalProducts: results3[0].total_products, productsGroup1, productsGroup2, productsGroup3, results5, results6, results7, productBig, departments: departmentList, results10 });
        }
        
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
app.get('/page-category/:id', async (req, res) => {
    try {

        // Id do produto selecionado
        const departmentId = req.params.id;
        const results0 = departmentId;

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

        // Setima Query -> Vai buscar os sub-departamentos para a secção de produtos e respetivas quantidades
        const query7 = 'SELECT sd.id AS sub_departamento_id, sd.name_sub_depart AS sub_departamento_nome, COUNT(p.id) AS total_produtos FROM sub_departments sd LEFT JOIN products p ON sd.id = p.sub_department_id JOIN departments d ON sd.department_id = d.id WHERE d.id = ? GROUP BY sd.id, sd.name_sub_depart';
        const results7 = await executeQuery(query7, [departmentId]);

        // Oitava Query -> Vai buscar as empresas para a secção de brands e respetivas quantidades
        const query8 = 'SELECT c.company_name, COUNT(p.id) AS total_produtos FROM products p JOIN sub_departments sd ON p.sub_department_id = sd.id JOIN departments d ON sd.department_id = d.id JOIN companies c ON p.company_id = c.id WHERE d.id = ? GROUP BY c.company_name';
        const results8 = await executeQuery(query8, [departmentId]);

        // Nona Query -> Conta o numero de produtos que estão neste intervalo de preço
        const query9 = 'SELECT COUNT(p.id) AS total_produtos FROM products p JOIN sub_departments sd ON p.sub_department_id = sd.id JOIN departments d ON sd.department_id = d.id WHERE d.id = ? AND p.price BETWEEN 0 AND 49';
        const results9 = await executeQuery(query9, [departmentId]);

        // Decima Query -> Conta o numero de produtos que estão neste intervalo de preço
        const query10 = 'SELECT COUNT(p.id) AS total_produtos FROM products p JOIN sub_departments sd ON p.sub_department_id = sd.id JOIN departments d ON sd.department_id = d.id WHERE d.id = ? AND p.price BETWEEN 50 AND 99';
        const results10 = await executeQuery(query10, [departmentId]);

        // Decima Primeira Query -> Conta o numero de produtos que estão neste intervalo de preço
        const query11 = 'SELECT COUNT(p.id) AS total_produtos FROM products p JOIN sub_departments sd ON p.sub_department_id = sd.id JOIN departments d ON sd.department_id = d.id WHERE d.id = ? AND p.price BETWEEN 100 AND 149';
        const results11 = await executeQuery(query11, [departmentId]);

        // Decima Segunda Query -> Conta o numero de produtos que estão neste intervalo de preço
        const query12 = 'SELECT COUNT(p.id) AS total_produtos FROM products p JOIN sub_departments sd ON p.sub_department_id = sd.id JOIN departments d ON sd.department_id = d.id WHERE d.id = ? AND p.price >= 150';
        const results12 = await executeQuery(query12, [departmentId]);

        // Decima Terceira Query -> Vai buscar os produtos que pertencem aquele departamento 12 de cada vez
        const query13 = 'SELECT p.*, c.company_name AS company_name FROM products p JOIN companies c ON p.company_id = c.id JOIN sub_departments sd ON p.sub_department_id = sd.id JOIN departments d ON sd.department_id = d.id WHERE d.id = ? LIMIT 12';
        const products = await executeQuery(query13, [departmentId]);

        // Decima Quarta Query -> Conta o numero de produtos existentes que pertencem aquele departamento
        const countQuery = 'SELECT d.id AS department_id, COUNT(*) AS total FROM products p JOIN sub_departments sd ON p.sub_department_id = sd.id JOIN departments d ON sd.department_id = d.id WHERE d.id = ?';
        const [{ department_id, total }] = await executeQuery(countQuery, [departmentId]);

        // Formatar os preços com duas casas decimais
        products.forEach(product => {
            product.formatted_price = product.price.toFixed(2);
            if (product.is_promotion) {
                product.formatted_promotion_price = product.promotion_price.toFixed(2);
            }
        });

        // Decima Quinta Query ->
        const query15 = 'SELECT name_depart AS name_depart, description_depart AS description_depart FROM departments WHERE id = ?';
        const results15 = await executeQuery(query15, [departmentId]);
        const departmentDetails = results15[0]

        // Decima Sexta query -> vai buscar os departamentos e sub-departamentos para o menu lateral
        const query16 = 'SELECT d.id AS department_id, d.name_depart AS department_name, d.icon_depart AS icon_depart, sd.id AS sub_department_id, sd.name_sub_depart AS sub_department_name FROM departments d LEFT JOIN sub_departments sd ON d.id = sd.department_id';
        const results16 = await executeQuery(query16);

        // Agrupar os resultados por departamento
        const departments = results16.reduce((acc, row) => {
            const { department_id, department_name, icon_depart, sub_department_id, sub_department_name } = row;
            if (!acc[department_id]) {
                acc[department_id] = {
                    id: department_id,
                    name: department_name,
                    icon: icon_depart,
                    subDepartments: []
                };
            }
            if (sub_department_id) {
                acc[department_id].subDepartments.push({
                    id: sub_department_id,
                    name: sub_department_name
                });
            }
            return acc;
        }, {});

        const departmentList = Object.values(departments);

        // Decima Setima Query -> vai buscar os sub-departamentos para o nav superior
        const query17 = 'SELECT * FROM sub_departments ORDER BY RAND() LIMIT 9';
        const results17 = await executeQuery(query17);

        // Cart Query -> Vai buscar os itens do carrinho do cliente
        if (req.session.user) {
            const userId = req.session.user.id;
            
            const cartQuery = 'SELECT c.product_id, c.quantity, p.product_name, p.price, p.main_img FROM carts c JOIN products p ON c.product_id = p.id WHERE c.company_id = ?';
            const cartItems = await executeQuery(cartQuery, [userId]);
            
            res.render('page-category', { isAuthenticated:true, results0, results1, results2, totalProducts: results3[0].total_products, results4, results5, results6, results7, results8, results9, results10, results11, results12, products, totalProducts2: total, DepartmentId: department_id, departmentDetails, departments: departmentList, results17, cartItems });
        } else {
            res.render('page-category', { isAuthenticated:false, results0, results1, results2, totalProducts: results3[0].total_products, results4, results5, results6, results7, results8, results9, results10, results11, results12, products, totalProducts2: total, DepartmentId: department_id, departmentDetails, departments: departmentList, results17 });
        }
        
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao processar as queries.');
    }
});

app.get('/load-more-products/:department_id', async (req, res) => {
    try {

        const DepartmentId = req.params.department_id;

        const offset = parseInt(req.query.offset) || 0; // Pegar o offset da query string

        // Query para contar o numero de produtos que pertencem aquele departamento
        const countQuery = 'SELECT COUNT(*) AS total FROM products p JOIN sub_departments sd ON p.sub_department_id = sd.id JOIN departments d ON sd.department_id = d.id WHERE d.id = ?';
        const [{ total }] = await executeQuery(countQuery, [DepartmentId]);

        // Query para carregar mais produtos com base no offset
        const query = 'SELECT p.*, c.company_name FROM products p JOIN companies c ON p.company_id = c.id JOIN sub_departments sd ON p.sub_department_id = sd.id JOIN departments d ON sd.department_id = d.id WHERE d.id = ? LIMIT ?, 12';
        const products = await executeQuery(query, [DepartmentId, offset]);

        // Formatar os preços com duas casas decimais
        products.forEach(product => {
            product.formatted_price = product.price.toFixed(2);
            if (product.is_promotion) {
                product.formatted_promotion_price = product.promotion_price.toFixed(2);
            }
        });

        res.json({ products, total });

    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao carregar mais produtos.');
    }
});

// rota dos filtros
app.post('/filter-products/:departmentId', async (req, res) => {
    const { subDepartments, brands, prices, order } = req.body;
    const { departmentId } = req.params;

    let query = `
    SELECT p.*, c.company_name
    FROM products p
    JOIN companies c ON p.company_id = c.id
    JOIN sub_departments sd ON p.sub_department_id = sd.id
    WHERE sd.department_id = ?
`;
    let queryParams = [departmentId];

    if (subDepartments && subDepartments.length > 0) {
        query += ' AND p.sub_department_id IN (?)';
        queryParams.push(subDepartments);
    }

    if (brands && brands.length > 0) {
        query += ' AND c.company_name IN (?)';
        queryParams.push(brands);
    }

    if (prices && prices.length > 0) {
        const priceConditions = prices.map(price => {
            const [min, max] = price.split('-');
            if (max === 'max') {
                return 'p.price >= ?';
            }
            return 'p.price BETWEEN ? AND ?';
        }).join(' OR ');

        query += ` AND (${priceConditions})`;
        prices.forEach(price => {
            const [min, max] = price.split('-');
            queryParams.push(min);
            if (max !== 'max') {
                queryParams.push(max);
            }
        });
    }

    if (order === 'high-low') {
        query += ' ORDER BY p.price DESC';
    } else if (order === 'low-high') {
        query += ' ORDER BY p.price ASC';
    } else {
        query += ' ORDER BY p.id';
    }


    try {
        const products = await executeQuery(query, queryParams);
        // Formatando os preços
        products.forEach(product => {
            product.formatted_price = product.price.toFixed(2);
            if (product.is_promotion) {
                product.formatted_promotion_price = product.promotion_price.toFixed(2);
            }
        });
        res.json({ products });
    } catch (error) {
        console.error('Erro ao carregar produtos filtrados:', error);
        res.status(500).send('Erro ao carregar produtos filtrados');
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

//************ page-sub_category routes *********
app.get('/page-sub_category/:id', async (req, res) => {
    try {

        // Id do produto selecionado
        const subDepartmentId = req.params.id;
        const results0 = subDepartmentId;

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

       // Oitava Query -> Vai buscar as empresas para a secção de brands e respetivas quantidades
       const query8 = 'SELECT c.company_name, COUNT(p.id) AS total_produtos FROM products p JOIN companies c ON p.company_id = c.id WHERE p.sub_department_id = ? GROUP BY c.company_name';
       const results8 = await executeQuery(query8, [subDepartmentId]);

       // Nona Query -> Conta o numero de produtos que estão neste intervalo de preço
       const query9 = 'SELECT COUNT(p.id) AS total_produtos FROM products p JOIN sub_departments sd ON p.sub_department_id = sd.id WHERE p.sub_department_id = ? AND p.price BETWEEN 0 AND 49';
       const results9 = await executeQuery(query9, [subDepartmentId]);

       // Decima Query -> Conta o numero de produtos que estão neste intervalo de preço
       const query10 = 'SELECT COUNT(p.id) AS total_produtos FROM products p JOIN sub_departments sd ON p.sub_department_id = sd.id WHERE p.sub_department_id = ? AND p.price BETWEEN 50 AND 99';
       const results10 = await executeQuery(query10, [subDepartmentId]);

       // Decima Primeira Query -> Conta o numero de produtos que estão neste intervalo de preço
       const query11 = 'SELECT COUNT(p.id) AS total_produtos FROM products p JOIN sub_departments sd ON p.sub_department_id = sd.id WHERE p.sub_department_id = ? AND p.price BETWEEN 100 AND 149';
       const results11 = await executeQuery(query11, [subDepartmentId]);

       // Decima Segunda Query -> Conta o numero de produtos que estão neste intervalo de preço
       const query12 = 'SELECT COUNT(p.id) AS total_produtos FROM products p JOIN sub_departments sd ON p.sub_department_id = sd.id WHERE p.sub_department_id = ? AND p.price >= 150';
       const results12 = await executeQuery(query12, [subDepartmentId]);

       // Decima Terceira Query -> Vai buscar os produtos que pertencem aquele departamento 12 de cada vez
       const query13 = 'SELECT p.*, c.company_name AS company_name FROM products p JOIN companies c ON p.company_id = c.id JOIN sub_departments sd ON p.sub_department_id = sd.id WHERE p.sub_department_id = ? LIMIT 12';
       const products = await executeQuery(query13, [subDepartmentId]);

       // Formatar os preços com duas casas decimais
       products.forEach(product => {
           product.formatted_price = product.price.toFixed(2);
           if (product.is_promotion) {
               product.formatted_promotion_price = product.promotion_price.toFixed(2);
           }
       });

       // Decima Quarta Query -> Conta o numero de produtos existentes que pertencem aquele sub-departamento
       const countQuery = 'SELECT sd.id AS sub_department_id, COUNT(p.id) AS total FROM products p JOIN sub_departments sd ON p.sub_department_id = sd.id WHERE p.sub_department_id = ?';
       const [{ sub_department_id, total }] = await executeQuery(countQuery, [subDepartmentId]);

       // Decima Quinta Query -> Vai buscar o nome do departamento e do sub-departamento correspondente
       const query15 = 'SELECT sd.name_sub_depart AS name_sub_depart, sd.sub_depart_description AS sub_depart_description, d.name_depart AS name_depart FROM sub_departments sd JOIN departments d ON sd.department_id = d.id WHERE sd.id = ?';
       const results15 = await executeQuery(query15, [subDepartmentId]);
       const departmentDetails = results15[0]

       // Decima Sexta query -> vai buscar os departamentos e sub-departamentos para o menu lateral
       const query16 = 'SELECT d.id AS department_id, d.name_depart AS department_name, d.icon_depart AS icon_depart, sd.id AS sub_department_id, sd.name_sub_depart AS sub_department_name FROM departments d LEFT JOIN sub_departments sd ON d.id = sd.department_id';
       const results16 = await executeQuery(query16);

       // Agrupar os resultados por departamento
       const departments = results16.reduce((acc, row) => {
           const { department_id, department_name, icon_depart, sub_department_id, sub_department_name } = row;
           if (!acc[department_id]) {
               acc[department_id] = {
                   id: department_id,
                   name: department_name,
                   icon: icon_depart,
                   subDepartments: []
               };
           }
           if (sub_department_id) {
               acc[department_id].subDepartments.push({
                   id: sub_department_id,
                   name: sub_department_name
               });
           }
           return acc;
       }, {});

       const departmentList = Object.values(departments);

       // Decima Setima Query -> vai buscar os sub-departamentos para o nav superior
       const query17 = 'SELECT * FROM sub_departments ORDER BY RAND() LIMIT 9';
       const results17 = await executeQuery(query17);

       // Cart Query -> Vai buscar os itens do carrinho do cliente
       if (req.session.user) {
            const userId = req.session.user.id;
        
            const cartQuery = 'SELECT c.product_id, c.quantity, p.product_name, p.price, p.main_img FROM carts c JOIN products p ON c.product_id = p.id WHERE c.company_id = ?';
            const cartItems = await executeQuery(cartQuery, [userId]);
        
            res.render('page-sub_category', { isAuthenticated:true, results0, results1, results2, totalProducts: results3[0].total_products, results4, results5, results6, results8, results9, results10, results11, results12, products, totalProducts2: total, subDepartmentId: sub_department_id, departmentDetails, departments: departmentList, results17, cartItems });
        } else {
            res.render('page-sub_category', { isAuthenticated:false, results0, results1, results2, totalProducts: results3[0].total_products, results4, results5, results6, results8, results9, results10, results11, results12, products, totalProducts2: total, subDepartmentId: sub_department_id, departmentDetails, departments: departmentList, results17 });
        }
       
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao processar as queries.');
    }
});


app.get('/load-more-products-sub-departments/:sub_department_id', async (req, res) => {
    try {

        const subDepartmentId = req.params.sub_department_id;

        const offset = parseInt(req.query.offset) || 0; // Pegar o offset da query string

        // Query para contar o numero de produtos que pertencem aquele sub- departamento
        const countQuery = 'SELECT COUNT(*) AS total FROM products p JOIN sub_departments sd ON p.sub_department_id = sd.id WHERE p.sub_department_id = ?';
        const [{ total }] = await executeQuery(countQuery, [subDepartmentId]);

        // Query para carregar mais produtos com base no offset
        const query = 'SELECT p.*, c.company_name FROM products p JOIN companies c ON p.company_id = c.id JOIN sub_departments sd ON p.sub_department_id = sd.id JOIN departments d ON sd.department_id = d.id WHERE sd.id = ? LIMIT ?, 12';
        const products = await executeQuery(query, [subDepartmentId, offset]);

        // Formatar os preços com duas casas decimais
        products.forEach(product => {
            product.formatted_price = product.price.toFixed(2);
            if (product.is_promotion) {
                product.formatted_promotion_price = product.promotion_price.toFixed(2);
            }
        });

        res.json({ products, total });

    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao carregar mais produtos.');
    }
});

app.post('/filter-products-sub_category/:subDepartmentId', async (req, res) => {
    const { brands, prices, order } = req.body;
    const { subDepartmentId } = req.params;

    let query = `
    SELECT p.*, c.company_name
    FROM products p
    JOIN companies c ON p.company_id = c.id
    WHERE p.sub_department_id = ?
    `;

    let queryParams = [subDepartmentId];

    if (brands && brands.length > 0) {
        query += ' AND c.company_name IN (?)';
        queryParams.push(brands);
    }

    if (prices && prices.length > 0) {
        const priceConditions = prices.map(price => {
            const [min, max] = price.split('-');
            if (max === 'max') {
                return 'p.price >= ?';
            }
            return 'p.price BETWEEN ? AND ?';
        }).join(' OR ');

        query += ` AND (${priceConditions})`;
        prices.forEach(price => {
            const [min, max] = price.split('-');
            queryParams.push(min);
            if (max !== 'max') {
                queryParams.push(max);
            }
        });
    }

    if (order === 'high-low') {
        query += ' ORDER BY p.price DESC';
    } else if (order === 'low-high') {
        query += ' ORDER BY p.price ASC';
    } else {
        query += ' ORDER BY p.id';
    }

    try {
        const products = await executeQuery(query, queryParams);
        // Formatando os preços
        products.forEach(product => {
            product.formatted_price = product.price.toFixed(2);
            if (product.is_promotion) {
                product.formatted_promotion_price = product.promotion_price.toFixed(2);
            }
        });
        res.json({ products });
    } catch (error) {
        console.error('Erro ao carregar produtos filtrados:', error);
        res.status(500).send('Erro ao carregar produtos filtrados');
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



//************ page-single routes *********
app.get('/page-single/:id', async (req, res) => {
    try {

        // Id do produto selecionado
        const productId = req.params.id;

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

        const query7 = 'SELECT p.*, c.company_name, r.rating, r.rating_coment, r.rating_author, r.data_review, sd.name_sub_depart AS name_sub_depart, d.name_depart AS name_depart FROM products p JOIN companies c ON p.company_id = c.id JOIN sub_departments sd ON p.sub_department_id = sd.id JOIN departments d ON sd.department_id = d.id LEFT JOIN rating_product r ON p.id = r.product_id WHERE p.id = ?';
        const results7 = await executeQuery(query7, [productId]);
        const productDetails = results7[0];
    
        // Formatar os preços com duas casas decimais
        productDetails.formatted_price = productDetails.price.toFixed(2);
        if (productDetails.is_promotion) {
            productDetails.formatted_promotion_price = productDetails.promotion_price.toFixed(2);
        }
        
  

        const query8 = 'SELECT p.id, p.main_img, p.product_name, p.stock, p.is_promotion, p.promotion_price, p.discount_percentage, p.price, p.price_symbol, p.min_order, p.product_description, p.sub_department_id, c.company_name, AVG(r.rating) AS average_rating, COUNT(r.rating) AS total_ratings FROM products p JOIN companies c ON p.company_id = c.id JOIN sub_departments sd ON p.sub_department_id = sd.id JOIN departments d ON sd.department_id = d.id LEFT JOIN rating_product r ON p.id = r.product_id WHERE d.id = (SELECT department_id FROM sub_departments WHERE id = (SELECT sub_department_id FROM products WHERE id = ?)) AND p.id != ? GROUP BY p.id, p.main_img, p.product_name, p.stock, p.is_promotion, p.promotion_price, p.discount_percentage, p.price, p.price_symbol, p.min_order, p.product_description, p.sub_department_id, c.company_name LIMIT 12';
        const results8 = await executeQuery(query8, [productId, productId]);

        results8.forEach(product => {
            product.formatted_price = product.price.toFixed(2);
            if (product.is_promotion) {
                product.formatted_promotion_price = product.promotion_price.toFixed(2);
            }
        });

        // Nona query -> vai buscar os departamentos e sub-departamentos para o menu lateral
        const query9 = 'SELECT d.id AS department_id, d.name_depart AS department_name, d.icon_depart AS icon_depart, sd.id AS sub_department_id, sd.name_sub_depart AS sub_department_name FROM departments d LEFT JOIN sub_departments sd ON d.id = sd.department_id';
        const results9 = await executeQuery(query9);

        // Agrupar os resultados por departamento
        const departments = results9.reduce((acc, row) => {
            const { department_id, department_name, icon_depart, sub_department_id, sub_department_name } = row;
            if (!acc[department_id]) {
                acc[department_id] = {
                    id: department_id,
                    name: department_name,
                    icon: icon_depart,
                    subDepartments: []
                };
            }
            if (sub_department_id) {
                acc[department_id].subDepartments.push({
                    id: sub_department_id,
                    name: sub_department_name
                });
            }
            return acc;
        }, {});

        const departmentList = Object.values(departments);

        // Decima Query -> vai buscar os sub-departamentos para o nav superior
        const query10 = 'SELECT * FROM sub_departments ORDER BY RAND() LIMIT 9';
        const results10 = await executeQuery(query10);

        // Cart Query -> Vai buscar os itens do carrinho do cliente
        if (req.session.user) {
            const userId = req.session.user.id;
            
            const cartQuery = 'SELECT c.product_id, c.quantity, p.product_name, p.price, p.main_img FROM carts c JOIN products p ON c.product_id = p.id WHERE c.company_id = ?';
            const cartItems = await executeQuery(cartQuery, [userId]);
            
            res.render('page-single', { isAuthenticated:true, results1, results2, totalProducts: results3[0].total_products, results4, results5, results6, productDetails, results8, departments: departmentList, results10, cartItems });
        } else {
            res.render('page-single', { isAuthenticated:false, results1, results2, totalProducts: results3[0].total_products, results4, results5, results6, productDetails, results8, departments: departmentList, results10 });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao processar as queries.');
    }
})

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



//************ page-offer routes *********
app.get('/page-offer', async (req, res) => {
    res.render('page-offer')
})




//************ cart routes *********
app.get('/cart', checkSession, async (req, res) => {
    try {

        const companyId = req.session.user.id;

        // Primeira Query -> Vai buscar todos os deartamentos para a navbar superior
        const query1 = 'SELECT * FROM departments';
        const results1 = await executeQuery(query1);

        // Decima Setima Query -> vai buscar os sub-departamentos para o nav superior
        const query2 = 'SELECT * FROM sub_departments ORDER BY RAND() LIMIT 9';
        const results2 = await executeQuery(query2);

        // Segunda Query -> Vai buscar empresas para a navbar superior
        const query3 = 'SELECT company_name FROM companies ORDER BY RAND() LIMIT 9';
        const results3 = await executeQuery(query3);

        // Terceira Query -> Conta o numero de produtos para o menu lateral
        const query4 = 'SELECT COUNT(*) AS total_products FROM products';
        const results4 = await executeQuery(query4);

        // Quinta query -> vai buscar os departamentos e sub-departamentos para o menu lateral
        const query5 = 'SELECT d.id AS department_id, d.name_depart AS department_name, d.icon_depart AS icon_depart, sd.id AS sub_department_id, sd.name_sub_depart AS sub_department_name FROM departments d LEFT JOIN sub_departments sd ON d.id = sd.department_id';
        const results5 = await executeQuery(query5);

        // Agrupar os resultados por departamento
        const departments = results5.reduce((acc, row) => {
            const { department_id, department_name, icon_depart, sub_department_id, sub_department_name } = row;
            if (!acc[department_id]) {
                acc[department_id] = {
                    id: department_id,
                    name: department_name,
                    icon: icon_depart,
                    subDepartments: []
                };
            }
            if (sub_department_id) {
                acc[department_id].subDepartments.push({
                    id: sub_department_id,
                    name: sub_department_name
                });
            }
            return acc;
        }, {});

        const departmentList = Object.values(departments);

        // Sexta query -> vai buscar os produtos que o cliente adicionou ao carrinho
        const query6 = 'SELECT p.id AS product_id, p.product_name AS product_name, p.price, p.main_img, p.min_order, c.quantity, co.company_name AS company_name FROM carts c JOIN products p ON c.product_id = p.id JOIN companies co ON p.company_id = co.id WHERE c.company_id = ?';
        const results6 = await executeQuery(query6, [companyId]);

        // Setima query -> vai buscar as opções de entrega
        const query7 = 'SELECT * FROM delivery_services';
        const deliveryServices = await executeQuery(query7);

        // Mostrar os produtos no icon do cart
        const cartQuery = 'SELECT COUNT(*) AS totalProductsCart, SUM(p.price * c.quantity) AS subtotalCart FROM carts c JOIN products p ON c.product_id = p.id WHERE c.company_id = ?';
        const cartItems = await executeQuery(cartQuery, [companyId]);
        const { totalProductsCart, subtotalCart } = cartItems[0];

        res.render('cart', { results1, results2, results3, totalProducts: results4[0].total_products, departments: departmentList, results6, deliveryServices, totalProductsCart, subtotalCart })
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao processar as queries.');
    }
})

// Rota para adicionar itens ao carrinho
app.post('/add-to-cart', checkSession, async (req, res) => {
    const { productId, quantity } = req.body;
    const companyId = req.session.user.id;

    console.log(`company_id: ${companyId}`);
    console.log(`product_id: ${productId}`);
    console.log(`quantity: ${quantity}`);

    try {
        // Verifique se o item já está no carrinho
        const [cartItem] = await executeQuery(
            'SELECT * FROM carts WHERE company_id = ? AND product_id = ?',
            [companyId, productId]
        );

        if (cartItem) {
            // Atualize a quantidade se o item já estiver no carrinho
            await executeQuery(
                'UPDATE carts SET quantity = quantity + ? WHERE company_id = ? AND product_id = ?',
                [quantity, companyId, productId]
            );
            res.json({ success: true, message: 'Produto adicionado ao carrinho com sucesso!' });
        } else {
            // Insira um novo item no carrinho
            await executeQuery(
                'INSERT INTO carts (company_id, product_id, quantity) VALUES (?, ?, ?)',
                [companyId, productId, quantity]
            );
            res.json({ success: true, message: 'Produto adicionado ao carrinho com sucesso!' });
        }
    } catch (error) {
        console.error('Erro ao adicionar item ao carrinho:', error);
        res.json({ success: false, error: 'Erro ao adicionar item ao carrinho' });
    }
});

// Rota para atualizar automatcamente o preço da entrega
app.get('/get-delivery-price', async (req, res) => {
    const { type, speed } = req.query;

    try {
        const query = 'SELECT delivery_price, delivery_speed FROM delivery_services WHERE delivery_type = ? AND delivery_speed = ?';
        const results = await executeQuery(query, [type, speed]);

        if (results.length > 0) {
            const price = results[0].delivery_price;
            const speed = results[0].delivery_speed;
            res.json({ success: true, price: price, speed: speed });
        } else {
            res.json({ success: false, error: 'Preço da entrega não encontrado' });
        }
    } catch (error) {
        console.error('Erro ao obter o preço da entrega:', error);
        res.json({ success: false, error: 'Erro ao obter o preço da entrega' });
    }
});

app.post('/update-cart-and-checkout', async (req, res) => {
    
    const companyId = req.session.user.id;
    const { quantities, productIds, delivery_type, delivery_speed, cart_subtotal, cart_shipping_price, cart_total } = req.body;
    
    try {
        // Atualizar quantidades de produtos no carrinho
        for (let i = 0; i < productIds.length; i++) {
            const productId = productIds[i];
            const quantity = parseInt(quantities[i], 10);

            console.log(`Updating product ${productId} to quantity ${quantity}`);
            const sqlUpdateQuantity = 'UPDATE carts SET quantity = ? WHERE company_id = ? AND product_id = ?';
            await executeQuery(sqlUpdateQuantity, [quantity, companyId, productId]);
        }

        // Atualizar tipo de entrega, velocidade e valores de subtotal, shipping e total
        const sqlUpdateDelivery = 'UPDATE carts SET delivery_type = ?, delivery_speed = ?, cart_subtotal = ?, cart_shipping_price = ?, cart_total = ? WHERE company_id = ?';
        await executeQuery(sqlUpdateDelivery, [delivery_type, delivery_speed, cart_subtotal, cart_shipping_price, cart_total, companyId]);

        // Redirecionar para a página de checkout
        res.redirect('/checkout');
    } catch (error) {
        console.error('Erro ao atualizar o carrinho:', error);
        res.status(500).send('Internal Server Error');
    }

});

app.post('/remove-from-cart', async (req, res) => {
    try {
        const { productId } = req.body;
        const companyId = req.session.user.id;

        // Consulta para remover o item do carrinho
        const query = 'DELETE FROM carts WHERE product_id = ? AND company_id = ?';
        await executeQuery(query, [productId, companyId]);

        res.json({ success: true, message: 'Produto removido do carrinho.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Erro ao remover o produto do carrinho.' });
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



//************ login routes *********
function checkSession(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.status(401).json({ success: false, message: 'Você precisa estar logado para adicionar produtos ao carrinho.' });
    }
}

app.get('/check-session', checkSession, (req, res) => {
    console.log('Session check:', req.session);
    const userId = req.session.user.id;
    res.json({ isAuthenticated: true, userId: userId });
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'views/assets/empresas_img'); // Diretório onde os arquivos serão armazenados
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Nome do arquivo
    }
});

const upload = multer({ storage: storage });

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

app.post('/create-account', upload.single('main_img'), (req, res) => {
    const { email, password, company_name, contact, address, nif, company_description } = req.body;
    const main_img = req.file ? req.file.filename : '';

    // Verificar se já existem contas com os mesmos valores para company_name, nif, ou email
    const checkDuplicatesQuery = 'SELECT * FROM companies WHERE company_name = ? OR nif = ? OR email = ?';
    const checkDuplicatesValues = [company_name, nif, email];

    executeQuery(checkDuplicatesQuery, checkDuplicatesValues)
        .then(results => {
            if (results.length > 0) {
                // Se tiver contas com dados duplicados
                let duplicateFields = [];
                if (results.some(result => result.company_name === company_name)) {
                    duplicateFields.push('Company Name');
                }
                if (results.some(result => result.nif === nif)) {
                    duplicateFields.push('NIF');
                }
                if (results.some(result => result.email === email)) {
                    duplicateFields.push('Email');
                }
                const message = `Um ou mais campos já estão registados: ${duplicateFields.join(', ')}`;
                res.status(400).json({ success: false, message });
            } else {
                bcrypt.hash(password, 10, (err, hash) => {
                    if (err) throw err;

                    // SQL para inserir uma nova empresa
                    const insertQuery = 'INSERT INTO companies (email, passwrd, company_name, contact, adress, nif, company_description, main_img) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
                    const insertValues = [email, hash, company_name, contact, address, nif, company_description, main_img];

                    executeQuery(insertQuery, insertValues)
                        .then(result => {
                            console.log('Empresa registrada com sucesso!');
                            res.json({ success: true, message: 'Account successfully created!' });
                        })
                        .catch(error => {
                            console.error('Erro ao registrar a empresa:', error);
                            res.status(500).json({ success: false, message: 'Erro ao registrar a empresa' });
                        });
                });
            }
        })
        .catch(error => {
            console.error('Erro ao verificar duplicatas:', error);
            res.status(500).json({ success: false, message: 'Erro ao verificar duplicatas' });
        });
 
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;


    try {
        // Verificar o email
        const query = 'SELECT * FROM companies WHERE email = ?';
        const results = await executeQuery(query, [email]);

        if (results.length === 0) {
            console.log('Email não encontrado na base de dados');
            return res.status(401).json({ success: false, message: 'Invalid credentials. Check your email and password and try again.' });
        }


        // Comparar a passwd fornecida com a senha hash armazenada usando bcrypt
        const hashedPassword = results[0].passwrd;
        bcrypt.compare(password, hashedPassword, (bcryptErr, bcryptResult) => {
            if (bcryptErr) {
                console.error('Erro ao comparar as senhas:', bcryptErr);
                return res.status(500).json({ success: false, message: 'Error trying to log in. Please try again later.' });
            }

            if (bcryptResult) {
                console.log('Login bem-sucedido');
                req.session.user = { id: results[0].id, email: results[0].email };
                res.json({ success: true, message: 'Login successful!' });
            } else {
                console.log('Senha incorreta');
                res.status(401).json({ success: false, message: 'Invalid credentials. Check your email and password and try again.' });
            }
        });
    } catch (error) {
        console.error('Erro ao tentar fazer login:', error);
        res.status(500).json({ success: false, message: 'Error trying to log in. Please try again later.' });
    }
});




//************ checkout routes *********
app.get('/checkout', (req, res) => {
    res.render('checkout')
})


//escutar os request
app.listen(3000);