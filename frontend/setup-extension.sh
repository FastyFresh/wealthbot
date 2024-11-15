#!/bin/bash

# Save current directory
CURRENT_DIR=$(pwd)

# Create setup directory
mkdir -p .vscode-tools/wealthbot-assistant/src

# Navigate to extension directory
cd .vscode-tools/wealthbot-assistant

# Initialize npm project
echo "Initializing npm project..."
npm init -y

# Install dependencies
echo "Installing dependencies..."
npm install --save-dev @types/vscode vscode typescript 
@types/node

# Create tsconfig.json
echo "Creating tsconfig.json..."
cat > tsconfig.json << 'EOF'
{
    "compilerOptions": {
        "module": "commonjs",
        "target": "ES2020",
        "outDir": "out",
        "lib": ["ES2020"],
        "sourceMap": true,
        "rootDir": "src",
        "strict": true
    },
    "exclude": ["node_modules", ".vscode-test"]
}
EOF

# Create extension.ts
echo "Creating extension.ts..."
cat > src/extension.ts << 'EOF'
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

// Constants for file patterns and common issues
const SOLANA_PATTERNS = {
    WALLET_CONNECTION: /new 
Connection\(|useConnection|useWallet/,
    DRIFT_PROTOCOL: 
/DriftClient|PerpMarket|clearingHouse/,
    RISK_MANAGEMENT: 
/positionSize|stopLoss|takeProfitLevel/
};

interface CodeIssue {
    file: string;
    line: number;
    issue: string;
    suggestion: string;
    severity: 'error' | 'warning' | 'info';
}

class WealthbotAssistant {
    private context: vscode.ExtensionContext;
    private diagnosticCollection: 
vscode.DiagnosticCollection;

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
        this.diagnosticCollection = 
vscode.languages.createDiagnosticCollection('wealthbot');
        this.registerCommands();
    }

    private registerCommands() {
        this.context.subscriptions.push(
            
vscode.commands.registerCommand('wealthbot.analyzeCode', 
() => {
                this.analyzeWorkspace();
            })
        );

        this.context.subscriptions.push(
            
vscode.commands.registerCommand('wealthbot.fixIssue', 
(issue: CodeIssue) => {
                this.fixIssue(issue);
            })
        );
    }

    private async analyzeWorkspace() {
        const workspaceFolders = 
vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            vscode.window.showErrorMessage('No 
workspace folder found');
            return;
        }

        const issues: CodeIssue[] = [];
        await 
this.analyzeProjectStructure(workspaceFolders[0].uri.fsPath, 
issues);
        await 
this.analyzeCodeFiles(workspaceFolders[0].uri.fsPath, 
issues);
        this.showIssues(issues);
    }

    private async analyzeProjectStructure(rootPath: 
string, issues: CodeIssue[]) {
        const requiredDirs = ['src/components', 
'src/pages', 'src/services', 'src/providers'];
        for (const dir of requiredDirs) {
            const fullPath = path.join(rootPath, dir);
            if (!fs.existsSync(fullPath)) {
                issues.push({
                    file: dir,
                    line: 0,
                    issue: `Missing required 
directory: ${dir}`,
                    suggestion: `Create directory 
structure: mkdir -p ${dir}`,
                    severity: 'error'
                });
            }
        }

        const requiredFiles = [
            'package.json',
            'tsconfig.json',
            'docker-compose.yml',
            '.env.example'
        ];
        
        for (const file of requiredFiles) {
            const fullPath = path.join(rootPath, 
file);
            if (!fs.existsSync(fullPath)) {
                issues.push({
                    file: file,
                    line: 0,
                    issue: `Missing required file: 
${file}`,
                    suggestion: `Create ${file} with 
appropriate configuration`,
                    severity: 'error'
                });
            }
        }
    }

    private async analyzeCodeFiles(rootPath: string, 
issues: CodeIssue[]) {
        const files = await 
vscode.workspace.findFiles(
            '{src/**/*.{ts,tsx},src/**/*.{js,jsx}}',
            '**/node_modules/**'
        );

        for (const file of files) {
            const document = await 
vscode.workspace.openTextDocument(file);
            const text = document.getText();

            if 
(SOLANA_PATTERNS.WALLET_CONNECTION.test(text)) {
                this.analyzeWalletConnection(document, 
issues);
            }
            if 
(SOLANA_PATTERNS.DRIFT_PROTOCOL.test(text)) {
                this.analyzeDriftProtocol(document, 
issues);
            }
            if 
(SOLANA_PATTERNS.RISK_MANAGEMENT.test(text)) {
                this.analyzeRiskManagement(document, 
issues);
            }
        }
    }

    private analyzeWalletConnection(document: 
vscode.TextDocument, issues: CodeIssue[]) {
        const text = document.getText();
        
        if (!text.includes('try') || 
!text.includes('catch')) {
            issues.push({
                file: document.fileName,
                line: 0,
                issue: 'Missing error handling in 
wallet connection',
                suggestion: 'Implement try-catch block 
for wallet operations',
                severity: 'warning'
            });
        }

        if (!text.includes('onConnect') || 
!text.includes('onDisconnect')) {
            issues.push({
                file: document.fileName,
                line: 0,
                issue: 'Missing wallet connection 
status handlers',
                suggestion: 'Implement onConnect and 
onDisconnect handlers',
                severity: 'warning'
            });
        }
    }

    private analyzeDriftProtocol(document: 
vscode.TextDocument, issues: CodeIssue[]) {
        const text = document.getText();

        if (!text.includes('getPerpMarkets')) {
            issues.push({
                file: document.fileName,
                line: 0,
                issue: 'Missing market 
initialization',
                suggestion: 'Initialize perpetual 
markets before trading',
                severity: 'error'
            });
        }

        if (!text.includes('getPositions')) {
            issues.push({
                file: document.fileName,
                line: 0,
                issue: 'Missing position management',
                suggestion: 'Implement position 
tracking and management',
                severity: 'warning'
            });
        }
    }

    private analyzeRiskManagement(document: 
vscode.TextDocument, issues: CodeIssue[]) {
        const text = document.getText();

        if (!text.includes('calculatePositionSize')) {
            issues.push({
                file: document.fileName,
                line: 0,
                issue: 'Missing position size 
calculation',
                suggestion: 'Implement dynamic 
position sizing based on risk parameters',
                severity: 'warning'
            });
        }

        if (!text.includes('stopLoss')) {
            issues.push({
                file: document.fileName,
                line: 0,
                issue: 'Missing stop loss 
implementation',
                suggestion: 'Implement stop loss 
mechanism for risk management',
                severity: 'error'
            });
        }
    }

    private showIssues(issues: CodeIssue[]) {
        this.diagnosticCollection.clear();
        const issuesByFile = new Map<string, 
vscode.Diagnostic[]>();

        for (const issue of issues) {
            const diagnostic = new vscode.Diagnostic(
                new vscode.Range(issue.line, 0, 
issue.line, 0),
                `${issue.issue}\nSuggestion: 
${issue.suggestion}`,
                this.getSeverity(issue.severity)
            );

            const fileDiagnostics = 
issuesByFile.get(issue.file) || [];
            fileDiagnostics.push(diagnostic);
            issuesByFile.set(issue.file, 
fileDiagnostics);
        }

        for (const [file, diagnostics] of 
issuesByFile) {
            const uri = vscode.Uri.file(file);
            this.diagnosticCollection.set(uri, 
diagnostics);
        }

        vscode.window.showInformationMessage(
            `Found ${issues.length} issues. Check 
Problems panel for details.`
        );
    }

    private getSeverity(severity: string): 
vscode.DiagnosticSeverity {
        switch (severity) {
            case 'error':
                return 
vscode.DiagnosticSeverity.Error;
            case 'warning':
                return 
vscode.DiagnosticSeverity.Warning;
            default:
                return 
vscode.DiagnosticSeverity.Information;
        }
    }

    private async fixIssue(issue: CodeIssue) {
        const document = await 
vscode.workspace.openTextDocument(issue.file);
        const edit = new vscode.WorkspaceEdit();

        switch (issue.issue) {
            case 'Missing error handling in wallet 
connection':
                edit.insert(
                    document.uri,
                    new vscode.Position(issue.line, 
0),
                    
this.getWalletErrorHandlingTemplate()
                );
                break;
        }

        await vscode.workspace.applyEdit(edit);
    }

    private getWalletErrorHandlingTemplate(): string {
        return `
try {
    const response = await wallet.connect();
    // Handle successful connection
} catch (error) {
    console.error('Wallet connection failed:', error);
    // Handle error appropriately
}
        `.trim();
    }
}

export function activate(context: 
vscode.ExtensionContext) {
    new WealthbotAssistant(context);
}

export function deactivate() {}
EOF

# Update package.json with extension configuration
echo "Updating package.json..."
cat > package.json << 'EOF'
{
    "name": "wealthbot-assistant",
    "displayName": "Wealthbot Development Assistant",
    "description": "AI-powered development assistant 
for Wealthbot",
    "version": "0.0.1",
    "engines": {
        "vscode": "^1.60.0"
    },
    "categories": [
        "Other"
    ],
    "activationEvents": [
        "onCommand:wealthbot.analyzeCode"
    ],
    "main": "./out/extension.js",
    "contributes": {
        "commands": [
            {
                "command": "wealthbot.analyzeCode",
                "title": "Wealthbot: Analyze Code"
            }
        ]
    },
    "scripts": {
        "vscode:prepublish": "npm run compile",
        "compile": "tsc -p ./",
        "watch": "tsc -watch -p ./",
        "pretest": "npm run compile"
    },
    "devDependencies": {
        "@types/node": "^16.x",
        "@types/vscode": "^1.60.0",
        "typescript": "^4.x"
    }
}
EOF

# Create .vscodeignore
echo "Creating .vscodeignore..."
cat > .vscodeignore << 'EOF'
.vscode/**
.vscode-test/**
src/**
.gitignore
.yarnrc
vsc-extension-quickstart.md
**/tsconfig.json
**/.eslintrc.json
**/*.map
**/*.ts
EOF

# Compile the extension
echo "Compiling the extension..."
npm run compile

# Create VSIX package
echo "Creating VSIX package..."
npm install -g vsce
vsce package

# Return to original directory
cd "$CURRENT_DIR"

echo "Setup complete! The extension has been created 
in .vscode-tools/wealthbot-assistant/"
echo "To install the extension:"
echo "1. Open VS Code"
echo "2. Press Ctrl/Cmd + Shift + P"
echo "3. Type 'Install from VSIX'"
echo "4. Select the .vsix file in 
.vscode-tools/wealthbot-assistant/"
