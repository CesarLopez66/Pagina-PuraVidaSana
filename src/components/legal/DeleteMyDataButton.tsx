"use client";

import { useState } from "react";
import { Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useStore } from "@/store/useStore";

export function DeleteMyDataButton() {
  const clearMyPersonalData = useStore((s) => s.clearMyPersonalData);
  const [done, setDone] = useState(false);

  const handleClick = () => {
    if (
      !confirm(
        "¿Borrar tu carrito, historial de pedidos y participación en la ruleta guardados en este navegador? Esta acción no se puede deshacer."
      )
    ) {
      return;
    }
    clearMyPersonalData();
    setDone(true);
    setTimeout(() => setDone(false), 3000);
  };

  return (
    <div>
      <Button type="button" variant="outline" onClick={handleClick}>
        {done ? <Check size={16} /> : <Trash2 size={16} />}
        {done ? "Tus datos locales fueron borrados" : "Borrar mis datos de este navegador"}
      </Button>
    </div>
  );
}
