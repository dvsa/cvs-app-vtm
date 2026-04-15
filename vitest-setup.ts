import '@angular/compiler';
import '@analogjs/vitest-angular/setup-zone';
import { ComponentFixture } from '@angular/core/testing';

vi.mock('accessible-autocomplete/dist/accessible-autocomplete.min', () => ({
  default: { enhanceSelectElement: vi.fn() },
  enhanceSelectElement: vi.fn(),
}));
import { TagType } from '@components/tag/tag.component';
import { DocumentType } from '@models/document-type.enum';
import { Modes } from '@models/modes.enum';
import { Roles } from '@models/roles.enum';
import { RootRoutes, TechRecordRoutes } from '@models/routes.enum';
import { StatusCodes, VehicleTypes } from '@models/vehicle-tech-record.model';
import { FormNodeTypes, FormNodeWidth, TagTypeLabels } from '@services/dynamic-forms/dynamic-form.types';

(globalThis as any)['CSS'] = null;

const mock = () => {
  let storage: { [key: string]: any } = {};
  return {
    getItem: (key: string) => (key in storage ? storage[key] : null),
    setItem: (key: string, value: any) => (storage[key] = value || ''),
    removeItem: (key: string) => delete storage[key],
    clear: () => (storage = {}),
  };
};

Object.defineProperty(window, 'localStorage', { value: mock(), configurable: true });
Object.defineProperty(window, 'sessionStorage', { value: mock(), configurable: true });
Object.defineProperty(document, 'doctype', { value: '<!DOCTYPE html>', configurable: true });
Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    display: 'none',
    appearance: ['-webkit-appearance'],
  }),
  configurable: true,
});
Object.defineProperty(document.body.style, 'transform', {
  value: () => ({
    enumerable: true,
    configurable: true,
  }),
  configurable: true,
});

const enumTemplateValues = {
  DocumentType,
  FormNodeTypes,
  FormNodeWidth,
  Modes,
  Roles,
  RootRoutes,
  StatusCodes,
  TagType,
  TagTypeLabels,
  TechRecordRoutes,
  VehicleTypes,
};

/**
 * Walk an Angular DebugElement tree and patch any component instance whose
 * enum-valued class property resolved to `undefined` (a known vitest + Angular
 * enum-import issue). Returns the number of properties that were patched.
 */
function patchEnumValues(debugEl: any): number {
  let patched = 0;
  if (!debugEl) return patched;

  try {
    const instance = debugEl.componentInstance as Record<string, unknown> | undefined;
    if (instance) {
      for (const [property, value] of Object.entries(enumTemplateValues)) {
        if (property in instance && instance[property] === undefined) {
          instance[property] = value;
          patched++;
        }
      }
    }
  } catch {
    // Not a component element — skip
  }

  for (const child of debugEl.childNodes ?? []) {
    patched += patchEnumValues(child);
  }
  return patched;
}

const fixturePrototype = ComponentFixture.prototype as typeof ComponentFixture.prototype & {
  __cvsEnumPatchApplied?: boolean;
};

if (!fixturePrototype.__cvsEnumPatchApplied) {
  const detectChanges = fixturePrototype.detectChanges;

  fixturePrototype.detectChanges = function (...args: Parameters<ComponentFixture<unknown>['detectChanges']>) {
    patchEnumValues(this.debugElement);
    try {
      return detectChanges.apply(this, args);
    } catch (e) {
      // After a failed detectChanges, child component instances may now exist
      // with undefined enum values. Patch the whole tree and retry once.
      if (patchEnumValues(this.debugElement) > 0) {
        return detectChanges.apply(this, args);
      }
      throw e;
    }
  };

  fixturePrototype.__cvsEnumPatchApplied = true;
}
