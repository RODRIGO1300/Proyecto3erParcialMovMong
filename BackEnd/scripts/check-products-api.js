const API_URL = process.env.PRODUCTS_API_URL || 'http://localhost:4000/api/products';

async function checkProductsApi() {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`HTTP ${response.status}: ${response.statusText} ${errorBody}`);
    }

    const products = await response.json();

    if (!Array.isArray(products)) {
      throw new Error('La API no regreso un arreglo de productos.');
    }

    console.log(`API conectada correctamente: ${products.length} productos encontrados.`);

    if (products[0]) {
      console.log('Primer producto:');
      console.log({
        id: products[0]._id || products[0].id,
        title: products[0].title,
        price: products[0].price,
        category: products[0].category
      });
    }
  } catch (error) {
    console.error('No se pudo validar la API de productos.');
    console.error(error.message);
    process.exitCode = 1;
  }
}

checkProductsApi();
