import { useEffect, useState } from "react";
import axios from "axios";

function MyBookings() {
  const [bookings, setBookings] = useState([]);

  // DEMO: fixed userId (later dynamic karamu)
  const userId = 1;

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/bookings");
      
      // filter only current user bookings
      const myBookings = res.data.filter(
        (b) => b.userId === userId || b.userName === "Test User"
      );

      setBookings(myBookings);
    } catch (err) {
      console.log(err);
      alert("Failed to load bookings");
    }
  };

  const cancelBooking = async (id) => {
    try {
      await axios.put(`http://localhost:8080/api/bookings/${id}/cancel`);
      alert("✅ Booking cancelled");
      window.location.href = "/";
      fetchBookings();
    } catch (err) {
      console.log(err);
      alert("❌ Cancel failed");
    }
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1>My Bookings</h1>

      <table border="1" cellPadding="10" style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Resource</th>
            <th>Date</th>
            <th>Start</th>
            <th>End</th>
            <th>Purpose</th>
            <th>Attendees</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {bookings.length > 0 ? (
            bookings.map((b) => (
              <tr key={b.id}>
                <td>{b.id}</td>
                <td>{b.resourceName}</td>
                <td>{b.bookingDate}</td>
                <td>{b.startTime}</td>
                <td>{b.endTime}</td>
                <td>{b.purpose}</td>
                <td>{b.expectedAttendees}</td>
                <td>{b.status}</td>
                <td>
  <button
    disabled={b.status !== "PENDING"}
    onClick={() => cancelBooking(b.id)}
    style={{
      opacity: b.status !== "PENDING" ? 0.5 : 1,
      cursor: b.status !== "PENDING" ? "not-allowed" : "pointer"
    }}
  >
    Cancel
  </button>
</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9">No bookings found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default MyBookings;