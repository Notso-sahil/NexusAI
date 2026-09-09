import os from 'node:os';
import path from 'node:path';
import { TOOL_NAMES, TOOL_SCHEMAS } from '../packages/shared/dist/index.mjs';
import { getAgentDataDir, getDatabasePath, getDefaultWorkspaceDir } from '../packages/bridge/dist/agent/storage.js';

console.log('====================================================');
console.log('NexusAI Phase 5 Verification Test Suite');
console.log('====================================================\n');

let failed = 0;

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    failed++;
  } else {
    console.log(`✅ PASS: ${message}`);
  }
}

// 1. Verify Shared Tool Names
console.log('[1] Verifying Shared Tool Names...');
assert(TOOL_NAMES.BROWSER.JOB_APPLIER === 'nexus_job_applier', 'JOB_APPLIER constant is "nexus_job_applier"');
assert(TOOL_NAMES.BROWSER.QUIZ_SOLVER === 'nexus_quiz_solver', 'QUIZ_SOLVER constant is "nexus_quiz_solver"');
assert(TOOL_NAMES.BROWSER.FORM_AUTOFILL === 'nexus_form_autofill', 'FORM_AUTOFILL constant is "nexus_form_autofill"');

// 2. Verify Shared Tool Schemas in TOOL_SCHEMAS array
console.log('\n[2] Verifying Tool Schemas Registration...');
const schemaNames = TOOL_SCHEMAS.map(s => s.name);
assert(schemaNames.includes('nexus_job_applier'), 'TOOL_SCHEMAS includes "nexus_job_applier"');
assert(schemaNames.includes('nexus_quiz_solver'), 'TOOL_SCHEMAS includes "nexus_quiz_solver"');
assert(schemaNames.includes('nexus_form_autofill'), 'TOOL_SCHEMAS includes "nexus_form_autofill"');

const jobApplierSchema = TOOL_SCHEMAS.find(s => s.name === 'nexus_job_applier');
assert(jobApplierSchema && jobApplierSchema.inputSchema.properties.resumeProfile, 'jobApplierSchema defines resumeProfile property');
assert(jobApplierSchema && jobApplierSchema.inputSchema.properties.tailorAnswers, 'jobApplierSchema defines tailorAnswers property');

// 3. Verify Agent Storage Isolation
console.log('\n[3] Verifying ~/.nexusai-agent Local Storage Isolation...');
const defaultDataDir = path.join(os.homedir(), '.nexusai-agent');
const defaultDbPath = path.join(defaultDataDir, 'agent.db');
const defaultWorkspaces = path.join(defaultDataDir, 'workspaces');

assert(getAgentDataDir() === defaultDataDir, `Default data dir is ~/.nexusai-agent (${getAgentDataDir()})`);
assert(getDatabasePath() === defaultDbPath, `Default database path is ~/.nexusai-agent/agent.db (${getDatabasePath()})`);
assert(getDefaultWorkspaceDir() === defaultWorkspaces, `Default workspaces dir is ~/.nexusai-agent/workspaces (${getDefaultWorkspaceDir()})`);

// Test environment variable override
process.env.NEXUSAI_AGENT_DATA_DIR = path.join(os.homedir(), '.test-nexus-custom');
assert(getAgentDataDir() === path.resolve(path.join(os.homedir(), '.test-nexus-custom')), 'NEXUSAI_AGENT_DATA_DIR overrides default storage path');
delete process.env.NEXUSAI_AGENT_DATA_DIR;

console.log('\n====================================================');
if (failed === 0) {
  console.log('🎉 ALL PHASE 5 AUTOMATED CHECKS PASSED SUCCESSFULLY!');
  console.log('====================================================');
  process.exit(0);
} else {
  console.error(`💥 ${failed} check(s) failed!`);
  console.log('====================================================');
  process.exit(1);
}
