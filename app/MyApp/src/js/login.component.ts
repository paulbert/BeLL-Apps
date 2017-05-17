import { Component, Input } from '@angular/core';

@Component({
    selector: 'login-form',
    template: `
        <div>
            <label>Username</label><input [(ngModel)]="name" placeholder="Enter username"/>
            <label>Password</label><input [(ngModel)]="pass" placeholder="Password"/>
        </div>
    `
})
export class LoginComponent {
    model = { name:'', pass:'' }
}