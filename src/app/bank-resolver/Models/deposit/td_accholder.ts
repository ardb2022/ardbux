import { baseModel } from '../baseModel';

export class td_accholder extends baseModel{
  public brn_cd: string;
  public acc_type_cd: number;
  public acc_num: string;
  public acc_holder : string;
  public relation: string;
  public cust_cd: number;
  public relationId: number;
  // public joint_cust_name: string; // extra
}
