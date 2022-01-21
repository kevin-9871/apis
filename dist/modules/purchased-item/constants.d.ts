export declare const PURCHASE_ITEM_TYPE: {
    SALE_VIDEO: string;
    PRODUCT: string;
    PHOTO: string;
    TIP: string;
    PRIVATE: string;
    GROUP: string;
};
export declare enum PurchaseItemType {
    SALE_VIDEO = "sale_video",
    PRODUCT = "sale_product",
    PHOTO = "sale_photo",
    TIP = "tip",
    PRIVATE = "stream_private",
    GROUP = "stream_group"
}
export declare const PURCHASE_ITEM_STATUS: {
    PENDING: string;
    SUCCESS: string;
    CANCELLED: string;
};
export declare const PURCHASE_ITEM_TARGET_TYPE: {
    PRODUCT: string;
    VIDEO: string;
    PHOTO: string;
    TIP: string;
    PRIVATE: string;
    GROUP: string;
};
export declare const ORDER_TOKEN_STATUS: {
    PROCESSING: string;
    SHIPPING: string;
    DELIVERED: string;
    REFUNDED: string;
};
export declare enum PURCHASE_ITEM_TARGET_SOURCE {
    USER = "user"
}
export declare const PURCHASED_ITEM_SUCCESS_CHANNEL = "PURCHASED_ITEM_SUCCESS_CHANNEL";
export declare const OVER_PRODUCT_STOCK = "OVER_PRODUCT_STOCK";
export declare const ITEM_NOT_PURCHASED = "ITEM_NOT_PURCHASED";
