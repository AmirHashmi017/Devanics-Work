import { SelectComponent } from '@/app/component/customSelect/Select.component';

type Props = {
  status: string;
  setStatus: React.Dispatch<React.SetStateAction<string>>;
};
export function CrmStatusFilter({ status, setStatus }: Props) {
  return (
    <SelectComponent
      label=""
      name="status"
      placeholder="Status"
      field={{
        value: status ? status : undefined,
        onChange: (value) => {
          setStatus(value);
        },
        options: [
          { label: 'Active', value: 'active' },
          { label: 'In Active', value: 'inactive' },
        ],
        className: '!w-auto',
        allowClear: true,
        onClear() {
          setStatus('');
        },
      }}
    />
  );
}
