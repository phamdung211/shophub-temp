import { Injectable, signal } from "@angular/core";

@Injectable({
    providedIn: 'root',
})

export class ThemeService {
    private readonly THEME_KEY = "shophub_theme";
    readonly isDarkMode = signal<boolean>(false);

    constructor() {
        this.initTheme();
    }

    private initTheme(): void {
        const savedTheme = localStorage.getItem(this.THEME_KEY);
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
            this.isDarkMode.set(true);
        } else {
            this.isDarkMode.set(false);
        }
        this.applyTheme();
    }
    private applyTheme(): void {
        // toggle(tên_class, điều_kiện): Nếu true thì thêm class, nếu false thì xóa class
        document.documentElement.classList.toggle('dark', this.isDarkMode());
    }
    toggleTheme(): void {

        this.isDarkMode.update(prev => !prev);


        localStorage.setItem(this.THEME_KEY, this.isDarkMode() ? 'dark' : 'light');


        this.applyTheme();
    }
}
