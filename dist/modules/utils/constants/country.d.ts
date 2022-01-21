export declare const REGIONS: {
    name: string;
    code: string;
}[];
export declare const COUNTRIES: ({
    name: string;
    code: string;
    capital: string;
    region: string;
    currency: {
        code: string;
        name: string;
        symbol: string;
    };
    language: {
        code: string;
        name: string;
        iso639_2?: undefined;
        nativeName?: undefined;
    };
    flag: string;
    demonym?: undefined;
} | {
    name: string;
    code: string;
    capital: string;
    region: string;
    currency: {
        code: string;
        name: string;
        symbol: string;
    };
    language: {
        code: string;
        iso639_2: string;
        name: string;
        nativeName: string;
    };
    flag: string;
    demonym?: undefined;
} | {
    name: string;
    code: string;
    capital: string;
    region: string;
    demonym: string;
    currency: {
        code: string;
        name: string;
        symbol: string;
    };
    language: {
        code: string;
        name: string;
        iso639_2?: undefined;
        nativeName?: undefined;
    };
    flag: string;
})[];
