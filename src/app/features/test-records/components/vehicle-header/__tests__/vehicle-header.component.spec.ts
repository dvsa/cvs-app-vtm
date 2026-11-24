import { InterceptorModule } from '@/src/app/interceptors/interceptor.module';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { VehicleType as VehicleTypes } from '@dvsa/cvs-type-definitions/types/v1/enums/vehicleType.enum.js';
import { MediaSchema, TestResultTestTypeSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { mockTestResult } from '@mocks/mock-test-result';
import { RootRoutes } from '@models/routes.enum';
import { resultOfTestEnum } from '@models/test-types/test-type.model';
import { TEST_TYPES_GROUP1_SPEC_TEST, TEST_TYPES_GROUP5_SPEC_TEST } from '@models/testTypeId.enum';
import { V3TechRecordModel, VehicleConfigurations } from '@models/vehicle-tech-record.model';
import { provideMockStore } from '@ngrx/store/testing';
import { DocumentsService } from '@services/documents/documents.service';
import { TestResultMediaService } from '@services/documents/test-result-media.service';
import { HttpService } from '@services/http/http.service';
import { ResultOfTestService } from '@services/result-of-test/result-of-test.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { TestService } from '@services/test/test.service';
import { initialAppState } from '@store/index';
import JSZip from 'jszip';
import { lastValueFrom, of } from 'rxjs';
import { VehicleHeaderComponent } from '../vehicle-header.component';

const mockTechnicalRecordService = {
	get techRecord$() {
		return of({ systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVin' });
	},
};

describe('VehicleHeaderComponent', () => {
	let component: VehicleHeaderComponent;
	let fixture: ComponentFixture<VehicleHeaderComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [VehicleHeaderComponent, InterceptorModule],
			providers: [
				HttpService,
				provideRouter([]),
				provideHttpClient(withInterceptorsFromDi()),
				provideHttpClientTesting(),
				provideMockStore({ initialState: initialAppState }),
				ResultOfTestService,
				{ provide: TechnicalRecordService, useValue: mockTechnicalRecordService },
			],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(VehicleHeaderComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('Photo of Certificate', () => {
		const ivaTypeId = TEST_TYPES_GROUP1_SPEC_TEST[0];
		const qt1TypeId = '136';
		const voluntaryIvaTypeId = TEST_TYPES_GROUP5_SPEC_TEST[0];
		const photo: MediaSchema = { type: 'image', path: 'TestResultId0001/iac/certificate.jpg' };

		afterEach(() => TestBed.inject(HttpTestingController).verify());

		function showTest(testTypeId: string, media?: MediaSchema[], testStartTimestamp = new Date().toISOString()) {
			const test = { ...mockTestResult(), approvalCertificate: media, testStartTimestamp };
			test.testTypes[0].testTypeId = testTypeId;
			fixture.componentRef.setInput('testResult', test);
			fixture.detectChanges();
			return test;
		}

		function photoCell(): HTMLElement | null {
			return fixture.nativeElement.querySelector('#test-certificate-photo');
		}

		it.each([ivaTypeId, qt1TypeId, voluntaryIvaTypeId])(
			'offers a photo download under Certificate for test type %s',
			(typeId) => {
				showTest(typeId, [photo]);
				const row = photoCell()?.parentElement;
				expect(row?.previousElementSibling?.querySelector('#test-certificate')).toBeTruthy();
				expect(row?.querySelector('dt')?.textContent?.trim()).toBe('Photo of certificate:');
				expect(photoCell()?.querySelector('a')?.textContent?.trim()).toBe('Download photo of certificate');
			}
		);

		it.each([
			[ivaTypeId, 'iac'],
			[qt1TypeId, 'mac'],
		] as const)(
			'preserves the certificate photo download after editing test %s with the signal form',
			(typeId, category) => {
				const service = TestBed.inject(TestService);
				const test = showTest(typeId, [{ ...photo, path: `TestResultId0001/${category}/certificate.jpg` }]);
				service.patch({
					...test,
					testTypes: [{ ...test.testTypes[0], testTypeStartTimestamp: test.testStartTimestamp }],
				});
				service.form.reasonForCreation().value.set('Amended test details');
				const saved = service.value();
				fixture.componentRef.setInput('testResult', saved);
				fixture.detectChanges();

				expect(saved.approvalCertificate).toEqual(test.approvalCertificate);
				const download = vi.spyOn(TestBed.inject(TestResultMediaService), 'download').mockReturnValue(of(undefined));
				const link = photoCell()?.querySelector('a');
				expect(link?.textContent?.trim()).toBe('Download photo of certificate');
				link?.click();
				expect(download).toHaveBeenCalledExactlyOnceWith(test.testResultId, category);
			}
		);

		it.each([
			['IVA', 'iac', ivaTypeId],
			['Part MSVA inspection (QT1)', 'mac', qt1TypeId],
			['voluntary IVA', 'iac', voluntaryIvaTypeId],
		])('%s downloads only %s images and reuses the full archive', async (_, category, typeId) => {
			const test = showTest(typeId, [{ ...photo, path: `TestResultId0001/${category}/certificate.jpg` }]);
			const categoryPath = `${test.testResultId}/${category}`;
			const source = new JSZip()
				.file(`${categoryPath}/certificate.jpg`, 'first image')
				.file(`${categoryPath}/extra.PNG`, 'second image')
				.file(`${categoryPath}/reason.txt`, 'not an image')
				.file(`${test.testResultId}/${category === 'iac' ? 'mac' : 'iac'}/other.jpg`, 'other certificate photo')
				.file(`${test.testResultId}/approvals/vehicle.jpg`, 'vehicle photo')
				.file(`${test.testResultId}/vtg15/vtg15.jpg`, 'VTG15 photo');
			const data = await source.generateAsync({ type: 'arraybuffer' });
			const documents = TestBed.inject(DocumentsService);
			vi.spyOn(documents, 'simulateClick').mockImplementation(() => {});
			const createLink = vi.spyOn(documents, 'createFileLink').mockImplementation(() => document.createElement('a'));
			const http = TestBed.inject(HttpTestingController);
			const mediaService = TestBed.inject(TestResultMediaService);

			photoCell()?.querySelector('a')?.click();
			const vtg15Download = lastValueFrom(mediaService.download(test.testResultId, 'vtg15'));
			http
				.expectOne(({ url, params }) => url.endsWith(`/${test.testResultId}`) && params.get('category') === category)
				.flush('https://example.test/test-media.zip');
			const request = await vi.waitFor(() => http.expectOne('https://example.test/test-media.zip'));
			request.flush(data);

			await vtg15Download;
			await lastValueFrom(mediaService.download(test.testResultId, 'approvals'));
			await vi.waitFor(() => expect(createLink).toHaveBeenCalledTimes(3));

			const expectedFiles = {
				[category]: [`${categoryPath}/certificate.jpg`, `${categoryPath}/extra.PNG`],
				vtg15: [`${test.testResultId}/vtg15/vtg15.jpg`],
				approvals: [`${test.testResultId}/approvals/vehicle.jpg`],
			};
			for (const [mediaCategory, names] of Object.entries(expectedFiles)) {
				const call = createLink.mock.calls.find(([fileName]) => fileName === `${test.testResultId}-${mediaCategory}`);
				expect(call).toBeDefined();
				const zip = await JSZip.loadAsync(call![1]);
				expect(
					zip
						.file(/./)
						.map(({ name }) => name)
						.sort()
				).toEqual(names);
				if (mediaCategory === category) {
					expect(await zip.file(`${categoryPath}/certificate.jpg`)?.async('string')).toBe('first image');
				}
			}
		});

		it('does not show the row for tests outside specialist groups 1 and 5', () => {
			showTest('94', [photo]);
			expect(photoCell()).toBeNull();
		});

		it.each([
			[undefined, 'No photo of certificate available'],
			['Camera not working', 'No photo of certificate available – camera was not working'],
			['The assessor’s hands were full.', 'No photo of certificate available – The assessor’s hands were full.'],
			['Failed to upload', 'No photo of certificate available – media failed to upload'],
		])('shows why a photo is unavailable (%s) without offering a download', (reason, expected) => {
			showTest(
				ivaTypeId,
				reason ? [{ type: 'failReason', path: 'TestResultId0001/iac/reason.txt', reason }] : undefined
			);
			expect(photoCell()?.textContent?.trim()).toBe(expected);
			expect(photoCell()?.querySelector('a')).toBeNull();
		});

		it('stops offering a download exactly ten years after the test started', () => {
			const now = new Date(2026, 10, 18, 12);
			const start = new Date(2016, 10, 18, 12);
			vi.useFakeTimers();
			try {
				vi.setSystemTime(new Date(now.getTime() - 1));
				showTest(ivaTypeId, [photo], start.toISOString());
				expect(photoCell()?.querySelector('a')).not.toBeNull();

				vi.setSystemTime(now);
				showTest(ivaTypeId, [photo], start.toISOString());
				expect(photoCell()?.querySelector('a')).toBeNull();
				expect(photoCell()?.textContent?.trim().replace(/\s+/g, ' ')).toBe(
					'No photo available - photo was deleted as the retention period had passed'
				);
			} finally {
				vi.useRealTimers();
			}
		});

		it.each(['vtg15', 'iac'] as const)('shows a global error instead of downloading on a %s 404', async (category) => {
			const test = showTest(ivaTypeId, [photo]);
			const download = vi.spyOn(TestBed.inject(DocumentsService), 'simulateClick');
			const setErrors = vi.spyOn(TestBed.inject(GlobalErrorService), 'setErrors');
			const http = TestBed.inject(HttpTestingController);
			if (category === 'iac') {
				photoCell()?.querySelector('a')?.click();
			} else {
				component.downloadCertificateMedia(test, category);
			}
			let request = http.expectOne(({ params }) => params.get('category') === category);
			if (category === 'iac') {
				request.flush('https://example.test/test-media.zip');
				request = await vi.waitFor(() => http.expectOne('https://example.test/test-media.zip'));
			}
			request.flush(null, { status: 404, statusText: 'Not Found' });

			await vi.waitFor(() =>
				expect(setErrors).toHaveBeenCalledWith([
					{
						error:
							'Media could not be found <br>Try again later or contact the IT Service Desk if this issue keeps happening.',
						anchorLink: '',
					},
				])
			);
			expect(download).not.toHaveBeenCalled();
		});

		it('redirects only once on an IAC 500 and does not download the archive', async () => {
			showTest(ivaTypeId, [photo]);
			const router = TestBed.inject(Router);
			const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);
			const navigateByUrl = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
			const download = vi.spyOn(TestBed.inject(DocumentsService), 'simulateClick');
			photoCell()?.querySelector('a')?.click();

			TestBed.inject(HttpTestingController)
				.expectOne(({ params }) => params.get('category') === 'iac')
				.flush(null, { status: 500, statusText: 'Internal Server Error' });

			await vi.waitFor(() => expect(navigate).toHaveBeenCalledExactlyOnceWith([RootRoutes.ERROR]));
			expect(navigateByUrl).not.toHaveBeenCalled();
			expect(download).not.toHaveBeenCalled();
		});
	});

	it('should combine the odometer reading', () => {
		expect(component.combinedOdometerReading('1234', 'kilometres')).toBe('1234 km');
	});

	it('should display the unit if the reading is undefined', () => {
		expect(component.combinedOdometerReading(undefined, 'kilometres')).toBe(' km');
	});

	it('should display the reading if the unit is undefined', () => {
		expect(component.combinedOdometerReading('1234', undefined)).toBe('1234 ');
	});

	it('should display the correct data based on vehicle type', () => {
		const mockRecord = {
			techRecord_vehicleConfiguration: VehicleConfigurations.RIGID,
			techRecord_bodyMake: 'testBody',
			techRecord_bodyModel: 'testBodyModel',
			techRecord_chassisMake: 'testChassis',
			techRecord_chassisModel: 'testChassisModel',
			techRecord_make: 'testHGV',
			techRecord_model: 'testHGVModel',
		} as unknown as V3TechRecordModel;

		expect(component.getVehicleDescription(mockRecord, VehicleTypes.TRL)).toBe('rigid');
		expect(component.getVehicleDescription(mockRecord, VehicleTypes.PSV)).toBe('testBody-testBodyModel');
		expect(component.getVehicleDescription(mockRecord, VehicleTypes.HGV)).toBe('testHGV-testHGVModel');
	});

	it('should display an empty string if all required data cannot be retrieved', () => {
		const mockRecord = {
			techRecord_bodyMake: '',
			techRecord_bodyModel: 'testBodyModel',
			techRecord_chassisMake: '',
			techRecord_chassisModel: 'testChassisModel',
			techRecord_make: '',
			techRecord_model: 'testHGVModel',
		} as unknown as V3TechRecordModel;

		expect(component.getVehicleDescription(mockRecord, VehicleTypes.TRL)).toBeFalsy();
		expect(component.getVehicleDescription(mockRecord, VehicleTypes.PSV)).toBeFalsy();
		expect(component.getVehicleDescription(mockRecord, VehicleTypes.HGV)).toBeFalsy();
	});

	it('should display "Unknown Vehicle Type" if vehicle type is unknown/undefined', () => {
		const mockRecord = {
			techRecord_bodyMake: 'testBodyMake',
			techRecord_bodyModel: 'testBodyModel',
			techRecord_chassisMake: 'testChassisMake',
			techRecord_chassisModel: 'testChassisModel',
		} as unknown as V3TechRecordModel;
		expect(component.getVehicleDescription(mockRecord, undefined)).toBe('Unknown Vehicle Type');
	});

	describe('isADRTest', () => {
		it('should return true if the selected test type is an ADR test', () => {
			vi.spyOn(component, 'test', 'get').mockReturnValue({ testTypeId: '50' } as TestResultTestTypeSchema);
			expect(component.isADRTest).toBe(true);
		});

		it('should return false if the selected test type is not an ADR test', () => {
			vi.spyOn(component, 'test', 'get').mockReturnValue({ testTypeId: '94' } as TestResultTestTypeSchema);
			expect(component.isADRTest).toBe(false);
		});
	});

	describe('shouldShowAbandonCert', () => {
		it('should return true if the VTG/VTP12 document should show', () => {
			vi.spyOn(component, 'resultOfTest', 'get').mockReturnValue(resultOfTestEnum.abandoned);
			vi.spyOn(component, 'test', 'get').mockReturnValue({ testTypeId: '3' } as TestResultTestTypeSchema);
			vi.spyOn(component, 'vehicleTypes', 'get').mockReturnValue('psv' as unknown as typeof VehicleTypes);
			expect(component.shouldShowAbandonCert).toBe(true);
		});

		it('should return false if the VTG/VTP12 document should show', () => {
			vi.spyOn(component, 'resultOfTest', 'get').mockReturnValue(resultOfTestEnum.abandoned);
			vi.spyOn(component, 'test', 'get').mockReturnValue({ testTypeId: '193' } as TestResultTestTypeSchema);
			vi.spyOn(component, 'vehicleTypes', 'get').mockReturnValue('psv' as unknown as typeof VehicleTypes);
			expect(component.shouldShowAbandonCert).toBe(false);
		});
	});

	describe('getCertificateLinkText', () => {
		it('should return null if test is undefined', () => {
			expect(component.getCertificateLinkText(undefined)).toBe(null);
		});

		it('should return testNumber for roadworthiness tests', () => {
			expect(
				component.getCertificateLinkText({ testTypeId: '62', testNumber: '12345' } as TestResultTestTypeSchema)
			).toBe('12345');
		});

		it('should return certificateNumber for other tests', () => {
			expect(component.getCertificateLinkText({ certificateNumber: '12345' } as TestResultTestTypeSchema)).toBe(
				'12345'
			);
		});
	});

	describe('hasVTG15Media', () => {
		it('should return false when testResult is null', () => {
			fixture.componentRef.setInput('testResult', null);
			expect(component.hasVTG15Media()).toBe(false);
		});

		it('should return false when testResult is undefined', () => {
			fixture.componentRef.setInput('testResult', undefined);
			expect(component.hasVTG15Media()).toBe(false);
		});

		it('should return false when vtg15 is undefined', () => {
			fixture.componentRef.setInput('testResult', { vtg15: undefined } as any);
			expect(component.hasVTG15Media()).toBe(false);
		});

		it('should return false when media is undefined', () => {
			fixture.componentRef.setInput('testResult', { vtg15: { media: undefined } } as any);
			expect(component.hasVTG15Media()).toBe(false);
		});

		it('should return false when media is an empty array', () => {
			fixture.componentRef.setInput('testResult', { vtg15: { media: [] } } as any);
			expect(component.hasVTG15Media()).toBe(false);
		});

		it('should return false when media only contains failReason items', () => {
			fixture.componentRef.setInput('testResult', {
				vtg15: {
					media: [{ type: 'failReason', location: 'test' }],
				},
			} as any);
			expect(component.hasVTG15Media()).toBe(false);
		});

		it('should return true when media contains valid non-failReason items', () => {
			fixture.componentRef.setInput('testResult', {
				vtg15: {
					media: [{ type: 'image', location: 'test' }],
				},
			} as any);
			expect(component.hasVTG15Media()).toBe(true);
		});
	});

	describe('hasVTG15RetentionPeriodPassed', () => {
		it('should return false when testResult is null', () => {
			fixture.componentRef.setInput('testResult', null);
			expect(component.hasVTG15RetentionPeriodPassed()).toBe(false);
		});

		it('should return false when testResult is undefined', () => {
			fixture.componentRef.setInput('testResult', undefined);
			expect(component.hasVTG15RetentionPeriodPassed()).toBe(false);
		});

		it('should return false when testTypes is undefined', () => {
			fixture.componentRef.setInput('testResult', { testTypes: undefined } as any);
			expect(component.hasVTG15RetentionPeriodPassed()).toBe(false);
		});

		it('should return false when testTypes is empty array', () => {
			fixture.componentRef.setInput('testResult', { testTypes: [] } as any);
			expect(component.hasVTG15RetentionPeriodPassed()).toBe(false);
		});

		it('should return false when testTypeEndTimestamp is invalid', () => {
			fixture.componentRef.setInput('testResult', {
				testTypes: [{ testTypeEndTimestamp: 'invalid-date' }],
			} as any);
			expect(component.hasVTG15RetentionPeriodPassed()).toBe(false);
		});

		it('should return false when testTypeEndTimestamp is empty string', () => {
			fixture.componentRef.setInput('testResult', {
				testTypes: [{ testTypeEndTimestamp: '' }],
			} as any);
			expect(component.hasVTG15RetentionPeriodPassed()).toBe(false);
		});

		it('should return false when retention period has not passed (5 days)', () => {
			const recentDate = new Date();
			recentDate.setDate(recentDate.getDate() - 5); // 5 days ago
			fixture.componentRef.setInput('testResult', {
				testTypes: [{ testTypeEndTimestamp: recentDate.toISOString() }],
			} as any);
			expect(component.hasVTG15RetentionPeriodPassed()).toBe(false);
		});

		it('should return true when retention period has exactly passed (21 days)', () => {
			const pastDate = new Date();
			pastDate.setDate(pastDate.getDate() - 21); // 21 days ago
			fixture.componentRef.setInput('testResult', {
				testTypes: [{ testTypeEndTimestamp: pastDate.toISOString() }],
			} as any);
			expect(component.hasVTG15RetentionPeriodPassed()).toBe(true);
		});

		it('should return true when retention period has long passed (60 days)', () => {
			const oldDate = new Date();
			oldDate.setDate(oldDate.getDate() - 60); // 60 days ago
			fixture.componentRef.setInput('testResult', {
				testTypes: [{ testTypeEndTimestamp: oldDate.toISOString() }],
			} as any);
			expect(component.hasVTG15RetentionPeriodPassed()).toBe(true);
		});

		it('should return false for date exactly 21 days in future', () => {
			const futureDate = new Date();
			futureDate.setDate(futureDate.getDate() + 21); // 21 days in future
			fixture.componentRef.setInput('testResult', {
				testTypes: [{ testTypeEndTimestamp: futureDate.toISOString() }],
			} as any);
			expect(component.hasVTG15RetentionPeriodPassed()).toBe(false);
		});

		it('should use first testType when multiple testTypes exist', () => {
			const pastDate = new Date();
			pastDate.setDate(pastDate.getDate() - 25); // 25 days ago, past 21-day threshold
			const recentDate = new Date();
			recentDate.setDate(recentDate.getDate() - 5); // 5 days ago, within 21-day threshold
			fixture.componentRef.setInput('testResult', {
				testTypes: [
					{ testTypeEndTimestamp: pastDate.toISOString() },
					{ testTypeEndTimestamp: recentDate.toISOString() },
				],
			} as any);
			expect(component.hasVTG15RetentionPeriodPassed()).toBe(true);
		});

		it('should return false for undefined testTypeEndTimestamp', () => {
			fixture.componentRef.setInput('testResult', {
				testTypes: [{ testTypeEndTimestamp: undefined }],
			} as any);
			expect(component.hasVTG15RetentionPeriodPassed()).toBe(false);
		});

		it('should return false for dates less than 21 days old', () => {
			const testDate = new Date();
			testDate.setDate(testDate.getDate() - 20); // 20 days ago
			fixture.componentRef.setInput('testResult', {
				testTypes: [{ testTypeEndTimestamp: testDate.toISOString() }],
			} as any);
			expect(component.hasVTG15RetentionPeriodPassed()).toBe(false);
		});

		it('should return true for dates more than 21 days old', () => {
			const testDate = new Date();
			testDate.setDate(testDate.getDate() - 22); // 22 days ago
			fixture.componentRef.setInput('testResult', {
				testTypes: [{ testTypeEndTimestamp: testDate.toISOString() }],
			} as any);
			expect(component.hasVTG15RetentionPeriodPassed()).toBe(true);
		});
	});
});
