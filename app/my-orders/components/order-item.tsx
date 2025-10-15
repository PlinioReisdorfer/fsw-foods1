"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { OrderStatus, Prisma } from "@prisma/client";
import { Separator } from "@/components/ui/separator";
import { ChevronRightIcon } from "lucide-react";
import { formatCurrency } from "@/helpers/price";
import Link from "next/link";
import { useContext } from "react";
import { CartContext } from "@/context/cart";
import { useRouter } from "next/navigation";

interface OrderItemProps {
    order: Prisma.OrderGetPayload<{
        include: {
            restaurant: true
            products: {
                include: {
                    product: true
                }
            }
        }
    }>;
}

const getOrderStatusLabel = (status: OrderStatus) => {
    switch (status) {
        case 'CANCELED':
            return 'Cancelado';
        case 'COMPLETED':
            return 'Entregue';
        case 'CONFIRMED':
            return 'Confirmado';
        case 'PREPARING':
            return 'Preparando';
        case 'DELIVERING':
            return 'Em transporte';
    }
}
const OrderItem = ({order}:OrderItemProps) => {
    const {addProductToCart} = useContext(CartContext);

    const router = useRouter();
    
    const handleRedoOrderClick = () => {
        for (const orderProduct of order.products) {
            addProductToCart({product: {...orderProduct.product, restaurant: order.restaurant}, quantity: orderProduct.quantity});
        }

        router.push(`/restaurant/${order.restaurantId}`);


    };
    return ( 
        <Card>
            <CardContent className="p-5">
                <div className={`bg-[#EEEEE] text-muted-foreground rounded-full w-fit px-2 py-1 
                    ${order.status !== 'COMPLETED' && 'bg-green-500 text-white'}` } > 
                    <span className="block text-xs font-semibold">
                        {getOrderStatusLabel(order.status)}
                    </span>
                </div>

                <div className="flex items-center justify-between pt-3">
                    <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                            <AvatarImage src={order.restaurant.imageUrl || undefined} />
                        </Avatar>

                        <span className="text-sm font-semibold">
                            {order.restaurant.name}
                        </span>
                    </div>

                    

                    <Button variant="link" size="icon" className="w-5 h-5 text-black" asChild>
                            <Link href={`/restaurant/${order.restaurantId}`}>
                                <ChevronRightIcon/>
                            </Link>
                        </Button>
                </div>
                <div className="py-3">
                        <Separator/>
                    </div>

                    <div className="space-y-2">
                        {order.products.map((product) => (
                            <div key ={product.id} className="flex items-center gap-2">
                            <div  className="w-5 h-5 rounded-full bg-muted-foreground flex items-center justify-center">
                                <span className="block text-xs text-white">{product.quantity}</span>
                            </div>
                            <span className="block text-muted-foreground text-xs">{product.product.name}</span>
                        </div>
                    ))} 
                    </div>

                    <div className="py-3">
                        <Separator/>
                    </div>

                    <div className="flex items-center justify-between">
                        <p className="font-semibold text-sm">{formatCurrency(Number(order.totalPrice))}</p>
                        <Button variant="ghost" className="text-primary text-xs" size="sm" onClick={handleRedoOrderClick} disabled={order.status !== 'COMPLETED'}>
                            Refazer Pedido
                        </Button>
                    </div>


            </CardContent>
        </Card>
     );
}
 
export default OrderItem;