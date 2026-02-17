import { ChangeDetectorRef, inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '@environments/environment';
import { lastValueFrom } from 'rxjs';
import JSZip from 'jszip';
import { ImageSchema } from '@dvsa/cvs-type-definitions/types/v1/test';
import { isEqual } from 'lodash';

@Injectable({ providedIn: 'root' })
export class DefectMediaService {

  http = inject(HttpClient);
  images: Record<string, string> = {};
  cdr = inject(ChangeDetectorRef);

  constructor() {
    console.log('created');
  }

  async getPresignedUrlValue(testResultId: string) {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/zip');
    headers = headers.set('X-Api-Key', environment.DOCUMENT_RETRIEVAL_API_KEY);
    const fileName = `${testResultId}`;

    let localParams = new HttpParams();
    this.params.forEach((value, key) => (localParams = localParams.set(key, value)));

    const url = await lastValueFrom(
      this.http.get(`${environment.VTM_API_URI}/v1/document-retrieval/${fileName}`, {
        params: localParams,
        headers,
        responseType: 'text',
      })
    );

    return url;
  }

  async loadImages(images: ImageSchema[], testResultId: string) {
    if (!isEqual(this.images, {})) {
      return;
    }
    const url = await this.getPresignedUrlValue(testResultId);
    const blob = await lastValueFrom(this.http.get(url, { responseType: 'blob' }));
    const zip = new JSZip();
    await zip.loadAsync(blob, { base64: true });

    for (const image of images) {
      const file = zip.files[image.path];
      if (file) {
        this.images[image.path] = await file.async('base64');
      }
    }
    this.cdr.detectChanges();
  }

  get params(): Map<string, string> {
    return new Map([['category', 'defects']]);
  }

  getImages(): Record<string, string> {
    return this.images;
  }

}
