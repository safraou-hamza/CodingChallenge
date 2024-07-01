import { Investment } from "./Investment";

export interface Portfolio {
    portfolioId: string;
    investments: [Investment];
  }

  