import { z } from "zod";
import { BookingModelSchema } from "./booking.model";
import { AvailabilityModelSchema } from "./availability.model";

export const RepresentativeModelSchema = z.object({
    id: z.number().int(),
    availability: z.array(AvailabilityModelSchema),
    bookings: z.array(BookingModelSchema),
})

export type RepresentativeModel = z.infer<typeof RepresentativeModelSchema>;