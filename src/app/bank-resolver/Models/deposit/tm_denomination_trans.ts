import { baseModel } from '../baseModel';

export class tm_denomination_trans extends baseModel {

  public brn_cd: string;
  public trans_cd: number;
  public trans_dt: Date;
  public rupees: number;
  public count: number;
  public total: number;
  public created_dt: Date;
  public created_by: string;
  public rupees_desc: string;
}

