import { useEffect, useState } from "react";
import axios from "axios";

function ManageBookings() {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/bookings");
      setBookings(res.data);
    } catch (err) {
      console.log(err);
      alert("Failed to load bookings");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:8080/api/bookings/${id}/status`, {
        status: status,
        rejectionReason: status === "REJECTED" ? "Not available" : null
      });

      alert("✅ Status updated");
      fetchBookings();
    } catch (err) {
      console.log(err);
      alert("❌ Failed to update status");
    }
  };

  const cancelBooking = async (id) => {
    try {
      await axios.put(`http://localhost:8080/api/bookings/${id}/cancel`);
      alert("✅ Booking cancelled");
      fetchBookings();
    } catch (err) {
      console.log(err);
      alert("❌ " + (err.response?.data?.message || "Failed to cancel booking"));
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = filter === "ALL" ? true : b.status === filter;

    const matchesSearch =
      b.resourceName.toLowerCase().includes(search.toLowerCase()) ||
      b.userName.toLowerCase().includes(search.toLowerCase()) ||
      b.purpose.toLowerCase().includes(search.toLowerCase());

    const matchesDate = dateFilter ? b.bookingDate === dateFilter : true;

    return matchesStatus && matchesSearch && matchesDate;
  });

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1>Manage Bookings</h1>

      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          gap: "15px",
          alignItems: "center",
          flexWrap: "wrap"
        }}
      >
        <div>
          <label>Status Filter: </label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="ALL">All</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        <div>
          <label>Search: </label>
          <input
            type="text"
            placeholder="Search resource / user / purpose"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div>
          <label>Date: </label>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>
      </div>

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
            <th>Attendees</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredBookings.length > 0 ? (
            filteredBookings.map((b) => (
              <tr key={b.id}>
                <td>{b.id}</td>
                <td>{b.resourceName}</td>
                <td>{b.userName}</td>
                <td>{b.bookingDate}</td>
                <td>{b.startTime}</td>
                <td>{b.endTime}</td>
                <td>{b.purpose}</td>
                <td>{b.expectedAttendees}</td>
                <td>{b.status}</td>
                <td>
                  {b.status === "PENDING" && (
                    <>
                      <button onClick={() => updateStatus(b.id, "APPROVED")}>
                        Approve
                      </button>{" "}
                      <button onClick={() => updateStatus(b.id, "REJECTED")}>
                        Reject
                      </button>{" "}
                      <button onClick={() => cancelBooking(b.id)}>
                        Cancel
                      </button>
                    </>
                  )}

                  {b.status === "APPROVED" && (
                    <button onClick={() => cancelBooking(b.id)}>
                      Cancel
                    </button>
                  )}

                  {(b.status === "REJECTED" || b.status === "CANCELLED") && (
                    <span style={{ opacity: 0.7 }}>No actions</span>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10">No bookings found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ManageBookings;