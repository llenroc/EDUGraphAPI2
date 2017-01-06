﻿import { Injectable, Inject } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map'
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import { UserInfo } from '../models/common/userinfo';
import { Cookie } from './cookieService';
import { SvcConsts } from "../svcConsts/svcConsts"




@Injectable()
export class MeService {

    private meAPIUrl = 'api/me';

    constructor(private _http: Http, @Inject('auth') private authService) {
    }

    public getCurrentUser() {
        return this._http.get(this.meAPIUrl, {})
            .map((response: Response) => response.json());
    }

    public updateFavoriteColor(favoriteColor): Promise<any> {
        return new Promise((resolve, reject) => {
            this.getCurrentUser()
                .subscribe((user) => {
                    user.favoriteColor = favoriteColor;
                    this._http.post('api/me/favoriteColor', user)
                        .subscribe((response) => resolve(response));
                });
        });
    }

    public isLocalAccount() {
        let authType = Cookie.get(SvcConsts.LOGIN_TOKEN);
        if (authType == null || authType == undefined)
            return true;
        return authType.toLowerCase() == "local";
    }

    public isO365Account() {
        return !this.isLocalAccount();
    }
}