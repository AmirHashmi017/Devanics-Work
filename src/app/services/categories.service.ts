// Importing base class
import { HttpService } from '@/app/services/base.service';
import { IResponseInterface } from '@/app/interfaces/api-response.interface';
import { CategoryInitTypes } from '@/app/(pages)/settings/CategorySetup/Category/page';
import { SubcategoryInitValues } from '@/app/(pages)/settings/CategorySetup/Subcategory/page';
import {
  ISettingCategoryParsedType,
  ISettingSubCategoryParsedType,
} from '../interfaces/settings/categories-settings.interface';
import {
  ICategory,
  ISubcategory,
} from '../interfaces/companyInterfaces/setting.interface';

class CategoriesService extends HttpService {
  private readonly prefix: string = 'api/setting/categories';

  // category
  httpAddNewCategory = (
    data: CategoryInitTypes
  ): Promise<IResponseInterface<ICategory>> =>
    this.post(`${this.prefix}/addNewCategory`, data);

  httpGetAllCategories = (
    page: number,
    limit: number = 9
  ): Promise<IResponseInterface> =>
    this.get(`${this.prefix}/getAllCategories?page=${page}&limit=${limit}`);

  httpUpdateCategory = (
    categoryId: string,
    data: CategoryInitTypes
  ): Promise<IResponseInterface<any>> =>
    this.post(`${this.prefix}/updateCategory/${categoryId}`, data);

  httpDeleteCategory = (category: string): Promise<IResponseInterface> =>
    this.delete(`${this.prefix}/category/delete/${category}`);

  // sub category
  httpAddNewSubcategory = (
    data: SubcategoryInitValues
  ): Promise<IResponseInterface> =>
    this.post(`${this.prefix}/addNewSubcategory`, data);

  httpGetAllSubcategories = (
    page: number,
    limit: number = 9
  ): Promise<IResponseInterface> =>
    this.get(`${this.prefix}/getAllSubcategories?page=${page}&limit=${limit}`);

  httpUpdateSubcategory = (
    subcategoryId: string,
    data: SubcategoryInitValues
  ): Promise<IResponseInterface<any>> =>
    this.post(`${this.prefix}/updateSubcategory/${subcategoryId}`, data);

  httpDeleteSubcategory = (category: string): Promise<IResponseInterface> =>
    this.delete(`${this.prefix}/subcategory/delete/${category}`);

  httpParseCategoriesCSV = (
    data: FormData
  ): Promise<IResponseInterface<ISettingCategoryParsedType[]>> =>
    this.post(`${this.prefix}/parse-csv`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

  httpParseSubCategoriesCSV = (
    data: FormData
  ): Promise<IResponseInterface<ISettingSubCategoryParsedType[]>> =>
    this.post(`${this.prefix}/parse-subcategories-csv`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

  httpInsertManyCategories = (
    data: ISettingCategoryParsedType[]
  ): Promise<IResponseInterface<ICategory[]>> =>
    this.post(`${this.prefix}/many-categories`, data);

  httpInsertManySubCategories = (
    data: (ISettingSubCategoryParsedType & { category: string })[]
  ): Promise<IResponseInterface<ISubcategory[]>> =>
    this.post(`${this.prefix}/many-sub-categories`, data);
}
export const categoriesService = new CategoriesService();
