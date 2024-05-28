app.post('/filter-products/:departmentId', async (req, res) => {
    const { subDepartments, brands, prices } = req.body;
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