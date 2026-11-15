 

function LoginRegister({
  showLogin,
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  handleSubmit,
  message,
  onToggle,
}) {
  return (
    <div className="app">
      <div className="auth-container">
        <h1>Sweety</h1>
        <p className="subtitle">Blood Glucose Tracker</p>

        <h2>{showLogin ? "Login" : "Create Account"}</h2>

        <form onSubmit={handleSubmit}>
          {!showLogin && (
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">
            {showLogin ? "Login" : "Register"}
          </button>
        </form>

        {message && <p className="message">{message}</p>}

        <p className="toggle-text">
          {showLogin
            ? "Don't have an account?"
            : "Already have an account?"}

          <span onClick={onToggle}>
            {showLogin ? " Register" : " Login"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default LoginRegister;
