import { Signal } from "@angular/core";
import { SIGNAL } from "@angular/core/primitives/signals";
import { z } from "zod";

export function zodSignal<TValue>(innerSchema: z.ZodType<TValue>){
    return z.custom<NoInfer<Signal<TValue>>>((sig) => {
        if (sig[SIGNAL] !== undefined) {
            return innerSchema.safeParse(sig()).success
        }
        return false;
    })
}