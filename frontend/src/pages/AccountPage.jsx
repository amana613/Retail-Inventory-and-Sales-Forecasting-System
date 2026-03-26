import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const AccountPage = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || ""
  });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "" });
  const [message, setMessage] = useState("");

  const submitProfile = async (event) => {
    event.preventDefault();
    try {
      await updateProfile(profileForm);
      setMessage("Profile updated");
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not update profile");
    }
  };

  const submitPassword = async (event) => {
    event.preventDefault();
    try {
      await changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      setPasswordForm({ currentPassword: "", newPassword: "" });
      setMessage("Password changed");
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not change password");
    }
  };

  return (
    <section className="section-stack">
      <header className="page-header">
        <h2>My Account</h2>
        <p>Manage your personal details and credentials.</p>
      </header>
      {message && <p className="info-banner">{message}</p>}

      <section className="split-grid">
        <article className="card">
          <h3>Profile Details</h3>
          <form onSubmit={submitProfile}>
            <input
              value={profileForm.name}
              placeholder="Name"
              onChange={(e) => setProfileForm((prev) => ({ ...prev, name: e.target.value }))}
              required
            />
            <input
              value={profileForm.email}
              placeholder="Email"
              onChange={(e) => setProfileForm((prev) => ({ ...prev, email: e.target.value }))}
              required
            />
            <button type="submit">Save Details</button>
          </form>
        </article>

        <article className="card">
          <h3>Change Password</h3>
          <form onSubmit={submitPassword}>
            <input
              type="password"
              value={passwordForm.currentPassword}
              placeholder="Current password"
              onChange={(e) =>
                setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))
              }
              required
            />
            <input
              type="password"
              value={passwordForm.newPassword}
              placeholder="New password"
              onChange={(e) => setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))}
              required
            />
            <button type="submit">Update Password</button>
          </form>
        </article>
      </section>
    </section>
  );
};

export default AccountPage;
