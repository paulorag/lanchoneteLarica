let modalKey = 0
let quantLanches = 1
let cart = []
const seleciona = (elemento) => document.querySelector(elemento)
const selecionaTodos = (elemento) => document.querySelectorAll(elemento)

const formatoReal = (valor) => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

const formatoMonetario = (valor) => {
    if (valor) {
        return valor.toFixed(2)
    }
}

const abrirModal = () => {
    seleciona('.lancheWindowArea').style.opacity = 0
    seleciona('.lancheWindowArea').style.display = 'flex'
    setTimeout(() => seleciona('.lancheWindowArea').style.opacity = 1, 150)
}

const fecharModal = () => {
    seleciona('.lancheWindowArea').style.opacity = 0
    setTimeout(() => seleciona('.lancheWindowArea').style.display = 'none', 500)
}

const botoesFechar = () => {
    selecionaTodos('.lancheInfo--cancelButton').forEach((item) => item.addEventListener('click', fecharModal))
}

const preencheDadosDosLanches = (lancheItem, item, index) => {
    lancheItem.setAttribute('data-key', index)
    lancheItem.querySelector('.lanche-item--img img').src = item.img
    lancheItem.querySelector('.lanche-item--price').innerHTML = formatoReal(item.price)
    lancheItem.querySelector('.lanche-item--name').innerHTML = item.name
    lancheItem.querySelector('.lanche-item--desc').innerHTML = item.description
}

const preencheDadosModal = (item) => {
    seleciona('.lancheBig img').src = item.img
    seleciona('.lancheInfo h1').innerHTML = item.name
    seleciona('.lancheInfo--desc').innerHTML = item.description
    seleciona('.lancheInfo--actualPrice').innerHTML = formatoReal(item.price)
}

const pegarKey = (e) => {
    let key = e.target.closest('.lanche-item').getAttribute('data-key')
    console.log('Item clicado ' + key)
    console.log(listaProdutos[key])

    quantLanches = 1

    modalKey = key

    return key
}


const mudarQuantidade = () => {
    seleciona('.lancheInfo--qtmais').addEventListener('click', () => {
        quantLanches++
        seleciona('.lancheInfo--qt').innerHTML = quantLanches
    })

    seleciona('.lancheInfo--qtmenos').addEventListener('click', () => {
        if (quantLanches > 1) {
            quantLanches--
            seleciona('.lancheInfo--qt').innerHTML = quantLanches
        }
    })
}

const adicionarNoCarrinho = () => {
    seleciona('.lancheInfo--addButton').addEventListener('click', () => {
        console.log('Adicionar no carrinho')

        console.log("Item " + modalKey)

        console.log("Quant. " + quantLanches)

        let price = seleciona('.lancheInfo--actualPrice').innerHTML.replace('R$&nbsp;', '')

        let identificador = listaProdutos[modalKey].id + 't'

        let key = cart.findIndex((item) => item.identificador == identificador)
        console.log(key)

        if (key > -1) {
            cart[key].qt += quantLanches
        } else {
            let lanche = {
                identificador,
                id: listaProdutos[modalKey].id,
                qt: quantLanches,
                price: parseFloat(price)
            }
            cart.push(lanche)
            console.log(lanche)
            console.log('Sub total R$ ' + (lanche.qt * lanche.price).toFixed(2))
        }

        fecharModal()
        abrirCarrinho()
        atualizarCarrinho()
    })
}

const abrirCarrinho = () => {
    console.log('Qtd de itens no carrinho ' + cart.length)
    if (cart.length > 0) {
        seleciona('aside').classList.add('show')
        seleciona('header').style.display = 'flex'
    }

    seleciona('.menu-openner').addEventListener('click', () => {
        if (cart.length > 0) {
            seleciona('aside').classList.add('show')
            seleciona('aside').style.left = '0'
        }
    })
}

const fecharCarrinho = () => {
    seleciona('.menu-closer').addEventListener('click', () => {
        seleciona('aside').style.left = '100vw'
        seleciona('header').style.display = 'flex'
    })
}

const atualizarCarrinho = () => {
    seleciona('.menu-openner span').innerHTML = cart.length

    if (cart.length > 0) {

        seleciona('aside').classList.add('show')

        seleciona('.cart').innerHTML = ''

        let subtotal = 0
        let total = 0

        for (let i in cart) {
            let lancheItem = listaProdutos.find((item) => item.id == cart[i].id)
            console.log(lancheItem)

            subtotal += cart[i].price * cart[i].qt

            let cartItem = seleciona('.models .cart--item').cloneNode(true)
            seleciona('.cart').append(cartItem)

            let lancheName = `${lancheItem.name}`

            cartItem.querySelector('img').src = lancheItem.img
            cartItem.querySelector('.cart--item-nome').innerHTML = lancheName
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt

            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                console.log('Clicou no botão mais')
                cart[i].qt++
                atualizarCarrinho()
            })

            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                console.log('Clicou no botão menos')
                if (cart[i].qt > 1) {
                    cart[i].qt--
                } else {
                    cart.splice(i, 1)
                }

                (cart.length < 1) ? seleciona('header').style.display = 'flex' : ''

                atualizarCarrinho()

            })

            seleciona('.cart').append(cartItem)

        }
        total = subtotal

        seleciona('.subtotal span:last-child').innerHTML = formatoReal(subtotal)
        seleciona('.total span:last-child').innerHTML = formatoReal(total)

    } else {
        seleciona('aside').classList.remove('show')
        seleciona('aside').style.left = '100vw'
    }
}

const finalizarCompra = () => {
    seleciona('.cart--finalizar').addEventListener('click', () => {
        console.log('Finalizar compra')
        seleciona('aside').classList.remove('show')
        seleciona('aside').style.left = '100vw'
        seleciona('header').style.display = 'flex'
    })
}

seleciona('.refresh').addEventListener("click", () => {
    alert('Pedido finalizado! Agradecemos pela preferencia :D!!')
    location.reload();
});

listaProdutos.map((item, index) => {

    let lancheItem = document.querySelector('.models .lanche-item').cloneNode(true)

    seleciona('.lanche-area').append(lancheItem)


    preencheDadosDosLanches(lancheItem, item, index)

    lancheItem.querySelector('.lanche-item a').addEventListener('click', (e) => {
        e.preventDefault()
        console.log('Clicou no item')

        let chave = pegarKey(e)
        abrirModal()

        preencheDadosModal(item)

        preencherTamanhos(chave)

        seleciona('.lancheInfo--qt').innerHTML = quantLanches

        escolherTamanhoPreco(chave)

    })

    botoesFechar()

})
mudarQuantidade()
adicionarNoCarrinho()
atualizarCarrinho()
fecharCarrinho()
finalizarCompra()