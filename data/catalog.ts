export type CatalogVariant = {
  label: string;
  rmb: number;
};

export type CatalogProduct = {
  name: string;
  variants: CatalogVariant[];
};

export type CatalogSection = {
  id: string;
  title: string;
  eyebrow: string;
  description: string;
  kind: "phone" | "watch";
  products: CatalogProduct[];
};

const variants = (...items: Array<[string, number]>): CatalogVariant[] =>
  items.map(([label, rmb]) => ({ label, rmb }));

/**
 * Prices are deliberately kept close to the landed cost. Phone prices include
 * KSh 5,000 shipping; the small tiered margin keeps the catalogue competitive
 * with the Kenyan refurbished market while covering handling and checks.
 */
export function retailPriceKes(rmb: number, kind: CatalogSection["kind"]) {
  const conversion = rmb * 20;
  const shipping = kind === "phone" ? 5_000 : 0;
  const margin =
    kind === "phone"
      ? rmb <= 1_300
        ? 1_000
        : rmb <= 2_500
          ? 2_000
          : rmb <= 4_000
            ? 3_000
            : 5_000
      : Math.max(1_000, Math.round(conversion * 0.1));

  return Math.ceil((conversion + shipping + margin) / 500) * 500;
}

export const catalogSections: CatalogSection[] = [
  {
    id: "samsung",
    title: "Samsung Galaxy",
    eyebrow: "Refurbished Android phones",
    description: "Galaxy S, Fold, Flip, Note and A-series stock.",
    kind: "phone",
    products: [
      { name: "Galaxy S26 Ultra", variants: variants(["256GB", 5500], ["512GB", 6400]) },
      { name: "Galaxy S26+", variants: variants(["256GB", 4900], ["512GB", 5500]) },
      { name: "Galaxy S26", variants: variants(["256GB", 4350], ["512GB", 4900]) },
      { name: "Galaxy S25", variants: variants(["128GB", 2900]) },
      { name: "Galaxy S24 Ultra", variants: variants(["256GB", 3650], ["512GB", 3950]) },
      { name: "Galaxy S24+", variants: variants(["256GB", 2600], ["512GB", 2700]) },
      { name: "Galaxy S24", variants: variants(["128GB", 2300], ["256GB", 2400]) },
      { name: "Galaxy S23 Ultra", variants: variants(["256GB", 2700], ["512GB", 2950]) },
      { name: "Galaxy S23+", variants: variants(["256GB", 1950], ["512GB", 2030]) },
      { name: "Galaxy S23", variants: variants(["128GB", 1620], ["256GB", 1800]) },
      { name: "Galaxy S22 Ultra", variants: variants(["128GB", 1980], ["256GB", 2230]) },
      { name: "Galaxy S22+", variants: variants(["128GB", 1300], ["256GB", 1440]) },
      { name: "Galaxy S22", variants: variants(["128GB", 1250], ["256GB", 1350]) },
      { name: "Galaxy S21 Ultra", variants: variants(["128GB", 1600], ["256GB", 1830]) },
      { name: "Galaxy S21+", variants: variants(["128GB", 1150], ["256GB", 1200]) },
      { name: "Galaxy S21", variants: variants(["128GB", 1100], ["256GB", 1150]) },
      { name: "Galaxy S20 Ultra", variants: variants(["128GB", 1200], ["256GB", 1320]) },
      { name: "Galaxy S20+", variants: variants(["128GB", 980], ["256GB", 1030]) },
      { name: "Galaxy S20", variants: variants(["128GB", 950], ["256GB", 1000]) },
      { name: "Galaxy Z Fold7", variants: variants(["256GB", 5500], ["512GB", 5750]) },
      { name: "Galaxy Z Fold6", variants: variants(["256GB", 4000], ["512GB", 4100]) },
      { name: "Galaxy Z Fold5", variants: variants(["256GB", 3000], ["512GB", 3310]) },
      { name: "Galaxy Z Fold4", variants: variants(["256GB", 2350], ["512GB", 2450]) },
      { name: "Galaxy Z Fold3", variants: variants(["256GB", 2100], ["512GB", 2200]) },
      { name: "Galaxy Z Fold2", variants: variants(["256GB", 1950], ["512GB", 2050]) },
      { name: "Galaxy Z Flip7", variants: variants(["256GB", 3100], ["512GB", 3250]) },
      { name: "Galaxy Z Flip6", variants: variants(["256GB", 1900], ["512GB", 2000]) },
      { name: "Galaxy Z Flip5", variants: variants(["256GB", 1550], ["512GB", 1650]) },
      { name: "Galaxy Z Flip4", variants: variants(["256GB", 1250], ["512GB", 1350]) },
      { name: "Galaxy Z Flip3", variants: variants(["256GB", 1050]) },
      { name: "Galaxy Z Flip2", variants: variants(["256GB", 1000]) },
      { name: "Galaxy Z Flip", variants: variants(["256GB", 950]) },
      { name: "Galaxy Note 20 Ultra", variants: variants(["128GB", 1580], ["256GB", 1650]) },
      { name: "Galaxy Note 20", variants: variants(["128GB", 1000], ["256GB", 1050]) },
      { name: "Galaxy Note 10+", variants: variants(["256GB", 1250]) },
      { name: "Galaxy Note 10", variants: variants(["256GB", 980]) },
      { name: "Galaxy Note 9", variants: variants(["128GB", 830]) },
      { name: "Galaxy A-series", variants: variants(["A70 128GB", 580], ["A60 128GB", 530], ["A50 64GB", 540], ["A31 64GB", 540], ["A30 32GB", 450], ["A20 32GB", 400], ["A10s 32GB", 460]) }
    ]
  },
  {
    id: "google-pixel",
    title: "Google Pixel",
    eyebrow: "Refurbished Android phones",
    description: "Clean Pixel choices across the 4A to 10 Pro XL range.",
    kind: "phone",
    products: [
      { name: "Pixel 10 Pro XL", variants: variants(["256GB eSIM", 4250]) },
      { name: "Pixel 10", variants: variants(["128GB eSIM", 3150]) },
      { name: "Pixel 9 Pro XL", variants: variants(["256GB", 3600]) },
      { name: "Pixel 9 Pro", variants: variants(["128GB", 3150], ["256GB", 3450]) },
      { name: "Pixel 9", variants: variants(["128GB", 2580], ["256GB", 2900]) },
      { name: "Pixel 8 Pro", variants: variants(["128GB", 2150], ["256GB", 2450]) },
      { name: "Pixel 8", variants: variants(["128GB", 1800], ["256GB", 2000]) },
      { name: "Pixel 8A", variants: variants(["128GB", 1730]) },
      { name: "Pixel 7A", variants: variants(["128GB", 1500]) },
      { name: "Pixel 7 Pro", variants: variants(["128GB", 1480], ["256GB", 1600]) },
      { name: "Pixel 7", variants: variants(["128GB", 1380], ["256GB", 1520]) },
      { name: "Pixel 6 Pro", variants: variants(["128GB", 1250], ["256GB", 1350]) },
      { name: "Pixel 6", variants: variants(["128GB", 1150], ["256GB", 1250]) },
      { name: "Pixel 6A", variants: variants(["128GB", 1100]) },
      { name: "Pixel 5A", variants: variants(["128GB", 1080]) },
      { name: "Pixel 4A 5G", variants: variants(["128GB", 950]) },
      { name: "Pixel 5", variants: variants(["128GB", 1050]) }
    ]
  },
  {
    id: "xiaomi-redmi",
    title: "Xiaomi, Redmi & POCO",
    eyebrow: "Refurbished Android phones",
    description: "Xiaomi flagships, Redmi Note models and POCO performance phones.",
    kind: "phone",
    products: [
      { name: "Xiaomi 17 Ultra", variants: variants(["16GB/512GB", 6250], ["12GB/512GB", 5600]) },
      { name: "Xiaomi 17 Pro Max", variants: variants(["16GB/1TB", 5500], ["16GB/512GB", 5000], ["12GB/512GB", 4900]) },
      { name: "Xiaomi 17 Pro", variants: variants(["16GB/1TB", 4800], ["16GB/512GB", 4400], ["12GB/512GB", 4200], ["12GB/256GB", 4050]) },
      { name: "Xiaomi 17", variants: variants(["16GB/1TB", 4180], ["16GB/512GB", 3980], ["12GB/256GB", 3880]) },
      { name: "Xiaomi 15 Ultra", variants: variants(["16GB/1TB", 4480], ["16GB/512GB", 3780], ["12GB/256GB", 3550]) },
      { name: "Xiaomi 15", variants: variants(["16GB/1TB", 3000], ["16GB/512GB", 2750], ["12GB/512GB", 2700], ["12GB/256GB", 2450]) },
      { name: "Xiaomi 14 Ultra", variants: variants(["16GB/1TB", 3280], ["16GB/512GB", 2800], ["12GB/256GB", 2650]) },
      { name: "Xiaomi 14T Pro", variants: variants(["12GB/512GB", 2500]) },
      { name: "Xiaomi 14 Pro", variants: variants(["16GB/1TB", 2450]) },
      { name: "Xiaomi 14", variants: variants(["16GB/1TB", 2350], ["12GB/256GB", 2050]) },
      { name: "Xiaomi 13 Ultra", variants: variants(["16GB/1TB", 2450], ["16GB/512GB", 2150], ["12GB/256GB", 2000]) },
      { name: "Xiaomi 13 Pro", variants: variants(["12GB/512GB", 1700]) },
      { name: "Xiaomi Civi 4 Pro", variants: variants(["16GB/512GB", 1750], ["12GB/256GB", 1550]) },
      { name: "Xiaomi 12S Ultra", variants: variants(["12GB/512GB", 1800], ["12GB/256GB", 1700]) },
      { name: "Xiaomi 12S Pro", variants: variants(["12GB/512GB", 1350], ["12GB/256GB", 1300], ["8GB/256GB", 1200]) },
      { name: "Xiaomi 12S", variants: variants(["8GB/256GB", 1100]) },
      { name: "Xiaomi 12 Pro", variants: variants(["12GB/256GB", 1250]) },
      { name: "Redmi Note 17 Pro", variants: variants(["256GB", 1780], ["128GB", 1550]) },
      { name: "Redmi Note 17", variants: variants(["8GB/128GB", 1380]) },
      { name: "Redmi Note 15 Pro+", variants: variants(["16GB/512GB", 2100], ["12GB/256GB", 1870]) },
      { name: "Redmi Note 15 Pro", variants: variants(["8GB/256GB", 1480]) },
      { name: "Redmi Note 15", variants: variants(["12GB/256GB", 1380], ["8GB/256GB", 1330], ["8GB/128GB", 1250]) },
      { name: "Redmi Note 15R", variants: variants(["12GB/512GB", 1430], ["12GB/256GB", 1300], ["8GB/256GB", 1150]) },
      { name: "Redmi Note 14 Pro+", variants: variants(["12GB/256GB", 1480]) },
      { name: "Redmi Note 14 Pro", variants: variants(["12GB/512GB", 1500], ["12GB/256GB", 1380], ["8GB/256GB", 1330], ["8GB/128GB", 1200]) },
      { name: "Redmi Note 14", variants: variants(["8GB/128GB", 1000], ["6GB/128GB", 950]) },
      { name: "Redmi 14R", variants: variants(["8GB/128GB", 800], ["6GB/128GB", 750]) },
      { name: "Redmi 14C", variants: variants(["6GB/128GB", 750], ["4GB/128GB", 700], ["4GB/64GB", 620]) },
      { name: "POCO F7", variants: variants(["16GB/1TB", 2350], ["16GB/512GB", 2150], ["16GB/256GB", 2000], ["12GB/256GB", 1850]) },
      { name: "POCO F7 Ultra", variants: variants(["16GB/512GB", 5000]) },
      { name: "POCO F6 Pro", variants: variants(["16GB/256GB", 1480], ["12GB/256GB", 1420]) },
      { name: "POCO F5 Pro", variants: variants(["12GB/512GB", 1480]) },
      { name: "POCO F9 Ultra", variants: variants(["16GB/512GB", 5000]) },
      { name: "POCO F8 Ultra", variants: variants(["16GB/1TB", 3980], ["12GB/256GB", 3280]) },
      { name: "POCO X8 Pro Max", variants: variants(["16GB/512GB", 2750], ["16GB/256GB", 2500], ["12GB/256GB", 2400]) },
      { name: "POCO X7 Pro", variants: variants(["16GB/1TB", 1880], ["16GB/512GB", 1650]) },
      { name: "POCO K90 Max", variants: variants(["16GB/512GB", 3350]) },
      { name: "POCO K80 Ultra", variants: variants(["16GB/512GB", 2780]) },
      { name: "POCO K70 Ultra", variants: variants(["24GB/1TB", 2350]) },
      { name: "POCO K50", variants: variants(["12GB/128GB", 1100]) },
      { name: "POCO K40", variants: variants(["12GB/256GB", 1080]) },
      { name: "POCO K30", variants: variants(["8GB/128GB", 650]) }
    ]
  },
  {
    id: "watches",
    title: "Apple, Samsung & Huawei Watches",
    eyebrow: "Smart watches",
    description: "Popular smart-watch sizes and generations.",
    kind: "watch",
    products: [
      { name: "Apple Watch Ultra 3 (2025)", variants: variants(["49mm", 4380]) },
      { name: "Apple Watch Ultra 2", variants: variants(["2024 49mm", 3280], ["2023 49mm", 3250]) },
      { name: "Apple Watch Ultra 1", variants: variants(["49mm", 2280]) },
      { name: "Apple Watch Series 11", variants: variants(["46mm", 2250], ["42mm", 2150]) },
      { name: "Apple Watch Series 10", variants: variants(["46mm", 1880], ["42mm", 1780]) },
      { name: "Apple Watch Series 9", variants: variants(["45mm", 1550], ["41mm", 1450]) },
      { name: "Apple Watch Series 8", variants: variants(["45mm", 1250], ["41mm", 1150]) },
      { name: "Apple Watch Series 7", variants: variants(["45mm", 1000], ["41mm", 970]) },
      { name: "Apple Watch Series 6", variants: variants(["44mm", 880], ["42mm", 850]) },
      { name: "Apple Watch Series 5", variants: variants(["44mm", 780], ["40mm", 750]) },
      { name: "Apple Watch Series 4", variants: variants(["44mm", 650]) },
      { name: "Apple Watch SE 2", variants: variants(["44mm", 980], ["40mm", 930]) },
      { name: "Apple Watch SE 1", variants: variants(["44mm", 750], ["40mm", 700]) },
      { name: "Samsung Watch 8", variants: variants(["44mm", 1650], ["40mm", 1500]) },
      { name: "Samsung Watch 7", variants: variants(["40mm", 910], ["44mm", 1020]) },
      { name: "Samsung Watch 7 Ultra", variants: variants(["47mm", 1650]) },
      { name: "Samsung Watch 6", variants: variants(["40mm", 700], ["43mm", 750], ["44mm", 850], ["47mm", 900]) },
      { name: "Samsung Watch 5", variants: variants(["40mm", 600], ["44mm", 650]) },
      { name: "Samsung Watch 5 Pro", variants: variants(["45mm", 700]) },
      { name: "Samsung Watch 4", variants: variants(["40mm", 530], ["44mm", 580], ["46mm", 680]) },
      { name: "Huawei Watch GT6", variants: variants(["46mm", 1050]) },
      { name: "Huawei Watch GT5", variants: variants(["46mm", 900]) },
      { name: "Huawei Watch GT4", variants: variants(["46mm", 680]) },
      { name: "Huawei Watch GT3", variants: variants(["46mm", 580]) }
    ]
  }
];
