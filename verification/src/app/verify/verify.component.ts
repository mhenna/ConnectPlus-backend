import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css']
})
export class VerifyComponent implements OnInit {
  loading = true;
  email: any;
  otp: any;
  success = true;

  constructor(
    private userService: UserService,
    private activatedRoute: ActivatedRoute
  ) { }

  async ngOnInit() {
    this.email = this.activatedRoute.snapshot.params.email;
    this.otp = this.activatedRoute.snapshot.params.otp;
    console.log(this.email, this.otp)
    await this.verify();
    this.loading = false;
  }

  async verify() {
    try {
      await this.userService.verify(this.email, this.otp);
      this.success = true;
    } catch (err) {
      console.log(err)
      this.success = false;
      if (err)
        alert(err.error.message);
    }
  }
}
