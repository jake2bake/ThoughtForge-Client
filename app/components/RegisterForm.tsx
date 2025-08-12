"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "../data/auth";

export default function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    about_me: "",
    role: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register(formData);
      router.push("/login");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style jsx>{`
        .medieval-bg {
          min-height: 100vh;
          background: linear-gradient(135deg, #1e1b4b 0%, #581c87 50%, #374151 100%);
          background-image: 
            radial-gradient(2px 2px at 20px 30px, rgba(255,255,255,0.15), transparent),
            radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.1), transparent),
            radial-gradient(1px 1px at 90px 40px, rgba(255,255,255,0.1), transparent),
            radial-gradient(1px 1px at 130px 80px, rgba(255,255,255,0.1), transparent),
            radial-gradient(2px 2px at 160px 30px, rgba(255,255,255,0.1), transparent);
          background-repeat: repeat;
          background-size: 200px 100px;
        }
        
        .medieval-card {
          background: #1f2937;
          border: 4px solid #d97706;
          clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
          box-shadow: 0 0 20px rgba(217, 119, 6, 0.5), inset 0 0 20px rgba(0, 0, 0, 0.5);
          position: relative;
        }
        
        .medieval-card::before {
          content: '';
          position: absolute;
          top: -8px;
          left: -8px;
          right: -8px;
          bottom: -8px;
          background: linear-gradient(45deg, #d97706, #f59e0b, #d97706);
          clip-path: polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px));
          z-index: -1;
          opacity: 0.75;
        }
        
        .medieval-header {
          background: linear-gradient(90deg, #d97706, #f59e0b);
          border-bottom: 4px solid #d97706;
          font-family: monospace;
          text-shadow: 2px 2px 0px rgba(0,0,0,0.3);
          letter-spacing: 2px;
          color: #1f2937;
          font-weight: bold;
          font-size: 1.5rem;
        }
        
        .medieval-input {
          background: #111827 !important;
          border: 2px solid #d97706 !important;
          color: #fbbf24 !important;
          font-family: monospace !important;
          clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px));
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.6) !important;
          transition: all 0.2s;
        }
        
        .medieval-input:focus {
          border-color: #fbbf24 !important;
          background: #1f2937 !important;
          box-shadow: 0 0 0 0.125em rgba(251, 191, 36, 0.25) !important;
        }
        
        .medieval-input::placeholder {
          color: #6b7280 !important;
        }
        
        .medieval-label {
          color: #fbbf24;
          font-family: monospace;
          font-weight: bold;
          letter-spacing: 1px;
          font-size: 0.875rem;
        }
        
        .medieval-button {
          background: linear-gradient(90deg, #d97706, #f59e0b) !important;
          border: 2px solid #d97706 !important;
          color: #1f2937 !important;
          font-family: monospace !important;
          font-weight: bold !important;
          font-size: 1.125rem !important;
          letter-spacing: 2px !important;
          clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
          text-shadow: 1px 1px 0px rgba(0,0,0,0.3);
          box-shadow: 0 4px 8px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.2);
          transition: all 0.2s;
          transform: scale(1);
        }
        
        .medieval-button:hover:not(:disabled) {
          background: linear-gradient(90deg, #f59e0b, #d97706) !important;
          transform: scale(1.05);
          color: #1f2937 !important;
        }
        
        .medieval-button:active {
          transform: scale(0.95);
        }
        
        .medieval-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .medieval-notification {
          background: #7f1d1d;
          border: 2px solid #dc2626;
          color: #fca5a5;
          font-family: monospace;
          clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
        }
        
        .medieval-footer {
          color: #d97706;
          font-family: monospace;
          font-size: 0.75rem;
          text-align: center;
        }
        
        .card-content {
          background: #1f2937;
        }
      `}</style>
      
      <div className="medieval-bg">
        <div className="hero is-fullheight">
          <div className="hero-body">
            <div className="container">
              <div className="columns is-centered">
                <div className="column is-one-third">
                  <div className="medieval-card">
                    
                    {/* Header */}
                    <div className="medieval-header has-text-centered p-4">
                      ⚔️ JOIN THE REALM ⚔️
                    </div>

                    <div className="card-content p-6">
                      {error && (
                        <div className="medieval-notification notification is-small mb-4">
                          💀 {error}
                        </div>
                      )}

                      <form onSubmit={handleSubmit}>
                        <div className="field">
                          <label className="label medieval-label">
                            🗡️ WARRIOR NAME
                          </label>
                          <div className="control">
                            <input
                              className="input medieval-input"
                              type="text"
                              name="username"
                              placeholder="Enter thy name..."
                              value={formData.username}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>

                        <div className="field">
                          <label className="label medieval-label">
                            📜 SCROLL ADDRESS
                          </label>
                          <div className="control">
                            <input
                              className="input medieval-input"
                              type="email"
                              name="email"
                              placeholder="thy.raven@castle.realm"
                              value={formData.email}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>

                        <div className="field">
                          <label className="label medieval-label">
                            🔐 SECRET PASSPHRASE
                          </label>
                          <div className="control">
                            <input
                              className="input medieval-input"
                              type="password"
                              name="password"
                              placeholder="••••••••"
                              value={formData.password}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>

                        <div className="field">
                          <label className="label medieval-label">
                            📖 THY CHRONICLE
                          </label>
                          <div className="control">
                            <textarea
                              className="textarea medieval-input"
                              name="about_me"
                              placeholder="Tell thy tale of valor and wisdom..."
                              value={formData.about_me}
                              onChange={handleChange}
                              required
                              rows={3}
                            />
                          </div>
                        </div>

                        <div className="field">
                          <label className="label medieval-label">
                            👑 THY CALLING
                          </label>
                          <div className="control">
                            <input
                              className="input medieval-input"
                              type="text"
                              name="role"
                              placeholder="Knight, Mage, Scholar, Bard..."
                              value={formData.role}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>

                        <div className="field">
                          <div className="control">
                            <button
                              type="submit"
                              disabled={loading}
                              className="button is-fullwidth medieval-button"
                            >
                              {loading ? "⏳ FORGING DESTINY..." : "⚔️ ENTER THE REALM ⚔️"}
                            </button>
                          </div>
                        </div>
                      </form>

                      <div className="medieval-footer mt-6">
                        ═══════════════════════════════════
                        <br />
                        🏰 WELCOME TO THE DIGITAL KINGDOM 🏰
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}