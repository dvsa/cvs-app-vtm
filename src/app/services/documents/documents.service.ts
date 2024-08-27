import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DocumentsService {
  openDocumentFromResponse(fileName: string, responseBody: unknown, fileType = 'pdf'): void {
    if (fileType === 'zip') {
      const link: HTMLAnchorElement = document.createElement('a');

      link.href = (responseBody as string).toString();
      link.download = `${fileName}.${fileType}`;

      this.simulateClick(link);
    } else {
      const blob = this.convertToBlob(responseBody, fileType);

      const link = this.createFileLink(fileName, blob, fileType);

      this.simulateClick(link);
    }
  }

  convertToBlob(data: unknown, fileType?: string): Blob {
    if (typeof data !== 'string') throw new Error('Cannot convert to a blob. Data needs to be of type string');

    const byteArray = new Uint8Array(
      window
        .atob(data)
        .split('')
        .map((char) => char.charCodeAt(0))
    );

    return new Blob([byteArray], { type: `application/${fileType}; charset=utf-8` });
  }

  createFileLink(fileName: string, blob: Blob, fileType?: string): HTMLAnchorElement {
    const url = window.URL.createObjectURL(blob);

    const link: HTMLAnchorElement = document.createElement('a');

    link.href = url;
    link.target = '_blank';
    link.download = `${fileName}.${fileType}`;

    return link;
  }

  simulateClick(link: HTMLAnchorElement): void {
    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  }
}
