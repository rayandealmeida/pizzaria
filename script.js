
let cart = [];
let modalQtd = 1;
let = modalKey = 0;
const doc = (el) => document.querySelector(el);
const docAll = (el) => document.querySelectorAll(el);

// listagem das pizzas
pizzaJson.map( (item, index)=> {
    let pizzaItem = doc('.models .pizza-item').cloneNode(true);

    //pegando a pizza selecionada
    pizzaItem.setAttribute('data-key',index);
    // add desc, price and name
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;


    //Area da Janela da pizza
    pizzaItem.querySelector('a').addEventListener('click',(e)=>{
        e.preventDefault();
        let key = e.target.closest('.pizza-item').getAttribute('data-key');  //pegando pizza clicada
        modalQtd = 1;
        modalKey = key;
        //add desc,price and name -> na janela clicada
        doc('.pizzaBig img').src=pizzaJson[key].img;
        doc('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        doc('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        doc('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;    
        
        //retirar seleção de tamanho padrão
        doc('.pizzaInfo--size.selected').classList.remove('selected');

        //colocando texto na seleção de tamanho
        docAll('.pizzaInfo--size').forEach((size,sizeIndex)=>{
            if(sizeIndex== 2){ 
                size.classList.add('selected'); // padronizando seleção de tamanho
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];  
        });
        doc('.pizzaInfo--qt').innerHTML = modalQtd; //resetando a quantidade de pizza

 
        // aparecendo Janela formatada.
        doc('.pizzaWindowArea').style.opacity=0;
        doc('.pizzaWindowArea').style.display ='flex';
        setTimeout(()=>{
            doc('.pizzaWindowArea').style.opacity=1;
        },100);
    });


    doc('.pizza-area').append( pizzaItem );
});

// Eventos do MODAL
//fechando modal
function closeModal(){
    doc('.pizzaWindowArea').style.opacity = 0;
    setTimeout(()=>{
        doc('.pizzaWindowArea').style.display ='none';
    },500);
}
docAll('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=> {
    item.addEventListener('click',closeModal);
});

// Trabalhando com adição e subtração da quantidade
doc('.pizzaInfo--qtmenos').addEventListener('click',()=>{
    if(modalQtd > 1){   
    modalQtd--;
    doc('.pizzaInfo--qt').innerHTML = modalQtd;
    } 
});
doc('.pizzaInfo--qtmais').addEventListener('click',()=>{
    modalQtd++;
    doc('.pizzaInfo--qt').innerHTML = modalQtd;
});

// Selecionando tamanho da pizza

docAll('.pizzaInfo--size').forEach((size,sizeIndex)=>{

    size.addEventListener('click',(e)=>{
        doc('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');

    }); 
});
// Func add carrinho
doc('.pizzaInfo--addButton').addEventListener('click',()=>{

    let size =parseInt(doc('.pizzaInfo--size.selected').getAttribute('data-key'));
    let identifier = pizzaJson[modalKey].id+"@"+size;
    let idKey = cart.findIndex((item)=> item.identifier == identifier);
    if(idKey > -1){

        cart[idKey].qt += modalQtd;
    }
    else{

        cart.push({
            identifier,
            id:pizzaJson[modalKey].id,
            size:size,
            qt:modalQtd
        });
    }
    closeModal();
    updateCart();
});

doc('.menu-openner').addEventListener('click',()=>{
    if(cart.length > 0){
        doc('aside').style.left='0';
    }
});
doc('.menu-closer').addEventListener('click',()=>{
    doc('aside').style.left = '100vw';
});

function updateCart() {
    doc('.menu-openner span').innerHTML = cart.length;

    if(cart.length > 0){
        doc('aside').classList.add('show');
        doc('.cart').innerHTML = '';
        let subtotal = 0;
        let desconto = 0;
        let valorDesconto = 0.1;
        let total = 0;
        for(let i in cart){
            let pizzaItem = pizzaJson.find((item)=> item.id == cart[i].id);
            subtotal+= pizzaItem.price * cart[i].qt;

            let cartItem = doc('.models  .cart--item').cloneNode(true);
            let pizzaSizeName;
            switch(cart[i].size){
                case 0:
                    pizzaSizeName = 'P';
                    break;
                case 1:
                    pizzaSizeName = 'M';
                    break;
                case 2:
                    pizzaSizeName = 'G';
                    break;
            }
            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;
            cartItem.querySelector('img').src=pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML=pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click',()=>{
                if(cart[i].qt > 1){
                    cart[i].qt--;
                }
                else{
                    cart.splice(i,1);
                }
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click',()=>{
                cart[i].qt++;
                updateCart();
            });
            doc('.cart').append(cartItem);
        }  
        desconto = subtotal * valorDesconto;
        total = subtotal - desconto;
        doc('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`; 
        doc('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`; 
        doc('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`; 
    } else{
        doc('aside').classList.remove('show');
        doc('aside').style.left = '100vw';
    }
}