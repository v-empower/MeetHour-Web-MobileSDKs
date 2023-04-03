<?php
namespace MeetHourApp\Types;
class GenerateJwt {
    public string $meeting_id;
    public ?int $contact_id;
    public ?object $ui_config;
    public ?array $config;

    public function __construct(string $meeting_id){
        $this->meeting_id = $meeting_id;
        $this->contact_id = null;
        $this->ui_config = null;
        $this->config = null;
    }
    public function prepare() {
        $generateJwtProperties = [
            "meeting_id" => $this->meeting_id,
            "contact_id" => $this->contact_id,
            "config" => $this->config,
            "ui_config" => $this->ui_config,
        ];
        foreach ($generateJwtProperties as $key => $value) {
            if ($value === null) {
              unset($generateJwtProperties[$key]);
            }
          }
        return $generateJwtProperties;
    }
}