import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Product {
    id: string;
    categoryId: string;
    weight: bigint;
    status: ProductStatus;
    featured: boolean;
    order: bigint;
    name: string;
    description: string;
    sizes: Array<Size>;
    colors: Array<Color>;
    price: bigint;
    images: Array<ExternalBlob>;
}
export interface Category {
    id: string;
    order: bigint;
    name: string;
    description: string;
}
export interface Address {
    zip: string;
    street: string;
    country: string;
    city: string;
    name: string;
    state: string;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface ContactForm {
    name: string;
    email: string;
    message: string;
    timestamp: bigint;
}
export interface AnnouncementBanner {
    enabled: boolean;
    message: string;
}
export interface SocialLinks {
    tiktok: string;
    twitch: string;
    instagram: string;
    kick: string;
    youtube: string;
}
export interface HeroSection {
    tagline: string;
    headline: string;
    image?: ExternalBlob;
}
export interface Order {
    id: string;
    status: string;
    total: bigint;
    userId: Principal;
    printifyCost?: bigint;
    shippingOption: ShippingOption;
    timestamp: bigint;
    shippingAddress: Address;
    products: Array<Product>;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface ShippingRates {
    usEconomyBase: bigint;
    restOfWorldPerItem: bigint;
    usStandardPerItem: bigint;
    australiaPerItem: bigint;
    canadaPerItem: bigint;
    restOfWorldBase: bigint;
    canadaBase: bigint;
    australiaBase: bigint;
    usEconomyPerItem: bigint;
    usExpressPerItem: bigint;
    usExpressBase: bigint;
    usStandardBase: bigint;
}
export type Color = string;
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export interface NewsletterSubscriber {
    signupDate: bigint;
    email: string;
}
export interface UserProfile {
    name: string;
    email: string;
}
export interface ShippingOption {
    name: string;
    itemPrice: bigint;
    basePrice: bigint;
}
export enum ProductStatus {
    hidden = "hidden",
    available = "available",
    soldOut = "soldOut"
}
export enum Size {
    L = "L",
    M = "M",
    S = "S",
    XL = "XL",
    XXL = "XXL",
    XXXXXL = "XXXXXL",
    XXXL = "XXXL",
    XXXXL = "XXXXL"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addCategory(category: Category): Promise<void>;
    addProduct(product: Product): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    calculateShipping(destination: string, method: string, itemCount: bigint): Promise<bigint>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    createOrder(productList: Array<Product>, total: bigint, shippingAddress: Address, shippingOption: ShippingOption): Promise<Order | null>;
    deleteCategory(id: string): Promise<void>;
    deleteProduct(id: string): Promise<void>;
    getAllOrders(): Promise<Array<Order>>;
    getAllProductBulletPoints(): Promise<Array<[string, Array<string>]>>;
    getAnnouncementBanner(): Promise<AnnouncementBanner | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCategories(): Promise<Array<Category>>;
    getContactForms(): Promise<Array<ContactForm>>;
    getHeroSection(): Promise<HeroSection | null>;
    getNewsletterSubscribers(): Promise<Array<NewsletterSubscriber>>;
    getOrder(id: string): Promise<Order | null>;
    getProductBulletPoints(id: string): Promise<Array<string>>;
    getProducts(): Promise<Array<Product>>;
    getShippingRates(): Promise<ShippingRates>;
    getSocialLinks(): Promise<SocialLinks | null>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    reorderCategories(orderedIds: Array<string>): Promise<void>;
    reorderProducts(orderedIds: Array<string>): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setAnnouncementBanner(banner: AnnouncementBanner): Promise<void>;
    setHeroSection(section: HeroSection): Promise<void>;
    setProductBulletPoints(id: string, points: Array<string>): Promise<void>;
    setProductFeatured(id: string, featured: boolean): Promise<void>;
    setProductStatus(id: string, status: ProductStatus): Promise<void>;
    setShippingRates(rates: ShippingRates): Promise<void>;
    setSocialLinks(links: SocialLinks): Promise<void>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    submitContactForm(form: ContactForm): Promise<void>;
    subscribeToNewsletter(email: string): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateCategory(category: Category): Promise<void>;
    updateOrderCost(orderId: string, cost: bigint): Promise<void>;
    updateOrderStatus(orderId: string, status: string): Promise<void>;
    updateProduct(product: Product): Promise<void>;
}
