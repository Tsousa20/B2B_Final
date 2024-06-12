app.post('/add-to-cart', async (req, res) => {
    const { companyId, productId, quantity } = req.body;

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
        } else {
            // Insira um novo item no carrinho
            await executeQuery(
                'INSERT INTO carts (company_id, product_id, quantity) VALUES (?, ?, ?)',
                [companyId, productId, quantity]
            );
        }
        res.redirect(`/page-single/${productId}`);
    } catch (error) {
        console.error('Erro ao adicionar item ao carrinho:', error);
        res.json({ success: false, error: 'Erro ao adicionar item ao carrinho' });
    }
});