
export type WebpageBaseDto = {
    name: string;
    slug: string;
    websiteId: string;
    publish?: boolean;
    redirectUrl?: string;
    draftHtml?: string;
    previewHtml?: string;
};

export type WebpageCreateDto = WebpageBaseDto;
export type WebpageUpdateDto = Partial<WebpageBaseDto>;
