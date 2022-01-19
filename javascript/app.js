import productModal from "../components/productModal.js";

const { defineRule, Form, Field, ErrorMessage, configure } = VeeValidate;
const { required, email, min, max } = VeeValidateRules;
const { localize, loadLocaleFromURL } = VeeValidateI18n;

defineRule("required", required);
defineRule("email", email);
defineRule("min", min);
defineRule("max", max);

loadLocaleFromURL(
  "https://unpkg.com/@vee-validate/i18n@4.1.0/dist/locale/zh_TW.json"
);

configure({
  generateMessage: localize("zh_TW"), // 本地化
});

const apiUrl = "https://vue3-course-api.hexschool.io/v2";
const apiPath = "record-product";

const app = Vue.createApp({
  data() {
    return {
      products: [],
      product: {},
      tempId: "",
      formData: {
        user: {
          address: "",
          email: "",
          tel: "",
          name: "",
        },
        message: "",
      },
      cart: {},
      coupon:''
    };
  },
  components: {
    VForm: Form,
    VField: Field,
    ErrorMessage: ErrorMessage,
    productModal,
  },
  methods: {
    // 取得所有商品
    getProducts() {
      const url = `${apiUrl}/api/${apiPath}/products`;
      axios
        .get(url)
        .then((res) => {
            this.products = res.data.products.filter((item) => {
              return item.is_enabled;
            });
        })
        .catch((err) => {
          this.showAlert(err.data.message,false)
        });
    },
    // 取得單筆商品
    getProduct(id) {
      const url = `${apiUrl}/api/${apiPath}/product/${id}`;
      this.tempId = id;
      axios
        .get(url)
        .then((res) => {
            this.tempId = "";
            this.product = res.data.product;
            this.$refs.productModal.openModal();
        })
        .catch((err) => {
          this.showAlert(err.data.message,false)
        });
    },
    // 新增商品至購物車
    addToCart(id, qty = 1) {
      const url = `${apiUrl}/api/${apiPath}/cart`;
      this.tempId = id;
      this.$refs.productModal.hideModal();
      const product = {
        data: {
          product_id: id,
          qty,
        },
      };
      axios
        .post(url, product)
        .then((res) => {
            this.showAlert(res.data.message)
            this.tempId = "";
            this.getCart(); // 更新商品購物車資訊
        })
        .catch((err) => {
          this.showAlert(err.data.message,false)
        });
    },

    // 取得購物車資訊
    getCart() {
      const url = `${apiUrl}/api/${apiPath}/cart`;
      axios
        .get(url)
        .then((res) => {
            this.cart = res.data.data;
        })
        .catch((err) => {
          this.showAlert(err.data.message,false)
        });
    },

    // 清空所有購物車
    deleteAllCarts() {
      const url = `${apiUrl}/api/${apiPath}/carts`;
      axios
        .delete(url)
        .then((res) => {
            this.showAlert(res.data.message)
            this.getCart();
        })
        .catch((err) => {
          this.showAlert(err.data.message,false)
        });
    },

    // 清除單筆購物車
    removeCartItem(id) {
      const url = `${apiUrl}/api/${apiPath}/cart/${id}`;
      this.tempId = id;
      axios
        .delete(url)
        .then((res) => {
            this.showAlert(res.data.message)
            this.tempId = "";
            this.getCart();
        })
        .catch((err) => {
          this.showAlert(err.data.message,false)
        });
    },

    // 更新購物車數量
    updateCart(item) {
      if(item.qty < 0){ // 防呆：避免輸入小於 0 的值
        item.qty = 1;
      }
      this.tempId = item.id;
      const url = `${apiUrl}/api/${apiPath}/cart/${item.id}`;
      const cart = {
        data: {
          product_id: item.product_id,
          qty: item.qty,
        },
      };
      axios
        .put(url, cart)
        .then((res) => {
            this.showAlert(res.data.message)
            this.tempId = "";
            this.getCart();
        })
        .catch((err) => {
          this.showAlert(err.data.message,false)
          this.tempId = "";
        });
    },
    // 新增折扣碼
    addCoupon() {
      const url = `${apiUrl}/api/${apiPath}/coupon`;
      const coupon = {
         data: {
           code: this.coupon
          } 
      };
      axios
        .post(url, coupon)
        .then((res) => {
          this.showAlert(res.data.message);
          this.getCart();
        })
        .catch((err) => {
          this.showAlert(err.data.message,false)
        });
    },
    // 送出訂單
    createOrder() {
      const url = `${apiUrl}/api/${apiPath}/order`;
      const order = { data: this.formData };
      axios
        .post(url, order)
        .then((res) => {
            this.showAlert(res.data.message)
            this.$refs.form.resetForm();
            this.formData.message = '';
            this.coupon = '';
            this.getCart();
        })
        .catch((err) => {
          this.showAlert(err.data.message,false)
        });
    },
    // 表單驗證：電話號碼格式
    isPhone(value) {
      const phoneNumber = /^(09)[0-9]{8}$/
      return phoneNumber.test(value) ? true : '需重新確認電話號碼，如：0912345678'
    },
    // 顯示提示視窗
    showAlert(message,success=true){
      Swal.fire({
        width:300,
        icon: success?'success':'error',
        title: message,
        showConfirmButton: false,
        timer: 1500
      })
    }
  },
  created() {
    this.getProducts();
    this.getCart();
  },
});
app.mount("#app");
