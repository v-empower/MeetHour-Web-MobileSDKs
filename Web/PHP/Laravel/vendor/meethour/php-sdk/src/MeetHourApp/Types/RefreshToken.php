<?php
namespace MeetHourApp\Types;
class RefreshToken
{
    private string $client_id;
    private string $client_secret;
    private ?string $grant_type;
    private string $refresh_token;

    public function __construct(
        string $client_id, string $client_secret, string $refresh_token
    ){
        $this->client_id = $client_id;
        $this->client_secret = $client_secret;
        $this->refresh_token = $refresh_token;
        $this->grant_type = "refresh_token";
    }

    public function prepare() {
        return [
            "client_id" => $this->client_id,
            "client_secret" => $this->client_secret,
            "grant_type" => $this->grant_type,
            "refresh_token" => $this->refresh_token,
        ];
    }
}
