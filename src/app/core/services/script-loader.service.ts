import { Injectable } from '@angular/core';

interface ScriptConfig {
    src: string;
    loaded: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class ScriptLoaderService {
    private scripts: { [key: string]: ScriptConfig } = {
        'pdf-lib': { src: 'https://unpkg.com/pdf-lib@1.17.0/dist/pdf-lib.min.js', loaded: false },
        'pdf-js': { src: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js', loaded: false },
        'jszip': { src: 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js', loaded: false },
        'file-saver': { src: 'https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js', loaded: false },
        'html2canvas': { src: 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js', loaded: false },
        'jspdf': { src: 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js', loaded: false },
        'html2pdf': { src: 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js', loaded: false }
    };

    load(scriptNames: string[]): Promise<void[]> {
        const promises: Promise<void>[] = [];
        scriptNames.forEach(name => promises.push(this.loadScript(name)));
        return Promise.all(promises);
    }

    private loadScript(name: string): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.scripts[name]) {
                reject(`Script "${name}" not defined`);
                return;
            }

            if (this.scripts[name].loaded) {
                resolve();
                return;
            }

            // Check if already in DOM (e.g. from another proactive load)
            const existingScript = document.querySelector(`script[src="${this.scripts[name].src}"]`);
            if (existingScript) {
                this.scripts[name].loaded = true;
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = this.scripts[name].src;
            script.type = 'text/javascript';
            script.async = true;

            script.onload = () => {
                this.scripts[name].loaded = true;
                console.log(`${name} loaded successfully`);
                resolve();
            };

            script.onerror = (error: any) => {
                console.error(`Could not load script ${name}`, error);
                reject(`Could not load script ${name}`);
            };

            document.getElementsByTagName('head')[0].appendChild(script);
        });
    }
}
