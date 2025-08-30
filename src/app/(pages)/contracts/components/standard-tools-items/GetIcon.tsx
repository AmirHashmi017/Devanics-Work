import { StandardToolType } from '../../types';
import {
  CalendarOutlined,
  CommentOutlined,
  FontSizeOutlined,
  SignatureOutlined,
} from '@ant-design/icons';

export function GetStandardToolIcon({ type }: { type: StandardToolType }) {
  switch (type) {
    case 'comment':
      return <CommentOutlined />;
    case 'initials':
      return <FontSizeOutlined />;
    case 'date':
      return <CalendarOutlined />;
    case 'signature':
      return <SignatureOutlined />;
  }
}
