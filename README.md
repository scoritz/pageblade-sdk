# PageBlade SDK

**PageBlade** provide an API to manage websites, webpages, assets, visitor statistics, page version control, tenants and much more.

This Node.js / Typescript SDK provides an easy to use wrapper around all the available actions.

The REST API is directly accessible, though we **strongly recommend** using this SDK as it is maintained in alignment with all API changes providing strong typings for methods, entities and DTOs.

## Contents

- [Installation](#installation)
- [API Key](#api-key)
- [Quick Start](#quick-start)
- [Websites](#websites)
- [Webpages](#webpages)
- [Assets](#assets)
- [Statistics](#statistics)
- [Tenants](#tenants)
- [Pagination](#pagination)
- [Rate Limiting](#rate-limiting)
- [Timestamps](#timestamps)
- [Error Handling](#error-handling)
- [Bandwidth](#bandwidth)
- [Roadmap](#roadmap)
- [Suggestions & Discussions](#suggestions--discussions)
- [Contributing](#contributing)
- [License](#license)

## Installation

    npm install pageblade-sdk --save

## API Key

You can grab a free API key from the [PageBlade website](https://pageblade.com), simply signup with your Github account. Your key will allow evaluation of all features aside from custom domains and multiple tenants. Production ready plans are available for access to all features.

## Quick Start

Here's a simple example to create your first website and webpage:
```typescript
import { PageBlade } from 'pageblade-sdk';

// Initialise the SDK - free API key can be obtained from https://pageblade.com
const pageBlade = new PageBlade({ apiKey });

// Create a website using default values
const website = await pageBlade.createWebsite();

// Create and auto publish a page
const webpage = await pageBlade.createWebpage({
    name: 'Getting Started',
    slug: '/getting-started',
    websiteId: website.id,
    draftHtml: '<html><body>Hello PageBlade!</body></html>',
    publish: true,
});

console.log(webpage.publishedUrl);
```
Using default values, the create website method will generate a random subdomain. We've specified the `publish: true` property to make the page instantly available.

The created webpage can be accessed at the returned `publishedUrl` parameter.

All websites are hosted on a `*.pageblade.site` domain, unless you specify a custom domain, more on that later.
```javascript
{
  publishedUrl: 'https://pinkcats.pageblade.site',
}
```

#### PageBlade Initialisation

The configuration object on the constructor is optional. Either specify your API key here or as the environment variable `PAGEBLADE_API_KEY`. If `defaultTenantId` is provided, it will be used for all requests unless overiden at request level where `tenantId` is often an optional parameter.

```typescript
// Configuration is optional
const pageBlade = new PageBlade({
    apiKey,
    defaultTenantId,
});
```

---

What follows is a list of all available methods with examples.
## API

### Websites

Websites are the containers for webpages and assets and visitor tracking analytics.

The following DTO is used for creating and updating websites.

#### Type: `WebsiteDto`

| Property | Type | Default | Max Length | Notes |
| :-- | :-- | :-- | :-- | :-- |
| `name` | string? | `My website`| 150 | Name for your own reference |
| `description` | string? | `My website` | 500 | Description for your own reference |
| `enabled` | boolean? | `true` | - | Set to `false` to prevent the website from being publically accessible |
| `subdomain` | string? | Random generated | 256 |  `subdomain.pageblade.site` |
| `domain` | string? | | 256 | Specify your own custom domain name |

#### Method: `createWebsite(website?: WebsiteDto, tenantId?: string): Promise<WebsiteEntity>`

> Creates a new website with optional DTO parameters.

```typescript
//
// Example: Create Website
//
const website = await pageBlade.createWebsite({
    name: 'My Amazing Website!',
    subdomain: 'amazing',
    domain: 'amazing.com',
});

console.log(website);
```

> Example response:
```javascript
// WebsiteEntity:
{
  description: 'My Website',
  domain: 'amazing.com',
  domainVerificationStatus: 'PENDING',
  domainVerificationKey: 'pageblade-AKXpx1Mrg7MGl4eGyswdP1NoykMkXTzJ',
  enabled: true,
  id: 'R6nF6teZdhde4Ex2ofHl2rnasGYtRe4X',
  name: 'My Amazing Website!',
  subdomain: 'amazing',
  hostedUrl: 'https://amazing.pageblade.site',
  cname: 'domain.pageblade.site',
  whenCreated: 1636211909820,
  whenUpdated: 1636211909820,
  tenantId: '9ZNyebUTK0O5dQicKHMCvrADaNlTXMGB',
  whenDomainVerificationAttempted: null
}
```
In the example above we are specifying a custom domain name. For the domain to be correctly allocated to the website, the domain owner will need to create two entries in their DNS records:
1. **CNAME**: Create a `CNAME` or `ALIAS` entry using the value provided in the `cname` property. This will point the domain to the PageBlade server.
2. **TXT**: Create a `TXT` entry using the value provided in the `domainVerificationKey` property. PageBlade will periodically check this value to verify ownership. **It is important this entry remains in the DNS otherwise it PageBlade will remove the domain allocation for the website without warning.**

#### Method: `updateWebsite(websiteId: string, website: WebsiteDto, tenantId?: string): Promise<WebsiteEntity>`

> Updates an existing website by passing the website ID and DTO.

```typescript
//
// Example: Update Website
//
const website = await pageBlade.updateWebsite(
    websiteId,
    {
        name: 'A More Amazing Website!',
        domain: 'another-example.com',
    },
);

console.log(website);
```

> Example response:
```javascript
// WebsiteEntity:
{
  description: 'My Website',
  domain: 'another-example.com',
  domainVerificationStatus: 'PENDING',
  domainVerificationKey: 'pageblade-VWFMMQn0c6zxvE7b9ey2oANyuCd3RLj5',
  enabled: true,
  id: 'R6nF6teZdhde4Ex2ofHl2rnasGYtRe4X',
  name: 'A More Amazing Website!',
  subdomain: 'amazing',
  hostedUrl: 'https://amazing.pageblade.site',
  cname: 'domain.pageblade.site',
  whenCreated: 1636211909820,
  whenUpdated: 1636211909864,
  tenantId: '9ZNyebUTK0O5dQicKHMCvrADaNlTXMGB',
  whenDomainVerificationAttempted: null
}
```

#### Method: `duplicateWebsite(websiteId: string, tenantId?: string): Promise<WebsiteEntity>`

> Duplicates a website and all associated webpages and assets by passing the website ID. A new subdomain is randomly generated.

```typescript
//
// Example: Duplicate Website
//
const duplicatedWebsite = await pageBlade.duplicateWebsite(websiteId);

console.log(duplicatedWebsite);
```
> Example response:
```javascript
// WebsiteEntity:
{
  description: 'My Website',
  domain: null,
  domainVerificationStatus: null,
  domainVerificationKey: null,
  enabled: true,
  id: 'uvyY0d6XEzujJCHajTQYl4l1XgqFnT7o',
  name: 'A More Amazing Website! copy',
  subdomain: 'minnesotamatrix',
  hostedUrl: 'https://minnesotamatrix.pageblade.site',
  cname: 'domain.pageblade.site',
  whenCreated: 1636211909898,
  whenUpdated: 1636211909898,
  tenantId: '9ZNyebUTK0O5dQicKHMCvrADaNlTXMGB',
  whenDomainVerificationAttempted: null
}
```
#### Method: `deleteWebsite(websiteId: string, tenantId?: string): Promise<void>`

>Deletes a website and all associated webpages, assets and tracking data by passing the website ID.

```typescript
//
// Example: Delete Website
//
await pageBlade.deleteWebsite(websiteId);
```
#### Method: `getWebsite(websiteId: string, tenantId?: string): Promise<WebsiteEntity>`

> Retrieves a single website for the passed website ID.

```typescript
//
// Example: Get Website
//
const website = await pageBlade.getWebsite(websiteId);

console.log(website);
```
> Example response:
```javascript
// WebsiteEntity:
{
  description: 'My Website',
  domain: 'another-example.com',
  domainVerificationStatus: 'PENDING',
  domainVerificationKey: 'pageblade-VWFMMQn0c6zxvE7b9ey2oANyuCd3RLj5',
  enabled: true,
  id: 'R6nF6teZdhde4Ex2ofHl2rnasGYtRe4X',
  name: 'A More Amazing Website!',
  subdomain: 'amazing',
  hostedUrl: 'https://amazing.pageblade.site',
  cname: 'domain.pageblade.site',
  whenCreated: 1636211909820,
  whenUpdated: 1636211909864,
  tenantId: '9ZNyebUTK0O5dQicKHMCvrADaNlTXMGB',
  whenDomainVerificationAttempted: null
}
```

#### Method: `getWebsites(paginatedRequest: PaginatedWebsiteDto, tenantId?: string): Promise<PaginatedWebsiteEntity>`

> Retrieves a page of websites for the default or passed tenant ID.

```typescript
//
// Example: Retrieve the first page of websites ordered by ascending creation date
//
const websites = await pageBlade.getWebsites({
    orderBy: 'whenCreated',
    orderDirection: ORDER_DIRECTION.ASC,
    pageIndex: 0,
    pageSize: 10,
});

console.log(websites);
```
> Example response:
```javascript
{
  nextPageUrl: null,
  totalRowsCount: 2,
  rows: [
    {
      description: 'My Website',
      domain: null,
      domainVerificationStatus: null,
      domainVerificationKey: null,
      enabled: true,
      id: 'lWg4LdrYUPWRcwJRuHzlxdvQ2Z7wHJhu',
      name: 'My New Website',
      subdomain: 'granularcambridgeshire',
      hostedUrl: 'https://granularcambridgeshire.pageblade.site',
      cname: null,
      whenCreated: 1636211908366,
      whenUpdated: 1636211908366,
      tenantId: '9ZNyebUTK0O5dQicKHMCvrADaNlTXMGB',
      whenDomainVerificationAttempted: null
    },
    {
      description: 'My Website',
      domain: 'another-example.com',
      domainVerificationStatus: 'PENDING',
      domainVerificationKey: 'pageblade-VWFMMQn0c6zxvE7b9ey2oANyuCd3RLj5',
      enabled: true,
      id: 'R6nF6teZdhde4Ex2ofHl2rnasGYtRe4X',
      name: 'A More Amazing Website!',
      subdomain: 'amazing',
      hostedUrl: 'https://amazing.pageblade.site',
      cname: 'domain.pageblade.site',
      whenCreated: 1636211909820,
      whenUpdated: 1636211909864,
      tenantId: '9ZNyebUTK0O5dQicKHMCvrADaNlTXMGB',
      whenDomainVerificationAttempted: null
    }
  ],
  totalPagesCount: 1,
  pageIndex: 0,
  pageSize: 10,
  orderBy: 'whenCreated'
}
```

#### Method: `downloadWebsite(websiteId: string, tenantId?: string): Promise<DownloadEntity>`

> Returns a zip file in base64 format containing all pages and assets structured in alignment with the webpage slugs.

```typescript
    //
    // Example: Download website to zip file format
    //
    const download = await pageBlade.downloadWebsite(websiteId);

    console.log(download);
```
> Example response:
```javascript
// DownloadEntity:
{
  filename: 'website_lWg4LdrYUPWRcwJRuHzlxdvQ2Z7wHJhu.zip',
  content: 'UEsDBBQACAAIAE96ZlMAAAAAAAAAA...',
  mimeType: 'application/zip'
}
```

---

### Webpages

Each webpage belongs to a single Website. It must have a unique slug, with the default home page value being `/`

The following DTO is used for creating and updating webpages.

#### Types: `WebpageCreateDto`, `WebpageUpdateDto (All properties optional)`

| Property | Type | Default | Max Length | Notes |
| :-- | :-- | :-- | :-- | :-- |
| `name` | string | `My webpage`| 150 | Name for your own reference |
| `slug` | string | `/` | 500 | Any valid slug path (valid chars???) |
| `websiteId` | string | - | 32 | Required |
| `publish` | boolean | false | - | Auto publishes the page
| `redirectUrl` | string? | - | 500 | Any valid URL either relative or external  |
| `draftHtml` | string? | - | 1MB | Draft HTML content remains in draft until published  |
| `previewHtml` | string? | - | 1MB | Preview HTML is viewable immediately using the URL returned by the create or update method  |

#### Method: `createWebpage(webpage?: WebpageDto, tenantId?: string): Promise<WebpageEntity>`

> Creates a new webpage. `name`, `slug` and `websiteId` are required properties.

```typescript
//
// Example: Create a draft version of a webpage
//
const webpage = await pageBlade.createWebpage({
    name: 'Home Page',
    slug: '/',
    websiteId: websiteId,
    draftHtml: '<html><body>Home</body></html>',
});
```

> Example response:
```javascript
// WebpageEntity:
{
  id: '23fteapYjMlgighjYO5oB8GfJ3nSrY4q',
  slug: '/',
  name: 'Home Page',
  whenCreated: 1636212523899,
  whenPublished: null,
  whenUpdated: 1636212524246,
  whenDraftSaved: 1636212524243,
  whenPreviewPublished: null,
  redirectUrl: null,
  publishedUrl: null,
  previewUrl: null,
  draftUrl: 'https://amazing.pageblade.site/?eapY=draft',
  websiteId: 'wD9agU5FESFFRRah5AbITxQLnHgIxzbc',
  publishedVersions: [],
  tenantId: '9ZNyebUTK0O5dQicKHMCvrADaNlTXMGB'
}
```

#### Method: `updateWebpage(webpageId: string, webpage: Webpageto): Promise<WebpageEntity>`

> Updates an existing webpage by passing the webpage ID and a DTO.

```typescript
//
// Example: Update Webpage slug
//
const webpage = await pageBlade.updateWebpage(
    webpageId,
    {
        slug: '/moved-here',
    },
);

console.log(webpage);
```

> Example response:
```javascript
// WebpageEntity:
{
  id: '23fteapYjMlgighjYO5oB8GfJ3nSrY4q',
  slug: '/moved-here',
  name: 'Home Page',
  whenCreated: 1636212523899,
  whenPublished: null,
  whenUpdated: 1636212524289,
  whenDraftSaved: 1636212524243,
  whenPreviewPublished: null,
  redirectUrl: null,
  publishedUrl: null,
  previewUrl: null,
  draftUrl: 'https://amazing.pageblade.site/moved-here?eapY=draft',
  websiteId: 'wD9agU5FESFFRRah5AbITxQLnHgIxzbc',
  publishedVersions: [],
  tenantId: '9ZNyebUTK0O5dQicKHMCvrADaNlTXMGB'
}
```

> Updates an existing webpage draft HTML.

```typescript
//
// Example: Update Webpage draft HTML
//
const webpage = await pageBlade.updateWebpage(
    webpageId,
    {
        draftHtml: '<html><body>Home Updated</body></html>',
    },
);

console.log(webpage);
```

> Example response, note the `draftUrl` property can be used to view the draft version:
```javascript
// WebpageEntity:
{
  id: '23fteapYjMlgighjYO5oB8GfJ3nSrY4q',
  slug: '/moved-here',
  name: 'Home Page',
  whenCreated: 1636212523899,
  whenPublished: null,
  whenUpdated: 1636212524684,
  whenDraftSaved: 1636212524681,
  whenPreviewPublished: null,
  redirectUrl: null,
  publishedUrl: null,
  previewUrl: null,
  draftUrl: 'https://amazing.pageblade.site/moved-here?eapY=draft',
  websiteId: 'wD9agU5FESFFRRah5AbITxQLnHgIxzbc',
  publishedVersions: [],
  tenantId: '9ZNyebUTK0O5dQicKHMCvrADaNlTXMGB'
}
```

> Updates an existing webpage preview HTML.

```typescript
//
// Example: Update Webpage draft HTML
//
const webpage = await pageBlade.updateWebpage(
    webpageId,
    {
        previewHtml: '<html><body>Just checking to see how this looks!</body></html>',
    },
);

console.log(webpage);
```

> Example response, note the `previewUrl` is now available:
```javascript
// WebpageEntity:
{
  id: '23fteapYjMlgighjYO5oB8GfJ3nSrY4q',
  slug: '/moved-here',
  name: 'Home Page',
  whenCreated: 1636212523899,
  whenPublished: null,
  whenUpdated: 1636212525032,
  whenDraftSaved: 1636212524681,
  whenPreviewPublished: 1636212525030,
  redirectUrl: null,
  publishedUrl: null,
  previewUrl: 'https://amazing.pageblade.site/moved-here?eapY=preview',
  draftUrl: 'https://amazing.pageblade.site/moved-here?eapY=draft',
  websiteId: 'wD9agU5FESFFRRah5AbITxQLnHgIxzbc',
  publishedVersions: [],
  tenantId: '9ZNyebUTK0O5dQicKHMCvrADaNlTXMGB'
}
```

#### Method: `publishDraft(webpageId: string, tenantId?: string): Promise<WebpageEntity>`

> Publishes the current draft version of the page.

> Note: To view any previously published version of a page, append `?published={version}` to the URL.

```typescript
//
// Example: Publish draft version of webpage
//
const webpage = await pageBlade.publishDraft(webpageId);

console.log(webpage);

return webpage;
```

> Example response, note the `publishedUrl` is now available and an entry in the `publishedVersions` array.
```javascript
// WebpageEntity:
{
  id: '23fteapYjMlgighjYO5oB8GfJ3nSrY4q',
  slug: '/moved-here',
  name: 'Home Page',
  whenCreated: 1636212523899,
  whenPublished: 1636212525070,
  whenUpdated: 1636212525318,
  whenDraftSaved: 1636212524681,
  whenPreviewPublished: 1636212525030,
  redirectUrl: null,
  publishedUrl: 'https://amazing.pageblade.site/moved-here',
  previewUrl: 'https://amazing.pageblade.site/moved-here?eapY=preview',
  draftUrl: 'https://amazing.pageblade.site/moved-here?eapY=draft',
  websiteId: 'wD9agU5FESFFRRah5AbITxQLnHgIxzbc',
  publishedVersions: [ 1636212525070 ],
  tenantId: '9ZNyebUTK0O5dQicKHMCvrADaNlTXMGB'
}
```

#### Method: `publishVersion(webpageId: string, version: number, tenantId?: string): Promise<WebpageEntity>`

> Publishes a previously published version of the page.

```typescript
//
// Example: Publish previously published version of webpage
//
const webpage = await pageBlade.publishVersion(webpageId, version);

console.log(webpage);
```

> Example response:
```javascript
// WebpageEntity:
{
  id: '23fteapYjMlgighjYO5oB8GfJ3nSrY4q',
  slug: '/moved-here',
  name: 'Home Page',
  whenCreated: 1636212523899,
  whenPublished: 1636212525070,
  whenUpdated: 1636212525318,
  whenDraftSaved: 1636212524681,
  whenPreviewPublished: 1636212525030,
  redirectUrl: null,
  publishedUrl: 'https://amazing.pageblade.site/moved-here',
  previewUrl: 'https://amazing.pageblade.site/moved-here?eapY=preview',
  draftUrl: 'https://amazing.pageblade.site/moved-here?eapY=draft',
  websiteId: 'wD9agU5FESFFRRah5AbITxQLnHgIxzbc',
  publishedVersions: [ 1636212525070 ],
  tenantId: '9ZNyebUTK0O5dQicKHMCvrADaNlTXMGB'
}
```

#### Method: `duplicateWebpage(webpageId: string, tenantId?: string): Promise<WebpageEntity>`

> Duplicates a webpage by passing the webpage ID. The slug is appended to ensure unique.

```typescript
//
// Example: Duplicate Webpage
//
const duplicatedWebpage = await pageBlade.duplicateWebpage(webpageId);

console.log(duplicatedWebpage);

return duplicatedWebpage;
```
> Example response:
```javascript
// WebpageEntity:
{
  id: 'kRIf6cNwrlI7CABuGwLAt6BwxMVQlCIQ',
  slug: '/moved-here-copy',
  name: 'Home Page copy',
  whenCreated: 1636212525516,
  whenPublished: null,
  whenUpdated: 1636212525516,
  whenDraftSaved: 1636212524681,
  whenPreviewPublished: 1636212525030,
  redirectUrl: null,
  publishedUrl: null,
  previewUrl: 'https://amazing.pageblade.site/moved-here-copy?6cNw=preview',
  draftUrl: 'https://amazing.pageblade.site/moved-here-copy?6cNw=draft',
  websiteId: 'wD9agU5FESFFRRah5AbITxQLnHgIxzbc',
  publishedVersions: [ 1636212525070 ],
  tenantId: '9ZNyebUTK0O5dQicKHMCvrADaNlTXMGB'
}
```

#### Method: `deleteWebpage(webpageId: string, tenantId?: string): Promise<void>`

>Deletes a webpage by passing the webpage ID.

```typescript
//
// Example: Delete Webpage
//
await pageBlade.deleteWebpage(webpageId);
```

#### Method: `getWebpage(webpageId: string, tenantId?: string): Promise<WebpageEntity>`

> Retrieves a single webpage for the passed webpage ID.

```typescript
//
// Example: Get Webpage
//
const webpage = await pageBlade.getWebpage(webpageId);

console.log(webpage);
```
> Example response:
```javascript
// WebpageEntity:
{
  id: '23fteapYjMlgighjYO5oB8GfJ3nSrY4q',
  slug: '/moved-here',
  name: 'Home Page',
  whenCreated: 1636212523899,
  whenPublished: 1636212525070,
  whenUpdated: 1636212525318,
  whenDraftSaved: 1636212524681,
  whenPreviewPublished: 1636212525030,
  redirectUrl: null,
  publishedUrl: 'https://amazing.pageblade.site/moved-here',
  previewUrl: 'https://amazing.pageblade.site/moved-here?eapY=preview',
  draftUrl: 'https://amazing.pageblade.site/moved-here?eapY=draft',
  websiteId: 'wD9agU5FESFFRRah5AbITxQLnHgIxzbc',
  publishedVersions: [ 1636212525070 ],
  tenantId: '9ZNyebUTK0O5dQicKHMCvrADaNlTXMGB'
}
```

#### Method: `getWebpages(paginatedRequest: PaginatedWebpageDto, tenantId?: string): Promise<PaginatedWebpageEntity>`

> Retrieves a page of webpages for the passed website default or passed tenant ID.

```typescript
//
// Example: Get a single page of Webpages
//
const webpages = await pageBlade.getWebpages({
    websiteId,
    orderBy: 'whenCreated',
    orderDirection: ORDER_DIRECTION.ASC,
    pageIndex: 0,
    pageSize: 10,
});

console.log(webpages);
```
> Example response:
```javascript
{
  nextPageUrl: null,
  totalRowsCount: 1,
  rows: [
    {
      id: '23fteapYjMlgighjYO5oB8GfJ3nSrY4q',
      slug: '/moved-here',
      name: 'Home Page',
      whenCreated: 1636212523899,
      whenPublished: 1636212525070,
      whenUpdated: 1636212525318,
      whenDraftSaved: 1636212524681,
      whenPreviewPublished: 1636212525030,
      redirectUrl: null,
      publishedUrl: 'https://amazing.pageblade.site/moved-here',
      previewUrl: 'https://amazing.pageblade.site/moved-here?eapY=preview',
      draftUrl: 'https://amazing.pageblade.site/moved-here?eapY=draft',
      websiteId: 'wD9agU5FESFFRRah5AbITxQLnHgIxzbc',
      publishedVersions: [Array],
      tenantId: '9ZNyebUTK0O5dQicKHMCvrADaNlTXMGB'
    }
  ],
  totalPagesCount: 1,
  pageIndex: 0,
  pageSize: 10,
  orderBy: 'whenCreated'
}
```

#### Method: `getWebpageDraftHtml(webpageId: string, tenantId?: string): Promise<HtmlEntity>`

> Retrieves the HTML for the draft version of the page.

```typescript
//
// Example: Get Webpage draft HTML
//
const html = await pageBlade.getWebpageDraftHtml(webpageId);

console.log(html);
```
> Example response:
```javascript
{ html: '<html><body>Draft html</body></html>' }
```

#### Method: `getWebpagePublishedHtml(webpageId: string, tenantId?: string): Promise<HtmlEntity>`

> Retrieves the HTML for the published version of the page.

```typescript
//
// Example: Get Webpage published HTML
//
const html = await pageBlade.getWebpagePublishedHtml(webpageId);

console.log(html);
```
> Example response:
```javascript
{ html: '<html><body>Home Updated</body></html>' }
```

#### Method: `getWebpagePublishedVersionHtml(webpageId: string, version: number, tenantId?: string): Promise<HtmlEntity>`

> Retrieves the HTML for a previously published version of the page.

```typescript
//
// Example: Get Webpage previously published version HTML
//
const html = await pageBlade.getWebpagePublishedVersionHtml(webpageId, version);

console.log(html);
```
> Example response:
```javascript
{ html: '<html><body>Previously Published html</body></html>' }
```

---
### Assets

Assets storage is available for all your images, CSS and JS files and are allocated to a website for access on any of the associated webpages using a relative or full URL path.
#### Method: `uploadAsset(websiteId: string, data: Readable | Buffer, filename: string, contentType: string, tenantId?: string): Promise<AssetEntity>`

> Uploads a new asset.

```typescript
//
// Example: Upload asset using file stream
//
const stream = fs.createReadStream('image.png');
const asset = await pageBlade.uploadAsset(websiteId, stream, 'image.png', 'image/png');

console.log(asset);
```

> Example response:
```javascript
// AssetEntity:
{
  id: 'GHvvsIPbY37kCeopIwR3Jy5SOb6cFTtP',
  slug: '/assets/images/image.png',
  whenCreated: 1636214085343,
  whenUpdated: 1636214085343,
  bytes: 71065,
  websiteId: 'Oa6eqbuCdixoZbl7MJa6su3ptkIokrIr',
  filename: 'image.png',
  url: 'https://amazing.pageblade.site/assets/images/image.png',
  contentType: 'image/png',
  tenantId: '9ZNyebUTK0O5dQicKHMCvrADaNlTXMGB'
}
```

#### Method: `getAsset(assetId: string, tenantId?: string): Promise<AssetEntity>`

> Retrieves details of an existing asset.

```typescript
//
// Example: Get Asset
//
const asset = await pageBlade.getAsset(assetId);

console.log(asset);
```

> Example response:
```javascript
// AssetEntity:
{
  id: 'GHvvsIPbY37kCeopIwR3Jy5SOb6cFTtP',
  slug: '/assets/images/image.png',
  whenCreated: 1636214085343,
  whenUpdated: 1636214085343,
  bytes: 71065,
  websiteId: 'Oa6eqbuCdixoZbl7MJa6su3ptkIokrIr',
  filename: 'image.png',
  url: 'https://amazing.pageblade.site/assets/images/image.png',
  contentType: 'image/png',
  tenantId: '9ZNyebUTK0O5dQicKHMCvrADaNlTXMGB'
}
```

#### Method: `getAssets(paginatedRequest?: PaginatedAssetDto, tenantId?: string): Promise<PaginatedAssetEntity>`

> Retrieves a single page of assets.

```typescript
//
// Example: Get a single page of Assets
//
const assets = await pageBlade.getAssets({
    websiteId,
    orderBy: 'whenCreated',
    orderDirection: ORDER_DIRECTION.ASC,
    pageIndex: 0,
    pageSize: 10,
});

console.log(assets);
```

> Example response:
```javascript
{
  nextPageUrl: null,
  totalRowsCount: 1,
  rows: [
    {
      id: 'GHvvsIPbY37kCeopIwR3Jy5SOb6cFTtP',
      slug: '/assets/images/image.png',
      whenCreated: 1636214085343,
      whenUpdated: 1636214085343,
      bytes: 71065,
      websiteId: 'Oa6eqbuCdixoZbl7MJa6su3ptkIokrIr',
      filename: 'image.png',
      url: 'https://amazing.pageblade.site/assets/images/image.png',
      contentType: 'image/png',
      tenantId: '9ZNyebUTK0O5dQicKHMCvrADaNlTXMGB'
    }
  ],
  totalPagesCount: 1,
  pageIndex: 0,
  pageSize: 10,
  orderBy: 'whenCreated'
}
```


#### Method: `deleteAsset(assetId: string, tenantId?: string): Promise<void>`

>Deletes an asset by passing the asset ID.

```typescript
//
// Example: Delete Asset
//
await pageBlade.deleteAsset(assetId);
```

---
### Statistics

Retrieve statistics for either the passed tenant ID or for the entire account.
#### Method: `getStatistics(tenantId?: string): Promise<StatisticsEntity>`

> Gets statistics for the account. Storage and bandwidth usage is defined in whole MB.

```typescript
//
// Example: Get statistics for account (all tenants)
//
const statistics = await pageBlade.getStatistics();

console.log(statistics);
```

> Example response:
```javascript
// StatisticsEntity:
{
  bandwidth: { limitMb: 1000, usedMb: 0, remainingMb: 1000 },
  storage: { limitMb: 1000, usedMb: 0, remainingMb: 1000 },
  websites: { limit: 1000, used: 2, remaining: 998 },
  tenants: { limit: 1000, used: 1, remaining: 999 }
}
```

> Gets statistics for the individual tenant ID.

```typescript
//
// Example: Get statistics for a single tenant
//
const statistics = await pageBlade.getStatistics(tenantId);

console.log(statistics);
```

> Example response:
```javascript
// StatisticsEntity:
{
  bandwidth: { limitMb: 1000, usedMb: 0, remainingMb: 1000 },
  storage: { limitMb: 1000, usedMb: 0, remainingMb: 1000 },
  websites: { limit: 1000, used: 2, remaining: 998 },
  tenantId: '58IKD1P86CTkRyjsvBLWcWnFhkNLkGA9'
}
```

---
### Tenants

All accounts have an associated default tenant. The tenant is the container for all websites, webpages, assets and tracking data.

Unless you are developing a multi-tenant application, it is unlikely you will need to specify the tenant ID, as the default tenant ID is used where unspecified.

Tenants allow you to provided completely isolated containers for your users. You can assign limits to restrict usage on bandwidth, storage and so on. It is important to provide the appropriate limiting values to your tenants so as not to exhaust your account.

Although it will accept any values, ultimately, they will not be allowed to exceed those defined in your account.

Most methods have an optional `tenantId`. On **create** methods, this will allocate the object to the tenant and on **read** methods, it will only return objects that belong to the tenant.

Note storage and bandwidth limits are defined in whole MB.

#### Method: `createTenant(tenant: TenantCreateDto): Promise<TenantEntity>`

> Creates a new tenant using the DTO.

```typescript
//
// Example: Create Tenant
//
const tenant = await pageBlade.createTenant({
    name: 'Mega Store',
    bandwidthLimit: 10000000,
    storageLimit: 100000000,
    websitesLimit: 10,
    customDomains: false,
});

console.log(tenant);
```

> Example response:
```javascript
{
  id: 'dYQEbRWekbbFOcTnRx45iDkfQYbhYSN6',
  name: 'Mega Store',
  bandwidthLimitMb: 10000000,
  storageLimitMb: 100000000,
  websitesLimit: 10,
  whenCreated: 1636294825679,
  whenUpdated: 1636294825679,
  customDomains: false,
  websiteAssetsLimit: 1000,
  websitePagesLimit: 1000
}
```

#### Method: `updateTenant(tenant: TenantUpdateDto, tenantId?: string): Promise<WebpageEntity>`

> Updates an existing tenant using the DTO.

```typescript
//
// Example: Update Tenant to limit the number of websites allowed to 1
//
const tenant = await pageBlade.updateTenant(
    {
        websitesLimit: 1,
    },
    tenantId,
);

console.log(tenant);
```

> Example response:
```javascript
{
  id: 'dYQEbRWekbbFOcTnRx45iDkfQYbhYSN6',
  name: 'Mega Store',
  bandwidthLimitMb: 10000000,
  storageLimitMb: 100000000,
  websitesLimit: 1,
  whenCreated: 1636294825679,
  whenUpdated: 1636294825715,
  customDomains: false,
  websiteAssetsLimit: 1000,
  websitePagesLimit: 1000
}
```

#### Method: `getTenant(tenantId: string): Promise<TenantEntity>`

> Retrieves tenant details.

```typescript
//
// Example: Get Tenant
//
const tenant = await pageBlade.getTenant(tenantId);

console.log(tenant);
```

> Example response:
```javascript
{
  id: 'dYQEbRWekbbFOcTnRx45iDkfQYbhYSN6',
  name: 'Mega Store',
  bandwidthLimitMb: 10000000,
  storageLimitMb: 100000000,
  websitesLimit: 1,
  whenCreated: 1636294825679,
  whenUpdated: 1636294825715,
  customDomains: false,
  websiteAssetsLimit: 1000,
  websitePagesLimit: 1000
}
```

#### Method: `getTenants(paginatedRequest?: PaginatedTenantDto): Promise<PaginatedTenantEntity>`

> Retrieves a single page of tenants.

```typescript
//
// Example: Get a single page of Tenants
//
const tenants = await pageBlade.getTenants({
    orderBy: 'whenCreated',
    orderDirection: ORDER_DIRECTION.ASC,
    pageIndex: 0,
    pageSize: 3,
});

console.log(tenants);
```

> Example response:
```javascript
{
  nextPageUrl: null,
  totalRowsCount: 2,
  rows: [
  {
      id: '58IKD1P86CTkRyjsvBLWcWnFhkNLkGA9',
      name: 'Default',
      bandwidthLimitMb: 1000,
      storageLimitMb: 1000,
      websitesLimit: 1000,
      whenCreated: 1636280236583,
      whenUpdated: 1636280236583,
      customDomains: true,
      websiteAssetsLimit: 1000,
      websitePagesLimit: 1000
    },
    {
      id: 'dYQEbRWekbbFOcTnRx45iDkfQYbhYSN6',
      name: 'Mega Store',
      bandwidthLimitMb: 10000000,
      storageLimitMb: 100000000,
      websitesLimit: 1,
      whenCreated: 1636294825679,
      whenUpdated: 1636294825715,
      customDomains: false,
      websiteAssetsLimit: 1000,
      websitePagesLimit: 1000
    }
  ],
  totalPagesCount: 1,
  pageIndex: 0,
  pageSize: 3,
  orderBy: 'whenCreated'
}
```

#### Method: `deleteTenant(tenantId: string): Promise<void>`

> Deletes a single tenant for the passed ID.

```typescript
//
// Example: Delete Tenant
//
await pageBlade.deleteTenant(tenantId);
```

---
### Pagination

Tenants, Websites, Webpages and Assets all implement common request and response attributes for pagination, all attributes being optional.

`pageIndex` starts from zero for the first page of results.

`pageSize` can accept a value between 1 and 100.

`keyword` allows you to filter results based on a keyword match in the named entity.

`orderBy` value is dependent on the entity type, though always includes `whenCreated` and `whenUpdated`

`orderDirection` can be either `ORDER_DIRECTION.ASC` or `ORDER_DIRECTION.DESC`

```typescript
// Example: PaginatedWebpageDto
{
    pageIndex?: number;
    pageSize?: number;
    keyword?: string;
    orderBy?: 'whenCreated' | 'whenUpdated' | 'whenPublished' | 'slug' | 'redirectUrl';
    orderDirection?: ORDER_DIRECTION;
};
```
> The common response format:
```javascript
export type PaginatedBaseEntity<T> = {
    nextPageUrl: string;
    orderBy: string;
    pageIndex: number;
    pageSize: number;
    rows: T[];
    totalPagesCount: number;
    totalRowsCount: number;
};
```

---
### Rate Limiting

The PageBlade API implements request rate limiting. This SDK uses [Got](https://www.npmjs.com/package/got) as the http client and is configured to respect the `retry-after` header response, retrying the request after the elapsed period.

It is therefore recommended to execute methods sequentially to reduce the chance of a request failing completely.

The rate limiting configuration on the PageBlade server may vary, though the actual limits are exposed in the response headers as `X-Rate-Limit-Limit`, `X-Retry-Remaining` and `X-Retry-Reset`.

---
### Timestamps

All timestamps, `whenUpdated`, `whenCreated` and others are in Unix Timestamp milliseconds format (UTC).


---
### Error Handling

It is recommended to wrap all requests in a `try {} catch () {}` The SDK will present the error code and message as sent from the API call, for example:

```typescript
// Attempt to retrieve website
try {
    await pageBlade.getWebsite('invalid-id');
} catch (error) {
    console.log(error);
}

// Response:
Error: website not found
code: 404
```


---
### Bandwidth

The hosting engine tracks outbound bandwidth use over a rolling 30 days. The current usage can be checked using the [statistics](#statistics) methods. If a request for a page or asset takes the total usage over the limits specified in either the tenant or user account, the visitor will receive a `509 Bandwidth Exceeded` error.

---
### Roadmap


**November 2021**
  - SDK available
  - Public access for free accounts

**December 2021**
  - Development and Production ready accounts activated:
    - Custom domains
    - Visitor tracking analytics

**January 2022**
  - Enterprise accounts activated:
    - Multi-tenant accounts
    - White-labeled subdomain hosting

---

### Suggestions & Discussions

Suggestions to improve PageBlade and to discuss current features are welcome! [Start a discussion](https://github.com/scoritz/pageblade-sdk/discussions).

---
### SDK Contributions

Contributions, enhancements, and bug-fixes are welcome!  [Open an issue](https://github.com/scoritz/pageblade-sdk/issues) on GitHub and [submit a pull request](https://github.com/scoritz/pageblade-sdk/pulls).

---
### Building
To build the project locally on your computer:

1. __Clone this repo__<br>
`git clone https://github.com/scoritz/pageblade-sdk.git`

2. __Install dependencies__<br>
`npm install`

3. __Build the code__<br>
`npm run build`

---

### License

pageblade-sdk is open-source, under the [MIT license](LICENSE).
