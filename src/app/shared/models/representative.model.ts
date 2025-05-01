import { z } from "zod";
import { BookingModelSchema } from "./booking.model";
import { AvailabilityModelSchema } from "./availability.model";

export const RepresentativeModelSchema = z.object({
    id: z.number().int(),
    name: z.string(),
    // only consider time component of the date
    availability: z.array(z.array(AvailabilityModelSchema)),
    bookings: z.array(BookingModelSchema),
})