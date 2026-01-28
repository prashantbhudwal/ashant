/**
 * Dependency Cleanup Script
 *
 * A self-contained TypeScript script to automate the "Scorched Earth" cleanup.
 * Uses only Node.js built-ins: fs, path, child_process, readline.
 *
 * Run with: pnpm tsx src/common/scripts/cleanup-dependencies.ts
 */

import * as fs from 'node:fs'
import * as path from 'node:path'
import { execSync } from 'node:child_process'
import * as readline from 'node:readline'

// ============================================================================
// CONFIGURATION — Edit these lists for your project
// ============================================================================

const SHADCN_COMPONENTS = [
  'accordion',
  'alert',
  'aspect-ratio',
  'badge',
  'button',
  'card',
  'carousel',
  'command',
  'dialog',
  'dropdown-menu',
  'form',
  'input',
  'label',
  'scroll-area',
  'separator',
  'skeleton',
  'slider',
  'table',
  'textarea',
  'tooltip',
]

const DEPENDENCIES_TO_TEST: Record<string, string> = {
  '@ai-sdk/react': '^2.0.119',
  '@ai-sdk/ui-utils': '^1.2.11',
  '@formkit/auto-animate': '^0.9.0',
  '@gxl/epub-parser': '^2.0.4',
  '@mastra/ai-sdk': '^0.2.7',
  '@mastra/client-js': '^0.16.15',
  '@mastra/core': '^0.23.3',
  '@mastra/libsql': '^0.16.4',
  '@mastra/mcp': '^0.14.5',
  '@mastra/memory': '^0.15.13',
  '@mendable/firecrawl-js': '^4.10.0',
  '@openai/agents': '^0.1.11',
  '@openai/agents-extensions': '^0.1.5',
  '@openrouter/ai-sdk-provider': '^1.5.4',
  '@tanstack/react-form': '^1.27.7',
  '@tanstack/react-router-with-query': '^1.130.17',
  '@tanstack/start-static-server-functions': '^1.145.7',
  '@unpic/react': '^1.0.2',
  '@upstash/redis': '^1.36.0',
  '@vercel/analytics': '^1.6.1',
  'ai-legacy': 'npm:ai@^4.3.19',
  'better-auth': '^1.4.10',
  'client-only': '^0.0.1',
  convex: '^1.31.2',
  epub2md: '^1.5.0',
  epubjs: '^0.3.93',
  'form-data': '^4.0.5',
  immer: '^10.2.0',
  ky: '^1.14.2',
  mastra: '^0.17.7',
  'next-themes': '^0.4.6',
  nitro: '3.0.1-alpha.0',
  openai: '^6.15.0',
  picocolors: '^1.1.1',
  'react-day-picker': '^9.13.0',
  'react-resizable-panels': '^3.0.6',
  recharts: '^2.15.4',
  'rehype-katex': '^7.0.1',
  'remark-math': '^6.0.0',
  sonner: '^2.0.7',
  'sugar-high': '^0.9.5',
}

// ============================================================================
// HELPERS
// ============================================================================

const PROJECT_ROOT = process.cwd()
const PACKAGE_JSON_PATH = path.join(PROJECT_ROOT, 'package.json')
const UI_FOLDER_PATH = path.join(
  PROJECT_ROOT,
  'src',
  'client',
  'components',
  'ui',
)

function log(message: string) {
  console.log(`\n[CLEANUP] ${message}`)
}

function runCommand(command: string): boolean {
  log(`Running: ${command}`)
  try {
    execSync(command, { cwd: PROJECT_ROOT, stdio: 'inherit' })
    return true
  } catch {
    log(`Command failed: ${command}`)
    return false
  }
}

function readPackageJson(): Record<string, unknown> {
  const content = fs.readFileSync(PACKAGE_JSON_PATH, 'utf-8')
  return JSON.parse(content) as Record<string, unknown>
}

function writePackageJson(pkg: Record<string, unknown>) {
  fs.writeFileSync(PACKAGE_JSON_PATH, JSON.stringify(pkg, null, 2) + '\n')
}

async function askQuestion(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close()
      resolve(answer.trim().toLowerCase())
    })
  })
}

// ============================================================================
// MAIN STEPS
// ============================================================================

async function step1_removeUiFolder() {
  log('Step 1: Remove UI folder')

  if (!fs.existsSync(UI_FOLDER_PATH)) {
    log('UI folder does not exist, skipping.')
    return
  }

  const answer = await askQuestion(`Delete ${UI_FOLDER_PATH}? (yes/no): `)

  if (answer === 'yes' || answer === 'y') {
    fs.rmSync(UI_FOLDER_PATH, { recursive: true, force: true })
    log('UI folder removed.')
  } else {
    log('Skipping UI folder removal.')
  }
}

function step2_removeRadixPackages() {
  log('Step 2: Remove all @radix-ui/* packages from package.json')

  const pkg = readPackageJson()
  const deps = (pkg.dependencies ?? {}) as Record<string, string>

  const radixPackages = Object.keys(deps).filter((name) =>
    name.startsWith('@radix-ui/'),
  )

  if (radixPackages.length === 0) {
    log('No @radix-ui packages found.')
    return
  }

  for (const name of radixPackages) {
    log(`Removing: ${name}`)
    delete deps[name]
  }

  pkg.dependencies = deps
  writePackageJson(pkg)
  runCommand('pnpm install')
  log(`Removed ${radixPackages.length} Radix packages.`)
}

function step3_reinstallShadcnComponents() {
  log('Step 3: Reinstall Shadcn components')

  const componentList = SHADCN_COMPONENTS.join(' ')
  runCommand(`pnpm shadd ${componentList} --overwrite --yes`)
  log('Shadcn components reinstalled.')
}

function step4_testDependencies(): { removed: string[]; kept: string[] } {
  log('Step 4: Iteratively test each dependency removal (Build batching: 5)')

  const removed: string[] = []
  const kept: string[] = []
  const entries = Object.entries(DEPENDENCIES_TO_TEST)

  let successCountSinceBuild = 0
  const currentBatch: string[] = []

  for (let i = 0; i < entries.length; i++) {
    const [name, version] = entries[i]
    log(`\n--- Testing removal of: ${name} (${i + 1}/${entries.length}) ---`)

    const pkg = readPackageJson()
    const deps = (pkg.dependencies ?? {}) as Record<string, string>

    if (!(name in deps)) {
      log(`${name} not in dependencies, skipping.`)
      removed.push(name)
      continue
    }

    const originalVersion = deps[name]
    delete deps[name]
    writePackageJson(pkg)

    const installOk = runCommand('pnpm install')
    const checkOk = installOk && runCommand('pnpm check')

    if (checkOk) {
      log(`✅ ${name} passed type check.`)
      successCountSinceBuild++
      currentBatch.push(name)

      // Run build every 5 successes or at the very end
      const isLast = i === entries.length - 1
      if (successCountSinceBuild >= 5 || (isLast && currentBatch.length > 0)) {
        log(
          `\n🚀 Batch limit reached (${successCountSinceBuild}). Running production build...`,
        )
        const buildOk = runCommand('pnpm build')

        if (buildOk) {
          log(
            `✨ Build passed! Batch of ${successCountSinceBuild} confirmed removed.`,
          )
          removed.push(...currentBatch)
          currentBatch.length = 0
          successCountSinceBuild = 0
        } else {
          log(
            `❌ Build failed after batching. Bisecting batch of ${currentBatch.length} items...`,
          )

          // 1. Restore the whole batch first to get back to a clean state
          const pkgRestore = readPackageJson()
          const restoreDeps = (pkgRestore.dependencies ?? {}) as Record<
            string,
            string
          >
          for (const batchItem of currentBatch) {
            restoreDeps[batchItem] = DEPENDENCIES_TO_TEST[batchItem]
          }
          pkgRestore.dependencies = restoreDeps
          writePackageJson(pkgRestore)
          runCommand('pnpm install') // Ensure we are back to green

          // 2. Test each item individually
          for (const batchItem of currentBatch) {
            log(`\n🔍 Individual retry for: ${batchItem}`)

            const pkgRetry = readPackageJson()
            const depsRetry = (pkgRetry.dependencies ?? {}) as Record<
              string,
              string
            >
            delete depsRetry[batchItem]
            writePackageJson(pkgRetry)

            const installOk2 = runCommand('pnpm install')
            const checkOk2 = installOk2 && runCommand('pnpm check')
            const buildOk2 = checkOk2 && runCommand('pnpm build')

            if (buildOk2) {
              log(`✅ ${batchItem} removed safely on retry.`)
              removed.push(batchItem)
            } else {
              log(`❌ ${batchItem} caused the build failure. Keeping.`)
              depsRetry[batchItem] = DEPENDENCIES_TO_TEST[batchItem]
              pkgRetry.dependencies = depsRetry
              writePackageJson(pkgRetry)
              runCommand('pnpm install') // Restore
              kept.push(batchItem)
            }
          }
          currentBatch.length = 0
          successCountSinceBuild = 0
        }
      }
    } else {
      log(`❌ ${name} failed type check. Restoring...`)
      deps[name] = originalVersion
      pkg.dependencies = deps
      writePackageJson(pkg)

      runCommand('pnpm install')
      runCommand('pnpm check')
      kept.push(name)

      // If we have a pending batch, maybe we should build it now to be safe
      if (currentBatch.length > 0) {
        log(`\nChecking previous successful batch after a failure...`)
        const buildBatchOk = runCommand('pnpm build')
        if (buildBatchOk) {
          removed.push(...currentBatch)
        } else {
          // This is unlikely but just in case
          log('Wait, previous batch failed build too. Restoring all.')
          const pkgBatchF = readPackageJson()
          const bDeps = (pkgBatchF.dependencies ?? {}) as Record<string, string>
          for (const it of currentBatch) {
            bDeps[it] = DEPENDENCIES_TO_TEST[it]
            kept.push(it)
          }
          pkgBatchF.dependencies = bDeps
          writePackageJson(pkgBatchF)
          runCommand('pnpm install')
        }
        currentBatch.length = 0
        successCountSinceBuild = 0
      }
    }
  }

  return { removed, kept }
}

function step5_generateReport(removed: string[], kept: string[]) {
  log('Step 5: Final Report')

  console.log('\n========================================')
  console.log('CLEANUP COMPLETE')
  console.log('========================================')

  console.log(`\n✅ Successfully removed (${removed.length}):`)
  for (const name of removed) {
    console.log(`   - ${name}`)
  }

  console.log(`\n❌ Kept (required) (${kept.length}):`)
  for (const name of kept) {
    console.log(`   - ${name}`)
  }

  console.log('\n========================================\n')
}

// ============================================================================
// MAIN
// ============================================================================

async function main() {
  log('Starting Dependency Cleanup Script')
  log(`Project root: ${PROJECT_ROOT}`)

  await step1_removeUiFolder()
  step2_removeRadixPackages()
  step3_reinstallShadcnComponents()
  const { removed, kept } = step4_testDependencies()
  step5_generateReport(removed, kept)
}

main().catch((err) => {
  console.error('Script failed:', err)
  process.exit(1)
})
