
export type WebsiteBaseDto = {
    name: string;
    description: string;
    enabled: boolean;
    subdomain: string;
    domain: string;
};

export type WebsiteCreateDto = Partial<WebsiteBaseDto>;
export type WebsiteUpdateDto = Omit<Partial<WebsiteBaseDto>, 'homePageHtml, autoPublish'>;
