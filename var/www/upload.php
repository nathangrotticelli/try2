<?php
   print_r($_FILES);
   $new_image_name = "YEAH.jpg";
   move_uploaded_file($_FILES["file"]["tmp_name"], "/var/www/TEST/".$new_image_name);
?>
