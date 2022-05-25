import { BankConfiguration } from './../Models/bankConfiguration';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { InAppMessageService, RestService } from 'src/app/_service';
import { BankConfigMst, mainmenu, submenu, screenlist, SystemValues, LOGIN_MASTER, MenuConfig } from '../Models';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { lvLocale } from 'ngx-bootstrap/chronos';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  constructor(private rstSvc: RestService, private router: Router,
              private msg: InAppMessageService) {
    this.subscription = this.msg.gethideTitleOnHeader().subscribe(
      res => {
        if (res) {
          this.hideScreenTitle();
        }
      },
      err => { }
    );
  }

  subscription: Subscription;
  collapsed = true;
  bankConfig: BankConfigMst;
  bankName: string;
  bankFullName: string;
  childMenu: mainmenu;
  subMenu: submenu;
  showMenu = false;
  showChildMenu = false;
  showSubMenu = false;
  showScreenTitle = false;
  selectedScreenToShow: string;
  sys = new SystemValues();
  show = false;
  menuConfigs: any;
  currentMenu: MenuConfig;
  inside = false;

  ngOnInit(): void {
    this.bankName = localStorage.getItem('__bName');
    this.getBankConfigMaster();
    this.getMenu();
    // this.bankName=this.titleService.getTitle()
  }

  // @HostListener('mouseout')
  // onMouseOut() {
  //   this.menuConfigs.forEach(lv1 => {
  //     lv1.show = false;
  //     lv1.childMenuConfigs.forEach(lv2 => {
  //       lv2.show = false;
  //     });
  //   });
  // }

  @HostListener('click')
  clicked() {
    this.inside = true;
  }
  @HostListener('document:click')
  clickedOut() {
    if (!this.inside) {
      this.menuConfigs.forEach(lv1 => {
        lv1.show = false;
        lv1.childMenuConfigs.forEach(lv2 => {
          lv2.show = false;
        });
      });
    }
    this.inside = false;
  }

  toggleCollapsed(): void {
    this.collapsed = !this.collapsed;
  }
  over(menu: MenuConfig): void {
    // case 1 when the menu is clicked for the first time
    if (null === this.currentMenu ||
      undefined === this.currentMenu) {
      menu.show = true;
      this.currentMenu = menu;
    } else if (this.currentMenu.level_no < menu.level_no) {
      // definately child of the opened menu is to be opened
      // try to close all its child and open this one only
      const diff = this.currentMenu.level_no - menu.level_no;
      switch (diff) {
        case 1:
        case -1:
          this.currentMenu.childMenuConfigs.forEach(lv2 => {
            lv2.show = false;
          });
          break;
        case 2:
          this.currentMenu.childMenuConfigs.forEach(lv2 => {
            lv2.childMenuConfigs.forEach(lv3 => {
              lv3.show = false;
            });
          });
          break;
      }
      menu.show = true;
    } else {
      this.hideMenu();
      menu.show = true;
      this.currentMenu = menu;
    }
  }

  private hideMenu(): void {
    this.inside = false;
    this.menuConfigs.forEach(lv1 => {
      lv1.show = false;
      lv1.childMenuConfigs.forEach(lv2 => {
        lv2.show = false;
        lv2.childMenuConfigs.forEach(lv3 => {
          lv3.show = false;
          lv3.childMenuConfigs.forEach(lv4 => {
            lv4.show = false;
          });
        });
      });
    });
  }

  gotoNewScreen(menu: MenuConfig): void {
    this.hideMenu();
    this.showScreenTitle = true;
    this.selectedScreenToShow = ''; // reset values;
    this.selectedScreenToShow = menu.menu_name;
    this.router.navigate([this.bankName + '/' + menu.ref_page]);
  }
  out(menu: MenuConfig): void {
    //  this.show = false;
    menu.show = false;
  }

  /** this is the new menu call from db */
  getMenu() {
    const menuConfig = new MenuConfig(); let rcvdMenuConfigs: MenuConfig[];
    menuConfig.bank_config_id = 1;
    this.rstSvc.addUpdDel<any>('Admin/GetMenuConfig', menuConfig).subscribe(
      res => {
        if (null !== res && undefined !== res) {
          // res = res as MenuConfig[];
          rcvdMenuConfigs = res;
          console.log(res);
          if (undefined !== res && null !== res) {
            // create the hirarchal data
            this.menuConfigs = rcvdMenuConfigs.filter(e => e.level_no === 1);
            this.menuConfigs.forEach(frstLvlEle => {
              if (frstLvlEle.is_screen === 'N') {
                const scndLvlMenus = rcvdMenuConfigs.filter(e =>
                  e.parent_menu_id === frstLvlEle.menu_id);
                frstLvlEle.childMenuConfigs.push(...scndLvlMenus);

                scndLvlMenus.forEach(scndLvlEle => {
                  if (scndLvlEle.is_screen === 'N') {
                    const thrdLvlMenus = rcvdMenuConfigs.filter(e =>
                      e.parent_menu_id === scndLvlEle.menu_id);
                    scndLvlEle.childMenuConfigs.push(...thrdLvlMenus);

                    thrdLvlMenus.forEach(thrdLvlEle => {
                      if (thrdLvlEle.is_screen === 'N') {
                        const forthLvlMenus = rcvdMenuConfigs.filter(e =>
                          e.parent_menu_id === thrdLvlEle.menu_id);
                        thrdLvlEle.childMenuConfigs.push(...forthLvlMenus);


                      }
                    });
                  }
                });
              }
            });

            // console.log(firtLvlMenus);
          } else {
            // todo need to check if the menu doesnt come then what
          }
        }
      },
      err => { }
    );
  }

  getBankConfigMaster() {
    this.rstSvc.getAll<BankConfigMst>('BankConfigMst').subscribe(
      res => {
        console.log(res);
        this.bankConfig = res;
        this.bankFullName = this.bankConfig.bankname;
        this.showMenu = true;
        this.showChildMenu = false;
        this.showSubMenu = false;
        // TODO roles if required.
      },
      err => { }
    );
  }

  logout() {
    this.hideMenu();
    // localStorage.removeItem('__bName');
    // this.router.navigate(['/']);
    this.updateUsrStatus();
    localStorage.removeItem('__brnName');
    localStorage.removeItem('__brnCd');
    localStorage.removeItem('__currentDate');
    localStorage.removeItem('__cashaccountCD');
    localStorage.removeItem('__ddsPeriod');
    localStorage.removeItem('__userId');
    this.msg.sendisLoggedInShowHeader(false);
    this.router.navigate([this.bankName + '/login']);
  }

  private updateUsrStatus(): void {
    const usr = new LOGIN_MASTER();
    usr.brn_cd = this.sys.BranchCode;
    usr.user_id = this.sys.UserId;
    usr.login_status = 'N';
    this.rstSvc.addUpdDel('Mst/Updateuserstatus', usr).subscribe(
      res => { },
      err => { }
    );
  }

  goToHome() {
    this.hideMenu();
    this.router.navigate([this.bankName + '/la']);
    this.showMenu = true;
    this.showChildMenu = false;
    this.showSubMenu = false;
    this.showScreenTitle = false;
  }

  // showChildMenuFor(menu: mainmenu): void {
  //   this.childMenu = menu;
  //   this.subMenu = null;
  //   this.showMenu = false;
  //   this.showChildMenu = true;
  //   this.showSubMenu = false;
  //   this.router.navigate([this.bankName + '/la']);
  // }

  // showSubChildMenuFor(submenu: submenu): void {
  //   this.subMenu = submenu;
  //   this.showMenu = false;
  //   this.showChildMenu = false;
  //   this.showSubMenu = true;
  //   this.router.navigate([this.bankName + '/la']);
  // }

  // gotoScreen(screen: screenlist): void {
  //   this.showScreenTitle = true;
  //   this.selectedScreenToShow = ''; // reset values;
  //   this.selectedScreenToShow = screen.screen;
  //   this.router.navigate([this.bankName + '/' + screen.value]);
  // }

  back(fromwhere: string) {
    if (fromwhere === 'sub') {
      this.showMenu = false;
      this.showChildMenu = true;
      this.showSubMenu = false;
    } else if (fromwhere === 'child') {
      this.showMenu = true;
      this.showChildMenu = false;
      this.showSubMenu = false;
    }
    this.hideScreenTitle();
    this.router.navigate([this.bankName + '/la']);
  }

  private hideScreenTitle(): void {
    this.showScreenTitle = false;
    // this.selectedScreenToShow = '';
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
