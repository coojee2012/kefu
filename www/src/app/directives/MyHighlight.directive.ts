import { Directive, Input, ElementRef, HostListener } from '@angular/core';
@Directive({
    selector: '[appHighlight]'
})

export class MyHighlightDirective {
    @Input() defaultColor: string;
    @Input() highlightColor: string;
    constructor(private el: ElementRef) {

    }
    @HostListener('mouseenter') onMouseEnter() {
        this.highlight(this.highlightColor || this.defaultColor || 'red');
    }

    @HostListener('mouseleave') onMouseLeave() {
        this.highlight(null);
    }

    private highlight(color: string) {
        this.el.nativeElement.style.backgroundColor = color;
    }

}

