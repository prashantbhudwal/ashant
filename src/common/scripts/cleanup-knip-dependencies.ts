/**
 * Knip Cleanup Script
 *
 * Automates the verification and removal of unused dependencies identified by Knip.
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { execSync } from "node:child_process";

// ============================================================================
// CONFIGURATION
// ============================================================================

// Candidates from Knip output that we want to test
const DEPENDENCIES_TO_TEST: Record<string, string> = {
  "@ai-sdk/google": "^2.0.52",
  "@ai-sdk/groq": "^2.0.34",
  "@mdx-js/loader": "^3.1.1",
  "@mdx-js/mdx": "^3.1.1",
  "@mdx-js/rollup": "^3.1.1",
  "@microlink/react-json-view": "^1.27.0",
  "@types/mdx": "^2.0.13",
  "drizzle-orm": "^0.44.7",
  geist: "^1.5.1",
  postgres: "^3.4.7",
};

// ============================================================================
// HELPERS
// ============================================================================

const PROJECT_ROOT = process.cwd();
const PACKAGE_JSON_PATH = path.join(PROJECT_ROOT, "package.json");

function log(message: string) {
  console.log(`\n[KNIP-CLEANUP] ${message}`);
}

function runCommand(command: string): boolean {
  log(`Running: ${command}`);
  try {
    execSync(command, { cwd: PROJECT_ROOT, stdio: "inherit" });
    return true;
  } catch {
    log(`Command failed: ${command}`);
    return false;
  }
}

function readPackageJson(): Record<string, unknown> {
  const content = fs.readFileSync(PACKAGE_JSON_PATH, "utf-8");
  return JSON.parse(content) as Record<string, unknown>;
}

function writePackageJson(pkg: Record<string, unknown>) {
  fs.writeFileSync(PACKAGE_JSON_PATH, JSON.stringify(pkg, null, 2) + "\n");
}

// ============================================================================
// MAIN LOGIC
// ============================================================================

function main() {
  log("Starting Knip Dependency Cleanup (with batching)");

  const removed: string[] = [];
  const kept: string[] = [];
  const entries = Object.entries(DEPENDENCIES_TO_TEST);

  let successCountSinceBuild = 0;
  const currentBatch: string[] = [];

  for (let i = 0; i < entries.length; i++) {
    const [name, version] = entries[i];
    log(`\n--- Testing removal of: ${name} (${i + 1}/${entries.length}) ---`);

    const pkg = readPackageJson();
    const deps = (pkg.dependencies ?? {}) as Record<string, string>;

    if (!(name in deps)) {
      log(`${name} already removed or missing.`);
      removed.push(name);
      continue;
    }

    const originalVersion = deps[name];
    delete deps[name];
    writePackageJson(pkg);

    const installOk = runCommand("pnpm install");
    const checkOk = installOk && runCommand("pnpm check");

    if (checkOk) {
      log(`✅ ${name} passed type check.`);
      successCountSinceBuild++;
      currentBatch.push(name);

      const isLast = i === entries.length - 1;
      if (successCountSinceBuild >= 5 || (isLast && currentBatch.length > 0)) {
        log(
          `\n🚀 Batch limit reached (${successCountSinceBuild}). Running production build...`,
        );
        const buildOk = runCommand("pnpm build");

        if (buildOk) {
          log(
            `✨ Build passed! Batch of ${successCountSinceBuild} confirmed removed.`,
          );
          removed.push(...currentBatch);
          currentBatch.length = 0;
          successCountSinceBuild = 0;
        } else {
          log(`❌ Build failed after batching. Bisecting batch...`);
          // Restore batch
          const pkgRestore = readPackageJson();
          const restoreDeps = (pkgRestore.dependencies ?? {}) as Record<
            string,
            string
          >;
          for (const item of currentBatch) {
            restoreDeps[item] = DEPENDENCIES_TO_TEST[item];
          }
          pkgRestore.dependencies = restoreDeps;
          writePackageJson(pkgRestore);
          runCommand("pnpm install");

          // Retry individually
          for (const item of currentBatch) {
            log(`\n🔍 Individual retry for: ${item}`);
            const pkgRetry = readPackageJson();
            const depsRetry = (pkgRetry.dependencies ?? {}) as Record<
              string,
              string
            >;
            delete depsRetry[item];
            writePackageJson(pkgRetry);

            if (
              runCommand("pnpm install") &&
              runCommand("pnpm check") &&
              runCommand("pnpm build")
            ) {
              log(`✅ ${item} removed on individual retry.`);
              removed.push(item);
            } else {
              log(`❌ ${item} is required. Restoring.`);
              depsRetry[item] = DEPENDENCIES_TO_TEST[item];
              pkgRetry.dependencies = depsRetry;
              writePackageJson(pkgRetry);
              runCommand("pnpm install");
              kept.push(item);
            }
          }
          currentBatch.length = 0;
          successCountSinceBuild = 0;
        }
      }
    } else {
      log(`❌ ${name} failed type check. Restoring...`);
      deps[name] = originalVersion;
      pkg.dependencies = deps;
      writePackageJson(pkg);
      runCommand("pnpm install");
      kept.push(name);

      if (currentBatch.length > 0) {
        log(`\nChecking previous successful batch after a failure...`);
        if (runCommand("pnpm build")) {
          removed.push(...currentBatch);
        } else {
          log("Previous batch failed build. Restoring all.");
          const pkgF = readPackageJson();
          const fDeps = (pkgF.dependencies ?? {}) as Record<string, string>;
          for (const it of currentBatch) {
            fDeps[it] = DEPENDENCIES_TO_TEST[it];
            kept.push(it);
          }
          pkgF.dependencies = fDeps;
          writePackageJson(pkgF);
          runCommand("pnpm install");
        }
        currentBatch.length = 0;
        successCountSinceBuild = 0;
      }
    }
  }

  log("\n========================================");
  log("CLEANUP COMPLETE");
  log("========================================");
  log(`Removed (${removed.length}): ${removed.join(", ")}`);
  log(`Kept (${kept.length}): ${kept.join(", ")}`);
}

main();
