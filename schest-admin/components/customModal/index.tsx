import { Modal } from 'antd';
interface Props {
  children: React.ReactNode;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  title?: string;
  width?: string;
  destroyOnClose?: boolean;
}
const ModalComponent = ({
  setOpen,
  open,
  children,
  width = '600px',
  destroyOnClose = false,
}: Props) => {
  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <div>
      <Modal
        open={open}
        closable={false}
        footer={null}
        centered={true}
        destroyOnClose={destroyOnClose}
        onCancel={handleCancel}
        width={width}
      >
        {children}
      </Modal>
    </div>
  );
};

export default ModalComponent;
