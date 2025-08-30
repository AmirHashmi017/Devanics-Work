import { Modal } from 'antd';
interface Props {
  children: React.ReactNode;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  title?: string;
  width?: string;
  destroyOnClose?: boolean;
  className?: any;
}
const ModalComponent = ({
  setOpen,
  open,
  children,
  width = '600px',
  destroyOnClose = false,
  className,
}: Props) => {
  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Modal
      open={open}
      closable={false}
      footer={null}
      centered={true}
      destroyOnClose={destroyOnClose}
      onCancel={(e) => {
        e.stopPropagation();
        handleCancel();
      }}
      width={width}
      className={className ? className : ''}
    >
      {children}
    </Modal>
  );
};

export default ModalComponent;
