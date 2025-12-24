
import { useState } from "react";

export default function UploadResearch() {
  const [file, setFile] = useState<File | null>(null);
  const [researchName, setResearchName] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxx.yyyy";

  const handleUpload = async () => {
    if (!file || !researchName.trim()) {
      alert("Please select a file and enter a name");
      return;
    }

    setLoading(true);

    const jsonRpcPayload = {
      jsonrpc: "2.0",
      id: Date.now(),
      method: "tools/call",
      params: {
        name: "volvox_research_create",
        arguments: {
          token: token,
          researchName: researchName.trim(),
        },
      },
    };

    const formData = new FormData();
    formData.append("jsonrpc", JSON.stringify(jsonRpcPayload));
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8001/mcp", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.result?.isError) {
        alert("Error: " + JSON.parse(data.result.content[0].text).error);
      } else {
        const uploaded = JSON.parse(data.result.content[0].text);
        setResult(uploaded);
        alert("Uploaded successfully! ID: " + uploaded._id);
      }
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Upload Research Document</h2>

      <input
        type="text"
        placeholder="Research Name (e.g. Quantum Paper 2025)"
        value={researchName}
        onChange={(e) => setResearchName(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 10 }}
      />

      <input
        type="file"
        accept=".pdf,.docx,.txt"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        style={{ marginBottom: 10 }}
      />

      <button
        onClick={handleUpload}
        disabled={loading}
        style={{
          padding: "10px 20px",
          background: loading ? "#ccc" : "#0066ff",
          color: "white",
          border: "none",
          borderRadius: 6,
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Uploading..." : "Upload Research"}
      </button>

      {result && (
        <pre style={{ marginTop: 20, background: "#f0f0f0", padding: 15 }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}