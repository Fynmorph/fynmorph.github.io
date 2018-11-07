<?php 
$data = $_POST["data"];
$niveau = $_POST["niveau"];

if($niveau == 1){file_put_contents('data1.txt', $data);}
if($niveau == 2){file_put_contents('data2.txt', $data);}
if($niveau == 3){file_put_contents('data3.txt', $data);}
if($niveau == 4){file_put_contents('data4.txt', $data);}
if($niveau == 5){file_put_contents('data5.txt', $data);}
if($niveau == 6){file_put_contents('data6.txt', $data);}
if($niveau == 7){file_put_contents('data7.txt', $data);}
if($niveau == 8){file_put_contents('data8.txt', $data);}
if($niveau == 9){file_put_contents('data9.txt', $data);}
?>