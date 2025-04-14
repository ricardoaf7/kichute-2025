
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (amount: number) => void;
  paymentDetails: {
    userId: string;
    userName: string;
    currentPayment: number;
  } | null;
  calculateRemainingBalance: (paidAmount: number) => number;
}

export function PaymentDialog({
  isOpen,
  onClose,
  onSubmit,
  paymentDetails,
  calculateRemainingBalance,
}: PaymentDialogProps) {
  const [paymentAmount, setPaymentAmount] = useState("");

  const handleSubmit = () => {
    const amount = Number(paymentAmount);
    if (!isNaN(amount) && amount > 0) {
      onSubmit(amount);
      setPaymentAmount("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Registrar Pagamento</DialogTitle>
          <DialogDescription>
            Informe o valor pago pelo participante.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {paymentDetails && (
            <>
              <div className="mb-4">
                <p className="font-medium">{paymentDetails.userName}</p>
                <p className="text-sm text-muted-foreground">
                  Valor já pago: R$ {paymentDetails.currentPayment.toFixed(2)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Valor restante: R$ {calculateRemainingBalance(paymentDetails.currentPayment).toFixed(2)}
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="payment-amount">Valor do Pagamento (R$)</Label>
                <Input
                  id="payment-amount"
                  type="number"
                  min="0"
                  step="10"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder="0.00"
                />
                <div className="text-sm text-muted-foreground">
                  <p>Valores sugeridos:</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setPaymentAmount("10")}
                    >
                      R$ 10 (1 mês)
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setPaymentAmount("30")}
                    >
                      R$ 30 (3 meses)
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setPaymentAmount("90")}
                    >
                      R$ 90 (Temporada completa)
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="button" onClick={handleSubmit}>
            Registrar Pagamento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
