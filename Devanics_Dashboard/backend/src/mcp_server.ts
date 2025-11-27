import express from "express";
import bodyParser from "body-parser";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  CallToolRequest,
  ListToolsResult,
  CallToolResult,
} from "@modelcontextprotocol/sdk/types.js";
import axios, { AxiosResponse } from "axios";
import FormData from "form-data";
import cors from "cors";


const PYTHON_API = process.env.VOLVOX_API_URL || "https://volvox-backend.onrender.com/api/v1";
const NODEJS_API = process.env.DEVANICS_API_URL || "http://localhost:3001/api";

interface VolvoxUser {
  _id: string;
  email: string;
  fullName: string;
  created_at: string;
}

interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: VolvoxUser;
}

interface ResearchItem {
  _id: string;
  user_id: string;
  researchName: string;
  fileName: string;
  extension: string;
  file_id: string;
  createdAt: string;
  fileUrl: string;
}

interface ChatResponse {
  response: string;
  chat_id: string;
  chat_title: string;
}

interface Profile {
  _id: string;
  companyName: string;
  websiteLink: string;
  hiresPerYear: string;
  address: string;
  city: string;
  country: string;
  zipCode: string;
  phoneNumber: string;
  vatNumber: string;
  description: string;
  status: string;
  startDate: string;
  archived: boolean;
  volvox_user_id?: string;
  volvox_user_email?: string;
}

function castArgs<T>(args: unknown): T {
  return args as T;
}

const server = new Server(
  {
    name: "unified-research-profile-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async (): Promise<ListToolsResult> => {
  return {
    tools: [
      {
        name: "auth_signup",
        description: "Register new user (Python FastAPI)",
        inputSchema: {
          type: "object",
          properties: {
            email: { type: "string" },
            password: { type: "string", minLength: 8 },
            fullName: { type: "string" },
          },
          required: ["email", "password", "fullName"],
        },
      },
      {
        name: "auth_login",
        description: "Login user and get JWT token (Python FastAPI)",
        inputSchema: {
          type: "object",
          properties: {
            email: { type: "string" },
            password: { type: "string" },
          },
          required: ["email", "password"],
        },
      },
      {
        name: "auth_get_user",
        description: "Get current user info with JWT token (Python FastAPI)",
        inputSchema: {
          type: "object",
          properties: {
            token: { type: "string" },
          },
          required: ["token"],
        },
      },
      {
        name: "research_list",
        description: "List user's research documents (Python FastAPI)",
        inputSchema: {
          type: "object",
          properties: {
            token: { type: "string" },
            limit: { type: "number", default: 20 },
            offset: { type: "number", default: 0 },
          },
          required: ["token"],
        },
      },
      {
        name: "chat_ask",
        description: "Ask AI assistant a question (Python FastAPI)",
        inputSchema: {
          type: "object",
          properties: {
            token: { type: "string" },
            question: { type: "string" },
            chat_id: { type: "string" },
            document_id: { type: "string" },
          },
          required: ["token", "question"],
        },
      },
      {
        name: "profile_create",
        description: "Create company profile (Node.js Express) - requires Volvox token",
        inputSchema: {
          type: "object",
          properties: {
            volvox_token: { type: "string", description: "JWT from Python backend" },
            companyName: { type: "string" },
            websiteLink: { type: "string" },
            hiresPerYear: { type: "string" },
            address: { type: "string" },
            city: { type: "string" },
            country: { type: "string" },
            zipCode: { type: "string" },
            phoneNumber: { type: "string" },
            vatNumber: { type: "string" },
            description: { type: "string" },
            status: { type: "string", enum: ["In Progress", "Draft", "Completed"] },
          },
          required: ["volvox_token", "companyName", "websiteLink"],
        },
      },
      {
        name: "profile_list",
        description: "List all profiles (Node.js Express)",
        inputSchema: {
          type: "object",
          properties: {
            volvox_token: { type: "string" },
          },
          required: ["volvox_token"],
        },
      },
      {
        name: "profile_update",
        description: "Update profile (Node.js Express)",
        inputSchema: {
          type: "object",
          properties: {
            volvox_token: { type: "string" },
            profile_id: { type: "string" },
            companyName: { type: "string" },
            status: { type: "string" },
          },
          required: ["volvox_token", "profile_id"],
        },
      },
      {
        name: "profile_delete",
        description: "Delete profile (Node.js Express)",
        inputSchema: {
          type: "object",
          properties: {
            volvox_token: { type: "string" },
            profile_id: { type: "string" },
          },
          required: ["volvox_token", "profile_id"],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request: CallToolRequest): Promise<CallToolResult> => {
  const { name, arguments: args } = request.params;

  if (!args) {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ error: "No arguments provided" }),
        },
      ],
      isError: true,
    };
  }

  try {
    switch (name) {
      case "auth_signup": {
        const { email, password, fullName } = castArgs<{
          email: string;
          password: string;
          fullName: string;
        }>(args);

        const res: AxiosResponse<AuthResponse> = await axios.post(`${PYTHON_API}/auth/signup`, {
          email,
          password,
          fullName,
        });
        return {
          content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }],
        };
      }

      case "auth_login": {
        const { email, password } = castArgs<{
          email: string;
          password: string;
        }>(args);

        const res: AxiosResponse<AuthResponse> = await axios.post(`${PYTHON_API}/auth/login`, {
          email,
          password,
        });
        return {
          content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }],
        };
      }

      case "auth_get_user": {
        const { token } = castArgs<{ token: string }>(args);

        const res: AxiosResponse<VolvoxUser> = await axios.get(`${PYTHON_API}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        return {
          content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }],
        };
      }

      case "research_list": {
        const { token, limit, offset } = castArgs<{
          token: string;
          limit?: number;
          offset?: number;
        }>(args);

        const params = new URLSearchParams();
        if (limit) params.append("limit", limit.toString());
        if (offset) params.append("offset", offset.toString());

        const res: AxiosResponse<ResearchItem[]> = await axios.get(`${PYTHON_API}/research?${params}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        return {
          content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }],
        };
      }

      case "chat_ask": {
        const { token, question, chat_id, document_id } = castArgs<{
          token: string;
          question: string;
          chat_id?: string;
          document_id?: string;
        }>(args);

        const params = new URLSearchParams();
        params.append("question", question);
        if (chat_id) params.append("chat_id", chat_id);
        if (document_id) params.append("document_id", document_id);

        const res: AxiosResponse<ChatResponse> = await axios.post(
          `${PYTHON_API}/chat/ask?${params}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        return {
          content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }],
        };
      }

      case "profile_create": {
        const {
          volvox_token,
          companyName,
          websiteLink,
          hiresPerYear,
          address,
          city,
          country,
          zipCode,
          phoneNumber,
          vatNumber,
          description,
          status,
        } = castArgs<{
          volvox_token: string;
          companyName: string;
          websiteLink: string;
          hiresPerYear?: string;
          address?: string;
          city?: string;
          country?: string;
          zipCode?: string;
          phoneNumber?: string;
          vatNumber?: string;
          description?: string;
          status?: string;
        }>(args);

        const userRes: AxiosResponse<VolvoxUser> = await axios.get(`${PYTHON_API}/auth/me`, {
          headers: { Authorization: `Bearer ${volvox_token}` },
        });
        const volvoxUser: VolvoxUser = userRes.data;

        const formData = new FormData();
        formData.append("companyName", companyName);
        formData.append("websiteLink", websiteLink);
        formData.append("hiresPerYear", hiresPerYear || "");
        formData.append("address", address || "");
        formData.append("city", city || "");
        formData.append("country", country || "");
        formData.append("zipCode", zipCode || "");
        formData.append("phoneNumber", phoneNumber || "");
        formData.append("vatNumber", vatNumber || "");
        formData.append("description", description || "");
        formData.append("status", status || "In Progress");
        formData.append("sendEmails", "false");
        formData.append("agreeGDPR", "true");
        formData.append("startDate", new Date().toISOString().split("T")[0]);
        formData.append("volvox_user_id", volvoxUser._id);
        formData.append("volvox_user_email", volvoxUser.email);

        const res: AxiosResponse<Profile> = await axios.post(`${NODEJS_API}/profiles`, formData, {
          headers: formData.getHeaders(),
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                { profile: res.data, linked_user: volvoxUser },
                null,
                2
              ),
            },
          ],
        };
      }

      case "profile_list": {
        const { volvox_token } = castArgs<{ volvox_token: string }>(args);

        const userRes: AxiosResponse<VolvoxUser> = await axios.get(`${PYTHON_API}/auth/me`, {
          headers: { Authorization: `Bearer ${volvox_token}` },
        });
        const volvoxUser: VolvoxUser = userRes.data;

        const res: AxiosResponse<Profile[]> = await axios.get(`${NODEJS_API}/profiles`);

        const userProfiles = res.data.filter(
          (p: Profile) => p.volvox_user_id === volvoxUser._id
        );

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                { profiles: userProfiles, user: volvoxUser },
                null,
                2
              ),
            },
          ],
        };
      }

      case "profile_update": {
        const { volvox_token, profile_id, companyName, status } = castArgs<{
          volvox_token: string;
          profile_id: string;
          companyName?: string;
          status?: string;
        }>(args);

        await axios.get(`${PYTHON_API}/auth/me`, {
          headers: { Authorization: `Bearer ${volvox_token}` },
        });

        const updateData: Record<string, string> = {};
        if (companyName) updateData.companyName = companyName;
        if (status) updateData.status = status;

        const res: AxiosResponse<Profile> = await axios.put(
          `${NODEJS_API}/profiles/${profile_id}`,
          updateData
        );

        return {
          content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }],
        };
      }

      case "profile_delete": {
        const { volvox_token, profile_id } = castArgs<{
          volvox_token: string;
          profile_id: string;
        }>(args);

        await axios.get(`${PYTHON_API}/auth/me`, {
          headers: { Authorization: `Bearer ${volvox_token}` },
        });

        await axios.delete(`${NODEJS_API}/profiles/${profile_id}`);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ success: true, message: "Profile deleted" }),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error: any) {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            { error: error.response?.data || error.message },
            null,
            2
          ),
        },
      ],
      isError: true,
    };
  }
});

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.post("/mcp", async (req, res) => {
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true, 
  });

  res.on("close", () => transport.close());

  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);
});

app.listen(4000, () => {
  console.log("MCP HTTP server running on http://localhost:4000/mcp");
});
