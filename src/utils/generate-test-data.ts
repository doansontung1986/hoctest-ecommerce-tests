import { faker } from "@faker-js/faker";

type ReviewData = {
  rating: number;
  your_review: string;
  name: string;
  email: string;
  save_info: boolean;
};

export function createReviewInfo(
  rating: number,
  your_review: string,
  name: string,
  email: string,
  save_info: boolean = false,
): ReviewData {
  rating = faker.number.int({ min: 1, max: 5 });

  switch (rating) {
    case 1:
      your_review = "Khoá học quá tệ";
      break;
    case 2:
      your_review = "Khoá học tệ";
      break;
    case 3:
      your_review = "Khoá học bình thường";
      break;
    case 4:
      your_review = "Khoá học tốt";
      break;
    case 5:
      your_review = "Khoá học chất lượng";
      break;
    default:
      your_review = "Review không hợp lệ";
  }
  return {
    rating,
    your_review,
    name: faker.person.fullName(),
    email: faker.internet.email(),
    save_info,
  };
}
