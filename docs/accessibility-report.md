# Accessibility Test Report

*Generated on: 10/02/2026 at 11:11:14*

## Overall Summary

**Total Tests:** 7

**Total Violations:** 14

| Severity | Count |
|----------|-------|
| 🔴 Critical | 0 |
| 🟠 Serious | 7 |
| 🟡 Moderate | 7 |
| 🔵 Minor | 0 |
| **Total** | **14** |

---

## Test Results

### tech record journey

**URL:** http://localhost:4200/search/results?primaryVrm=VTM-123456789

**Tested:** 2026-02-10T11:07:37.854Z

**Violations Found:** 2

| Severity | Count |
|----------|-------|
| 🔴 Critical | 0 |
| 🟠 Serious | 1 |
| 🟡 Moderate | 1 |
| 🔵 Minor | 0 |

#### 1. 🟠 Elements must meet enhanced color contrast ratio thresholds

**Severity:** SERIOUS

**Rule ID:** `color-contrast-enhanced`

**Description:** Ensure the contrast between foreground and background colors meets WCAG 2 AAA enhanced contrast ratio thresholds

**WCAG Reference:** [Learn more](https://dequeuniversity.com/rules/axe/4.11/color-contrast-enhanced?application=playwright)

**Affected Elements:** 5

<details>
<summary><strong>Show Affected Elements</strong></summary>

**Element 1:** `#appversion`

```html
<span _ngcontent-ng-c441620951="" id="appversion">v1.43</span>
```

**Issue:**

Fix any of the following:
  Element has insufficient color contrast of 4.72 (foreground color: #ffffff, background color: #e31b23, font size: 12.0pt (16px), font weight: normal). Expected contrast ratio of 7:1

---

**Element 2:** `#username`

```html
<span _ngcontent-ng-c441620951="" id="username">VTM ADMIN1</span>
```

**Issue:**

Fix any of the following:
  Element has insufficient color contrast of 4.72 (foreground color: #ffffff, background color: #e31b23, font size: 14.3pt (19px), font weight: normal). Expected contrast ratio of 7:1

---

**Element 3:** `strong`

```html
<strong _ngcontent-ng-c965304189="" class="govuk-tag govuk-phase-banner__content__tag"> beta </strong>
```

**Issue:**

Fix any of the following:
  Element has insufficient color contrast of 5.16 (foreground color: #ffffff, background color: #1d70b8, font size: 12.0pt (16px), font weight: bold). Expected contrast ratio of 7:1

---

**Element 4:** `a[target="_blank"]`

```html
<a _ngcontent-ng-c965304189="" target="_blank" class="govuk-link" href="https://www.smartsurvey.co.uk/s/XJIAZC/">give your feedback (opens in a new tab)</a>
```

**Issue:**

Fix any of the following:
  Element has insufficient color contrast of 5.16 (foreground color: #1d70b8, background color: #ffffff, font size: 12.0pt (16px), font weight: normal). Expected contrast ratio of 7:1

---

**Element 5:** `a[_ngcontent-ng-c2648421499=""]`

```html
<a _ngcontent-ng-c2648421499="" routerlink="../../create" class="govuk-link" href="/create">Create new tech record</a>
```

**Issue:**

Fix any of the following:
  Element has insufficient color contrast of 4.62 (foreground color: #1d70b8, background color: #f3f2f1, font size: 12.0pt (16px), font weight: normal). Expected contrast ratio of 7:1

</details>

---

#### 2. 🟡 Zooming and scaling must not be disabled

**Severity:** MODERATE

**Rule ID:** `meta-viewport`

**Description:** Ensure <meta name="viewport"> does not disable text scaling and zooming

**WCAG Reference:** [Learn more](https://dequeuniversity.com/rules/axe/4.11/meta-viewport?application=playwright)

**Affected Elements:** 1

<details>
<summary><strong>Show Affected Elements</strong></summary>

**Element 1:** `meta[name="viewport"]`

```html
<meta name="viewport" content="viewport-fit=cover, width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
```

**Issue:**

Fix any of the following:
  user-scalable=no on <meta> tag disables zooming on mobile devices

</details>

---

---

### tech record journey

**URL:** http://localhost:4200/

**Tested:** 2026-02-10T11:07:35.494Z

**Violations Found:** 2

| Severity | Count |
|----------|-------|
| 🔴 Critical | 0 |
| 🟠 Serious | 1 |
| 🟡 Moderate | 1 |
| 🔵 Minor | 0 |

#### 1. 🟠 Elements must meet enhanced color contrast ratio thresholds

**Severity:** SERIOUS

**Rule ID:** `color-contrast-enhanced`

**Description:** Ensure the contrast between foreground and background colors meets WCAG 2 AAA enhanced contrast ratio thresholds

**WCAG Reference:** [Learn more](https://dequeuniversity.com/rules/axe/4.11/color-contrast-enhanced?application=playwright)

**Affected Elements:** 4

<details>
<summary><strong>Show Affected Elements</strong></summary>

**Element 1:** `#appversion`

```html
<span _ngcontent-ng-c441620951="" id="appversion">v1.43</span>
```

**Issue:**

Fix any of the following:
  Element has insufficient color contrast of 4.72 (foreground color: #ffffff, background color: #e31b23, font size: 12.0pt (16px), font weight: normal). Expected contrast ratio of 7:1

---

**Element 2:** `#username`

```html
<span _ngcontent-ng-c441620951="" id="username">VTM ADMIN1</span>
```

**Issue:**

Fix any of the following:
  Element has insufficient color contrast of 4.72 (foreground color: #ffffff, background color: #e31b23, font size: 14.3pt (19px), font weight: normal). Expected contrast ratio of 7:1

---

**Element 3:** `strong`

```html
<strong _ngcontent-ng-c965304189="" class="govuk-tag govuk-phase-banner__content__tag"> beta </strong>
```

**Issue:**

Fix any of the following:
  Element has insufficient color contrast of 5.16 (foreground color: #ffffff, background color: #1d70b8, font size: 12.0pt (16px), font weight: bold). Expected contrast ratio of 7:1

---

**Element 4:** `a[target="_blank"]`

```html
<a _ngcontent-ng-c965304189="" target="_blank" class="govuk-link" href="https://www.smartsurvey.co.uk/s/XJIAZC/">give your feedback (opens in a new tab)</a>
```

**Issue:**

Fix any of the following:
  Element has insufficient color contrast of 5.16 (foreground color: #1d70b8, background color: #ffffff, font size: 12.0pt (16px), font weight: normal). Expected contrast ratio of 7:1

</details>

---

#### 2. 🟡 Zooming and scaling must not be disabled

**Severity:** MODERATE

**Rule ID:** `meta-viewport`

**Description:** Ensure <meta name="viewport"> does not disable text scaling and zooming

**WCAG Reference:** [Learn more](https://dequeuniversity.com/rules/axe/4.11/meta-viewport?application=playwright)

**Affected Elements:** 1

<details>
<summary><strong>Show Affected Elements</strong></summary>

**Element 1:** `meta[name="viewport"]`

```html
<meta name="viewport" content="viewport-fit=cover, width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
```

**Issue:**

Fix any of the following:
  user-scalable=no on <meta> tag disables zooming on mobile devices

</details>

---

---

### tech record journey

**URL:** http://localhost:4200/betas

**Tested:** 2026-02-10T11:07:36.083Z

**Violations Found:** 2

| Severity | Count |
|----------|-------|
| 🔴 Critical | 0 |
| 🟠 Serious | 1 |
| 🟡 Moderate | 1 |
| 🔵 Minor | 0 |

#### 1. 🟠 Elements must meet enhanced color contrast ratio thresholds

**Severity:** SERIOUS

**Rule ID:** `color-contrast-enhanced`

**Description:** Ensure the contrast between foreground and background colors meets WCAG 2 AAA enhanced contrast ratio thresholds

**WCAG Reference:** [Learn more](https://dequeuniversity.com/rules/axe/4.11/color-contrast-enhanced?application=playwright)

**Affected Elements:** 6

<details>
<summary><strong>Show Affected Elements</strong></summary>

**Element 1:** `#appversion`

```html
<span _ngcontent-ng-c441620951="" id="appversion">v1.43</span>
```

**Issue:**

Fix any of the following:
  Element has insufficient color contrast of 4.72 (foreground color: #ffffff, background color: #e31b23, font size: 12.0pt (16px), font weight: normal). Expected contrast ratio of 7:1

---

**Element 2:** `#username`

```html
<span _ngcontent-ng-c441620951="" id="username">VTM ADMIN1</span>
```

**Issue:**

Fix any of the following:
  Element has insufficient color contrast of 4.72 (foreground color: #ffffff, background color: #e31b23, font size: 14.3pt (19px), font weight: normal). Expected contrast ratio of 7:1

---

**Element 3:** `strong`

```html
<strong _ngcontent-ng-c965304189="" class="govuk-tag govuk-phase-banner__content__tag"> beta </strong>
```

**Issue:**

Fix any of the following:
  Element has insufficient color contrast of 5.16 (foreground color: #ffffff, background color: #1d70b8, font size: 12.0pt (16px), font weight: bold). Expected contrast ratio of 7:1

---

**Element 4:** `a[target="_blank"]`

```html
<a _ngcontent-ng-c965304189="" target="_blank" class="govuk-link" href="https://www.smartsurvey.co.uk/s/XJIAZC/">give your feedback (opens in a new tab)</a>
```

**Issue:**

Fix any of the following:
  Element has insufficient color contrast of 5.16 (foreground color: #1d70b8, background color: #ffffff, font size: 12.0pt (16px), font weight: normal). Expected contrast ratio of 7:1

---

**Element 5:** `app-button:nth-child(1) > button`

```html
<button _ngcontent-ng-c677714215="" apppreventdoubleclick="" data-module="govuk-button" class="govuk-button" id="save" type="button" aria-disabled="false">Save preferences<!----></button>
```

**Issue:**

Fix any of the following:
  Element has insufficient color contrast of 6.2 (foreground color: #ffffff, background color: #00703c, font size: 14.3pt (19px), font weight: normal). Expected contrast ratio of 7:1

---

**Element 6:** `.govuk-button--link`

```html
<button _ngcontent-ng-c677714215="" apppreventdoubleclick="" data-module="govuk-button" class="govuk-button govuk-button--link" id="cancel" type="button" aria-disabled="false">Cancel<!----></button>
```

**Issue:**

Fix any of the following:
  Element has insufficient color contrast of 5.16 (foreground color: #1d70b8, background color: #ffffff, font size: 14.3pt (19px), font weight: normal). Expected contrast ratio of 7:1

</details>

---

#### 2. 🟡 Zooming and scaling must not be disabled

**Severity:** MODERATE

**Rule ID:** `meta-viewport`

**Description:** Ensure <meta name="viewport"> does not disable text scaling and zooming

**WCAG Reference:** [Learn more](https://dequeuniversity.com/rules/axe/4.11/meta-viewport?application=playwright)

**Affected Elements:** 1

<details>
<summary><strong>Show Affected Elements</strong></summary>

**Element 1:** `meta[name="viewport"]`

```html
<meta name="viewport" content="viewport-fit=cover, width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
```

**Issue:**

Fix any of the following:
  user-scalable=no on <meta> tag disables zooming on mobile devices

</details>

---

---

### tech record journey

**URL:** http://localhost:4200/create/duplicate-vin

**Tested:** 2026-02-10T11:07:39.717Z

**Violations Found:** 2

| Severity | Count |
|----------|-------|
| 🔴 Critical | 0 |
| 🟠 Serious | 1 |
| 🟡 Moderate | 1 |
| 🔵 Minor | 0 |

#### 1. 🟠 Elements must meet enhanced color contrast ratio thresholds

**Severity:** SERIOUS

**Rule ID:** `color-contrast-enhanced`

**Description:** Ensure the contrast between foreground and background colors meets WCAG 2 AAA enhanced contrast ratio thresholds

**WCAG Reference:** [Learn more](https://dequeuniversity.com/rules/axe/4.11/color-contrast-enhanced?application=playwright)

**Affected Elements:** 6

<details>
<summary><strong>Show Affected Elements</strong></summary>

**Element 1:** `#appversion`

```html
<span _ngcontent-ng-c441620951="" id="appversion">v1.43</span>
```

**Issue:**

Fix any of the following:
  Element has insufficient color contrast of 4.72 (foreground color: #ffffff, background color: #e31b23, font size: 12.0pt (16px), font weight: normal). Expected contrast ratio of 7:1

---

**Element 2:** `#username`

```html
<span _ngcontent-ng-c441620951="" id="username">VTM ADMIN1</span>
```

**Issue:**

Fix any of the following:
  Element has insufficient color contrast of 4.72 (foreground color: #ffffff, background color: #e31b23, font size: 14.3pt (19px), font weight: normal). Expected contrast ratio of 7:1

---

**Element 3:** `strong`

```html
<strong _ngcontent-ng-c965304189="" class="govuk-tag govuk-phase-banner__content__tag"> beta </strong>
```

**Issue:**

Fix any of the following:
  Element has insufficient color contrast of 5.16 (foreground color: #ffffff, background color: #1d70b8, font size: 12.0pt (16px), font weight: bold). Expected contrast ratio of 7:1

---

**Element 4:** `a[target="_blank"]`

```html
<a _ngcontent-ng-c965304189="" target="_blank" class="govuk-link" href="https://www.smartsurvey.co.uk/s/XJIAZC/">give your feedback (opens in a new tab)</a>
```

**Issue:**

Fix any of the following:
  Element has insufficient color contrast of 5.16 (foreground color: #1d70b8, background color: #ffffff, font size: 12.0pt (16px), font weight: normal). Expected contrast ratio of 7:1

---

**Element 5:** `app-button:nth-child(1) > button`

```html
<button _ngcontent-ng-c677714215="" apppreventdoubleclick="" data-module="govuk-button" class="govuk-button" id="submit" type="button" aria-disabled="false">Confirm<!----></button>
```

**Issue:**

Fix any of the following:
  Element has insufficient color contrast of 6.2 (foreground color: #ffffff, background color: #00703c, font size: 14.3pt (19px), font weight: normal). Expected contrast ratio of 7:1

---

**Element 6:** `.govuk-button--link`

```html
<button _ngcontent-ng-c677714215="" apppreventdoubleclick="" data-module="govuk-button" class="govuk-button govuk-button--link" id="cancel" type="button" aria-disabled="false">Back<!----></button>
```

**Issue:**

Fix any of the following:
  Element has insufficient color contrast of 5.16 (foreground color: #1d70b8, background color: #ffffff, font size: 14.3pt (19px), font weight: normal). Expected contrast ratio of 7:1

</details>

---

#### 2. 🟡 Zooming and scaling must not be disabled

**Severity:** MODERATE

**Rule ID:** `meta-viewport`

**Description:** Ensure <meta name="viewport"> does not disable text scaling and zooming

**WCAG Reference:** [Learn more](https://dequeuniversity.com/rules/axe/4.11/meta-viewport?application=playwright)

**Affected Elements:** 1

<details>
<summary><strong>Show Affected Elements</strong></summary>

**Element 1:** `meta[name="viewport"]`

```html
<meta name="viewport" content="viewport-fit=cover, width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
```

**Issue:**

Fix any of the following:
  user-scalable=no on <meta> tag disables zooming on mobile devices

</details>

---

---

### tech record journey

**URL:** http://localhost:4200/create/new-record-details

**Tested:** 2026-02-10T11:07:40.672Z

**Violations Found:** 2

| Severity | Count |
|----------|-------|
| 🔴 Critical | 0 |
| 🟠 Serious | 1 |
| 🟡 Moderate | 1 |
| 🔵 Minor | 0 |

#### 1. 🟠 Elements must meet enhanced color contrast ratio thresholds

**Severity:** SERIOUS

**Rule ID:** `color-contrast-enhanced`

**Description:** Ensure the contrast between foreground and background colors meets WCAG 2 AAA enhanced contrast ratio thresholds

**WCAG Reference:** [Learn more](https://dequeuniversity.com/rules/axe/4.11/color-contrast-enhanced?application=playwright)

**Affected Elements:** 8

<details>
<summary><strong>Show Affected Elements</strong></summary>

**Element 1:** `#appversion`

```html
<span _ngcontent-ng-c441620951="" id="appversion">v1.43</span>
```

**Issue:**

Fix any of the following:
  Element has insufficient color contrast of 4.72 (foreground color: #ffffff, background color: #e31b23, font size: 12.0pt (16px), font weight: normal). Expected contrast ratio of 7:1

---

**Element 2:** `#username`

```html
<span _ngcontent-ng-c441620951="" id="username">VTM ADMIN1</span>
```

**Issue:**

Fix any of the following:
  Element has insufficient color contrast of 4.72 (foreground color: #ffffff, background color: #e31b23, font size: 14.3pt (19px), font weight: normal). Expected contrast ratio of 7:1

---

**Element 3:** `.govuk-phase-banner__content__tag[_ngcontent-ng-c965304189=""]`

```html
<strong _ngcontent-ng-c965304189="" class="govuk-tag govuk-phase-banner__content__tag"> beta </strong>
```

**Issue:**

Fix any of the following:
  Element has insufficient color contrast of 5.16 (foreground color: #ffffff, background color: #1d70b8, font size: 12.0pt (16px), font weight: bold). Expected contrast ratio of 7:1

---

**Element 4:** `a[target="_blank"]`

```html
<a _ngcontent-ng-c965304189="" target="_blank" class="govuk-link" href="https://www.smartsurvey.co.uk/s/XJIAZC/">give your feedback (opens in a new tab)</a>
```

**Issue:**

Fix any of the following:
  Element has insufficient color contrast of 5.16 (foreground color: #1d70b8, background color: #ffffff, font size: 12.0pt (16px), font weight: normal). Expected contrast ratio of 7:1

---

**Element 5:** `#status-code > .govuk-phase-banner__content__tag`

```html
<strong _ngcontent-ng-c31070335="" class="govuk-tag govuk-phase-banner__content__tag">Current</strong>
```

**Issue:**

Fix any of the following:
  Element has insufficient color contrast of 5.16 (foreground color: #ffffff, background color: #1d70b8, font size: 12.0pt (16px), font weight: bold). Expected contrast ratio of 7:1

---

**Element 6:** `.govuk-tag--green`

```html
<strong class="govuk-tag govuk-tag--green"> VISIBLE </strong>
```

**Issue:**

Fix any of the following:
  Element has insufficient color contrast of 6.16 (foreground color: #005a30, background color: #cce2d8, font size: 12.0pt (16px), font weight: bold). Expected contrast ratio of 7:1

---

**Element 7:** `.govuk-button`

```html
<button _ngcontent-ng-c677714215="" apppreventdoubleclick="" data-module="govuk-button" class="govuk-button" id="submit-record-continue" type="button" aria-disabled="false">Submit new record<!----></button>
```

**Issue:**

Fix any of the following:
  Element has insufficient color contrast of 6.2 (foreground color: #ffffff, background color: #00703c, font size: 14.3pt (19px), font weight: normal). Expected contrast ratio of 7:1

---

**Element 8:** `#techRecord_reasonForCreation-label > .tags > app-tag > .govuk-tag--red`

```html
<strong class="govuk-tag govuk-tag--red">Required</strong>
```

**Issue:**

Fix any of the following:
  Element has insufficient color contrast of 6.14 (foreground color: #942514, background color: #f6d7d2, font size: 12.0pt (16px), font weight: bold). Expected contrast ratio of 7:1

</details>

---

#### 2. 🟡 Zooming and scaling must not be disabled

**Severity:** MODERATE

**Rule ID:** `meta-viewport`

**Description:** Ensure <meta name="viewport"> does not disable text scaling and zooming

**WCAG Reference:** [Learn more](https://dequeuniversity.com/rules/axe/4.11/meta-viewport?application=playwright)

**Affected Elements:** 1

<details>
<summary><strong>Show Affected Elements</strong></summary>

**Element 1:** `meta[name="viewport"]`

```html
<meta name="viewport" content="viewport-fit=cover, width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
```

**Issue:**

Fix any of the following:
  user-scalable=no on <meta> tag disables zooming on mobile devices

</details>

---

---

### tech record journey

**URL:** http://localhost:4200/create

**Tested:** 2026-02-10T11:07:38.596Z

**Violations Found:** 2

| Severity | Count |
|----------|-------|
| 🔴 Critical | 0 |
| 🟠 Serious | 1 |
| 🟡 Moderate | 1 |
| 🔵 Minor | 0 |

#### 1. 🟠 Elements must meet enhanced color contrast ratio thresholds

**Severity:** SERIOUS

**Rule ID:** `color-contrast-enhanced`

**Description:** Ensure the contrast between foreground and background colors meets WCAG 2 AAA enhanced contrast ratio thresholds

**WCAG Reference:** [Learn more](https://dequeuniversity.com/rules/axe/4.11/color-contrast-enhanced?application=playwright)

**Affected Elements:** 6

<details>
<summary><strong>Show Affected Elements</strong></summary>

**Element 1:** `#appversion`

```html
<span _ngcontent-ng-c441620951="" id="appversion">v1.43</span>
```

**Issue:**

Fix any of the following:
  Element has insufficient color contrast of 4.72 (foreground color: #ffffff, background color: #e31b23, font size: 12.0pt (16px), font weight: normal). Expected contrast ratio of 7:1

---

**Element 2:** `#username`

```html
<span _ngcontent-ng-c441620951="" id="username">VTM ADMIN1</span>
```

**Issue:**

Fix any of the following:
  Element has insufficient color contrast of 4.72 (foreground color: #ffffff, background color: #e31b23, font size: 14.3pt (19px), font weight: normal). Expected contrast ratio of 7:1

---

**Element 3:** `strong`

```html
<strong _ngcontent-ng-c965304189="" class="govuk-tag govuk-phase-banner__content__tag"> beta </strong>
```

**Issue:**

Fix any of the following:
  Element has insufficient color contrast of 5.16 (foreground color: #ffffff, background color: #1d70b8, font size: 12.0pt (16px), font weight: bold). Expected contrast ratio of 7:1

---

**Element 4:** `a[target="_blank"]`

```html
<a _ngcontent-ng-c965304189="" target="_blank" class="govuk-link" href="https://www.smartsurvey.co.uk/s/XJIAZC/">give your feedback (opens in a new tab)</a>
```

**Issue:**

Fix any of the following:
  Element has insufficient color contrast of 5.16 (foreground color: #1d70b8, background color: #ffffff, font size: 12.0pt (16px), font weight: normal). Expected contrast ratio of 7:1

---

**Element 5:** `#input-vin-hint`

```html
<div class="govuk-hint" id="input-vin-hint"> Must be between 3 and 21 characters </div>
```

**Issue:**

Fix any of the following:
  Element has insufficient color contrast of 6.32 (foreground color: #505a5f, background color: #f3f2f1, font size: 14.3pt (19px), font weight: normal). Expected contrast ratio of 7:1

---

**Element 6:** `app-button:nth-child(1) > button`

```html
<button _ngcontent-ng-c677714215="" apppreventdoubleclick="" data-module="govuk-button" class="govuk-button" id="submit" type="button" aria-disabled="false">Continue<!----></button>
```

**Issue:**

Fix any of the following:
  Element has insufficient color contrast of 6.2 (foreground color: #ffffff, background color: #00703c, font size: 14.3pt (19px), font weight: normal). Expected contrast ratio of 7:1

</details>

---

#### 2. 🟡 Zooming and scaling must not be disabled

**Severity:** MODERATE

**Rule ID:** `meta-viewport`

**Description:** Ensure <meta name="viewport"> does not disable text scaling and zooming

**WCAG Reference:** [Learn more](https://dequeuniversity.com/rules/axe/4.11/meta-viewport?application=playwright)

**Affected Elements:** 1

<details>
<summary><strong>Show Affected Elements</strong></summary>

**Element 1:** `meta[name="viewport"]`

```html
<meta name="viewport" content="viewport-fit=cover, width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
```

**Issue:**

Fix any of the following:
  user-scalable=no on <meta> tag disables zooming on mobile devices

</details>

---

---

### tech record journey

**URL:** http://localhost:4200/search

**Tested:** 2026-02-10T11:07:37.182Z

**Violations Found:** 2

| Severity | Count |
|----------|-------|
| 🔴 Critical | 0 |
| 🟠 Serious | 1 |
| 🟡 Moderate | 1 |
| 🔵 Minor | 0 |

#### 1. 🟠 Elements must meet enhanced color contrast ratio thresholds

**Severity:** SERIOUS

**Rule ID:** `color-contrast-enhanced`

**Description:** Ensure the contrast between foreground and background colors meets WCAG 2 AAA enhanced contrast ratio thresholds

**WCAG Reference:** [Learn more](https://dequeuniversity.com/rules/axe/4.11/color-contrast-enhanced?application=playwright)

**Affected Elements:** 5

<details>
<summary><strong>Show Affected Elements</strong></summary>

**Element 1:** `#appversion`

```html
<span _ngcontent-ng-c441620951="" id="appversion">v1.43</span>
```

**Issue:**

Fix any of the following:
  Element has insufficient color contrast of 4.72 (foreground color: #ffffff, background color: #e31b23, font size: 12.0pt (16px), font weight: normal). Expected contrast ratio of 7:1

---

**Element 2:** `#username`

```html
<span _ngcontent-ng-c441620951="" id="username">VTM ADMIN1</span>
```

**Issue:**

Fix any of the following:
  Element has insufficient color contrast of 4.72 (foreground color: #ffffff, background color: #e31b23, font size: 14.3pt (19px), font weight: normal). Expected contrast ratio of 7:1

---

**Element 3:** `strong`

```html
<strong _ngcontent-ng-c965304189="" class="govuk-tag govuk-phase-banner__content__tag"> beta </strong>
```

**Issue:**

Fix any of the following:
  Element has insufficient color contrast of 5.16 (foreground color: #ffffff, background color: #1d70b8, font size: 12.0pt (16px), font weight: bold). Expected contrast ratio of 7:1

---

**Element 4:** `a[target="_blank"]`

```html
<a _ngcontent-ng-c965304189="" target="_blank" class="govuk-link" href="https://www.smartsurvey.co.uk/s/XJIAZC/">give your feedback (opens in a new tab)</a>
```

**Issue:**

Fix any of the following:
  Element has insufficient color contrast of 5.16 (foreground color: #1d70b8, background color: #ffffff, font size: 12.0pt (16px), font weight: normal). Expected contrast ratio of 7:1

---

**Element 5:** `#undefined`

```html
<button _ngcontent-ng-c677714215="" apppreventdoubleclick="" data-module="govuk-button" class="govuk-button" id="undefined" type="button" aria-disabled="false">Search<!----></button>
```

**Issue:**

Fix any of the following:
  Element has insufficient color contrast of 6.2 (foreground color: #ffffff, background color: #00703c, font size: 14.3pt (19px), font weight: normal). Expected contrast ratio of 7:1

</details>

---

#### 2. 🟡 Zooming and scaling must not be disabled

**Severity:** MODERATE

**Rule ID:** `meta-viewport`

**Description:** Ensure <meta name="viewport"> does not disable text scaling and zooming

**WCAG Reference:** [Learn more](https://dequeuniversity.com/rules/axe/4.11/meta-viewport?application=playwright)

**Affected Elements:** 1

<details>
<summary><strong>Show Affected Elements</strong></summary>

**Element 1:** `meta[name="viewport"]`

```html
<meta name="viewport" content="viewport-fit=cover, width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
```

**Issue:**

Fix any of the following:
  user-scalable=no on <meta> tag disables zooming on mobile devices

</details>

---

---

*Generated by [Axe-core](https://www.deque.com/axe/) via Playwright*
