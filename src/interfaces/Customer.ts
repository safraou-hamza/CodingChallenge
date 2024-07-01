import { Investment } from "./Investment";
import { RiskProfile } from "./RiskProfile";

export interface Customer {
    clientId: string;
    firstName: string;
    lastName: string;
    riskProfile: number;
    annualIncome: number;
    currency: string;
    residence: string;
    clientType: string;
    portfolios: [Investment] | never[];
    riskProfileDetails?: RiskProfile | undefined;
  }