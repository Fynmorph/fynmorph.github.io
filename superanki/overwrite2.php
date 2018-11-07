<?php 
$jour = $_POST["jour"];
$step = $_POST["step"];

file_put_contents('jour.txt', $jour);
file_put_contents('jour.txt', '@', FILE_APPEND);
file_put_contents('jour.txt', $step, FILE_APPEND);
  
?>