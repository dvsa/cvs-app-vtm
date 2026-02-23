import AxeBuilder from '@axe-core/playwright';
import { Page, TestInfo } from '@playwright/test';
import { type AxeResults } from 'axe-core';
import { FooterComponent } from '../components/footer.component';
import { HeaderComponent } from '../components/header.component';
import { generateAccessibilityReport } from '../utils/accessibility-html-reporter';
import { generateAccessibilityMarkdownReport } from '../utils/accessibility-markdown-reporter';

export abstract class BasePage {
	readonly header: HeaderComponent;
	readonly footer: FooterComponent;

	constructor(public page: Page) {
		this.header = new HeaderComponent(page);
		this.footer = new FooterComponent(page);
	}

	async runAccessibilityScan(testInfo: TestInfo): Promise<AxeResults> {
		await this.page.waitForLoadState('domcontentloaded');

		// Perform accessibility scan
		const accessibilityScanResults = await new AxeBuilder({ page: this.page })
			.withTags(['wcag2a', 'wcag2aa', 'wcag22aa', 'wcag2aaa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
			.analyze();

		// Generate HTML and Markdown reports
		const [htmlReportPath, markdownReportPath] = await Promise.all([
			generateAccessibilityReport(accessibilityScanResults, this.page, testInfo.title),
			generateAccessibilityMarkdownReport(accessibilityScanResults, this.page, testInfo.title),
		]);

		// Attach reports to test
		const body = JSON.stringify(accessibilityScanResults, null, 2);
		await Promise.all([
			testInfo.attach('accessibility-scan-results', {
				body,
				contentType: 'application/json',
			}),
			testInfo.attach('accessibility-html-report', {
				path: htmlReportPath,
				contentType: 'text/html',
			}),
			testInfo.attach('accessibility-markdown-report', {
				path: markdownReportPath,
				contentType: 'text/markdown',
			}),
		]);

		return accessibilityScanResults;
	}
}
