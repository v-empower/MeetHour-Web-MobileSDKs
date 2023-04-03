<?php
namespace MeetHourApp\Types;
class Login {
    public ?string $client_id;
    public ?string $client_secret;
    public ?string $grant_type;
    public ?string $password;
    public ?string $username;

    public function __construct(
        string $client_id, string $client_secret, string $grant_type, string $username, string $password
    ){
        $this->client_id = $client_id;
        $this->client_secret = $client_secret;
        $this->grant_type = $grant_type;
        $this->username = $username;
        $this->password = $password;
    }

    public function prepare() {
        return [
            "client_id" => $this->client_id,
            "client_secret" => $this->client_secret,
            "grant_type" => $this->grant_type,
            "password" => $this->password,
            "username" => $this->username,
        ];
    }
    
}
/*
$login = new Login();
$login->setClientId('client_id_value');
$login->setClientSecret('client_secret_value');
$login->setGrantType('grant_type_value');
$login->setPassword('password_value');
$login->setUsername('username_value');

$body = $login->toArray();
*/