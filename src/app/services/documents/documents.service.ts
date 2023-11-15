import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DocumentsService {
  openDocumentFromResponse(fileName: string, responseBody: unknown): void {
    const blob = this.convertToBlob(responseBody);

    const link = this.createFileLink(fileName, blob);

    this.simulateClick(link);
  }

  convertToBlob(data: unknown): Blob {
    if (typeof data !== 'string') throw new Error('Cannot convert to a blob. Data needs to be of type string');

    const byteArray = new Uint8Array(
      window
        .atob(data)
        .split('')
        .map((char) => char.charCodeAt(0)),
    );

    return new Blob([byteArray], { type: 'application/pdf; charset=utf-8' });
  }

  createFileLink(fileName: string, blob: Blob): HTMLAnchorElement {
    const url = window.URL.createObjectURL(blob);

    const link: HTMLAnchorElement = document.createElement('a');

    link.href = url;
    link.target = '_blank';
    link.download = `${fileName}.pdf`;

    return link;
  }

  simulateClick(link: HTMLAnchorElement): void {
    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  }
}
