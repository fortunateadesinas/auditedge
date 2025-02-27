#!/usr/bin/env node

const { Command } = require('commander');
const inquirer = require('inquirer');
const { analyzeContract } = require('./src/ai-prompt');
const fs = require('fs');
const path = require('path');
const { type } = require('os');

const program = new Command();

program.name("auditedge").description('A CLI tool for auditing smart contracts using AI.').version('1.0.0');

const getApiKey = async () => {

    const { apiKey } = await inquirer.prompt([
        {
            type: 'input',
            name: 'apiKey',
            message: 'Enter your Gemini API key:',
            validate: (input) => input.length > 0 || 'API key cannot be empty.'
        }
    ]);
    return apiKey;
};

program.command('check <file>').description('Analyzes a smart contract file.').action(async (file) => {
    try {
        const apiKey = await getApiKey();

        const contractPath = path.resolve(process.cwd(), file);
        console.log(`Checking file at path: ', ${contractPath}`);

        if (!fs.existsSync(contractPath)) {
            console.log('File does not exist.');
            process.exit(1);            
        }

        if (fs.statSync(contractPath).isDirectory()) {
            console.error('This is a directory, not a file.', contractPath);
            process.exit(1);            
        }

        const contract = fs.readFileSync(contractPath, 'utf8');

        await analyzeContract(contract, apiKey);
    } catch (error) {
        console.error('An error occurred during analysis:', error.message);
        process.exit(1);
    }
});

program.parse(process.argv);