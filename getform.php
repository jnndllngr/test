<?php

$post_data['name'] = $_POST['name'];
$post_data['phone'] = preg_replace('/[^0-9]/', '', $_POST['phone']);
$post_data['subid'] = $_POST['subid'];

if (isset($post_data['phone']) and ($post_data['phone'] !== '') ) {

	$post  = [
		'flow_hash' => '22rk',
		'landing' => 'm.id.theerogan.com',
		'referrer' => $_POST['referrer'],
		'country' => 'CZ',
		'phone' => $post_data['phone'],
		'name' => $post_data['name'],
		'sub1' => $_SERVER['HTTP_HOST'],
		'sub2' => $post_data['subid']
	];

	$api_reqest = curl('http://leadbit.com/api/new-order/4c24536a4c7c325743526d25636c7b47', $post);

  	file_get_contents('http://postback.fun/b700926/postback?sub_id=' . $post_data['subid']. '&status=new&from=leadbit.com');

	$api_reqest = json_decode($api_reqest);

	if(@$api_reqest->status == 'success'){
		require_once('_thankyou/ok.php');
	}else{
		echo 'Ошибка 1!';
	}
} else {
	echo 'Ошибка 2!';
}

function curl($url, $post = null, $head=0){
	$ch = curl_init($url);
	curl_setopt($ch,CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($ch, CURLOPT_TIMEOUT, 60);
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);

	if($head){
		curl_setopt($ch,CURLOPT_HTTPHEADER, $head);
	}else{
		curl_setopt($ch,CURLOPT_HEADER, 0);
	}

	if($post){
		curl_setopt($ch, CURLOPT_POST, 1);
		curl_setopt($ch, CURLOPT_POSTFIELDS, $post);
	}
	$response = curl_exec($ch);
	$header_data = curl_getinfo($ch);
	curl_close($ch);
	return $response;

}
