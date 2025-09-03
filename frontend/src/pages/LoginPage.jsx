import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { GraduationCap, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        navigate("/dashboard");
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      setError("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '28rem',
        background: 'white',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ textAlign: 'center', padding: '2rem 2rem 1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <div style={{ 
              backgroundColor: '#2563eb', 
              padding: '0.75rem', 
              borderRadius: '9999px',
              display: 'inline-flex'
            }}>
              <GraduationCap style={{ height: '2rem', width: '2rem', color: 'white' }} />
            </div>
          </div>
          <h2 style={{
            fontSize: '1.5rem',
            lineHeight: '2rem',
            fontWeight: '700',
            marginBottom: '0.5rem',
            color: '#1f2937'
          }}>
            Student Records Management
          </h2>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
            Sign in to access your account
          </p>
        </div>

        <div style={{ padding: '0 2rem 2rem' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label htmlFor="email" style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '0.875rem',
                lineHeight: '1.25rem',
                fontWeight: '500',
                color: '#374151'
              }}>
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '0.375rem',
                  border: '1px solid #d1d5db',
                  fontSize: '0.875rem',
                  lineHeight: '1.25rem',
                  color: '#111827',
                  backgroundColor: '#fff',
                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                }}
              />
            </div>

            <div>
              <label htmlFor="password" style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '0.875rem',
                lineHeight: '1.25rem',
                fontWeight: '500',
                color: '#374151'
              }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '0.5rem 2.5rem 0.5rem 0.75rem',
                    borderRadius: '0.375rem',
                    border: '1px solid #d1d5db',
                    fontSize: '0.875rem',
                    lineHeight: '1.25rem',
                    color: '#111827',
                    backgroundColor: '#fff',
                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '0',
                    top: '0',
                    height: '100%',
                    padding: '0 0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#6b7280'
                  }}
                >
                  {showPassword ? 
                    <EyeOff style={{ height: '1rem', width: '1rem' }} /> : 
                    <Eye style={{ height: '1rem', width: '1rem' }} />
                  }
                </button>
              </div>
            </div>

            {error && (
              <div style={{
                padding: '0.75rem',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '0.375rem',
                color: '#b91c1c',
                fontSize: '0.875rem',
                lineHeight: '1.25rem'
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                backgroundColor: '#2563eb',
                color: 'white',
                fontWeight: '500',
                fontSize: '0.875rem',
                lineHeight: '1.25rem',
                border: 'none',
                cursor: 'pointer',
                opacity: isLoading ? '0.7' : '1',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => !isLoading && (e.target.style.backgroundColor = '#1d4ed8')}
              onMouseOut={(e) => !isLoading && (e.target.style.backgroundColor = '#2563eb')}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div style={{
            marginTop: '1.5rem',
            padding: '1rem',
            backgroundColor: '#f9fafb',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            lineHeight: '1.25rem'
          }}>
            <p style={{ fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
              Demo Accounts:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <p style={{ color: '#4b5563', fontSize: '0.75rem' }}>
                <strong>Administrator:</strong> admin@srms.edu / admin123
              </p>
              <p style={{ color: '#4b5563', fontSize: '0.75rem' }}>
                <strong>Student:</strong> student@srms.edu / student123
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
