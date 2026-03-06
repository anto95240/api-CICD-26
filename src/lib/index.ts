export function calculatedDiscount(price: number, discount: number): number {
  if (discount < 0 || discount > 100) {
    throw new Error("Discount must be between 0 and 100");
  }
  return price - (price * discount) / 100;
}

// should return an error if price is negative
// should return an error if discount is negative
// if discount is between 0 and 100, should return the discounted price
// should return an error if price is not a number
// should return an error if discount is not a number
// should return the original price if discount is 0

interface CartItem {
  Id: number;
  price: number;
  qty: number;
}

export function calculateCartTotal(
  cart: CartItem[] | null | undefined,
): number {
  // Validation: panier ne doit pas être null ou undefined
  if (cart === null || cart === undefined) {
    throw new Error("Cart cannot be null or undefined");
  }

  // Validation: panier doit être un tableau
  if (typeof cart !== "object" || !Array.isArray(cart)) {
    throw new Error("Cart must be an array");
  }

  // Validation: panier vide
  if (cart.length === 0) {
    return 0;
  }

  // Calcul du total
  let total = 0;
  for (const item of cart) {
    // Validation: price et qty doivent être des nombres
    if (typeof item.price !== "number" || typeof item.qty !== "number") {
      throw new Error("Price and qty must be numbers");
    }

    // Validation: price et qty ne doivent pas être null/undefined
    if (
      item.price === null ||
      item.price === undefined ||
      item.qty === null ||
      item.qty === undefined
    ) {
      throw new Error("Price and qty cannot be null or undefined");
    }

    // Validation: price et qty doivent être positifs
    if (item.price < 0) {
      throw new Error("Price must not be negative");
    }
    if (item.qty < 0) {
      throw new Error("Qty must not be negative");
    }

    total += item.price * item.qty;
  }

  return total;
}
