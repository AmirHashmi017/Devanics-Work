export interface ISettingTarget {
  month: string;
  price: string;
  _id?: string;
  year: string;
}

export interface ICategory {
  categoryId: string;
  name: string;
  _id?: string;
}

export interface ISubcategory {
  name: string;
  price: string;
  category: string;
  _id?: string;
}
