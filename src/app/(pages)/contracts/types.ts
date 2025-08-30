import { ChooseFontType } from '@/app/component/fonts';
import { FileInterface } from '@/app/interfaces/file.interface';

export type StandardToolType = 'signature' | 'initials' | 'comment' | 'date';

type SignatureState = {
  tool: 'signature';
  value?:
    | {
        font: ChooseFontType;
        value: string;
      }
    | FileInterface;
};

type InitialsState = {
  tool: 'initials';
  value?: string | FileInterface;
};

type CommentState = {
  tool: 'comment';
  value?: string;
};

type DateState = {
  tool: 'date';
  value?: string;
};

export type ToolState = {
  position: { x: number; y: number };
  id: string;
  date?: string;
  email?: string;
} & (SignatureState | InitialsState | CommentState | DateState);

export type PdfContractMode =
  | 'add-values'
  | 'edit-fields'
  | 'view-fields'
  | 'view-values';
