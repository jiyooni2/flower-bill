export type Input = {
  id: number;
  name: string;
  price: string;
  keyword: string;
  categoryName: string;
  clicked: boolean;
  favorite: boolean;
  page: number;
}


export type Error = {
  name: string;
  price: string;
  category: string;
}
