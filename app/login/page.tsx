"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "../data/auth";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const user = { username: username, password };
      const response = await login(user);

      if (response.token) {
        localStorage.setItem("token", response.token);
        router.push("/entries");  
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <section className="section">
      <div className="medieval-login-card fade-in">
        <div className="medieval-card-header">
          <h1 className="title">⚔️ Enter the Realm ⚔️</h1>
          <p className="subtitle">Present thy credentials, brave scribe</p>
        </div>

        <div style={{ padding: '2rem' }}>
          {error && <div className="notification is-danger">🛡️ {error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label className="label">👤 Scholar's Name</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  placeholder="Enter thy username..."
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="field">
              <label className="label">🔐 Secret Passage</label>
              <div className="control">
                <input
                  className="input"
                  type="password"
                  placeholder="•••••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="field">
              <div className="control">
                <button className="button is-primary" type="submit" style={{ width: '100%' }}>
                  🏰 Enter the Keep
                </button>
              </div>
            </div>
            <div className="field">
              <div className="control">
                <Link href='/register' className="button is-primary" style={{ width: '100%'}}>
                  Be Knighted, Dear Traveler
                </Link>
              </div>

            </div>
          </form>
        </div>
      </div>
    </section>
  );
}