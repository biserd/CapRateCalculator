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

export const loanCalculatorSchema = z.object({
  purchasePrice: numberString,
  downPaymentPercent: z.string().refine(
    (val) => !isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 100,
    "Must be between 0 and 100"
  ),
  interestRate: z.string().refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0,
    "Must be greater than 0"
  ),
  loanTerm: z.string().refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0,
    "Must be greater than 0"
  ),
  monthlyRent: numberString,
  monthlyExpenses: numberString,
});

export type PropertyFormData = z.infer<typeof propertyFormSchema>;
export type LoanCalculatorData = z.infer<typeof loanCalculatorSchema>;