import * as fs from 'node:fs';
import * as path from 'node:path';

interface BDDScenario {
	testName: string;
	description: string;
	tags?: string;
}

interface FileScenarios {
	describeBlock?: string;
	scenarios: BDDScenario[];
	hasConfigurableValues?: boolean;
}

function extractBDDFromFile(filePath: string): FileScenarios {
	const content = fs.readFileSync(filePath, 'utf-8');
	const bddScenarios: BDDScenario[] = [];

	// extract test.describe() block name
	const describePattern = /test\.describe\((['"])(.*?)\1/;
	const describeMatch = content.match(describePattern);
	const describeBlock = describeMatch ? describeMatch[2] : undefined;

	//match test names with tags - handles test(), test.skip(), test.only()
	//updated to handle multiline test declarations where async might be on the next line
	//exclude test.describe, test.beforeEach, test.afterEach, etc.
	//updated to handle template literals (backticks) in addition to quotes
	const testPattern = /\btest(?:\.(skip|only))?\((['"`])(.*?)\2/g;
	const testNames: Array<{ name: string; tags: string }> = [];
	let hasConfigurableValues = false;

	// Extract test names and tags
	let match = testPattern.exec(content);
	while (match !== null) {
		const fullMatch = match[3];
		const tagMatch = fullMatch.match(/(@[\w\-,\s]+)/);
		const testName = fullMatch.replace(/\s*\|.*$/, '').trim();
		const tags = tagMatch ? tagMatch[1] : '';

		// Check if test name contains template literal variables
		if (/\$\{[^}]+\}/.test(testName)) {
			hasConfigurableValues = true;
		}

		testNames.push({ name: testName, tags });
		match = testPattern.exec(content);
	}

	// Pattern to match BDD descriptions
	const bddPattern =
		/test\.info\(\)\.annotations\.push\(\{\s*type:\s*['"]BDD['"]\s*,\s*description:\s*(['"`])([\s\S]*?)\1\s*,?\s*\}\);/g;
	let index = 0;

	match = bddPattern.exec(content);
	while (match !== null) {
		const description = match[2].trim().replace(/\\n/g, '\n').replace(/\t/g, '');

		// Check if BDD description contains template literal variables
		if (/\$\{[^}]+\}/.test(description)) {
			hasConfigurableValues = true;
		}

		bddScenarios.push({
			testName: testNames[index]?.name || 'Unknown',
			tags: testNames[index]?.tags || '',
			description,
		});
		index++;
		match = bddPattern.exec(content);
	}

	return {
		describeBlock,
		scenarios: bddScenarios,
		hasConfigurableValues,
	};
}

function formatFileNameAsTitle(fileName: string): string {
	return fileName
		.replace(/\.spec\.ts$/, '')
		.replace(/-/g, ' ')
		.split(' ')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		.join(' ');
}

function formatBDDDescription(description: string): string {
	return description
		.replace(/,\s*When\s+/gi, '\n\n**When** ')
		.replace(/,\s*Then\s+/gi, '\n\n**Then** ')
		.replace(/,\s*And\s+/gi, '\n\n**And** ')
		.replace(/^Given\s+/i, '**Given** ');
}

function writeBDDToMarkdown(scenariosByFile: Map<string, FileScenarios>, outputPath: string): void {
	let output = '# BDD Test Scenarios\n\n';
	output += `*Generated on: ${new Date().toLocaleDateString('en-GB')}*\n\n`;

	let totalScenarios = 0;

	for (const fileScenarios of scenariosByFile.values()) {
		totalScenarios += fileScenarios.scenarios.length;
	}

	output += `**Total Scenarios:** ${totalScenarios}\n\n`;
	output += `**Total Files:** ${scenariosByFile.size}\n\n`;
	output += '---\n\n';

	// Sort files alphabetically
	const sortedFiles = Array.from(scenariosByFile.keys()).sort();

	for (const filePath of sortedFiles) {
		const fileScenarios = scenariosByFile.get(filePath);
		if (!fileScenarios) continue;

		const { describeBlock, scenarios, hasConfigurableValues } = fileScenarios;
		const fileName = path.basename(filePath);
		const formattedTitle = formatFileNameAsTitle(fileName);

		output += `# ${formattedTitle}\n\n`;
		output += `**File:** \`${filePath}\`\n\n`;
		output += `**Scenarios:** ${scenarios.length}\n\n`;

		if (describeBlock) {
			output += `**Description:** ${describeBlock}\n\n`;
		}

		if (hasConfigurableValues) {
			output +=
				'> **Note:** This spec contains configurable values that can be set via environment variables or use default values.\n\n';
		}

		scenarios.forEach((scenario, index) => {
			output += `## ${index + 1}. ${scenario.testName}\n\n`;

			if (scenario.tags) {
				output += `**Tags:** ${scenario.tags}\n\n`;
			}

			output += `${formatBDDDescription(scenario.description)}\n\n`;
			output += '---\n\n';
		});

		output += '\n';
	}

	fs.writeFileSync(outputPath, output, 'utf-8');
	console.log(`✓ BDD scenarios extracted to ${outputPath}`);
	console.log(`✓ Total scenarios: ${totalScenarios}`);
	console.log(`✓ Total files processed: ${scenariosByFile.size}`);
}

function writeBDDToJSON(scenariosByFile: Map<string, FileScenarios>, outputPath: string): void {
	let totalScenarios = 0;
	const fileData: Record<string, FileScenarios> = {};

	scenariosByFile.forEach((fileScenarios, filePath) => {
		totalScenarios += fileScenarios.scenarios.length;
		fileData[filePath] = fileScenarios;
	});

	const output = {
		generatedAt: new Date().toISOString(),
		totalScenarios,
		totalFiles: scenariosByFile.size,
		files: fileData,
	};

	fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf-8');
	console.log(`✓ BDD scenarios extracted to ${outputPath}`);
	console.log(`✓ Total scenarios: ${totalScenarios}`);
	console.log(`✓ Total files processed: ${scenariosByFile.size}`);
}

function findSpecFiles(directory: string): string[] {
	const specFiles: string[] = [];

	function walkDir(dir: string): void {
		const files = fs.readdirSync(dir);

		for (const file of files) {
			const filePath = path.join(dir, file);
			const stat = fs.statSync(filePath);

			if (stat.isDirectory()) {
				walkDir(filePath);
			} else if (file.endsWith('.spec.ts')) {
				specFiles.push(filePath);
			}
		}
	}

	walkDir(directory);
	return specFiles;
}

function main(): void {
	const testsDirectory = path.join(process.cwd(), 'src', 'tests');
	const outputMarkdown = path.join(process.cwd(), 'docs', 'bdd-scenarios.md');
	const outputJSON = path.join(process.cwd(), 'docs', 'bdd-scenarios.json');

	try {
		if (!fs.existsSync(testsDirectory)) {
			console.error(`Error: Tests directory not found - ${testsDirectory}`);
			process.exit(1);
		}

		console.log(`Scanning for .spec.ts files in: ${testsDirectory}`);
		const specFiles = findSpecFiles(testsDirectory);

		if (specFiles.length === 0) {
			console.warn('Warning: No .spec.ts files found');
			return;
		}

		console.log(`Found ${specFiles.length} spec files\n`);

		const scenariosByFile = new Map<string, FileScenarios>();
		let totalScenarios = 0;

		for (const filePath of specFiles) {
			console.log(`Processing: ${path.basename(filePath)}`);

			const fileScenarios = extractBDDFromFile(filePath);

			if (fileScenarios.scenarios.length > 0) {
				const relativePath = path.relative(process.cwd(), filePath);
				scenariosByFile.set(relativePath, fileScenarios);
				totalScenarios += fileScenarios.scenarios.length;
				console.log(`  ✓ Found ${fileScenarios.scenarios.length} BDD scenario(s)`);
			} else {
				console.log('  ⚠ No BDD scenarios found');
			}
		}

		if (totalScenarios === 0) {
			console.warn('\nWarning: No BDD scenarios found in any files');
			return;
		}

		const outputDir = path.dirname(outputMarkdown);
		if (!fs.existsSync(outputDir)) {
			fs.mkdirSync(outputDir, { recursive: true });
		}

		console.log('\nGenerating output files...');
		writeBDDToMarkdown(scenariosByFile, outputMarkdown);

		// created incase we want to work with the data in an easier format
		// writeBDDToJSON(scenariosByFile, outputJSON);

		console.log('\n✓ Extraction complete!');
	} catch (error) {
		console.error('Error during extraction:', error);
		process.exit(1);
	}
}

// Run the script
main();
