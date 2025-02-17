import { z } from "zod";

const numberString = z.string().refine(
  (val) => !isNaN(Number(val)) && val !== "",
  "Must be a valid number"
);

export const propertyFormSchema = z.object({
  postcode: z.string().min(1, "Postcode is required"),
  purchasePrice: numberString,
  marketValue: z.string().refine(
    (val) => val === "" || (!isNaN(Number(val)) && Number(val) > 0),
    "Must be a valid number greater than 0"
  ),
  monthlyRent: numberString,
  monthlyHoa: numberString,
  annualTaxes: numberString,
  annualInsurance: numberString,
  annualMaintenance: numberString,
  managementFees: z.string().refine(
    (val) => val === "" || (!isNaN(Number(val)) && Number(val) >= 0),
    "Must be a valid number greater than or equal to 0"
  )
});

export type PropertyFormData = z.infer<typeof propertyFormSchema>;