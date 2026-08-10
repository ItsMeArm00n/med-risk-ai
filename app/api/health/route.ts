import { spawn } from "child_process";
import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export const dynamic = "force-dynamic";

export async function GET() {
  const checks = {
    python: false,
    model_file: false,
    dependencies: false,
    errors: [] as string[],
  };

  // Check if model file exists
  const modelPath = path.join(process.cwd(), "Health_risk_predictor_model.pkl");
  checks.model_file = fs.existsSync(modelPath);
  if (!checks.model_file) {
    checks.errors.push(`Model file not found at ${modelPath}`);
  }

  // Check Python and dependencies
  return new Promise((resolve) => {
    const pythonProcess = spawn("python", ["-c", "import pickle, json, sys; print('ok')"]);

    let stdout = "";
    let stderr = "";

    pythonProcess.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    pythonProcess.on("error", (error) => {
      checks.errors.push(`Python not found: ${error.message}`);
      resolve(
        NextResponse.json(
          {
            status: "error",
            message: "Python is not installed or not in PATH",
            ...checks,
          },
          { status: 500 }
        )
      );
    });

    pythonProcess.on("close", (code) => {
      checks.python = code === 0;

      if (code !== 0) {
        checks.errors.push(`Python check failed: ${stderr}`);
      } else {
        checks.dependencies = true;
      }

      const status = checks.python && checks.model_file ? "ok" : "error";

      resolve(
        NextResponse.json(
          {
            status,
            message: status === "ok" ? "All checks passed" : "Some checks failed",
            ...checks,
          },
          { status: status === "ok" ? 200 : 500 }
        )
      );
    });
  });
}
