import { InAppMessageService } from './../../_service/in-app-message.service';
import { Component, OnInit } from '@angular/core';
import { mm_dashboard } from '../Models/mm_dashboard';
import { p_gen_param } from '../Models/p_gen_param';
import { SystemValues } from '../Models';
import { RestService } from 'src/app/_service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  constructor(private msg: InAppMessageService,private svc: RestService) { }
  sys = new SystemValues();
  dashboardItem = new mm_dashboard();
  isLoading = false;
  ngOnInit(): void {
    // when ever landing is loaded screen title should be hidden
    this.msg.sendhideTitleOnHeader(true);
    this.getDashboardItem();
  }

  getDashboardItem() {
    const param = new p_gen_param();
    param.brn_cd = this.sys.BranchCode;
    this.svc.addUpdDel<any>('Common/GetDashBoardInfo', param).subscribe(
        res => {
          this.dashboardItem = res;
        },
        err => {
        }
      );
    }
  }

