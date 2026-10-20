import { TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { HighlightPipe } from '../highlight.pipe';

describe('HighlightPipe', () => {
	let pipe: HighlightPipe;
	let sanitizer: DomSanitizer;

	beforeEach(() => {
		TestBed.configureTestingModule({ providers: [HighlightPipe] });
		pipe = TestBed.inject(HighlightPipe);
		sanitizer = TestBed.inject(DomSanitizer);
	});

	const html = (value: ReturnType<HighlightPipe['transform']>) =>
		sanitizer.sanitize(1 /* SecurityContext.HTML */, value) ?? '';

	it('should create', () => {
		expect(pipe).toBeTruthy();
	});

	it('should return the text unchanged when there is no term', () => {
		expect(html(pipe.transform('showing evidence of a recut', ''))).toBe('showing evidence of a recut');
	});

	it('should wrap the matched term in a mark, case-insensitively', () => {
		const result = html(pipe.transform('Showing evidence of a Recut', 'recut'));
		expect(result).toContain('<mark class="defect-tree__highlight">Recut</mark>');
	});

	it('should highlight every occurrence', () => {
		const result = html(pipe.transform('recut recut', 'recut'));
		expect((result.match(/<mark/g) ?? []).length).toBe(2);
	});

	it('should escape HTML in the source text', () => {
		const result = html(pipe.transform('<script>alert(1)</script>', 'alert'));
		expect(result).not.toContain('<script>');
		expect(result).toContain('&lt;script&gt;');
	});

	it('should highlight a term containing an ampersand without stranding the entity', () => {
		const result = html(pipe.transform('Seat Belts & Supplementary Restraint Systems', 'Belts &'));
		expect(result).toContain('<mark class="defect-tree__highlight">Belts &amp;</mark>');
		expect(result).not.toContain('amp;</mark>amp;');
		expect(result).not.toMatch(/<\/mark>amp;/);
	});

	it('should treat the term as a literal, not a regex', () => {
		const result = html(pipe.transform('a.b.c', '.'));
		expect((result.match(/<mark/g) ?? []).length).toBe(2);
	});

	it('should handle null / undefined values', () => {
		expect(html(pipe.transform(null, 'x'))).toBe('');
		expect(html(pipe.transform(undefined, 'x'))).toBe('');
	});
});
