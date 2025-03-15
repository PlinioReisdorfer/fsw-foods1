import CartItem from "@/app/products/[id]/components/cart-item";
import { CartContext } from "@/context/cart";
import { useContext } from "react";
import { Card, CardContent } from "./card";
import { formatCurrency } from "@/helpers/price";
import { Separator } from "./separator";
import { Button } from "./button";

const Cart = () => {
  const { products, subtotalPrice, totalDiscounts, totalPrice } =
    useContext(CartContext);
  return (
    <div className="flex h-full flex-col py-5">
      {/* TOTAIS */}
      {products.length > 0 ? (
        <>
          <div className="flex-auto space-y-4">
            {products.map((product) => (
              <CartItem key={product.id} cartProduct={product} />
            ))}
          </div>

          <div className="mt-6">
            <Card>
              <CardContent className="space-y-2 p-5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">SubTotal</span>
                  <span>{formatCurrency(subtotalPrice)}</span>
                </div>

                <Separator />

                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Descontos</span>
                  <span>- {formatCurrency(totalDiscounts)}</span>
                </div>

                <Separator />

                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Entrega</span>

                  {Number(products?.[0].restaurant.deliveryFee) === 0 ? (
                    <span className="uppercase text-primary">Grátis</span>
                  ) : (
                    formatCurrency(Number(products?.[0].restaurant.deliveryFee))
                  )}
                </div>

                <Separator />

                <div className="flex items-center justify-between text-xs font-semibold">
                  <span>Total</span>
                  <span>{formatCurrency(totalPrice)}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* FINALIZAR PEDIDO */}
          <Button className="mt-6 w-full">Finalizar Pedido</Button>
        </>
      ) : (
        <h2 className="text-left font-medium">Sua sacola está vazia</h2>
      )}
    </div>
  );
};

export default Cart;
