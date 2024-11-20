import { PrivateContentDTO } from "./private-content-dto";

export class PrivateAreaDTO {
  id?: number;
  isEnabled?: boolean;
  monthCostPrivateArea?: number; // BigDecimal se mapea como number en TypeScript
  privateContentDTO?: PrivateContentDTO[];
}
