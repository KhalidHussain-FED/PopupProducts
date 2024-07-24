document.addEventListener('DOMContentLoaded', function () {
  // Event listener for quick view links
  document.querySelectorAll('.quick-view').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();

      var productHandle = this.getAttribute('data-handle');

      fetch('/products/' + productHandle + '.js')
        .then(response => response.json())
        .then(product => {
          var modalTitle = document.querySelector('.modal-title');
          var modalBody = document.querySelector('.modal-body');
          var imagesContainer = modalBody.querySelector('.product-images');
          var productPrice = modalBody.querySelector('.product-price');
          var productDescription = modalBody.querySelector('.product-description');
          var productVariants = modalBody.querySelector('.product-variants');
          var addToCartButton = document.querySelector('.modal-footer .add-to-cart');

          if (modalTitle) modalTitle.innerText = product.title;
          if (productPrice) productPrice.innerText = `$${(product.variants[0].price / 100).toFixed(2)}`;
          if (productDescription) productDescription.innerHTML = product.description;
          if (imagesContainer) {
            imagesContainer.innerHTML = '';
            product.images.forEach(image => {
              var imgElement = document.createElement('img');
              imgElement.src = image.replace('.jpg', '_800x.jpg').replace('.png', '_800x.png');
              imgElement.alt = product.title;
              imagesContainer.appendChild(imgElement);
            });
          }

          if (productVariants) {
            productVariants.innerHTML = '';

            product.options.forEach(option => {
              if (option.name.toLowerCase() === 'color') {
                var colorOptions = document.createElement('div');
                colorOptions.classList.add('color-options');
                colorOptions.innerHTML = '<h5>Color</h5>';
                option.values.forEach(value => {
                  var label = document.createElement('label');
                  label.innerHTML = `
                    <input type="radio" name="color" value="${value}" /> ${value}
                  `;
                  label.setAttribute('data-original-color', window.getComputedStyle(label).backgroundColor);
                  colorOptions.appendChild(label);
                });
                productVariants.appendChild(colorOptions);

                // Attach event listeners to all radio buttons
                colorOptions.querySelectorAll('input[type="radio"]').forEach(input => {
                  input.addEventListener('change', handleRadioChange);
                });
              } else if (option.name.toLowerCase() === 'size') {
                var sizeOptions = document.createElement('div');
                sizeOptions.classList.add('size-options');
                sizeOptions.innerHTML = '<h5>Size</h5>';
                var select = document.createElement('select');
                select.name = 'size';
                select.innerHTML = '<option value="">Choose your size</option>';

                option.values.forEach(value => {
                  var optionElement = document.createElement('option');
                  optionElement.value = value;
                  optionElement.innerText = value;
                  select.appendChild(optionElement);
                });

                sizeOptions.appendChild(select);
                productVariants.appendChild(sizeOptions);
              }
            });
          }

          function getSelectedVariantId() {
            var selectedOptions = {};
            var selectedColor = document.querySelector('input[name="color"]:checked')?.value;
            var selectedSizeElement = document.querySelector('select[name="size"]');
            var selectedSize = selectedSizeElement ? selectedSizeElement.value : '';

            if (selectedColor) selectedOptions['Color'] = selectedColor;
            if (selectedSize) selectedOptions['Size'] = selectedSize;

            if (product.variants.length === 1) {
              return product.variants[0].id;
            }

            var selectedVariant = product.variants.find(variant => {
              var variantOptions = variant.options.map(option => option.trim().toLowerCase());
              return Object.entries(selectedOptions).every(([key, value]) => {
                return variantOptions.includes(value.toLowerCase());
              });
            });

            return selectedVariant ? selectedVariant.id : null;
          }

          if (addToCartButton) {
            addToCartButton.onclick = function () {
              var selectedVariantId = getSelectedVariantId();
              if (selectedVariantId) {
                fetch('/cart/add.js', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({ id: selectedVariantId, quantity: 1 })
                })
                .then(response => response.json())
                .then(data => {
                  window.location.href = '/cart';
                })
                .catch(error => {
                  console.error('Error adding product to cart:', error);
                });
              } else {
                console.error('No variant selected');
              }
            };
          }

          var myModal = new bootstrap.Modal(document.getElementById('quickViewModal'));
          myModal.show();
        })
        .catch(error => {
          console.error('Error fetching product data:', error);
        });
    });
  });

  function handleRadioChange(event) {
    const selectedColor = event.target.value;
    document.querySelectorAll('.color-options label').forEach(label => {
      const originalColor = label.getAttribute('data-original-color');
      label.style.backgroundColor = originalColor; // Reset to original background color
      label.style.color = ''; // Reset text color
    });
    
    const selectedLabel = event.target.parentNode;
    selectedLabel.style.backgroundColor = selectedColor;
    selectedLabel.style.color = selectedColor === 'White' ? 'black' : 'white'; // Adjust text color for visibility
  }
});
