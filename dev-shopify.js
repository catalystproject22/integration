const BASE_URL = "https://dev-api-somosxpanda.herokuapp.com/api/v1/order";
const LAMBDA_URL =
  "https://veiuob6e82.execute-api.us-east-1.amazonaws.com/default/orderTrackingMongo";
const AF_SCRIPT = "shopify";

function setCookie(cookie_key, cookie_value, days_of_expiration) {
  var date = new Date();
  date.setTime(date.getTime() + days_of_expiration * 24 * 60 * 60 * 1000);
  var expires = "expires=" + date.toUTCString();
  document.cookie = cookie_key + "=" + cookie_value + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

var API = {
  post: function (data, url) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    data['influencerUsername'] = getCookie("xpndr");
    data['scriptName'] = AF_SCRIPT;
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(data),
      redirect: "follow",
    };

    fetch(url, requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
  },
};

const orderProducts = [];
const orderDiscounts = [];
const AffTracker = {
  readInfluencerId: function () {
    const url = new URL(document.location.href);
    return url.searchParams.get("xpndr");
  },
  buildOrderObject: function (
    order_id,
    order_name,
    url,
    currency,
    total_price,
    products
  ) {
    const order = {};
    order["orderId"] = order_id;
    order["orderName"] = order_name;
    order["shopURL"] = url;
    order["orderCurrency"] = currency;
    order["orderTotal"] = total_price;
    order["products"] = products;
    return order;
  },
  sendToLambda: function (data) {
    const xpndrCookie = getCookie("xpndr");
    if (xpndrCookie) {
      API.post(data, LAMBDA_URL);
    }
  },
  addOrder: function (data) {
    const xpndrCookie = getCookie("xpndr");
    if (xpndrCookie) {
      console.log(data);
      API.post(data, BASE_URL);
    }
  },
  buildOrderProductObject: function (
    product_id,
    sku,
    title,
    price,
    quantity,
    vendor,
    variant,
    discounts
  ) {
    const product = {};
    product["id"] = product_id;
    product["sku"] = sku;
    product["title"] = title;
    product["price"] = price;
    product["quantity"] = quantity;
    product["brand"] = vendor;
    product["variant"] = variant;
    product["productDiscounts"] = discounts;
    return product;
  },
  addOrderProduct: function (
    product_id,
    sku,
    title,
    price,
    quantity,
    vendor,
    variant,
    discounts
  ) {
    const orderProductObject = AffTracker.buildOrderProductObject(
      product_id,
      sku,
      title,
      price,
      quantity,
      vendor,
      variant,
      discounts
    );
    orderProducts.push(orderProductObject);
  },
  buildProductDiscountObject: function (amount, value, value_type) {
    const discount = {};
    discount["amount"] = amount;
    discount["value"] = value;
    discount["valueType"] = value_type;
    return discount;
  },
  buildOrderDiscountObject: function (
    target_selection,
    target_type,
    value,
    value_type,
    total_allocated_amount,
    title
  ) {
    const order_discount = {};
    order_discount["targetSelection"] = target_selection;
    order_discount["targetType"] = target_type;
    order_discount["value"] = value;
    order_discount["valueType"] = value_type;
    order_discount["totalAllocatedAmount"] = total_allocated_amount;
    order_discount["title"] = title;
    return order_discount;
  },
  execute: function () {
    const xpndr = this.readInfluencerId();
    if (xpndr) setCookie("xpndr", xpndr, 365);
  },
};

AffTracker.execute();
