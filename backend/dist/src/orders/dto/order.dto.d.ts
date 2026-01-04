export declare class OrderItemDto {
    productId: string;
    quantity: number;
}
export declare class CreateOrderDto {
    items: OrderItemDto[];
    shippingAddress?: string;
}
export declare class UpdateOrderStatusDto {
    status: string;
}
