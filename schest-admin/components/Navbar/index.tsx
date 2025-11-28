import { Link } from 'react-router-dom';

const Navbar = () => {
  const logoutHandler = () => {
    localStorage.removeItem('schestiToken');
    window.location.pathname = '/login';
  };
  return (
    <nav className="py-3 px-16 md:h-[60px] md:flex flex-col  md:flex-row items-center justify-end w-full bg-white shadow-lg ">
      <div className="flex flex-col md:flex-row gap-6 justify-between items-center">
        <div className="flex items-center gap-4">
          <Link to="#">
            <div className="w-9 h-9"></div>
          </Link>
        </div>
        <h1
          className="text-schestiPrimary cursor-pointer"
          onClick={logoutHandler}
        >
          Logout
        </h1>
      </div>
    </nav>
  );
};

export default Navbar;
