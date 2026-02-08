import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { filter } from 'rxjs/operators';

declare const gtag: Function;

@Injectable({
    providedIn: 'root'
})
export class GoogleAnalyticsService {
    private googleAnalyticsId = 'G-7VK811G06C';

    constructor(
        private router: Router,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {
        if (isPlatformBrowser(this.platformId)) {
            this.trackPageViews();
        }
    }

    private trackPageViews() {
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe((event: NavigationEnd) => {
            try {
                if (typeof gtag === 'function') {
                    gtag('config', this.googleAnalyticsId, {
                        'page_path': event.urlAfterRedirects
                    });
                }
            } catch (e) {
                console.error('Error tracking Google Analytics page view', e);
            }
        });
    }
}
