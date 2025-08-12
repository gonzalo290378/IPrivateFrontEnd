import { PrivateContentDTO } from './private-content-dto';

export class PrivateAreaDTO {
  id?: number;
  isEnabled?: boolean;
  monthCostPrivateArea?: number;
  privateContentDTO?: PrivateContentDTO[];
}
