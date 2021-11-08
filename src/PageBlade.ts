import { Readable } from 'stream';
import got, { Method, Options } from 'got';

import {
    PaginatedAssetDto,
    PaginatedTenantDto,
    PaginatedWebpageDto,
    PaginatedWebsiteDto,
    TenantCreateDto,
    TenantUpdateDto,
    WebpageCreateDto,
    WebpageUpdateDto,
    WebsiteCreateDto,
    WebsiteUpdateDto,
} from './dto';
import {
    AssetEntity,
    HtmlEntity,
    PaginatedAssetEntity,
    PaginatedWebpageEntity,
    PaginatedWebsiteEntity,
    WebpageEntity,
    WebsiteEntity,
    PaginatedTenantEntity,
    TenantEntity,
    StatisticsEntity,
    DownloadEntity,
} from './entities';
import { PageBladeError } from './errors/PageBladeError';
import { IConfig } from './interfaces';
import { API_URL } from './constants';

export class PageBlade {

    constructor(private config?: IConfig) { }

    // Websites
    public async createWebsite(website?: WebsiteCreateDto, tenantId?: string): Promise<WebsiteEntity> {
        return this.post('website', website, tenantId);
    }

    public async updateWebsite(
        websiteId: string,
        website: WebsiteUpdateDto,
        tenantId?: string,
    ): Promise<WebsiteEntity> {
        return this.put(`website/${websiteId}`, website, tenantId);
    }

    public async duplicateWebsite(websiteId: string, tenantId?: string): Promise<WebsiteEntity> {
        return this.post(`website/${websiteId}`, null, tenantId);
    }

    public async deleteWebsite(websiteId: string, tenantId?: string): Promise<void> {
        return this.delete(`website/${websiteId}`, tenantId);
    }

    public async getWebsite(websiteId: string, tenantId?: string): Promise<WebsiteEntity> {
        return this.get(`website/${websiteId}`, null, tenantId);
    }

    public async getWebsites(
        paginatedRequest?: PaginatedWebsiteDto,
        tenantId?: string,
    ): Promise<PaginatedWebsiteEntity> {
        return this.get('websites', paginatedRequest, tenantId);
    }

    public async downloadWebsite(websiteId: string, tenantId?: string): Promise<DownloadEntity> {
        return this.get(`website/download/${websiteId}`, null, tenantId);
    }

    // Webpages
    public async createWebpage(webpage: WebpageCreateDto, tenantId?: string): Promise<WebpageEntity> {
        return this.post('webpage', webpage, tenantId);
    }

    public async updateWebpage(
        webpageId: string,
        webpage: WebpageUpdateDto,
        tenantId?: string,
    ): Promise<WebpageEntity> {
        return this.put(`webpage/${webpageId}`, webpage, tenantId);
    }

    public async publishDraft(webpageId: string, tenantId?: string): Promise<WebpageEntity> {
        return this.post(`webpage/publish/${webpageId}`, null, tenantId);
    }

    public async publishVersion(webpageId: string, version: number, tenantId?: string): Promise<WebpageEntity> {
        return this.post(`webpage/publish/${webpageId}/version/${version}`, null, tenantId);
    }

    public async duplicateWebpage(webpageId: string, tenantId?: string): Promise<WebpageEntity> {
        return this.post(`webpage/${webpageId}`, null, tenantId);
    }

    public async deleteWebpage(webpageId: string, tenantId?: string): Promise<void> {
        return this.delete(`webpage/${webpageId}`, tenantId);
    }

    public async getWebpage(webpageId: string, tenantId?: string): Promise<WebpageEntity> {
        return this.get(`webpage/${webpageId}`, null, tenantId);
    }

    public async getWebpages(
        paginatedRequest?: PaginatedWebpageDto,
        tenantId?: string,
    ): Promise<PaginatedWebpageEntity> {
        return this.get('webpages', paginatedRequest, tenantId);
    }

    public async getWebpageDraftHtml(webpageId: string, tenantId?: string): Promise<HtmlEntity> {
        return this.get(`webpage/html/draft/${webpageId}`, null, tenantId);
    }

    public async getWebpagePublishedHtml(webpageId: string, tenantId?: string): Promise<HtmlEntity> {
        return this.get(`webpage/html/published/${webpageId}`, null, tenantId);
    }

    public async getWebpagePublishedVersionHtml(
        webpageId: string,
        version: number,
        tenantId?: string,
    ): Promise<HtmlEntity> {
        return this.get(`webpage/html/published/${webpageId}/version/${version}`, null, tenantId);
    }

    // Assets
    public async uploadAsset(
        websiteId: string,
        data: Readable | Buffer,
        filename: string,
        contentType: string,
        tenantId?: string,
    ): Promise<AssetEntity> {
        return this.post(`asset/${websiteId}/${filename}`, data, tenantId, filename, contentType);
    }

    public async getAsset(assetId: string, tenantId?: string): Promise<AssetEntity> {
        return this.get(`asset/${assetId}`, tenantId);
    }

    public async getAssets(paginatedRequest?: PaginatedAssetDto, tenantId?: string): Promise<PaginatedAssetEntity> {
        return this.get('assets', paginatedRequest, tenantId);
    }

    public async deleteAsset(assetId: string, tenantId?: string): Promise<void> {
        return this.delete(`asset/${assetId}`, tenantId);
    }

    // Statistics
    public async getStatistics(tenantId?: string): Promise<StatisticsEntity> {
        const command = tenantId ? 'statistics/tenant' : 'statistics';
        return this.get(command, null, tenantId);
    }

    // Tenants
    public async getTenants(paginatedRequest?: PaginatedTenantDto): Promise<PaginatedTenantEntity> {
        return this.get('tenants', paginatedRequest);
    }

    public async getTenant(tenantId: string): Promise<TenantEntity> {
        return this.get('tenant', tenantId);
    }

    public async createTenant(tenant: TenantCreateDto): Promise<TenantEntity> {
        return this.post('tenant', tenant);
    }

    public async updateTenant(tenant: TenantUpdateDto, tenantId?: string): Promise<WebpageEntity> {
        return this.put('tenant', tenant, tenantId);
    }

    public async deleteTenant(tenantId: string): Promise<void> {
        return this.delete('tenant', tenantId);
    }

    // Private
    private async get(command: string, qs: any, tenantId?: string): Promise<any> {
        return this.request('GET', command, qs, null, tenantId);
    }

    private async put(command: string, data: any, tenantId?: string): Promise<any> {
        return this.request('PUT', command, null, data, tenantId);
    }

    private async post(
        command: string,
        data: any,
        tenantId?: string,
        filename?: string,
        contentType?: string,
    ): Promise<any> {
        return this.request('POST', command, null, data, tenantId, filename, contentType);
    }

    private async delete(command: string, tenantId?: string): Promise<any> {
        return this.request('DELETE', command, null, null, tenantId);
    }

    private async request(
        method: Method,
        command: string,
        qs: any,
        data: any,
        tenantId?: string,
        filename?: string,
        contentType?: string,
    ): Promise<any> {
        const options: Options = {
            method,
            url: `${process.env.PAGEBLADE_URL || API_URL}/${command}`,
            responseType: 'json',
            resolveBodyOnly: true,
            headers: {
                'x-api-key': this.config?.apiKey || process.env.PAGEBLADE_API_KEY,
                'x-tenant-id': tenantId || this.config?.defaultTenantId,
                'content-type': filename ? contentType : 'application/json',
            },
            https: { rejectUnauthorized: false },
            searchParams: qs || undefined,
            retry: {
                methods: ['GET', 'POST', 'DELETE', 'PUT'],
                statusCodes: [429],
            },
        };
        if (data && (method === 'POST' || method === 'PUT')) {
            if (filename) {
                options.body = data;
            } else {
                options.json = data;
            }
        }
        let response;
        try {
            response = await got(options);
        } catch (error: any) {
            throw new PageBladeError(
                error.response?.statusCode,
                error.response?.body?.message,
            );
        }
        return response;
    }

}
