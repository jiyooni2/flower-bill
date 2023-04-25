export type Input = {
  id: number;
  name: string;
  price: string;
  keyword: string;
  categoryName: string;
  favorite: boolean;
  page: number;
  clicked: boolean;
}


export type Error = {
  name: string;
  price: string;
  category: string;
}
