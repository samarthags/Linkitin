import { useState } from "react";

export default function Home() {
  const [form, setForm] = useState({
    username: "",
    name: "",
    bio: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (data.url) {
      window.location.href = data.url;
    } else {
      alert(data.error);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: 50 }}>
      <h1>Create Profile</h1>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Username"
          onChange={(e) =>
            setForm({ ...form, username: e.target.value })
          }
        />
        <br /><br />

        <input
          placeholder="Name"
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />
        <br /><br />

        <textarea
          placeholder="Bio"
          onChange={(e) =>
            setForm({ ...form, bio: e.target.value })
          }
        />
        <br /><br />

        <button type="submit">Create</button>
      </form>
    </div>
  );
}