import { createContext } from 'react';

export interface UploadFileData {
  src: string;
  width: number;
  height: number;
  pageNum?: number;
}

export interface EditContextProps {
  editData: any[];
  handleEdit: (data: any[]) => void;
}

const EditContext = createContext<EditContextProps>({
  editData: [],
  handleEdit: () => undefined,
});

export default EditContext;
