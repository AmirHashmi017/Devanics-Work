import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("amir@example.com");
  const [password, setPassword] = useState("123456");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);

    const jsonRpcPayload = {
      jsonrpc: "2.0",
      id: Date.now(),
      method: "tools/call",
      params: {
        name: "volvox_auth_login",   
        arguments: {
          email: email,
          password: password,
        },
      },
    };

    try {
      const response = await fetch("http://localhost:8001/mcp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jsonRpcPayload),
      });

      const data = await response.json();

      if (data.result?.isError) {
        const error = JSON.parse(data.result.content[0].text);
        alert("Error: " + (error.error || "Login failed"));
      } else {
        const loginResult = JSON.parse(data.result.content[0].text);
        setResult(loginResult);
        alert("Login Success! Token: " + loginResult.token);
        localStorage.setItem("token", loginResult.token);
      }
    } catch (err) {
      alert("Network error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Login via MCP</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 10 }}
      />

      <br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 10 }}
      />
      <br />

      <button
        onClick={handleLogin}
        disabled={loading}
        style={{
          padding: "10px 20px",
          background: loading ? "#ccc" : "#28a745",
          color: "white",
          border: "none",
          borderRadius: 6,
        }}
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      {result && (
        <pre style={{ marginTop: 20, background: "#f0f0f0", padding: 15 }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}