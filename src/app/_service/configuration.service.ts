import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import * as configuration from '../../assets/constants/bankconfig.json';
import { BankConfig, BankConfiguration } from '../bank-resolver/Models';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  // static configuration: BankConfiguration[] = [];
  static bankconfigurationList: BankConfig[] = [];

  constructor(private http: HttpClient) { }

  // getAllConfiguration(): Promise<BankConfiguration[]> {
  //   const p = new Promise<BankConfiguration[]>((resolve, reject) => {
  //     if (null !== this.configuration
  //         && this.configuration.length > 0) { } else {
  //         this.configuration = (configuration  as  any).default;
  //       }

  //     resolve(this.configuration);
  //     // even here if the this.configuration is null
  //     // then we should reject with error
  //   });

  //   return p;
  // }

  getAllConfiguration(serverIp: string): Promise<BankConfig[]> {
    // let serverIp = '36.255.3.143';
    console.log('getAllConfiguration called');
    const masterApi = 'Admin/GetBankConfigDtlsNoPass';
    const masterApiUrl = 'http://' + serverIp + '/ardbMasterConfig/api/'
      + masterApi;
    const p = new Promise<BankConfig[]>((resolve, reject) => {

      this.http.post(masterApiUrl, null).subscribe(
        res => {
          if (null !== res) {
            ConfigurationService.bankconfigurationList = (res as BankConfig[]);
          }
          resolve(ConfigurationService.bankconfigurationList);
        });
    });
    return p;
  }


  // getAllConfiguration(): Promise<BankConfiguration[]> {
  //   const p = new Promise<BankConfiguration[]>((resolve, reject) => {
  //     this.http.get('./assets/constants/BankConfig.json').subscribe(data => {
  //       // console.log(data);
  //       if (null !== data) {
  //         ConfigurationService.configuration = (data as BankConfiguration[]);
  //       }
  //       resolve(ConfigurationService.configuration);
  //     });
  //     // even here if the this.configuration is null
  //     // then we should reject with error
  //   });

  //   return p;
  // }



  // getConfigurationForName(findConf: string): Promise<BankConfiguration> {
  //   const p = new Promise<BankConfiguration>((resolve, reject) => {
  //     this.http.get('./assets/constants/BankConfig.json').subscribe(data => {
  //       // console.log(data);
  //       if (null !== data) {
  //         ConfigurationService.configuration = (data as BankConfiguration[]);
  //       }
  //       resolve(ConfigurationService.configuration.
  //         filter(e => e.name.toLowerCase() === findConf.toLowerCase())[0]);
  //     });
  //     // even here if the this.configuration is null
  //     // then we should reject with error
  //   });

  //   return p;
  // }


  // public getAllUrl(url: string): Promise<BankConfig[]> {
  //   var masterUrl = url + 'Admin/GetBankConfigDtlsNoPass';
  //   debugger;
  //   const p = new Promise<BankConfig[]>((resolve, reject) => {
  //   this.http.post(masterUrl, null).subscribe(
  //     res => {
  //       debugger;
  //       if (null !== res) {
  //         ConfigurationService.bankconfiguration = (res as BankConfig[]) ;
  //         debugger;
  //       }
  //       resolve(ConfigurationService.bankconfiguration);

  //     });


  //   });

  //   return p;
  // }

  // getConfigurationForName(findConf: string): Promise<BankConfiguration> {
  //   const p = new Promise<BankConfiguration>((resolve, reject) => {
  //     if (null !== this.configuration
  //       && this.configuration.length > 0) { } else {
  //       this.configuration = (configuration as any).default;
  //     }

  //     resolve(this.configuration.
  //       filter(e => e.name.toLowerCase() === findConf.toLowerCase())[0]);
  //     // even here if the this.configuration is null
  //     // then we should reject with error
  //   });

  //   return p;
  // }
}
