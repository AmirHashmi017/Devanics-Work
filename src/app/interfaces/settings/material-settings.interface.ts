export type IMaterialSetting = {
  _id: {
    categoryId: string;
    categoryName: string;
    subcategoryId: string;
    subcategoryName: string;
  };
  materialsData: {
    _id: string;
    description: string;
    unit: string;
    unitLabourHour: number;
    unitMaterialCost: number;
    unitEquipments: number;
    categoryDetails: CategoryDetails;
    subcategoryDetails: SubcategoryDetails;
  }[];
};
interface CategoryDetails {
  _id: string;
  name: string;
  categoryId: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface SubcategoryDetails {
  _id: string;
  name: string;
  price: number;
  companyId: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface IUnits {
  label: string;
  value: string;
}
