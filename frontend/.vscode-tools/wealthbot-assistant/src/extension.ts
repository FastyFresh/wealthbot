import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

// Constants for file patterns and common issues
const SOLANA_PATTERNS = {
    WALLET_CONNECTION: /new Connection\(|useConnection|useWallet/,
    DRIFT_PROTOCOL: /DriftClient|PerpMarket|clearingHouse/,
    RISK_MANAGEMENT: /positionSize|stopLoss|takeProfitLevel/,
    DOCKER_SETUP: {
        CONFIG: /dockerfile|docker-compose\.yml/i,
        DEVNET: /VITE_DEVNET_RPC_URL/,
        PORT: /3015:3015/,
        VOLUMES: /\.\/:/
    }
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
    private diagnosticCollection: vscode.DiagnosticCollection;

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
        this.diagnosticCollection = vscode.languages.createDiagnosticCollection('wealthbot');
        this.registerCommands();
    }

    private registerCommands() {
        this.context.subscriptions.push(
            vscode.commands.registerCommand('wealthbot.analyzeCode', () => {
                this.analyzeWorkspace();
            })
        );

        this.context.subscriptions.push(
            vscode.commands.registerCommand('wealthbot.fixIssue', (issue: CodeIssue) => {
                this.fixIssue(issue);
            })
        );
    }

    private async analyzeWorkspace() {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            vscode.window.showErrorMessage('No workspace folder found');
            return;
        }

        const issues: CodeIssue[] = [];
        await this.analyzeProjectStructure(workspaceFolders[0].uri.fsPath, issues);
        await this.analyzeCodeFiles(workspaceFolders[0].uri.fsPath, issues);
        this.showIssues(issues);
    }

    private async analyzeProjectStructure(rootPath: string, issues: CodeIssue[]) {
        // Check for required directories
        const requiredDirs = ['src/components', 'src/pages', 'src/services', 'src/providers'];
        for (const dir of requiredDirs) {
            const fullPath = path.join(rootPath, dir);
            if (!fs.existsSync(fullPath)) {
                issues.push({
                    file: dir,
                    line: 0,
                    issue: `Missing required directory: ${dir}`,
                    suggestion: `Create directory structure: mkdir -p ${dir}`,
                    severity: 'error'
                });
            }
        }

        // Check Docker configuration files
        const dockerFiles = ['Dockerfile', 'docker-compose.yml', '.dockerignore'];
        for (const file of dockerFiles) {
            const fullPath = path.join(rootPath, file);
            if (!fs.existsSync(fullPath)) {
                issues.push({
                    file: file,
                    line: 0,
                    issue: `Missing Docker configuration file: ${file}`,
                    suggestion: `Create ${file} for Docker setup`,
                    severity: 'error'
                });
            } else {
                const content = fs.readFileSync(fullPath, 'utf8');
                await this.analyzeDockerFile(file, content, issues);
            }
        }

        // Check other required files
        const requiredFiles = [
            'package.json',
            'tsconfig.json',
            '.env.example'
        ];
        
        for (const file of requiredFiles) {
            const fullPath = path.join(rootPath, file);
            if (!fs.existsSync(fullPath)) {
                issues.push({
                    file: file,
                    line: 0,
                    issue: `Missing required file: ${file}`,
                    suggestion: `Create ${file} with appropriate configuration`,
                    severity: 'error'
                });
            }
        }
    }

    private async analyzeDockerFile(fileName: string, content: string, issues: CodeIssue[]) {
        if (fileName === 'docker-compose.yml') {
            if (!SOLANA_PATTERNS.DOCKER_SETUP.DEVNET.test(content)) {
                issues.push({
                    file: fileName,
                    line: 0,
                    issue: 'Missing Solana Devnet RPC URL configuration',
                    suggestion: 'Add VITE_DEVNET_RPC_URL environment variable',
                    severity: 'error'
                });
            }

            if (!SOLANA_PATTERNS.DOCKER_SETUP.PORT.test(content)) {
                issues.push({
                    file: fileName,
                    line: 0,
                    issue: 'Incorrect or missing port mapping',
                    suggestion: 'Add ports: - "3015:3015" for development server',
                    severity: 'error'
                });
            }

            if (!SOLANA_PATTERNS.DOCKER_SETUP.VOLUMES.test(content)) {
                issues.push({
                    file: fileName,
                    line: 0,
                    issue: 'Missing volume mapping',
                    suggestion: 'Add volumes: - ./:/app for hot reloading',
                    severity: 'warning'
                });
            }
        }
    }

    private async analyzeCodeFiles(rootPath: string, issues: CodeIssue[]) {
        const files = await vscode.workspace.findFiles(
            '{src/**/*.{ts,tsx},src/**/*.{js,jsx}}',
            '**/node_modules/**'
        );

        for (const file of files) {
            const document = await vscode.workspace.openTextDocument(file);
            const text = document.getText();

            if (SOLANA_PATTERNS.WALLET_CONNECTION.test(text)) {
                this.analyzeWalletConnection(document, issues);
            }
            if (SOLANA_PATTERNS.DRIFT_PROTOCOL.test(text)) {
                this.analyzeDriftProtocol(document, issues);
            }
            if (SOLANA_PATTERNS.RISK_MANAGEMENT.test(text)) {
                this.analyzeRiskManagement(document, issues);
            }
        }
    }

    private analyzeWalletConnection(document: vscode.TextDocument, issues: CodeIssue[]) {
        const text = document.getText();
        
        if (!text.includes('try') || !text.includes('catch')) {
            issues.push({
                file: document.fileName,
                line: 0,
                issue: 'Missing error handling in wallet connection',
                suggestion: 'Implement try-catch block for wallet operations',
                severity: 'warning'
            });
        }

        if (!text.includes('onConnect') || !text.includes('onDisconnect')) {
            issues.push({
                file: document.fileName,
                line: 0,
                issue: 'Missing wallet connection status handlers',
                suggestion: 'Implement onConnect and onDisconnect handlers',
                severity: 'warning'
            });
        }
    }

    private analyzeDriftProtocol(document: vscode.TextDocument, issues: CodeIssue[]) {
        const text = document.getText();

        if (!text.includes('getPerpMarkets')) {
            issues.push({
                file: document.fileName,
                line: 0,
                issue: 'Missing market initialization',
                suggestion: 'Initialize perpetual markets before trading',
                severity: 'error'
            });
        }

        if (!text.includes('getPositions')) {
            issues.push({
                file: document.fileName,
                line: 0,
                issue: 'Missing position management',
                suggestion: 'Implement position tracking and management',
                severity: 'warning'
            });
        }
    }

    private analyzeRiskManagement(document: vscode.TextDocument, issues: CodeIssue[]) {
        const text = document.getText();

        if (!text.includes('calculatePositionSize')) {
            issues.push({
                file: document.fileName,
                line: 0,
                issue: 'Missing position size calculation',
                suggestion: 'Implement dynamic position sizing based on risk parameters',
                severity: 'warning'
            });
        }

        if (!text.includes('stopLoss')) {
            issues.push({
                file: document.fileName,
                line: 0,
                issue: 'Missing stop loss implementation',
                suggestion: 'Implement stop loss mechanism for risk management',
                severity: 'error'
            });
        }
    }

    private showIssues(issues: CodeIssue[]) {
        this.diagnosticCollection.clear();
        const issuesByFile = new Map<string, vscode.Diagnostic[]>();

        for (const issue of issues) {
            const diagnostic = new vscode.Diagnostic(
                new vscode.Range(issue.line, 0, issue.line, 0),
                `${issue.issue}\nSuggestion: ${issue.suggestion}`,
                this.getSeverity(issue.severity)
            );

            const fileDiagnostics = issuesByFile.get(issue.file) || [];
            fileDiagnostics.push(diagnostic);
            issuesByFile.set(issue.file, fileDiagnostics);
        }

        for (const [file, diagnostics] of issuesByFile) {
            const uri = vscode.Uri.file(file);
            this.diagnosticCollection.set(uri, diagnostics);
        }

        vscode.window.showInformationMessage(
            `Found ${issues.length} issues. Check Problems panel for details.`
        );
    }

    private getSeverity(severity: string): vscode.DiagnosticSeverity {
        switch (severity) {
            case 'error':
                return vscode.DiagnosticSeverity.Error;
            case 'warning':
                return vscode.DiagnosticSeverity.Warning;
            default:
                return vscode.DiagnosticSeverity.Information;
        }
    }

    private async fixIssue(issue: CodeIssue) {
        const document = await vscode.workspace.openTextDocument(issue.file);
        const edit = new vscode.WorkspaceEdit();

        switch (issue.issue) {
            case 'Missing Docker configuration file: docker-compose.yml':
                edit.insert(
                    document.uri,
                    new vscode.Position(0, 0),
                    this.getDockerComposeTemplate()
                );
                break;
            case 'Missing Docker configuration file: Dockerfile':
                edit.insert(
                    document.uri,
                    new vscode.Position(0, 0),
                    this.getDockerfileTemplate()
                );
                break;
            case 'Missing error handling in wallet connection':
                edit.insert(
                    document.uri,
                    new vscode.Position(issue.line, 0),
                    this.getWalletErrorHandlingTemplate()
                );
                break;
        }

        await vscode.workspace.applyEdit(edit);
    }

    private getDockerComposeTemplate(): string {
        return `
services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3015:3015"
    volumes:
      - ./:/app
      - /app/node_modules
    environment:
      - VITE_DEVNET_RPC_URL=https://api.devnet.solana.com
      - NODE_ENV=development
    command: npm run dev -- --host 0.0.0.0 --port 3015
        `.trim();
    }

    private getDockerfileTemplate(): string {
        return `
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3015

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3015"]
        `.trim();
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

export function activate(context: vscode.ExtensionContext) {
    new WealthbotAssistant(context);
}

export function deactivate() {}
