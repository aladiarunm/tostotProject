
const AFUtil = function(){};

AFUtil.isNull = function(obj) {
    if(obj == null || obj == undefined  || obj == '') {   
        return true;
    }
    return false;
}
AFUtil.isNotNull = function(obj) {
    if(obj != null && obj != undefined && obj != '') {   
        return true;
    }
    return false;
}

AFUtil.calculateOfferPrice = function(sellPrice, offerPercent) {
    let offerPrice = 0;
    offerPrice = sellPrice - (sellPrice * (offerPercent / 100));
    offerPrice = offerPrice.toFixed(2);

    return offerPrice;
}


AFUtil.calculateCartTotals = function (cartProducts, shippingCharge) {
    let offerPrice = 0;
    let sellPrice = 0;
    let cartQuantity = 0;
    let priceForCalculation = 0;
    let productPrice = 0;
    let igstRate = 0;
    let taxAmount = 0;
  
    const cartTotalObject = cartProducts.reduce((acc, product) => {
      offerPrice = product.offerPrice ? parseFloat(product.offerPrice) : 0;
      sellPrice = parseFloat(product.sellPrice);
      cartQuantity = parseFloat(product.cartQuantity);
      igstRate = parseFloat(product.igstRate);
  
      priceForCalculation = offerPrice > 0 ? offerPrice : sellPrice;
      productPrice = priceForCalculation * cartQuantity;
      taxAmount = productPrice * (igstRate / 100);
  
      acc.productsTotal += productPrice;
      acc.includedTaxAmount += taxAmount;
  
      return acc;
    }, { productsTotal: 0, includedTaxAmount: 0 });
  
    cartTotalObject.includedTaxAmount = parseFloat(cartTotalObject.includedTaxAmount.toFixed(2));
    cartTotalObject.shippingCharge = shippingCharge;
    cartTotalObject.totalPrice = cartTotalObject.productsTotal + cartTotalObject.shippingCharge;
  
    return cartTotalObject;
}

AFUtil.formatTotalForRazorpay = function (totalPrice) {
    let formattedTotal = totalPrice.toString();
    if(formattedTotal.indexOf(".") != -1) {
        formattedTotal = formattedTotal.replace(".", "");
    } else {
        formattedTotal = formattedTotal + "00";
    }
    return formattedTotal;
}

AFUtil.concatenateAddressFields = function (obj, type) {
    let concatenatedAddress = "";
    if(type == 'customer') {
        concatenatedAddress += obj.fullName + "\n";
    } else if(type == 'region') {
        concatenatedAddress += obj.name + "\n";
    }
    concatenatedAddress += obj.addressLine1 + "\n";
    concatenatedAddress += obj.addressLine2 + "\n";
    concatenatedAddress += obj.pincode + "\n";
    concatenatedAddress += obj.districtName + "\n";
    concatenatedAddress += obj.stateName + "\n";
    concatenatedAddress += obj.country + "\n";

    return concatenatedAddress;
}

AFUtil.getAddressObjectFromConcatenatedAddressFields = function (concatenatedAddress, type) {

    const addressArray = concatenatedAddress.split("\n");
    let address = {};
    if(type == 'customer') {
        address.fullName = addressArray[0];
    } else if(type == 'region') {
        address.name = addressArray[0];
    }
    address.addressLine1 = addressArray[1];
    address.addressLine2 = addressArray[2];
    address.pincode = addressArray[3];
    address.districtName = addressArray[4];
    address.stateName = addressArray[5];
    address.country = addressArray[6];
    
    return address;
}

module.exports = AFUtil;