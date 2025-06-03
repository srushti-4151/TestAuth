import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { user } = useSelector(state => state.auth);

  return (
    <nav className="bg-gray-800 text-white p-4">
      <Link to="/">Home</Link> |{" "}
      {user?.role === 'manager' && <Link to="/manager">Manager</Link>}
      {user?.role === 'chef' && <Link to="/chef">Chef</Link>}
      {user?.role === 'customer' && <Link to="/customer">Customer</Link>}
      {" | "}
      {user ? <span>{user.email}</span> : <Link to="/login">Login</Link>}
    </nav>
  );
};

export default Navbar;
