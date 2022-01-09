export default {
  template: `<div class="modal fade" id="productModal" tabindex="-1" role="dialog"
  aria-labelledby="exampleModalLabel" aria-hidden="true" ref="modal">
   <div class="modal-dialog modal-xl" role="document">
     <div class="modal-content border-0">
       <div class="modal-header bg-dark text-white">
         <h5 class="modal-title" id="exampleModalLabel">
           <span>{{ product.title }}</span>
         </h5>
         <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
       </div>
       <div class="modal-body">
         <div class="row">
           <div class="col-sm-6">
             <img class="img-fluid" :src="product.imagesUrl" alt="" referrerpolicy="no-referrer">
           </div>
           <div class="col-sm-6">
             <span class="badge bg-danger rounded-pill">{{ product.category }}</span>
             <p>商品描述：{{ product.description }}</p>
             <p>商品內容：{{ product.content }}</p>
             <div class="h5" v-if="!product.price">{{ product.origin_price }} 元</div>
             <del class="h6" v-if="product.price">$ {{ product.origin_price }} 元</del>
             <span class="h5" v-if="product.price">$ {{ product.price }} 元</span>
             <div>
               <div class="input-group">
                 <input type="number" class="form-control"
                       v-model.number="qty" min="1" @blur="checkQty">
                 <button type="button" class="btn btn-secondary"
                         @click="$emit('addcart', product.id, qty)">加入購物車</button>
               </div>
             </div>
           </div>
         </div>
       </div>
     </div>
   </div>
 </div>`,
  props: ["product"],
  data() {
    return {
      modal: "",
      qty: 1,
    };
  },
  methods: {
    openModal() {
      this.qty = 1;
      this.modal.show();
    },
    hideModal() {
      this.modal.hide();
    },
    checkQty() {
      if (this.qty < 0) { // 防呆：避免輸入小於 0 的值
        this.qty = 1;
      }
    },
  },
  mounted() {
    this.modal = new bootstrap.Modal(this.$refs.modal);
  },
};
