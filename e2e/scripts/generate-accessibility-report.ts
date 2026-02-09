import * as fs from 'node:fs';
import * as path from 'node:path';

interface AccessibilityViolation {
	id: string;
	impact: string | null;
	description: string;
	help: string;
	helpUrl: string;
	nodes: Array<{
		html: string;
		target: string[];
		failureSummary?: string;
		impact?: string;
	}>;
}

interface AccessibilityReport {
	testName: string;
	url: string;
	timestamp: string;
	violations: AccessibilityViolation[];
	passes?: unknown[];
	incomplete?: unknown[];
	inapplicable?: unknown[];
}

interface ParsedReport {
	testName: string;
	filePath: string;
	report: AccessibilityReport;
}

function parseMarkdownReport(filePath: string): ParsedReport | null {
	try {
		const content = fs.readFileSync(filePath, 'utf-8');

		// Extract test name from first heading
		const testNameMatch = content.match(/^#\s+(.+)$/m);
		const testName = testNameMatch ? testNameMatch[1] : 'Unknown Test';

		// Extract URL
		const urlMatch = content.match(/\*\*URL:\*\*\s+(.+)$/m);
		const url = urlMatch ? urlMatch[1] : '';

		// Extract timestamp
		const timestampMatch = content.match(/\*\*Generated:\*\*\s+(.+)$/m);
		const timestamp = timestampMatch ? timestampMatch[1] : '';

		// Check if there are violations by looking at the summary table
		const violations: AccessibilityViolation[] = [];

		// More flexible pattern that handles various spacing
		const violationPattern = /###\s+\d+\.\s+[🔴🟠🟡🔵]\s+(.+?)$/gmu;
		const matches = Array.from(content.matchAll(violationPattern));

		for (const match of matches) {
			const help = match[1].trim();

			// Extract the violation section
			const violationStart = match.index ?? 0;
			const nextMatch = content.slice(violationStart + 1).match(/###\s+\d+\./);
			const violationEnd = nextMatch
				? violationStart + 1 + (nextMatch.index ?? 0)
				: content.indexOf('---', violationStart + 1);
			const violationContent = content.slice(
				violationStart,
				violationEnd > violationStart ? violationEnd : content.length
			);

			// Extract severity
			const severityMatch = violationContent.match(/\*\*Severity:\*\*\s+(\w+)/i);
			const impact = severityMatch ? severityMatch[1].toLowerCase() : 'minor';

			// Extract rule ID
			const ruleIdMatch = violationContent.match(/\*\*Rule ID:\*\*\s+`(.+?)`/);
			const ruleId = ruleIdMatch ? ruleIdMatch[1] : '';

			// Extract description
			const descMatch = violationContent.match(/\*\*Description:\*\*\s+(.+?)(?=\n\n|\*\*)/);
			const description = descMatch ? descMatch[1].trim() : '';

			// Extract help URL
			const helpUrlMatch = violationContent.match(/\*\*WCAG Reference:\*\*\s+\[.+?\]\((.+?)\)/);
			const helpUrl = helpUrlMatch ? helpUrlMatch[1] : '';

			// Parse affected elements
			const nodes: Array<{ html: string; target: string[]; failureSummary?: string }> = [];
			const detailsPattern = /<details>\s*<summary>Element \d+: <code>(.+?)<\/code><\/summary>([\s\S]*?)<\/details>/g;
			const detailsMatches = Array.from(violationContent.matchAll(detailsPattern));

			for (const detailsMatch of detailsMatches) {
				const target = detailsMatch[1].replace(/\\/g, ''); // Remove escape characters
				const elementContent = detailsMatch[2];

				// Extract HTML
				const htmlMatch = elementContent.match(/```html\s*([\s\S]*?)\s*```/);
				const html = htmlMatch ? htmlMatch[1].trim() : '';

				// Extract failure summary
				const failureMatch = elementContent.match(/\*\*Issue:\*\*\s*([\s\S]*?)(?=<\/details>|$)/);
				const failureSummary = failureMatch ? failureMatch[1].trim() : undefined;

				nodes.push({
					html,
					target: [target],
					failureSummary,
				});
			}

			violations.push({
				id: ruleId,
				impact,
				description,
				help,
				helpUrl,
				nodes,
			});
		}

		return {
			testName,
			filePath,
			report: {
				testName,
				url,
				timestamp,
				violations,
			},
		};
	} catch (error) {
		console.error(`Error parsing ${filePath}:`, error);
		return null;
	}
}

function getImpactCounts(violations: AccessibilityViolation[]): {
	critical: number;
	serious: number;
	moderate: number;
	minor: number;
} {
	const counts = { critical: 0, serious: 0, moderate: 0, minor: 0 };

	for (const violation of violations) {
		const impact = violation.impact || 'minor';
		if (impact in counts) {
			counts[impact as keyof typeof counts]++;
		}
	}

	return counts;
}

function getImpactEmoji(impact: string): string {
	const emojiMap: { [key: string]: string } = {
		critical: '🔴',
		serious: '🟠',
		moderate: '🟡',
		minor: '🔵',
	};
	return emojiMap[impact] || '⚪';
}

function sortViolationsByImpact(violations: AccessibilityViolation[]): AccessibilityViolation[] {
	const impactOrder: { [key: string]: number } = {
		critical: 0,
		serious: 1,
		moderate: 2,
		minor: 3,
	};

	return [...violations].sort((a, b) => {
		const impactA = impactOrder[a.impact || 'minor'];
		const impactB = impactOrder[b.impact || 'minor'];
		return impactA - impactB;
	});
}

function writeMergedReport(reports: ParsedReport[], outputPath: string): void {
	let output = '# Accessibility Test Report\n\n';
	output += `*Generated on: ${new Date().toLocaleDateString('en-GB')} at ${new Date().toLocaleTimeString('en-GB')}*\n\n`;

	// Calculate overall statistics
	let totalViolations = 0;
	const overallCounts = { critical: 0, serious: 0, moderate: 0, minor: 0 };

	for (const { report } of reports) {
		totalViolations += report.violations.length;
		const counts = getImpactCounts(report.violations);
		overallCounts.critical += counts.critical;
		overallCounts.serious += counts.serious;
		overallCounts.moderate += counts.moderate;
		overallCounts.minor += counts.minor;
	}

	// Overall summary
	output += '## Overall Summary\n\n';
	output += `**Total Tests:** ${reports.length}\n\n`;
	output += `**Total Violations:** ${totalViolations}\n\n`;

	if (totalViolations > 0) {
		output += '| Severity | Count |\n';
		output += '|----------|-------|\n';
		output += `| 🔴 Critical | ${overallCounts.critical} |\n`;
		output += `| 🟠 Serious | ${overallCounts.serious} |\n`;
		output += `| 🟡 Moderate | ${overallCounts.moderate} |\n`;
		output += `| 🔵 Minor | ${overallCounts.minor} |\n`;
		output += `| **Total** | **${totalViolations}** |\n\n`;
	}

	output += '---\n\n';

	// Individual test reports
	output += '## Test Results\n\n';

	for (const { report } of reports) {
		output += `### ${report.testName}\n\n`;
		output += `**URL:** ${report.url}\n\n`;
		output += `**Tested:** ${report.timestamp}\n\n`;

		if (report.violations.length === 0) {
			output += '✅ **No accessibility violations found!**\n\n';
			output += 'This page passed all accessibility checks for the specified WCAG standards.\n\n';
		} else {
			output += `**Violations Found:** ${report.violations.length}\n\n`;

			const counts = getImpactCounts(report.violations);

			output += '| Severity | Count |\n';
			output += '|----------|-------|\n';
			output += `| 🔴 Critical | ${counts.critical} |\n`;
			output += `| 🟠 Serious | ${counts.serious} |\n`;
			output += `| 🟡 Moderate | ${counts.moderate} |\n`;
			output += `| 🔵 Minor | ${counts.minor} |\n\n`;

			// List violations
			const sortedViolations = sortViolationsByImpact(report.violations);

			for (let i = 0; i < sortedViolations.length; i++) {
				const violation = sortedViolations[i];
				const impact = violation.impact || 'minor';
				const emoji = getImpactEmoji(impact);

				output += `#### ${i + 1}. ${emoji} ${violation.help}\n\n`;
				output += `**Severity:** ${impact.toUpperCase()}\n\n`;
				output += `**Rule ID:** \`${violation.id}\`\n\n`;
				output += `**Description:** ${violation.description}\n\n`;
				output += `**WCAG Reference:** [Learn more](${violation.helpUrl})\n\n`;
				output += `**Affected Elements:** ${violation.nodes.length}\n\n`;

				// Show element details
				if (violation.nodes.length > 0) {
					output += '<details>\n';
					output += '<summary><strong>Show Affected Elements</strong></summary>\n\n';

					for (let j = 0; j < violation.nodes.length; j++) {
						const node = violation.nodes[j];
						output += `**Element ${j + 1}:** \`${node.target.join(' > ')}\`\n\n`;

						if (node.html) {
							output += '```html\n';
							output += `${node.html}\n`;
							output += '```\n\n';
						}

						if (node.failureSummary) {
							output += `**Issue:**\n\n${node.failureSummary}\n\n`;
						}

						if (j < violation.nodes.length - 1) {
							output += '---\n\n';
						}
					}

					output += '</details>\n\n';
				}

				output += '---\n\n';
			}
		}

		output += '---\n\n';
	}

	output += '*Generated by [Axe-core](https://www.deque.com/axe/) via Playwright*\n';

	// Ensure output directory exists
	const outputDir = path.dirname(outputPath);
	if (!fs.existsSync(outputDir)) {
		fs.mkdirSync(outputDir, { recursive: true });
	}

	fs.writeFileSync(outputPath, output, 'utf-8');
	console.log(`✓ Accessibility report generated at ${outputPath}`);
	console.log(`✓ Total tests: ${reports.length}`);
	console.log(`✓ Total violations: ${totalViolations}`);
}

function findMarkdownReports(directory: string): string[] {
	const reportFiles: string[] = [];

	if (!fs.existsSync(directory)) {
		return reportFiles;
	}

	function walkDir(dir: string): void {
		const files = fs.readdirSync(dir);

		for (const file of files) {
			const filePath = path.join(dir, file);
			const stat = fs.statSync(filePath);

			if (stat.isDirectory()) {
				walkDir(filePath);
			} else if (file.endsWith('.md') && !file.includes('merged')) {
				reportFiles.push(filePath);
			}
		}
	}

	walkDir(directory);
	return reportFiles;
}

function main(): void {
	const reportsDirectory = path.join(process.cwd(), 'test-results', 'accessibility-reports');
	const outputPath = path.join(process.cwd(), 'docs', 'accessibility-report.md');

	try {
		console.log(`Scanning for accessibility reports in: ${reportsDirectory}`);

		if (!fs.existsSync(reportsDirectory)) {
			console.warn('Warning: Accessibility reports directory not found. No reports to merge.');
			console.log(`Expected directory: ${reportsDirectory}`);
			return;
		}

		const reportFiles = findMarkdownReports(reportsDirectory);

		if (reportFiles.length === 0) {
			console.warn('Warning: No accessibility markdown reports found');
			return;
		}

		console.log(`Found ${reportFiles.length} report(s)\n`);

		const parsedReports: ParsedReport[] = [];

		for (const filePath of reportFiles) {
			console.log(`Processing: ${path.basename(filePath)}`);
			const parsed = parseMarkdownReport(filePath);

			if (parsed) {
				parsedReports.push(parsed);
				console.log(`  ✓ Parsed successfully - ${parsed.report.violations.length} violation(s)`);
			} else {
				console.log('  ⚠ Failed to parse');
			}
		}

		if (parsedReports.length === 0) {
			console.warn('\nWarning: No valid reports could be parsed');
			return;
		}

		console.log('\nGenerating merged report...');
		writeMergedReport(parsedReports, outputPath);

		console.log('\n✓ Report generation complete!');
	} catch (error) {
		console.error('Error during report generation:', error);
		process.exit(1);
	}
}

main();
