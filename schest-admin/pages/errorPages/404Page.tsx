import { NavLink } from 'react-router-dom';
import CustomButton from '../../components/CustomButton/button';

const ErrorPage404 = () => {
  return (
    <section className="h-screen flex flex-col justify-center items-center">
      <img
        className="h-[90vh]"
        src="assets/images/no_found.png"
        alt="error-404"
      />
      <div>
        <NavLink to="/">
          <CustomButton text="Go Back" className="w-60" />
        </NavLink>
      </div>
    </section>
  );
};

export default ErrorPage404;
