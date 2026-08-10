import { spawn } from "child_process";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { execSync } from "child_process";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    console.log("[PREDICT API] Received prediction request:", JSON.stringify(data));

    const predictScriptPath = path.join(process.cwd(), "predict.py");
    
    // Check if predict.py exists
    if (!fs.existsSync(predictScriptPath)) {
      console.error("[PREDICT API] predict.py not found at:", predictScriptPath);
      return NextResponse.json(
        { error: `predict.py not found at ${predictScriptPath}` },
        { status: 500 }
      );
    }

    console.log("[PREDICT API] predict.py found at:", predictScriptPath);

    // Get Python path
    let pythonPath = "python";
    try {
      pythonPath = execSync("where python").toString().trim().split("\n")[0];
      console.log("[PREDICT API] Using Python at:", pythonPath);
    } catch (e) {
      console.log("[PREDICT API] Could not find python path, using 'python'");
    }

    // Spawn Python subprocess
    return new Promise((resolve) => {
      console.log("[PREDICT API] Spawning Python process...");
      const pythonProcess = spawn(pythonPath, [predictScriptPath], {
        stdio: ["pipe", "pipe", "pipe"],
        cwd: process.cwd(),
      });

      let stdout = "";
      let stderr = "";
      let timedOut = false;

      const timeout = setTimeout(() => {
        timedOut = true;
        pythonProcess.kill();
        console.error("[PREDICT API] Process timed out after 10 seconds");
        resolve(
          NextResponse.json(
            { error: "Prediction timed out" },
            { status: 500 }
          )
        );
      }, 10000);

      pythonProcess.stdout.on("data", (chunk) => {
        stdout += chunk.toString();
      });

      pythonProcess.stderr.on("data", (chunk) => {
        stderr += chunk.toString();
      });

      pythonProcess.on("error", (error) => {
        clearTimeout(timeout);
        if (timedOut) return;
        console.error("[PREDICT API] Failed to spawn Python process:", error);
        resolve(
          NextResponse.json(
            { 
              error: `Failed to spawn Python: ${error.message}` 
            },
            { status: 500 }
          )
        );
      });

      pythonProcess.on("close", (code) => {
        clearTimeout(timeout);
        if (timedOut) return;
        
        console.log("[PREDICT API] Python process closed with code:", code);
        console.log("[PREDICT API] Stdout:", stdout);
        console.log("[PREDICT API] Stderr:", stderr);

        try {
          if (code !== 0) {
            const errorMsg = stderr || stdout || "Unknown error";
            console.error("[PREDICT API] Python exited with error code", code, ":", errorMsg);
            return resolve(
              NextResponse.json(
                { 
                  error: `Python error: ${errorMsg}` 
                },
                { status: 500 }
              )
            );
          }

          if (!stdout || stdout.trim().length === 0) {
            console.error("[PREDICT API] No output from Python. Stderr:", stderr);
            return resolve(
              NextResponse.json(
                { error: "No output from Python process" },
                { status: 500 }
              )
            );
          }

          const trimmedOutput = stdout.trim();
          console.log("[PREDICT API] Parsing output:", trimmedOutput);
          
          const result = JSON.parse(trimmedOutput);

          if (result.error) {
            console.error("[PREDICT API] Python returned error:", result.error);
            return resolve(
              NextResponse.json({ error: result.error }, { status: 400 })
            );
          }

          console.log("[PREDICT API] Success:", result);
          resolve(NextResponse.json(result, { status: 200 }));
        } catch (e) {
          console.error("[PREDICT API] Error parsing output:", e);
          console.error("[PREDICT API] Raw stdout:", JSON.stringify(stdout));
          console.error("[PREDICT API] Raw stderr:", JSON.stringify(stderr));
          resolve(
            NextResponse.json(
              { error: `Parse error: ${String(e)}` },
              { status: 500 }
            )
          );
        }
      });

      // Send input to Python process
      const inputJson = JSON.stringify(data);
      console.log("[PREDICT API] Sending to Python:", inputJson);
      pythonProcess.stdin.write(inputJson);
      pythonProcess.stdin.end();
    });
  } catch (error: any) {
    console.error("[PREDICT API] API Error:", error);
    return NextResponse.json(
      { error: `API Error: ${error.message}` },
      { status: 500 }
    );
  }
}


