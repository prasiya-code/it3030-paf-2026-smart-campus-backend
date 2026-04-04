import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav
      style={{
        display: "flex",
        gap: "15px",
        padding: "15px 30px",
        borderBottom: "1px solid gray",
        marginBottom: "20px"
      }}
    >
      <Link to="/" style={{ color: "white", textDecoration: "none" }}>
        Dashboard
      </Link>

      <Link to="/create-booking" style={{ color: "white", textDecoration: "none" }}>
        Create Booking
      </Link>

      <Link to="/my-bookings" style={{ color: "white", textDecoration: "none" }}>
        My Bookings
      </Link>

      <Link to="/manage-bookings" style={{ color: "white", textDecoration: "none" }}>
        Manage Bookings
      </Link>
    </nav>
  );
}

export default Navbar;