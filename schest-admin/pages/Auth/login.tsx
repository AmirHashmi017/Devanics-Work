import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { AppDispatch } from 'src/redux/store';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// module imports
import FormControl from 'src/components/FormControl';
import Button from 'src/components/CustomButton/button';
import AuthWrapper from 'src/pages/Auth/authWrapper';
import { ILogInInterface } from 'src/interfaces/authInterfaces/login.interface';
import { login } from 'src/redux/authSlices/auth.thunk';
import logo from 'src/assets/icons/logo.svg';
import { ADMIN_ROLE } from 'src/utils/roles';

const initialValues: ILogInInterface = {
  email: '',
  password: '',
};
const LoginSchema = Yup.object({
  email: Yup.string()
    .required('Email is required!')
    .email('Email should be valid'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Minimum six character is required'),
});
const LoginComponent = () => {
  const dispatch = useDispatch<AppDispatch>();
  let navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const submitHandler = async ({ email, password }: ILogInInterface) => {
    setLoading(true);
    dispatch(login({ email, password }))
      .then((response: any) => {
        setLoading(false);
        if (response.payload.statusCode == 200) {
          if (response.payload.data.user.userRole === ADMIN_ROLE) {
            navigate('/');
          } else {
            toast.error('Unauthorized.');
          }
        } else {
          toast.error(response.payload.message);
        }
      })
      .catch((error) => {
        setLoading(false);
        toast.error(error.message);
      });
  };
  return (
    <AuthWrapper>
      <img src="/assets/icons/logo.svg" alt="logo" />
      <section className="grid place-items-center h-full">
        <div className="w-full max-w-md">
          <Formik
            initialValues={initialValues}
            validationSchema={LoginSchema}
            onSubmit={submitHandler}
          >
            {({ handleSubmit }) => (
              <Form name="basic" autoComplete="off" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-3">
                  <FormControl
                    control="input"
                    label="email"
                    type="email"
                    name="email"
                    placeholder="Email Address"
                  />
                  <FormControl
                    control="password"
                    label="password"
                    type="password"
                    name="password"
                    placeholder="Password"
                  />
                </div>

                <Button
                  isLoading={loading}
                  text="Login"
                  className="!p-3 mt-8"
                  type="submit"
                />
              </Form>
            )}
          </Formik>
        </div>
      </section>
    </AuthWrapper>
  );
};

export default LoginComponent;
