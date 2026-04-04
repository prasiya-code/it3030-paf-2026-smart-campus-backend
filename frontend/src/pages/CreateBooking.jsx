import { useEffect, useState } from "react";
import axios from "axios";

function CreateBooking() {
  const [form, setForm] = useState({
    resourceId: "",
    userId: "",
    bookingDate: "",
    startTime: "",
    endTime: "",
    purpose: "",
    expectedAttendees: ""
  });

  const [users, setUsers] = useState([]);
  const [resources, setResources] = useState([]);

  useEffect(() => {
    fetchUsers();
    fetchResources();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/users");
      setUsers(res.data);
    } catch (err) {
      alert("❌ Failed to load users");
    }
  };

  const fetchResources = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/resources");
      setResources(res.data);
    } catch (err) {
      alert("❌ Failed to load resources");
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:8080/api/bookings", {
        ...form,
        resourceId: Number(form.resourceId),
        userId: Number(form.userId),
        expectedAttendees: Number(form.expectedAttendees)
      });

      alert("✅ Booking created successfully");
      window.location.href = "/";

      // reset form
      setForm({
        resourceId: "",
        userId: "",
        bookingDate: "",
        startTime: "",
        endTime: "",
        purpose: "",
        expectedAttendees: ""
      });

    } catch (err) {
      alert("❌ " + (err.response?.data?.message || "Error"));
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>Create Booking</h1>

      {/* Resource Dropdown */}
      <div>
        <label>Resource:</label><br />
        <select name="resourceId" value={form.resourceId} onChange={handleChange}>
          <option value="">Select Resource</option>
          {resources.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name} ({r.location})
            </option>
          ))}
        </select>
      </div>

      <br />

      {/* User Dropdown */}
      <div>
        <label>User:</label><br />
        <select name="userId" value={form.userId} onChange={handleChange}>
          <option value="">Select User</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name} ({u.role})
            </option>
          ))}
        </select>
      </div>

      <br />

      <input type="date" name="bookingDate" value={form.bookingDate} onChange={handleChange} /><br /><br />
      <input type="time" name="startTime" value={form.startTime} onChange={handleChange} /><br /><br />
      <input type="time" name="endTime" value={form.endTime} onChange={handleChange} /><br /><br />

      <input
        name="purpose"
        placeholder="Purpose"
        value={form.purpose}
        onChange={handleChange}
      /><br /><br />

      <input
        name="expectedAttendees"
        placeholder="Attendees"
        value={form.expectedAttendees}
        onChange={handleChange}
      /><br /><br />

      <button onClick={handleSubmit}>Create Booking</button>
    </div>
  );
}

export default CreateBooking;