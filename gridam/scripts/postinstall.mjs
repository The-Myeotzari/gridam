import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const repoRoot = path.resolve(__dirname, "..");
const scriptPath = path.join(repoRoot, "scripts", "create-structure.ts");

try {
  if (fs.existsSync(scriptPath)) {
    execSync(`npx -y tsx "${scriptPath}"`, { stdio: "inherit", cwd: repoRoot });
  } else {
    console.log("ℹ️ skip: scripts/create-structure.ts 없음");
  }
} catch (e) {
  console.warn("⚠️ postinstall: 구조 생성 중 오류가 발생했지만 설치는 계속합니다.");
  console.warn(String(e?.message || e));
}
