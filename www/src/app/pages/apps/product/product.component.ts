import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-product',
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.css']
})

export class ProductComponent implements OnInit {
    public products:Array<Product>;

    constructor() {
    }

    ngOnInit() {
        this.products = [
            new Product(1, '第一个商品', 899, 3.5, '这是一个垃圾电脑', ['电子产品', '家电']),
            new Product(2, '第二个商品', 899, 3.5, '这是一个垃圾电脑', ['电子产品', '家电']),
            new Product(3, '第三个商品', 899, 3.5, '这是一个垃圾电脑', ['电子产品', '家电']),
            new Product(4, '第四个商品', 899, 3.5, '这是一个垃圾电脑', ['电子产品', '家电']),
            new Product(5, '第五个商品', 899, 3.5, '这是一个垃圾电脑', ['电子产品', '家电']),
            new Product(6, '第六个商品', 899, 3.5, '这是一个垃圾电脑', ['电子产品', '家电'])
        ]
    }

}
export class Product {
    constructor(public id:number,
                public title:string,
                public price:number,
                public rating:number,
                public desc:string,
                public categories:Array<string>) {
    }
}
