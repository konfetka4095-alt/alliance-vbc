<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
function reply(int $code,array $data):void { http_response_code($code); echo json_encode($data); exit; }
if (($_SERVER['REQUEST_METHOD']??'')!=='POST') reply(405,['ok'=>false,'error'=>'Method not allowed.']);
if ((int)($_SERVER['CONTENT_LENGTH']??0)>8192) reply(413,['ok'=>false,'error'=>'Request too large.']);
$products=['Alliance Hoodie'=>[50,['XS','S','M','L','XL','2XL','3XL','4XL','5XL']], 'Alliance Long Sleeve'=>[30,['S','M','L','XL','2XL','3XL']]];
$item=(string)($_POST['item']??'');$size=(string)($_POST['size']??'');$qty=filter_var($_POST['quantity']??null,FILTER_VALIDATE_INT,['options'=>['min_range'=>1,'max_range'=>30]]);
$name=trim((string)($_POST['name']??''));$email=trim((string)($_POST['email']??''));$program=trim((string)($_POST['program']??''));$notes=trim((string)($_POST['notes']??''));$ref=(string)($_POST['requestId']??'');
if(!isset($products[$item])||!in_array($size,$products[$item][1],true)||$qty===false||!preg_match('/^AVC-[A-Z0-9]{8,24}$/',$ref)||strlen($name)<2||strlen($name)>120||!filter_var($email,FILTER_VALIDATE_EMAIL)||strlen($email)>180||strlen($program)<2||strlen($program)>240||strlen($notes)>800) reply(400,['ok'=>false,'error'=>'Please check the order details.']);
$origin=(string)($_SERVER['HTTP_ORIGIN']??'');if($origin && !in_array(strtolower((string)parse_url($origin,PHP_URL_HOST)),['alliancevbc.ca','www.alliancevbc.ca'],true)) reply(403,['ok'=>false,'error'=>'Invalid origin.']);
$payload=http_build_query(['formType'=>'merch-order','requestId'=>$ref,'item'=>$item,'size'=>$size,'quantity'=>$qty,'name'=>$name,'email'=>$email,'program'=>$program,'notes'=>$notes],'','&',PHP_QUERY_RFC3986);
$endpoint='https://script.google.com/macros/s/AKfycbzX8p4bNGWZ_AKu0wtKVtjDa28DkIE2MXSt_DB8BO-0WYZPJB93v6f89aINa4ZTeUtv/exec';
if(!function_exists('curl_init')) reply(503,['ok'=>false,'error'=>'The order service is unavailable. Please contact Alliance.']);
$ch=curl_init($endpoint);
curl_setopt_array($ch,[CURLOPT_POST=>true,CURLOPT_POSTFIELDS=>$payload,CURLOPT_HTTPHEADER=>['Content-Type: application/x-www-form-urlencoded'],CURLOPT_RETURNTRANSFER=>true,CURLOPT_FOLLOWLOCATION=>true,CURLOPT_MAXREDIRS=>5,CURLOPT_CONNECTTIMEOUT=>8,CURLOPT_TIMEOUT=>25]);
$raw=curl_exec($ch);$status=(int)curl_getinfo($ch,CURLINFO_HTTP_CODE);$error=curl_error($ch);curl_close($ch);
if($raw===false||$error!=='')reply(502,['ok'=>false,'error'=>'Order service could not be reached. Please try again.']);
$data=json_decode($raw,true);
if($status<200||$status>=300||!is_array($data))reply(502,['ok'=>false,'error'=>'Order service response was invalid. Please contact Alliance before retrying.']);
reply(!empty($data['ok'])?200:400,$data);
