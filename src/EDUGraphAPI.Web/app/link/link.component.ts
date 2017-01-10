﻿import { Component,  OnInit, Inject  } from '@angular/core';
import { Router } from '@angular/router';
import { LinkService } from './link.service';
import { UrlHelper } from '../utils/urlHelper';
import { UserInfo } from '../models/common/userinfo';


@Component({
    moduleId: module.id,
    selector: 'linkPage',
    templateUrl: 'link.component.template.html',
})

export class Link implements OnInit {
    areAccountsLinked: boolean;
    isLocalAccount: boolean;
    localAccountExisted: boolean;
    localAccountExistedMessage: string;
    userInfo: UserInfo; 
    error: string;


    constructor( @Inject('linkService') private linkService: LinkService, private router: Router, @Inject('me') private meService, @Inject('user') private userService) { }

    ngOnInit() {
        this.initCurrentUser();
        this.localAccountExistedMessage = '';
        this.initIsLocalAccount();
        this.userService.getLinkedAccounts()
            .subscribe((result) => {
                console.log(result);
            });
        this.initMessage();
    }

    initCurrentUser() {
        this.userInfo = new UserInfo();
        this.linkService.getCurrentUser()
            .subscribe((user) => {
                this.userInfo.readFromJson(user);
                this.areAccountsLinked = user.areAccountsLinked;
                this.initLocalAccountExisted(user);
            });
    }

    initLocalAccountExisted(user: any) {
        this.localAccountExisted = user.hasSameNameLocalAccount;
        this.localAccountExistedMessage = 'There is a local account: ' + user.o365Email + ' matching your O365 account.';
    }

    initIsLocalAccount() {
        this.isLocalAccount = this.meService.isLocalAccount();
    }

    loginO365() {
        this.linkService.linkO365User();
    }

    createLocalAccount() {
        console.log('createLocalAccount');
        this.router.navigate(['link-local']);
    }

    initMessage() {
        var msg = UrlHelper.getUrlQueryValue('error')
        if (msg != null && msg.length > 0) {
            this.error = msg;
        }
    }
}