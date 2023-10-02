"use strict"
const ModelUser = require("../model/model-user");

class ControllerCart {

    constructor() { }

    // ADD PRODUCT TO CART
    async addProductToCart(user = {}, product = {}, cb) {
        try {
            let buyNewProduct = false;

            let productInCart = user.model.cart.find((cartInfor) => cartInfor.product._id.toString() === product._id.toString());
            if(productInCart) {
                user.model.cart = user.model.cart.map((cartInfor) => {
                    if(cartInfor.product._id.toString() === product._id.toString()) {
                        cartInfor.quantity++;
                    }

                    return cartInfor;
                })

            } else {
                buyNewProduct = true;
                user.model.cart.push({
                    product,
                    quantity: 1
                })
            }

            if(buyNewProduct) {
                product.ref++;
            }

            product.quantity--;
            await product.save();

            await user.model.save();
            cb({status: true, message: 'Add product to cart successfully'});

        } catch (error) {
            // METHOD FAILED
            cb({status: false, message: 'Method failed', error});
        }
    }

    // REMOVE PRODUCT IN CART
    async removeProductInCart(user = {}, product = {}, cb) {
        try {
            for(let cartInfor of user.model.cart) {
                if(cartInfor.product._id.toString() === product._id.toString()) {
                    product.quantity += cartInfor.quantity;
                    product.ref--;
                    await product.save();
                    break;
                }
            }

            user.model.cart = user.model.cart.filter((cartInfor) => cartInfor.product._id.toString() !== product._id.toString());
            await user.model.save();
            cb({status: true, message: 'Remove product in cart successfully'});

        } catch (error) {
            // METHOD FAILED
            cb({status: false, message: 'Method failed'});
        }
    }

    // CANCEL CART
    async cancelCart(user = {}, cb) {
        try {

            user.model.cart = user.model.cart.forEach( async(cartInfor) => {
                cartInfor.product.quantity += cartInfor.quantity;
                cartInfor.product.ref--;
                await cartInfor.product.save();
            })

            await user.model.save();
            cb({status: true, message: 'Cancel cart successfully'});

        } catch (error) {
            // METHOD FAILED
            cb({status: false, message: 'Method failed'});
        }
    }
}

module.exports = new ControllerCart();