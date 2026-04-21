# Shopping Cart API

A generic Shopping Cart API built with Node.js, Express, and TypeScript.

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

### Installation & Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server (auto-restarts on file changes):
   ```bash
   npm run dev
   ```
   Or run the file directly:
   ```bash
   npx ts-node src/index.ts
   ```

3. The server will be running on `http://localhost:3000`.

### Testing Locally

You can test the API by using `curl` or any API client (like Postman / Insomnia) against the running server.

**Example 1: Getting a Cart**
```bash
curl -X GET http://localhost:3000/carts/123
```

**Example 2: Adding an Item to the Cart**
```bash
curl -X POST http://localhost:3000/carts/123/items \
     -H "Content-Type: application/json" \
     -d '{"productId": 1, "quantity": 2}'
```

**Example 3: Updating an Item Quantity**
```bash
curl -X PUT http://localhost:3000/carts/123/items/1 \
     -H "Content-Type: application/json" \
     -d '{"quantity": 5}'
```

---

## Design Decisions

- **In-Memory Store**: As requested, data persistence is maintained in-memory using a standard Javascript `Map`. 
- **Money Representation**: Floating-point math in Javascript is notorious for rounding errors (e.g., `0.1 + 0.2 =  0.30000000000000004`). We avoid this by representing money in the smallest currency denomination (cents) using integers, accompanied by a currency ISO string.
- **Cart Sessioning via URL Params**: Instead of a single ephemeral global cart, I opted for a `cartId` path parameter (e.g., `/carts/:cartId/...`). This closely resembles real-world guest checkouts where a `cartId` is stored in cookies/local storage.
- **Extensibility via Metadata**: The cart item payload accepts a `metadata` object (e.g., `{ color: "red" }`). This provides flexibility for storing item-specific variations or attributes without altering the core database schema.

## Trade-Offs & Edge Cases handled

- **Quantity Edge Cases**: Adding <= 0 quantity throws an error. Updating to `0` removes the item entirely from the cart.
- **Identical Products**: If a client adds the same `productId` twice, the backend sensibly increments the quantity instead of creating a duplicated entry row.

## Future Improvements (With More Time)

1. **Persistent DB**: Replace the in-memory map with something like Redis (ideal for ephemeral cart data with an expiration) or Postgres.
2. **Promotional Engine**: Implementing a separate engine that calculates dynamic totals based on discount codes and item bundles.
3. **Inventory Checks**: Currently, we let you add any quantity of items assuming infinite stock. In a real system, we'd check against an inventory microservice or DB.
4. **Validation/Input parsing**: Add comprehensive DTO validation via Zod or `class-validator` instead of basic conditional checks in the controller.

---

## 📖 API Documentation

*Assuming server runs at http://localhost:3000, and we use Cart ID `123`.*

### `GET /carts/:cartId`
Gets the cart and calculates totals dynamically.

### `POST /carts/:cartId/items`
**Body:**
```json
{
  "productId": 2,
  "quantity": 2,
  "metadata": {
    "color": "red"
  }
}
```

### `PUT /carts/:cartId/items/:productId`
Updates item quantity. If `quantity` is 0, the item is removed.
**Body:**
```json
{
  "quantity": 5
}
```

### `DELETE /carts/:cartId/items/:productId`
Removes the specified product from the cart completely.
