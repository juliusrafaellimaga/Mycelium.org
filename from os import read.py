from os import read
from pydoc import html
import site


Dividr/
 index.html          
 pipeline.js         
 style.css
.github/      
workflows/
deploy.yml 

# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

 on:
 push:
 branches:
- main  # deploys every time you push to main

permissions:
contents: read
pages: write
id-token: write

 jobs:
deploy:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout repo
    uses: actions/checkout@v4

    - name: Setup Pages
    uses: actions/configure-pages@v4- name: Upload site

 uses: actions/upload-pages-artifact@v3
  with
          path: '.'   # uploads everything in root folder
name: deploy to Github pages
ses: actions/deploy-pages@v4 



const ANTHROPIC_API = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-20250514';

// ── Helper: call Claude API ──────────────────────────────────
async function callAgent(systemPrompt, userMessage) {
  const res = await fetch(ANTHROPIC_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }]
    })
  });
  const data = await res.json();
  return data.content[0].text;
}

// ── Agent 1: Intake — classify and parse the request ─────────
async function intakeAgent(rawInput) {
  console.log('🟡 Agent 1 (Intake) running...');
  return await callAgent(
    `You are an intake agent. Your job is to:
     1. Identify what the user is asking for
     2. Extract key details (topic, urgency, type)
     3. Return a clean structured JSON summary
     Only return valid JSON, no extra text.`,
    rawInput
  );
}

// ── Agent 2: Processor — main AI logic ───────────────────────
async function processorAgent(intakeSummary) {
  console.log('🟠 Agent 2 (Processor) running...');
  return await callAgent(
    `You are a processor agent. You receive a structured summary 
     from the intake agent and perform the main task. 
     Be thorough, accurate, and concise.`,
    `Intake summary: ${intakeSummary}\n\nNow process this fully.`
  );
}

// ── Agent 3: Validator — quality check ───────────────────────
async function validatorAgent(processedOutput) {
  console.log('🔵 Agent 3 (Validator) running...');
  return await callAgent(
    `You are a validator agent. Review the output from the processor.
     Check for: accuracy, completeness, and clarity.
     If it passes, return it as-is with a PASS prefix.
     If it needs fixing, correct it and prefix with FIXED.`,
    processedOutput
  );
}

// ── Agent 4: Responder — final formatting ────────────────────
async function responderAgent(validatedOutput) {
  console.log('🟢 Agent 4 (Responder) running...');
  return await callAgent(
    `You are a responder agent. Take the validated output and format 
     it into a clean, friendly, professional final response 
     suitable for the end user. Remove any PASS or FIXED prefixes.`,
    validatedOutput
  );
}

// ── Mycelium Pipeline — runs all agents in sequence ──────────
export async function runMyceliumPipeline(userInput) {
  console.log('🍄 Mycelium Pipeline started...\n');

  try {
    const intake    = await intakeAgent(userInput);
    const processed = await processorAgent(intake);
    const validated = await validatorAgent(processed);
    const response  = await responderAgent(validated);

    console.log('\n✅ Pipeline complete.');
    return {
      success: true,
      stages: { intake, processed, validated },
      result: response
    };
  } catch (err) {
    console.error('❌ Pipeline error:', err.message);
    return { success: false, error: err.message };
  }
}
index.html — Hook the pipeline to your UI:
html<!DOCTYPE html>
<html lang="en">
<head>
 <meta charset="UTF-8">
 <title>Dividr — Mycelium Pipeline</title>
 <style>
    body { font-family: sans-serif; max-width: 700px; margin: 60px auto; padding: 0 20px; }
    textarea { width: 100%; height: 100px; padding: 10px; font-size: 14px; }
     button  { margin-top: 10px; padding: 10px 24px; background: #185FA5; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; }
    #output { margin-top: 24px; padding: 16px; background: #f5f5f5; border-radius: 8px; white-space: pre-wrap; font-size: 14px; min-height: 60px; }
    #status { font-size: 13px; color: #666; margin-top: 8px; }
 </style>
</head>
<body>
  <h1>🍄 Mycelium Pipeline</h1>
  <p>Enter a request — the AI agent workflow will process it.</p>

  <textarea id="userInput" placeholder="e.g. Analyze Q1 2026 sales and suggest improvements..."></textarea>
  <br>
  <button onclick="run()">Run Pipeline</button>
  <div id="status"></div>
  <div id="output">Output will appear here...</div>

  <script type="module">
    import { runMyceliumPipeline } from './pipeline.js';

    window.run = async function () {
      const input = document.getElementById('userInput').value;
      const status = document.getElementById('status');
      const output = document.getElementById('output');

      if (!input.trim()) return alert('Please enter a request.');

      status.textContent = '🍄 Pipeline running — 4 agents processing...';
      output.textContent = '';

      const result = await runMyceliumPipeline(input);

      if (result.success) {
        status.textContent = '✅ Done!';
        output.textContent = result.result;
      } else {
        status.textContent = '❌ Error';
        output.textContent = result.error;
      }
    };
  </script>
</body>
</html>

