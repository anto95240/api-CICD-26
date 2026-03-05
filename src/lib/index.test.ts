import { calculatedDiscount } from "./index";
import * as lib from "./index";

type CartItem = {
	id: number;
	price: number;
	qty: number;
};

const calculateCartTotal = (lib as Record<string, unknown>)
	.calculateCartTotal as (cart: CartItem[]) => number;

describe("calculatedDiscount", () => {
	it("should return an error if price is negative", () => {
		expect(() => calculatedDiscount(-100, 10)).toThrow();
	});

	it("should return an error if discount is negative", () => {
		expect(() => calculatedDiscount(100, -10)).toThrow(
			"Discount must be between 0 and 100"
		);
	});

    // happy path test/ case
	it("if discount is between 0 and 100, should return the discounted price", () => {
		expect(calculatedDiscount(100, 20)).toBe(80);
	});
    
    // invalid case
	it("should return an error if price is not a number", () => {
		expect(() => calculatedDiscount("100" as unknown as number, 10)).toThrow();
	});

    // invalid case
	it("should return an error if discount is not a number", () => {
		expect(() => calculatedDiscount(100, "10" as unknown as number)).toThrow();
	});

    // edge case test
	it("should return the original price if discount is 0", () => {
		expect(calculatedDiscount(100, 0)).toBe(100);
	});
});

describe("calculateCartTotal - TDD", () => {
	it("should return an error if cart is undefined", () => {
		expect(() =>
			calculateCartTotal(undefined as unknown as CartItem[])
		).toThrow();
	});

	it("should return an error if cart is null", () => {
		expect(() => calculateCartTotal(null as unknown as CartItem[])).toThrow();
	});

	it("should return an error if cart is 0", () => {
		expect(() => calculateCartTotal(0 as unknown as CartItem[])).toThrow();
	});

	it("should return 0 for an empty cart", () => {
		expect(calculateCartTotal([])).toBe(0);
	});

	it("should return price * qty when cart has one item with qty 1", () => {
		expect(calculateCartTotal([{ id: 1, price: 100, qty: 1 }])).toBe(100);
	});

	it("should return 500 for the mockup cart", () => {
		const cart = [
			{ id: 1, price: 100, qty: 3 },
			{ id: 2, price: 200, qty: 1 },
		];

		expect(calculateCartTotal(cart)).toBe(500);
	});

	it("should return an error if price is negative", () => {
		expect(() =>
			calculateCartTotal([{ id: 1, price: -100, qty: 1 }])
		).toThrow();
	});

	it("should return an error if qty is negative", () => {
		expect(() =>
			calculateCartTotal([{ id: 1, price: 100, qty: -1 }])
		).toThrow();
	});

	it("should return an error if price is not a number", () => {
		expect(() =>
			calculateCartTotal([
				{ id: 1, price: "100" as unknown as number, qty: 1 },
			])
		).toThrow();
	});

	it("should return an error if qty is not a number", () => {
		expect(() =>
			calculateCartTotal([
				{ id: 1, price: 100, qty: "1" as unknown as number },
			])
		).toThrow();
	});

	it("should return an error if price is null or undefined", () => {
		expect(() =>
			calculateCartTotal([
				{ id: 1, price: null as unknown as number, qty: 1 },
			])
		).toThrow();

		expect(() =>
			calculateCartTotal([
				{ id: 1, price: undefined as unknown as number, qty: 1 },
			])
		).toThrow();
	});

	it("should return an error if qty is null or undefined", () => {
		expect(() =>
			calculateCartTotal([
				{ id: 1, price: 100, qty: null as unknown as number },
			])
		).toThrow();

		expect(() =>
			calculateCartTotal([
				{ id: 1, price: 100, qty: undefined as unknown as number },
			])
		).toThrow();
	});
});