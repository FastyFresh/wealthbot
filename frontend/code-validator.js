const fs = require('fs');

class CodeValidator {
    constructor() {
        this.requiredExports = {
            'src/agents/TradingAgent.ts': ['TradingAgent'],
            'src/agents/StrategyAgent.ts': ['StrategyAgent'],
            'src/strategies/SOLPerpetualStrategy.ts': ['SOLPerpetualStrategy'],
        };

        this.requiredImports = {
            '@solana/web3.js': ['Connection', 'PublicKey'],
            '@solana/wallet-adapter-react': ['useConnection', 'useWallet'],
        };
    }

    async validate() {
        console.log('Starting code validation...\n');

        // Check file contents and exports
        for (const [file, exports] of Object.entries(this.requiredExports)) {
            if (fs.existsSync(file)) {
                const content = fs.readFileSync(file, 'utf8');
                console.log(`\nChecking ${file}:`);
                
                // Check exports
                exports.forEach(exp => {
                    const hasExport = content.includes(`export class ${exp}`) || 
                                    content.includes(`export interface ${exp}`) ||
                                    content.includes(`export type ${exp}`);
                    console.log(`${hasExport ? '✅' : '❌'} Export: ${exp}`);
                });

                // Check imports
                for (const [pkg, imports] of Object.entries(this.requiredImports)) {
                    const hasImport = content.includes(`from '${pkg}'`);
                    if (hasImport) {
                        console.log(`✅ Import from: ${pkg}`);
                        imports.forEach(imp => {
                            const hasSpecificImport = content.includes(imp);
                            console.log(`  ${hasSpecificImport ? '✅' : '❌'} Import: ${imp}`);
                        });
                    } else {
                        console.log(`❌ Missing import from: ${pkg}`);
                    }
                }
            } else {
                console.log(`\n❌ File not found: ${file}`);
            }
        }

        // Additional checks for React components
        this.validateReactComponents();

        console.log('\nCode validation complete!');
    }

    validateReactComponents() {
        const componentPath = 'src/components';
        if (fs.existsSync(componentPath)) {
            console.log('\nChecking React components:');
            fs.readdirSync(componentPath).forEach(file => {
                if (file.endsWith('.tsx')) {
                    const content = fs.readFileSync(`${componentPath}/${file}`, 'utf8');
                    console.log(`\nComponent: ${file}`);
                    
                    // Check for React import
                    const hasReactImport = content.includes("import React");
                    console.log(`${hasReactImport ? '✅' : '❌'} React import`);
                    
                    // Check for component export
                    const hasExport = content.includes("export default") || 
                                    content.includes("export const");
                    console.log(`${hasExport ? '✅' : '❌'} Component export`);
                    
                    // Check for prop types/interfaces
                    const hasProps = content.includes("interface Props") || 
                                   content.includes("type Props");
                    console.log(`${hasProps ? '✅' : '❌'} Prop types defined`);
                }
            });
        }
    }
}

// Run the validator
const validator = new CodeValidator();
validator.validate().catch(console.error);
