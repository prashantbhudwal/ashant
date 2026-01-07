import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import readline from "readline";

type PromptCreationResult = {
  success: boolean;
  message: string;
  promptPath?: string;
};

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Define paths
const PROMPTS_DIR = path.join(process.cwd(), "src", "content", "prompts");

/**
 * Prompts the user with a question and returns their answer
 */
const prompt = (question: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
};

/**
 * Creates a directory if it doesn't already exist
 */
const createDirIfNotExists = (dirPath: string): void => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
};

/**
 * Creates a new prompt file with the template structure
 */
const createPrompt = async (): Promise<PromptCreationResult> => {
  try {
    // Get slug from user
    const slug = await prompt("Enter prompt slug (kebab-case): ");

    if (!slug) {
      return {
        success: false,
        message: "Slug cannot be empty",
      };
    }

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      return {
        success: false,
        message: "Slug must be in kebab-case format (e.g., my-prompt-slug)",
      };
    }

    const promptFilePath = path.join(PROMPTS_DIR, `${slug}.md`);

    // Check if prompt file already exists
    if (fs.existsSync(promptFilePath)) {
      return {
        success: false,
        message: `Prompt with slug '${slug}' already exists`,
      };
    }

    // Create prompts directory if it doesn't exist
    createDirIfNotExists(PROMPTS_DIR);

    // Create prompt file
    const now = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
    const promptId = uuidv4();

    const title = slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    const mdContent = `---
id: "${promptId}"
slug: "${slug}"
title: "${title}"
shortTitle: ""
description: ""
createdAt: "${now}"
updatedAt: "${now}"
tags: ["ai"]
keyword: ";${slug.replace(/-/g, "")}"
arguments: {}
---

## Context

<!-- Describe when and why to use this prompt -->

## Prompt

\`\`\`md
<!-- Your prompt content goes here -->
\`\`\`
`;

    fs.writeFileSync(promptFilePath, mdContent);
    console.log(`Created prompt file: ${slug}.md`);

    return {
      success: true,
      message: `Prompt '${slug}' created successfully!`,
      promptPath: promptFilePath,
    };
  } catch (error) {
    return {
      success: false,
      message: `Error: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
};

/**
 * Main function to run the script
 */
const main = async (): Promise<void> => {
  try {
    console.log("🚀 Prompt Creator - Create a new AI prompt\n");

    const result = await createPrompt();

    if (result.success) {
      console.log("\n✅ " + result.message);
      console.log("\nYou can now:");
      console.log(`- Edit the prompt at: ${result.promptPath}`);
    } else {
      console.error("\n❌ " + result.message);
    }
  } catch (error) {
    console.error(
      `\n❌ Unexpected error: ${error instanceof Error ? error.message : String(error)}`,
    );
  } finally {
    rl.close();
  }
};

// Run the script
main();
