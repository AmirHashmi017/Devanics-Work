import CustomButton from '@/app/component/customButton/button';
import WhiteButton from '@/app/component/customButton/white';
import { TextAreaComponent } from '@/app/component/textarea';
import { useUser } from '@/app/hooks/useUser';
import { contactService } from '@/app/services/contact.service';
import { Popover, Radio } from 'antd';
import { useFormik } from 'formik';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'react-toastify';

export function Feedback() {
  const user = useUser();
  const [loading, setLoading] = useState(false);
  const [isOpened, setIsOpened] = useState(false);

  const formik = useFormik({
    initialValues: {
      experience: 'Excellent',
      message: '',
      user: user?._id,
    },
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await contactService.httpSendFeedback(values);
        if (response.data) {
          toast.success('Feedback sent successfully');
          setIsOpened(false);
          formik.resetForm();
        }
      } catch (error) {
        toast.error('Failed to send feedback');
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Popover
      trigger={['click']}
      title="How is your experience with Schesti?"
      open={isOpened}
      onOpenChange={setIsOpened}
      content={
        <div className="max-w-[500px] min-w-[200px]">
          <form className="space-y-3" onSubmit={formik.handleSubmit}>
            <Radio.Group
              name="experience"
              onChange={formik.handleChange}
              value={formik.values.experience}
              onBlur={formik.handleBlur}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
              options={[
                {
                  label: 'Excellent',
                  value: 'Excellent',
                },
                {
                  label: 'Very Good',
                  value: 'Very Good',
                },
                {
                  label: 'Good',
                  value: 'Good',
                },
                {
                  label: 'Need Improvement',
                  value: 'Need Improvement',
                },
              ]}
            />

            <TextAreaComponent
              label="What can we do to improve the system?"
              name="message"
              placeholder="Type here..."
              field={{
                rows: 5,
                value: formik.values.message,
                onChange: formik.handleChange,
                onBlur: formik.handleBlur,
              }}
            />

            <div className="space-y-2">
              <CustomButton
                text="Send Feedback"
                isLoading={loading}
                type="submit"
              />

              <WhiteButton text="Cancel" onClick={() => setIsOpened(false)} />
            </div>
          </form>
        </div>
      }
      style={{
        width: '500',
      }}
      autoAdjustOverflow
      placement="topLeft"
      destroyTooltipOnHide
    >
      <div className="absolute lg:right-4 right-0 transition-transform duration-300 cursor-pointer -bottom-0 lg:bottom-[15px] md:bottom-10 hover:scale-125">
        <Image
          src="/images/hero_mesage.png"
          width={66}
          height={66}
          alt="Message"
        />
      </div>
    </Popover>
  );
}
