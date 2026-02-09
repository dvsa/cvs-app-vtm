import * as fs from 'node:fs';
import * as path from 'node:path';
import { type Page } from '@playwright/test';
import type { AccessibilityResults } from 'models/accessibility';

interface AccessibilityViolation {
	id: string;
	impact: string | null;
	description: string;
	help: string;
	helpUrl: string;
	nodes: ViolationNode[];
}

interface ViolationNode {
	html: string;
	target: string[];
	failureSummary?: string;
	impact?: string;
}

export class AccessibilityHtmlReporter {
	private readonly results: AccessibilityResults;
	private readonly pageUrl: string;
	private readonly testName: string;

	constructor(results: AccessibilityResults, pageUrl: string, testName: string) {
		this.results = results;
		this.pageUrl = pageUrl;
		this.testName = testName;
	}

	/**
	 * Generate and save HTML report
	 * @param outputPath Path where the HTML report will be saved
	 * @returns Path to the generated report
	 */
	async generateReport(outputPath: string): Promise<string> {
		const html = this.generateHtml();

		// Ensure directory exists
		const dir = path.dirname(outputPath);
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir, { recursive: true });
		}

		fs.writeFileSync(outputPath, html);
		return outputPath;
	}

	private generateHtml(): string {
		const violationCount = this.results.violations.length;
		const impactCounts = this.getImpactCounts();
		const timestamp = new Date().toISOString();

		return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Accessibility Report - ${this.escapeHtml(this.testName)}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f5f5f5;
            padding: 20px;
        }

        .container {
            max-width: 1400px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            overflow: hidden;
        }

        header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
        }

        header h1 {
            font-size: 28px;
            margin-bottom: 10px;
        }

        header .meta {
            opacity: 0.9;
            font-size: 14px;
        }

        .summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            padding: 30px;
            background: #f8f9fa;
            border-bottom: 1px solid #e0e0e0;
        }

        .summary-card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            text-align: center;
        }

        .summary-card .number {
            font-size: 36px;
            font-weight: bold;
            margin-bottom: 5px;
        }

        .summary-card .label {
            color: #666;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .summary-card.total .number { color: ${violationCount > 0 ? '#e53e3e' : '#38a169'}; }
        .summary-card.critical .number { color: #c53030; }
        .summary-card.serious .number { color: #dd6b20; }
        .summary-card.moderate .number { color: #d69e2e; }
        .summary-card.minor .number { color: #3182ce; }

        .content {
            padding: 30px;
        }

        .no-violations {
            text-align: center;
            padding: 60px 20px;
            color: #38a169;
        }

        .no-violations .icon {
            font-size: 64px;
            margin-bottom: 20px;
        }

        .no-violations h2 {
            font-size: 24px;
            margin-bottom: 10px;
        }

        .violation {
            background: white;
            border: 1px solid #e0e0e0;
            border-left: 4px solid;
            border-radius: 4px;
            margin-bottom: 20px;
            overflow: hidden;
        }

        .violation.critical { border-left-color: #c53030; }
        .violation.serious { border-left-color: #dd6b20; }
        .violation.moderate { border-left-color: #d69e2e; }
        .violation.minor { border-left-color: #3182ce; }

        .violation-header {
            padding: 20px;
            cursor: pointer;
            user-select: none;
            background: #fafafa;
            border-bottom: 1px solid #e0e0e0;
            transition: background 0.2s;
        }

        .violation-header:hover {
            background: #f5f5f5;
        }

        .violation-header h3 {
            font-size: 18px;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .violation-header .toggle {
            margin-left: auto;
            font-size: 12px;
            color: #666;
        }

        .impact-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .impact-badge.critical { background: #fed7d7; color: #c53030; }
        .impact-badge.serious { background: #feebc8; color: #dd6b20; }
        .impact-badge.moderate { background: #fefcbf; color: #d69e2e; }
        .impact-badge.minor { background: #bee3f8; color: #3182ce; }

        .violation-body {
            padding: 20px;
            display: none;
        }

        .violation.expanded .violation-body {
            display: block;
        }

        .violation.expanded .toggle::before {
            content: '▼ ';
        }

        .violation:not(.expanded) .toggle::before {
            content: '▶ ';
        }

        .description {
            margin-bottom: 15px;
            color: #555;
        }

        .help-link {
            display: inline-block;
            margin-bottom: 20px;
            color: #667eea;
            text-decoration: none;
            font-weight: 500;
        }

        .help-link:hover {
            text-decoration: underline;
        }

        .affected-elements {
            margin-top: 20px;
        }

        .affected-elements h4 {
            margin-bottom: 15px;
            color: #333;
            font-size: 16px;
        }

        .element {
            background: #f8f9fa;
            border: 1px solid #e0e0e0;
            border-radius: 4px;
            padding: 15px;
            margin-bottom: 15px;
        }

        .element-target {
            font-family: 'Monaco', 'Courier New', monospace;
            font-size: 13px;
            color: #667eea;
            margin-bottom: 10px;
            word-break: break-all;
        }

        .element-html {
            background: #2d3748;
            color: #e2e8f0;
            padding: 12px;
            border-radius: 4px;
            font-family: 'Monaco', 'Courier New', monospace;
            font-size: 12px;
            overflow-x: auto;
            margin-bottom: 10px;
        }

        .failure-summary {
            color: #c53030;
            font-size: 14px;
            padding: 10px;
            background: #fff5f5;
            border-left: 3px solid #fc8181;
            margin-top: 10px;
        }

        footer {
            padding: 20px 30px;
            background: #f8f9fa;
            border-top: 1px solid #e0e0e0;
            text-align: center;
            color: #666;
            font-size: 14px;
        }

        @media (max-width: 768px) {
            .summary {
                grid-template-columns: 1fr;
            }

            body {
                padding: 10px;
            }

            .content {
                padding: 15px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>${this.escapeHtml(this.testName)}</h1>
            <div class="meta">
                <div><strong>URL:</strong> ${this.escapeHtml(this.pageUrl)}</div>
                <div><strong>Generated:</strong> ${timestamp}</div>
            </div>
        </header>

        <div class="summary">
            <div class="summary-card total">
                <div class="number">${violationCount}</div>
                <div class="label">Total Violations</div>
            </div>
            <div class="summary-card critical">
                <div class="number">${impactCounts.critical}</div>
                <div class="label">Critical</div>
            </div>
            <div class="summary-card serious">
                <div class="number">${impactCounts.serious}</div>
                <div class="label">Serious</div>
            </div>
            <div class="summary-card moderate">
                <div class="number">${impactCounts.moderate}</div>
                <div class="label">Moderate</div>
            </div>
            <div class="summary-card minor">
                <div class="number">${impactCounts.minor}</div>
                <div class="label">Minor</div>
            </div>
        </div>

        <div class="content">
            ${this.generateViolationsHtml()}
        </div>

        <footer>
            Generated by Axe-core via Playwright | <a href="https://www.deque.com/axe/" target="_blank">Learn more about axe</a>
        </footer>
    </div>

    <script>
        document.querySelectorAll('.violation-header').forEach(header => {
            header.addEventListener('click', () => {
                header.parentElement.classList.toggle('expanded');
            });
        });

        // Expand first violation by default
        const firstViolation = document.querySelector('.violation');
        if (firstViolation) {
            firstViolation.classList.add('expanded');
        }
    </script>
</body>
</html>`;
	}

	private generateViolationsHtml(): string {
		if (this.results.violations.length === 0) {
			return `
                <div class="no-violations">
                    <div class="icon">✓</div>
                    <h2>No Accessibility Violations Found!</h2>
                    <p>This page passed all accessibility checks for the specified WCAG standards.</p>
                </div>
            `;
		}

		// Sort violations by impact severity
		const sortedViolations = this.sortViolationsByImpact(this.results.violations);

		return sortedViolations
			.map((violation, index) => {
				const impact = violation.impact || 'minor';
				return `
            <div class="violation ${impact}">
                <div class="violation-header">
                    <h3>
                        <span class="impact-badge ${impact}">${impact}</span>
                        <span>${this.escapeHtml(violation.help)}</span>
                        <span class="toggle"></span>
                    </h3>
                </div>
                <div class="violation-body">
                    <div class="description">
                        ${this.escapeHtml(violation.description)}
                    </div>
                    <a href="${violation.helpUrl}" target="_blank" class="help-link">
                        📖 Learn more about this rule
                    </a>
                    <div class="affected-elements">
                        <h4>Affected Elements (${violation.nodes.length})</h4>
                        ${this.generateNodesHtml(violation.nodes)}
                    </div>
                </div>
            </div>
        `;
			})
			.join('');
	}

	private generateNodesHtml(nodes: ViolationNode[]): string {
		return nodes
			.map((node) => {
				return `
            <div class="element">
                <div class="element-target">
                    <strong>Target:</strong> ${this.escapeHtml(node.target.join(' '))}
                </div>
                <div class="element-html">${this.escapeHtml(node.html)}</div>
                ${
									node.failureSummary
										? `<div class="failure-summary">${this.escapeHtml(node.failureSummary)}</div>`
										: ''
								}
            </div>
        `;
			})
			.join('');
	}

	private getImpactCounts(): { critical: number; serious: number; moderate: number; minor: number } {
		const counts = { critical: 0, serious: 0, moderate: 0, minor: 0 };

		for (const violation of this.results.violations) {
			const impact = violation.impact || 'minor';
			if (impact in counts) {
				counts[impact as keyof typeof counts]++;
			}
		}

		return counts;
	}

	private sortViolationsByImpact(violations: AccessibilityViolation[] | unknown): AccessibilityViolation[] {
		if (!violations || !Array.isArray(violations)) {
			return [];
		}

		const impactOrder: { [key: string]: number } = {
			critical: 0,
			serious: 1,
			moderate: 2,
			minor: 3,
		};

		return violations.sort((a, b) => {
			const impactA = impactOrder[a.impact || 'minor'];
			const impactB = impactOrder[b.impact || 'minor'];
			return impactA - impactB;
		});
	}

	private escapeHtml(text: string): string {
		const map: { [key: string]: string } = {
			'&': '&amp;',
			'<': '&lt;',
			'>': '&gt;',
			'"': '&quot;',
			"'": '&#039;',
		};
		return text.replace(/[&<>"']/g, (m) => map[m]);
	}
}

/**
 * Helper function to generate and save accessibility HTML report
 */
export async function generateAccessibilityReport(
	results: AccessibilityResults,
	page: Page,
	testName: string,
	outputPath?: string
): Promise<string> {
	const url = page.url();
	const defaultPath = outputPath || `test-results/accessibility-reports/${testName}-${Date.now()}.html`;

	const reporter = new AccessibilityHtmlReporter(results, url, testName);
	return await reporter.generateReport(defaultPath);
}
