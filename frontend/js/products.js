const main = document.querySelector("main");

// Create a container for products
const container = document.createElement("div");
container.classList.add("products-container");
main.appendChild(container);

async function fetchProducts() {
  try {
    const response = await fetch("http://localhost:5555/product");
    if (!response.ok) throw new Error(`Failed to fetch products: ${response.status}`);

    const result = await response.json();
    const products = result.data || result; // handles both formats

    container.innerHTML = ""; // clear container

    if (!products.length) {
      container.innerHTML = "<p>No products found.</p>";
      return;
    }

    products.forEach((product) => {
      // ✅ Wrap card in <a> pointing to details page
      const link = document.createElement("a");
      link.href = `product-details.html?id=${product._id}`;
      link.classList.add("product-link");

      const card = document.createElement("div");
      card.classList.add("product-card");

      card.innerHTML = `
        <img src="http://localhost:5555${product.image}" alt="${product.name}" class="product-img"/>
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <p><strong>Price:</strong> $${product.price}</p>
        <p><strong>Quantity:</strong> ${product.quantity}</p>
        <p><strong>Category:</strong> ${product.category}</p>
      `;

      // append card into link
      link.appendChild(card);
      container.appendChild(link);
    });

  } catch (error) {
    console.error("Error loading products:", error);
    container.innerHTML = `<p style="color:red;">${error.message}</p>`;
  }
}

fetchProducts();
