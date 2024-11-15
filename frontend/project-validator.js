const fs = require('fs');

class ProjectValidator {
    constructor() {
        this.requiredDirectories = [
            'src',
            'src/components',
            'src/services',
            'src/agents',
            'src/strategies',
            'src/utils',
            'src/providers'
        ];

        this.requiredFiles = [
            'package.json',
            'tsconfig.json',
            'vite.config.ts',
            '.env.example',
            'src/agents/TradingAgent.ts',
            'src/agents/StrategyAgent.ts',
            'src/strategies/SOLPerpetualStrategy.ts'
        ];

        this.requiredDependencies = [
            '@solana/web3.js',
            '@solana/wallet-adapter-react',
            'typescript',
            'react',
            '@types/node'
        ];
    }

    async validate() {
        console.log('Starting project validation...\n');

        // Check directories
        console.log('Checking directories:');
        for (const dir of this.requiredDirectories) {
            if (!fs.existsSync(dir)) {
                console.log(`❌ Missing: ${dir}`);
                fs.mkdirSync(dir, { recursive: true });
                console.log(`✅ Created: ${dir}`);
            } else {
                console.log(`✅ Exists: ${dir}`);
            }
        }

        // Check files
        console.log('\nChecking required files:');
        for (const file of this.requiredFiles) {
            if (!fs.existsSync(file)) {
                console.log(`❌ Missing: ${file}`);
            } else {
                console.log(`✅ Exists: ${file}`);
            }
        }

        // Check package.json dependencies
        if (fs.existsSync('package.json')) {
            console.log('\nChecking dependencies:');
            const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
            for (const dep of this.requiredDependencies) {
                const hasDep = packageJson.dependencies?.[dep] || packageJson.devDependencies?.[dep];
                console.log(`${hasDep ? '✅' : '❌'} ${dep}`);
            }
        }

        console.log('\nValidation complete!');
    }
}

// Run the validator
const validator = new ProjectValidator();
validator.validate().catch(console.error);
