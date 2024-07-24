document.addEventListener('DOMContentLoaded', function() {
    var modal = document.getElementById('product-modal');
    var span = document.getElementsByClassName('close')[0];

    document.querySelectorAll('.grid__item').forEach(function(item) {
        item.addEventListener('click', function() {
            var title = this.getAttribute('data-title');
            var description = this.getAttribute('data-description');
            var images = this.getAttribute('data-images').split(',');
            var colors = this.getAttribute('data-colors').split(',');
            var sizes = this.getAttribute('data-sizes').split(',');

            // Populate modal
            document.getElementById('modal-title').textContent = title;
            document.getElementById('modal-description').textContent = description;

            // Display images
            var imagesContainer = document.getElementById('modal-images');
            imagesContainer.innerHTML = '';
            images.forEach(function(image) {
                var img = document.createElement('img');
                img.src = 'path/to/images/' + image;
                imagesContainer.appendChild(img);
            });

            // Display colors
            var colorsContainer = document.getElementById('modal-colors');
            colorsContainer.innerHTML = 'Colors: ' + colors.join(', ');

            // Display sizes
            var sizesContainer = document.getElementById('modal-sizes');
            sizesContainer.innerHTML = 'Sizes: ' + sizes.join(', ');

            // Show the modal
            modal.style.display = 'block';
        });
    });

    // Close the modal when the user clicks on <span> (x)
    span.onclick = function() {
        modal.style.display = 'none';
    }

    // Close the modal when the user clicks anywhere outside of the modal
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
});
