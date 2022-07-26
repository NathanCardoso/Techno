const vm = new Vue({
  el: "#app",
  data: {
    products: [],
    product: false,
    cart: [],
    alertMensage: 'Item adicionado com sucesso',
    activeAlert: false,
    activeCart: false
  },
  computed: {
    totalCart() {
      let total = 0
      if(this.cart.length) {
        this.cart.forEach(item => {
          total += item.price
        })
      }
      return total
    }
  },
  watch: {
    product() {
      document.title = this.product.name || 'Techno'
      const hash = this.product.id || ''
      history.pushState(null, null, `#${hash}`)
      this.compareStock()
    },
    cart() {
      window.localStorage.cart = JSON.stringify(this.cart)
    }
  },
  methods: {
    fetchProducts() {
      fetch('../assets/api/products.json')
      .then(response => response.json())
      .then(responseProducts => {
        this.products = responseProducts
      })
    },
    fetchProduct(id) {
      fetch(`../assets/api/products/${id}/dados.json`)
      .then(response => response.json())
      .then(productJson => {
        this.product = productJson
      })
    },
    openModal(id) {
      this.fetchProduct(id)
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      })
    },
    closerModal({target, currentTarget}) {
      if(target === currentTarget) 
        this.product = false
    },
    addItem() {
      this.product.inventory--
      const {id, name, price} = this.product
      this.cart.push({id, name, price})
      this.alert(`${name} adicionado ao carrinho`)
    },
    removerItem(index) {
      this.cart.splice(index, 1)
    },
    checkLocalStorage() {
      if (window.localStorage.cart)
        this.carrinho = JSON.parse(window.localStorage.cart)
    },
    alert(mensage) {
      this.alertMensage = mensage
      this.activeAlert = true
      setTimeout(() => {
        this.activeAlert = false
      }, 1500)
    },
    router() {
      const hash = window.location.hash
      if (hash) {
        this.fetchProduct(hash.replace('#', ''))
      }
    },
    closerCart({target, currentTarget}) {
      if(target === currentTarget) 
        this.activeCart = false
    },
    compareStock() {
      const items = this.cart.filter(({id}) => id === this.product.id)
      this.product.inventory -= items.length
    }
  },
  filters: {
    priceNumber(value) {
      return value.toLocaleString("pt-BR", {style: "currency", currency: "BRL"})
    }
  },
  created() {
    this.fetchProducts()
    this.router()
    this.checkLocalStorage()
  }
})