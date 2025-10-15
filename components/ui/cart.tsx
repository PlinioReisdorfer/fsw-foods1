import CartItem from "@/app/products/[id]/components/cart-item";
import { CartContext } from "@/context/cart";
import { useContext, useState } from "react";
import { Card, CardContent } from "./card";
import { formatCurrency } from "@/helpers/price";
import { Separator } from "./separator";
import { Button } from "./button";
import { useSession } from "next-auth/react";
import { OrderStatus } from "@prisma/client";
import { createOrder } from "@/app/actions/actions/order";
import { Loader2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./alert-dialog";
import {toast} from "sonner"
import { useRouter } from "next/navigation";


interface CartProps {
  setIsOpen: (isOpen: boolean) => void;
}
const Cart = ({setIsOpen} : CartProps) => {
  const router = useRouter();
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [isConfirmadDialogOpen, setIsConfirmationDialogOpen] = useState(false);
  const {data} = useSession();

  const { products, subtotalPrice, totalDiscounts, totalPrice, clearCart } =
    useContext(CartContext);
  
  const handleFinishOrderClick = async () => {
    if(!data?.user) return;
    const restaurant = products[0].restaurant;
    try{
      setIsSubmitLoading(true);
      
      await createOrder({
      subtotalPrice: subtotalPrice,
      totalDiscounts,
      totalPrice,
      deliveryFee: restaurant.deliveryFee,
      deliveryTimeMinutes: restaurant.deliveryTimeMinutes,
      restaurant: {
        connect: {id: restaurant.id},
      },
      status: OrderStatus.CONFIRMED,
      user: {
        connect: {id: data.user.id},
      },
      products: {
        createMany: {
          data: products.map((product) => ({
            productId: product.id,
            quantity: product.quantity,
          })),
        }
      }
    });


    clearCart();
    setIsOpen(false);
    
    toast("Pedido finalizado com sucesso", {
      description: "Acompanhe o seu pedido na tela dos seus pedidos",
      action: {
        label: "Meus Pedidos",
        onClick: () => router.push('/my-orders'),
        },
    });


  } catch (error) {
    console.log(error);
  } finally {
    setIsSubmitLoading(false);
  }
      
  }
  return (
    <>
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
          <Button className="mt-6 w-full" onClick={() => setIsConfirmationDialogOpen(true)} disabled={isSubmitLoading}>Finalizar Pedido</Button>
          
        </>
      ) : (
        <h2 className="text-left font-medium">Sua sacola está vazia</h2>
      )}
    </div>

    <AlertDialog open={isConfirmadDialogOpen} onOpenChange={setIsConfirmationDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Deseja Finalizar o pedido?</AlertDialogTitle>
            <AlertDialogDescription>
              Seu pedido será entregue em instantes.
            </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
      <AlertDialogCancel>
        
        Cancelar</AlertDialogCancel>
      <AlertDialogAction onClick={handleFinishOrderClick} disabled={isSubmitLoading}>
        {isSubmitLoading && (<Loader2 className="ml-2 h-4 w-4 animate-spin" />)}
        Finalizar
        </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
    </>
  );
};

export default Cart;
