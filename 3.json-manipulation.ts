import productsData from "./sources/products.json";

enum Gender {
  Female = "female",
  Male = "male",
  Unisex = "unisex",
}

interface Product {
  id: string;
  guid: string;
  in_stock: boolean;
  on_sale: boolean;
  name: string;
  picture: string;
  gender: Gender;
  categories: string[];
  color: string;
  price: string;
  description: string;
}

// Helper function to group an array of objects by a key or multiple keys
const groupBy = <T, K extends keyof any>(
  array: T[],
  key: (item: T) => K | K[]
): Record<K, T[]> => {
  return array.reduce((result, currentItem) => {
    const groupKey = key(currentItem);

    if (Array.isArray(groupKey)) {
      groupKey.forEach((key) => {
        if (!result[key]) {
          result[key] = [];
        }
        result[key].push(currentItem);
      });
    } else {
      if (!result[groupKey]) {
        result[groupKey] = [];
      }
      result[groupKey].push(currentItem);
    }

    return result;
  }, {} as Record<K, T[]>);
};

const extractPrice = (price: string): number => {
  return parseFloat(price.replace("$", ""));
};

// 1. Which products are out of stock, `not` on sale, and under $20?
const outOfStockNotOnSaleUnder20Products = (products: Product[]): Product[] => {
  return products.filter(
    (product) =>
      !product.on_sale && !product.in_stock && extractPrice(product.price) <= 20
  );
};
console.log(
  "1:",
  outOfStockNotOnSaleUnder20Products(productsData as Product[])
);

// 2. What is the most commonly used category?
const mostCommonlyUsedCategory = (products: Product[]): string[] => {
  // could be done with reduce to decrease the time complexity,
  // but for this small dataset, this is more readable

  const productsByCategory = groupBy(products, (product) => product.categories);
  const maxCategoryCount = Math.max(
    ...Object.values(productsByCategory).map((products) => products.length)
  );

  if (maxCategoryCount === 0) {
    return [];
  }

  const mostCommonCategories = Object.keys(productsByCategory).filter(
    (category) => productsByCategory[category].length === maxCategoryCount
  );

  return mostCommonCategories;
};
console.log("2:", mostCommonlyUsedCategory(productsData as Product[]));

// 3. What is the average price of sale items?
const averagePriceOfSaleProducts = (products: Product[]): number => {
  // could be done with reduce to decrease the time complexity,
  // but for this small dataset, this is more readable

  const saleProducts: Product[] = products.filter((product) => product.on_sale);

  if (saleProducts.length === 0) {
    return 0;
  }

  const sumOfSaleProducts: number = saleProducts.reduce(
    (acc: number, product: Product) => acc + extractPrice(product.price),
    0
  );

  return sumOfSaleProducts / saleProducts.length;
};
console.log("3:", averagePriceOfSaleProducts(productsData as Product[]));

// 4. How many women’s products are out of stock, broken down by color?
const womenProductsOutOfStockByColor = (
  products: Product[]
): Record<string, Product[]> => {
  // could be done with reduce to decrease the time complexity,
  // but for this small dataset, this is more readable

  const womenProducts: Product[] = products.filter(
    (product) => product.gender === Gender.Female
  );
  const productsByColor: Record<string, Product[]> = groupBy(
    womenProducts,
    (product) => product.color
  );

  return productsByColor;
};
console.log("4:", womenProductsOutOfStockByColor(productsData as Product[]));
