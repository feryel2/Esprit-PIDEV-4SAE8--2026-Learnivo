import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-verify',
    templateUrl: './verify.component.html',
})
export class VerifyComponent implements OnInit {
    message: string = 'Verifying your email...';
    isError: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            const token = params['token'];
            if (token) {
                this.authService.verifyEmail(token).subscribe({
                    next: () => {
                        this.message = 'Email verified successfully! You can now login.';
                        this.isError = false;
                        setTimeout(() => {
                            this.router.navigate(['/login']);
                        }, 3000);
                    },
                    error: (err) => {
                        this.message = err.error?.error || 'Verification failed. The token may be invalid or expired.';
                        this.isError = true;
                    }
                });
            } else {
                this.message = 'No verification token provided.';
                this.isError = true;
            }
        });
    }
}
