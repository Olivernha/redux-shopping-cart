import productsReducer ,{receivedProducts} from "./productsSlice";
import products from '../../../public/products.json';
import {ActionCreatorWithoutPayload} from "@reduxjs/toolkit";
describe('products reducer', function () {
    it('should return the initial state when passed to an empty action', function () {
            const initialState = undefined;
            const action= {} as ActionCreatorWithoutPayload;
            const result = productsReducer(initialState, action);
            expect(result).toEqual({products:{}});
    });
    it('should convert the products received to an object',() =>{
        const initialState = undefined;
        const action = receivedProducts(products);
        const result = productsReducer(initialState, action);
        expect(Object.keys(result.products).length).toEqual(products.length);
        products.forEach((product)=>{
            expect(result.products[product.id]).toEqual(product);
        })
    })
});