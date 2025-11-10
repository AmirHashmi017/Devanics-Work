import { useUserBrandingColor } from '@/app/hooks/useUserBrandingColor';
import { Image } from 'antd';

export function ClientInvoiceFooter() {
  const color = useUserBrandingColor();
  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <Image
          width={200}
          preview={false}
          src="/powered-by.svg"
          alt="powered by"
        />
      </div>
      <div
        className="h-3"
        style={{
          backgroundColor: color,
        }}
      ></div>
    </div>
  );
}
