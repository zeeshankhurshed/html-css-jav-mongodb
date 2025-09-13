// Function to go back to products page
function goBack() {
    window.location.href = 'products.html';
}

// Get DOM elements
const container = document.getElementById("product-detail-container");

// Get product ID from URL
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

// Check if we have a product ID
if (!productId) {
    container.innerHTML = "<p class='error'>No product ID provided in URL.</p>";
} else {
    // Fetch real product by ID from backend
    fetchProduct(productId);
}

// Function to fetch product from API
async function fetchProduct(id) {
    try {
        const response = await fetch(`http://localhost:5555/product/${id}`);
        if (!response.ok) throw new Error(`Failed to fetch product: ${response.status}`);
        
        const result = await response.json();
        const product = result.data || result;

        if (!product) {
            container.innerHTML = "<p class='error'>Product not found.</p>";
            return;
        }

        renderProduct(product);
    } catch (error) {
        console.error("Error fetching product:", error);
        container.innerHTML = `<p class='error'>${error.message}</p>`;
    }
}

// Function to render product details
function renderProduct(product) {
    const imageUrl = `http://localhost:5555${product.image}`;
    
    container.innerHTML = `
        <div class="product-detail-card">
            <div class="product-image-container">
                <img src="${imageUrl}" alt="${product.name}" class="product-detail-img"
                     onerror="this.src='https://via.placeholder.com/400x400?text=Image+Not+Found'"/>
            </div>
            <div class="product-info">
                <h2>${product.name}</h2>
                <p>${product.description}</p>
                
                <div class="product-meta">
                    <p><strong>Price:</strong> $${product.price}</p>
                    <p><strong>Quantity:</strong> ${product.quantity} in stock</p>
                    <p><strong>Category:</strong> ${product.category}</p>
                    <p><strong>Image Path:</strong> <span class="image-path">${product.image}</span></p>
                </div>
                
                <div class="product-buttons">
                    <button id="edit-btn">Edit</button>
                    <button id="delete-btn">Delete</button>
                </div>
            </div>
        </div>
    `;

    // Edit button
    document.getElementById("edit-btn").addEventListener("click", () => {
        window.location.href = `product-edit.html?id=${product._id}`;
    });

    // Delete button
   // Delete button
document.getElementById("delete-btn").addEventListener("click", async () => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
        const response = await fetch(`http://localhost:5555/product/${product._id}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.message || `Delete failed: ${response.status}`);
        }

        const data = await response.json();
        alert(data.message || "Product deleted successfully");
        window.location.href = "products.html"; // go back to product list
    } catch (error) {
        console.error("Error deleting product:", error);
        alert(error.message || "Failed to delete product");
    }
});

}
