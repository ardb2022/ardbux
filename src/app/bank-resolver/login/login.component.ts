import { RestService } from './../../_service/rest.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LOGIN_MASTER, SystemValues } from '../Models';
import { InAppMessageService } from 'src/app/_service';
import { m_branch } from '../Models/m_branch';
import { sm_parameter } from '../Models/sm_parameter';
import { p_gen_param } from '../Models/p_gen_param';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  returnUrl: string;
  isError = false;
  brnDtls: m_branch[] = [];
  systemParam: sm_parameter[] = [];
  // genparam=new p_gen_param();
  isLoading = false;
  showAlert = false;
  alertMsg = '';
  ipAddress: any;
  showUnlockUsr = false;
  usrToUnlock: any;
  constructor(private router: Router,
              private formBuilder: FormBuilder,
              private rstSvc: RestService,
              private msg: InAppMessageService,
              private http: HttpClient) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      branch: ['', Validators.required]
    });
    this.loginForm.enable();
    this.msg.sendisLoggedInShowHeader(false);
    this.isLoading = true;

    setTimeout(() => {
      this.isLoading = false;
      this.GetBranchMaster();
      const sys = new SystemValues();
      if (null !== sys.UserId && sys.UserId.length > 0) {
        const usr = new LOGIN_MASTER();
        usr.brn_cd = sys.BranchCode;
        usr.user_id = sys.UserId;
        usr.login_status = 'N';
        this.updateUsrStatus(usr);
      }
      localStorage.removeItem('__userId');
    }, 300);
  }
  get f() { return this.loginForm.controls; }

  onSubmit(): void {
    this.showUnlockUsr = false;
    // this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.isLoading = true;
    const __bName = localStorage.getItem('__bName');
    // this.router.navigate([__bName + '/la']); // TODO remove this it will be after login
    const login = new LOGIN_MASTER();
    const toreturn = false;
    login.user_id = this.f.username.value;
    login.password = this.f.password.value;
    login.brn_cd = this.f.branch.value;
    this.rstSvc.addUpdDel<any>('Mst/GetUserDtls', login).subscribe(
      res => {
        this.isLoading = false;
        if (res.length === 0) {
          this.showAlert = true;
          this.alertMsg = 'Invalid Credential !!!!!';
        }
        else {
          if (res[0].login_status === 'Y') {
            this.showAlert = true;
            this.alertMsg = 'User id already logged in another machine;';
            this.showUnlockUsr = true;
            this.usrToUnlock = res[0];
            return;
          }
          // console.log('Login Sucess');
          this.getSystemParam();
          res[0].login_status = 'Y';
          this.updateUsrStatus(res[0]);
        }
      },
      err => {
        this.isLoading = false;
        this.showAlert = true;
        this.alertMsg = 'Invalid Credential !!!!!';
      }
    );
  }

  closeAlert() {
    this.showAlert = false;
  }

  public unlockUsr(): void {
    this.isLoading = true;
    this.usrToUnlock.login_status = 'N';
    this.rstSvc.addUpdDel('Mst/Updateuserstatus', this.usrToUnlock).subscribe(
      res => {
        this.isLoading = false;
        this.onSubmit();
      },
      err => { }
    );
  }

  private updateUsrStatus(usr: any): void {
    this.rstSvc.addUpdDel('Mst/Updateuserstatus', usr).subscribe(
      res => {
      },
      err => { console.log(err); }
    );
  }

  private getSystemParam(): void {
    this.rstSvc.addUpdDel('Mst/GetSystemParameter', null).subscribe(
      sysRes => {
        try {
          const __bName = localStorage.getItem('__bName');
          this.systemParam = sysRes;
          // console.log('ParameterList Sucess');
          localStorage.setItem('__brnCd', this.f.branch.value); // "101"
          localStorage.setItem('__brnName', this.brnDtls.find(x => x.brn_cd === this.f.branch.value).brn_name); // "101"
          localStorage.setItem('__currentDate', this.systemParam.find(x => x.param_cd === '206').param_value); // Day initilaze
          localStorage.setItem('__cashaccountCD', this.systemParam.find(x => x.param_cd === '213').param_value); // 28101
          localStorage.setItem('__ddsPeriod', this.systemParam.find(x => x.param_cd === '220').param_value); // 12
          localStorage.setItem('__userId', this.f.username.value); // feather
          localStorage.setItem('__minBalWdChq', this.systemParam.find(x => x.param_cd === '301').param_value);
          localStorage.setItem('__minBalNoChq', this.systemParam.find(x => x.param_cd === '302').param_value);
          localStorage.setItem('__dpstBnsRt', this.systemParam.find(x => x.param_cd === '805').param_value);
          localStorage.setItem('__pnlIntRtFrAccPreMatClos', this.systemParam.find(x => x.param_cd === '802').param_value);
          localStorage.setItem('__curFinyr', this.systemParam.find(x => x.param_cd === '207').param_value);
          localStorage.setItem('__neftPayDrAcc', this.systemParam.find(x => x.param_cd === '820').param_value);
          localStorage.setItem('__sbInttCalTilDt', this.systemParam.find(x => x.param_cd === '799').param_value);
          this.msg.sendisLoggedInShowHeader(true);
          this.router.navigate([__bName + '/la']);

        }
        catch (exception) {
          this.isLoading = false;
          this.showAlert = true;
          this.alertMsg = 'Initialization Failed. Contact Administrator !';
        }
      },
      sysErr => { }
    );
  }

  cancel() {
    localStorage.clear();
    localStorage.removeItem('__bName');
    localStorage.removeItem('__brnName');
    localStorage.removeItem('__brnCd');
    localStorage.removeItem('__currentDate');
    localStorage.removeItem('__cashaccountCD');
    localStorage.removeItem('__ddsPeriod');
    localStorage.removeItem('__userId');

    this.router.navigate(['/']);
  }

  private GetBranchMaster() {
    this.isLoading = true;
    this.rstSvc.addUpdDel('Mst/GetBranchMaster', null).subscribe(
      res => {
        this.loginForm.disable();
        this.http.get<{ ip: string }>('https://jsonip.com').subscribe(
          data => {
            // console.log('th data', data);
            this.ipAddress = data;
            this.isLoading = false;
            let ipMatched = false;
            this.brnDtls = res;
            this.brnDtls.forEach(e => {
              if (e.ip_address.indexOf(this.ipAddress.ip) !== -1) { ipMatched = true; }
            });
            if (!ipMatched) {
              this.showAlert = true;
              this.alertMsg = 'IP not allowed to access, contact support.';
              this.loginForm.disable();
              return;
            } else {
              this.loginForm.enable();
            }
          },
          ipErr => {
            this.isLoading = false;
            this.alertMsg = 'Unable to get IP, contact support.';
          }
        );
      },
      err => { this.isLoading = false; console.log(err);}
    );
  }
}
