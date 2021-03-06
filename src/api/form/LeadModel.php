<?php
namespace api\form;

require_once dirname(__FILE__) . '/../database/DatabaseTableModel.php';
require_once dirname(__FILE__) . '/FormModel.php';

class LeadModel extends \api\database\DatabaseTableModel
{
	function __construct($db)
	{
		parent::__construct('leads', $db);
	}
	
	protected function create()
	{
		$this->createTable($this->name, array(
			'`id` int(11) primary key auto_increment',
			'`form` int(11) not null',
			'`data` text default null',
			'`created` timestamp default current_timestamp',
			'`useragent` varchar(255) default null',
			'`referer` varchar(255) default null',
			'`ip` varchar(50) default null'
		));
	}
	
	protected function doInsert($formFingerprint, $data)
	{
		$formModelTableName = FormModel::getName();
		$referer = $this->getReferer();
		
		if($this->query("insert into `{$this->name}`(`form`, `data`, `useragent`, `referer`, `ip`) values((select id from `$formModelTableName` where fingerprint='$formFingerprint'), '{$this->encodeString($data)}', '{$this->encodeString($_SERVER['HTTP_USER_AGENT'])}', '$referer', '{$this->encodeString($_SERVER['REMOTE_ADDR'])}')"))
			return true;
		else
		{
			print_r("insert into `{$this->name}`(`form`, `data`, `useragent`, `referer`, `ip`) values((select id from `$formModelTableName` where fingerprint='$formFingerprint'), '{$this->encodeString($data)}', '{$this->encodeString($_SERVER['HTTP_USER_AGENT'])}', '$referer', '{$this->encodeString($_SERVER['REMOTE_ADDR'])}')") . PHP_EOL;
			\api\errors\Errors::internalServerError('Cannot insert data.');
		}
	}
	
	protected function getReferer()
	{
		return isset($_SERVER['HTTP_REFERER']) ? $this->encodeString($_SERVER['HTTP_REFERER']) : 'Unknown';
	}
	
	protected function parseValue($value)
	{
		switch($value)
		{
			case '${page_ref}':
				$value = $this->getReferer();
				break;
		}
		
		return $value;
	}
	
	public function email($formFingerprint, $data)
	{
		$formModel = new FormModel($this->db);
		$formData = $formModel->getFormByFingerprint($formFingerprint);
		
		if($formData->email)
		{
			$leadData = mysql_fetch_object($this->query("select `created`, `referer`, `ip` from `{$this->name}` order by `id` desc limit 1"));
			
			$data = json_decode($this->decodeString($data));
			$tableData = "";
			
			foreach($data as $key=>$value)
				$tableData .= "<tr><td style=\"font-weight: bold\">$key</td><td>{$this->parseValue($value)}</td></tr>";
			
			$success = mail(
				$formData->email, 
				"New lead from \"{$formData->name}\"", 
				"<div>
					<table>$tableData</table>
					<hr/>
					<h5>Created on {$leadData->created}</h5>
					<h5>Refered from {$leadData->referer}</h5>
					<h5>User IP {$leadData->ip}</h5>
				</div>", 
				"From: no-reply@quiz.co.il" . "\r\n" .
				"Mime-Version: 1.0" . "\r\n" .
				"Content-Type: text/html; charset=utf-8"
			);

			if(!$success)
				\api\errors\Errors::internalServerError('Error in sending email');
		}
	}
	
	public function sendToExternalService($formFingerprint, $data)
	{
		$formModel = new FormModel($this->db);
		$formData = $formModel->getFormByFingerprint($formFingerprint);
		$url = $formData->externalAPI; 
		
		if($url)
		{
			$data = json_decode($this->decodeString($data));
			$params = array();

			foreach($data as $key=>$value)
				$params[] = "$key=>{$this->parseValue($value)}";
			
			$queryString = implode('&', $params);
			$ch = curl_init();
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

			switch($formData->method)
			{
				default:
					\api\errors\Errors::internalServerError('Unknown form method');
					break;
				case 'GET':
					curl_setopt($ch, CURLOPT_URL, $url . (strstr($url, '?') ? '&' : '?') . $queryString);
					break;
				case 'POST':
					curl_setopt($ch, CURLOPT_URL, $url);
					curl_setopt($ch, CURLOPT_POST, true);
					curl_setopt($ch, CURLOPT_POSTFIELDS, $queryString);
					break;
			}
			
			$success = curl_exec($ch);
			curl_close($ch);

			if(!$success)
				\api\errors\Errors::internalServerError('Error in sending to external API');
		}
	}
	
	public function getLeadsByForm($id)
	{
		$result = $this->query("select `data`, `created`, `referer`, `ip` from `{$this->name}` where `form`=$id order by `created` desc");
		$leads = array();
		
		if($result && mysql_num_rows($result))
		{
			while($row = mysql_fetch_object($result))
			{
				$row->data = json_decode($row->data);
				$leads[] = $row;
			}
			return $leads;
		}
		else
			\api\errors\Errors::internalServerError('Error getting leads');
	}
}