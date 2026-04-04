import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/bookings");
      setBookings(res.data);
    } catch (err) {
      console.log(err);
      alert("Failed to load dashboard data");
    }
  };

  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter(
    (booking) => booking.status === "PENDING"
  ).length;
  const approvedBookings = bookings.filter(
    (booking) => booking.status === "APPROVED"
  ).length;
  const cancelledBookings = bookings.filter(
    (booking) => booking.status === "CANCELLED"
  ).length;
  const rejectedBookings = bookings.filter(
    (booking) => booking.status === "REJECTED"
  ).length;

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>
        Smart Campus Dashboard
      </h1>

      <a href="/create-booking" style={{ textDecoration: "none" }}>
  <button
    style={{
      padding: "3px 3px",
      borderRadius: "2px",
      border: "none",
      cursor: "pointer"
    }}
  >
    + Create Booking
  </button>
</a>
    <a href="/my-bookings">
  <button style={{ marginBottom: "20px", marginLeft: "10px" }}>
    My Bookings
  </button>
</a>

<a href="/manage-bookings" style={{ marginLeft: "10px" }}>
  <button>Manage Bookings</button>
</a>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "15px",
          marginBottom: "30px"
        }}
      >
        <div style={cardStyle}>
          <h3>Total Bookings</h3>
          <p style={countStyle}>{totalBookings}</p>
        </div>

        <div style={cardStyle}>
          <h3>Pending</h3>
          <p style={countStyle}>{pendingBookings}</p>
        </div>

        <div style={cardStyle}>
          <h3>Approved</h3>
          <p style={countStyle}>{approvedBookings}</p>
        </div>

        <div style={cardStyle}>
          <h3>Cancelled</h3>
          <p style={countStyle}>{cancelledBookings}</p>
        </div>

        <div style={cardStyle}>
          <h3>Rejected</h3>
          <p style={countStyle}>{rejectedBookings}</p>
        </div>
      </div>

      <div style={{ marginTop: "20px" }}>
        <h2>Recent Bookings</h2>

        <table
          border="1"
          cellPadding="10"
          style={{ borderCollapse: "collapse", width: "100%" }}
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>Resource</th>
              <th>User</th>
              <th>Date</th>
              <th>Start</th>
              <th>End</th>
              <th>Purpose</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length > 0 ? (
              bookings.slice(0, 5).map((booking) => (
                <tr key={booking.id}>
                  <td>{booking.id}</td>
                  <td>{booking.resourceName}</td>
                  <td>{booking.userName}</td>
                  <td>{booking.bookingDate}</td>
                  <td>{booking.startTime}</td>
                  <td>{booking.endTime}</td>
                  <td>{booking.purpose}</td>
                  <td>{booking.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">No bookings found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const cardStyle = {
  border: "1px solid gray",
  borderRadius: "10px",
  padding: "20px",
  textAlign: "center",
  backgroundColor: "#1e1e2f",
  color: "white"
};

const countStyle = {
  fontSize: "28px",
  fontWeight: "bold",
  marginTop: "10px"
};

export default Dashboard;