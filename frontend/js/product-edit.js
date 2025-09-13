const form = document.getElementById("edit-product-form");
const productIdInput = document.getElementById("product-id");
const preview = document.getElementById("preview");

// Get product ID from URL
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

// Prefill form with product details
async function fetchProduct(id) {
  try {
    const response = await fetch(`http://localhost:5555/product/${id}`);
    if (!response.ok) throw new Error("Failed to fetch product");
    const result = await response.json();
    const product = result.data || result;

    // Fill form fields
    productIdInput.value = product._id;
    document.getElementById("name").value = product.name;
    document.getElementById("description").value = product.description;
    document.getElementById("price").value = product.price;
    document.getElementById("quantity").value = product.quantity;
    document.getElementById("category").value = product.category;

    // Show current image
    preview.src = `http://localhost:5555${product.image}`;
  } catch (error) {
    console.error(error);
    alert("Error loading product");
  }
}

if (productId) {
  fetchProduct(productId);
}

// Handle form submit
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(form);

  try {
    const response = await fetch(`http://localhost:5555/product/${productId}`, {
      method: "PUT",
      body: formData, // send multipart/form-data
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || "Failed to update product");
    }

    const data = await response.json();
    alert(data.message || "Product updated successfully");

    // Redirect back to details page
    window.location.href = `product-details.html?id=${productId}`;
  } catch (error) {
    console.error("Update error:", error);
    alert(error.message);
  }
});
