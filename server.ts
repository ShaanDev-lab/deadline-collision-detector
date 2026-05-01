import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";
import taskRoutes from "./routes/taskRoutes.js";
import subjectRoutes from "./routes/subjectRoutes.js";
import userRoutes from "./routes/userRoutes.js";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(cors());
  app.use(express.json());

  // API Routes
  app.use("/api/tasks", taskRoutes);
  app.use("/api/subjects", subjectRoutes);
  app.use("/api/users", userRoutes);

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Basic static serving for production
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`\n🚀 Deadline Collision Detector Server Running!`);
    console.log(`🔗 Local Interface: http://localhost:${PORT}`);
    console.log(`📂 Backend Architecture: MVC`);
    console.log(`🛠️ API: /api/tasks\n`);
  });
}

startServer();
