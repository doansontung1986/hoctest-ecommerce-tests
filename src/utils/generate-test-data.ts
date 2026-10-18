import { fa, faker } from "@faker-js/faker";

export type ReviewData = {
  rating: number;
  your_review: string;
  name: string;
  email: string;
  save_info: boolean;
};

export type CredentialData = {
  username: string;
  password: string;
  rememberMe: boolean;
  shouldSuccess: boolean;
};

export type ProductData = {
  productName: string;
  productDescription: string;
  productType: string;
  isVirtualProduct?: boolean;
  regularPrice: string;
  salePrice: string;
};

export function createReviewInfo(overrides: Partial<ReviewData>): ReviewData {
  const rating = overrides.rating || faker.number.int({ min: 1, max: 5 });

  const reviewText: Record<number, string> = {
    1: "Khoá học quá tệ",
    2: "Khoá học tệ",
    3: "Khoá học bình thường",
    4: "Khoá học tốt",
    5: "Khoá học chất lượng",
  };
  return {
    rating,
    your_review: reviewText[rating] ?? "Review không hợp lệ",
    name: faker.person.fullName(),
    email: faker.internet.email(),
    save_info: false,
    ...overrides,
  };
}

export function createCredentialInfo(
  ovverides: Partial<CredentialData>,
): CredentialData {
  return {
    username: faker.internet.username(),
    password: faker.internet.password(),
    rememberMe: false,
    shouldSuccess: false,
    ...ovverides,
  };
}

export function generateRandomNumber(): number {
  return faker.number.int({ min: 1000, max: 10000 });
}
